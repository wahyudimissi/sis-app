import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { hashPassword } from '@/lib/auth';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

// Validation schema
const siswaSchema = z.object({
  nis: z.string().min(1, 'NIS is required'),
  nisn: z.string().min(1, 'NISN is required'),
  nama: z.string().min(1, 'Nama is required'),
  jenisKelamin: z.enum(['L', 'P']),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  agama: z.string().optional(),
  alamat: z.string().optional(),
  noHp: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  foto: z.string().optional(),
  rfidCard: z.string().optional(),
  kelasId: z.string().optional(),
  jurusanId: z.string().optional(),
  tahunMasuk: z.string().optional(),
  status: z.enum(['AKTIF', 'LULUS', 'PINDAH', 'KELUAR', 'ALUMNI']).default('AKTIF'),
  // User credentials
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// GET - List all siswa with pagination and search
export async function GET(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_KELAS'],
    async (req, user) => {
      try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const kelasId = searchParams.get('kelasId') || '';
        const status = searchParams.get('status') || '';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (search) {
          where.OR = [
            { nis: { contains: search } },
            { nisn: { contains: search } },
            { nama: { contains: search } },
          ];
        }

        if (kelasId) {
          where.kelasId = kelasId;
        }

        if (status) {
          where.status = status;
        }

        // Get total count
        const total = await prisma.siswa.count({ where });

        // Get data
        const data = await prisma.siswa.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                status: true,
              },
            },
            kelas: {
              select: {
                id: true,
                namaKelas: true,
                tingkat: true,
                jurusan: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
            jurusan: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
          orderBy: {
            nama: 'asc',
          },
        });

        return ApiResponseHelper.success({
          data,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        });

      } catch (error) {
        console.error('Get siswa error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// POST - Create new siswa
export async function POST(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        const body = await req.json();

        // Validate input
        const validation = siswaSchema.safeParse(body);
        if (!validation.success) {
          const errors: Record<string, string[]> = {};
          validation.error.issues.forEach((err) => {
            const path = err.path[0] as string;
            if (!errors[path]) errors[path] = [];
            errors[path].push(err.message);
          });
          return ApiResponseHelper.validationError(errors);
        }

        const data = validation.data;

        // Check if NIS/NISN already exists
        const existingSiswa = await prisma.siswa.findFirst({
          where: {
            OR: [
              { nis: data.nis },
              { nisn: data.nisn },
              ...(data.rfidCard ? [{ rfidCard: data.rfidCard }] : []),
            ],
          },
        });

        if (existingSiswa) {
          let message = 'NISN already exists';
          if (existingSiswa.nis === data.nis) message = 'NIS already exists';
          if (data.rfidCard && existingSiswa.rfidCard === data.rfidCard) {
            message = 'RFID card already registered';
          }
          return ApiResponseHelper.badRequest(message);
        }

        // Check if username already exists
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { username: data.username },
              { email: data.email || '' },
            ],
          },
        });

        if (existingUser) {
          return ApiResponseHelper.badRequest('Username or email already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create user and siswa in transaction
        const siswa = await prisma.$transaction(async (tx) => {
          // Create user
          const newUser = await tx.user.create({
            data: {
              username: data.username,
              email: data.email || `${data.username}@sekolah.com`,
              password: hashedPassword,
              role: 'SISWA',
              status: true,
            },
          });

          // Create siswa
          const newSiswa = await tx.siswa.create({
            data: {
              userId: newUser.id,
              nis: data.nis,
              nisn: data.nisn,
              nama: data.nama,
              jenisKelamin: data.jenisKelamin,
              tempatLahir: data.tempatLahir,
              tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
              agama: data.agama,
              alamat: data.alamat,
              noHp: data.noHp,
              email: data.email,
              foto: data.foto,
              rfidCard: data.rfidCard || null,
              kelasId: data.kelasId || null,
              jurusanId: data.jurusanId || null,
              tahunMasuk: data.tahunMasuk,
              status: data.status,
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
              kelas: {
                select: {
                  namaKelas: true,
                },
              },
              jurusan: {
                select: {
                  nama: true,
                },
              },
            },
          });

          return newSiswa;
        });

        return ApiResponseHelper.created(siswa, 'Siswa created successfully');

      } catch (error) {
        console.error('Create siswa error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
