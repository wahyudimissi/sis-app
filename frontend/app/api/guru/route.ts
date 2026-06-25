import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { hashPassword } from '@/lib/auth';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

// Validation schema
const guruSchema = z.object({
  nip: z.string().min(1, 'NIP is required'),
  nuptk: z.string().optional(),
  nama: z.string().min(1, 'Nama is required'),
  jenisKelamin: z.enum(['L', 'P']),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  agama: z.string().optional(),
  alamat: z.string().optional(),
  noHp: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  foto: z.string().optional(),
  mataPelajaran: z.string().optional(),
  jabatan: z.string().optional(),
  statusKepegawaian: z.string().optional(),
  status: z.boolean().default(true),
  // User credentials
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['GURU', 'WALI_KELAS', 'KEPALA_SEKOLAH']).default('GURU'),
});

// GET - List all guru with pagination and search
export async function GET(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH'],
    async (req, user) => {
      try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (search) {
          where.OR = [
            { nip: { contains: search } },
            { nama: { contains: search } },
            { mataPelajaran: { contains: search } },
          ];
        }

        if (status) {
          where.status = status === 'true';
        }

        // Get total count
        const total = await prisma.guru.count({ where });

        // Get data
        const data = await prisma.guru.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                status: true,
              },
            },
            kelasWali: {
              select: {
                id: true,
                namaKelas: true,
                tingkat: true,
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
        console.error('Get guru error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// POST - Create new guru
export async function POST(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        const body = await req.json();

        // Validate input
        const validation = guruSchema.safeParse(body);
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

        // Check if NIP already exists
        const existingGuru = await prisma.guru.findFirst({
          where: {
            OR: [
              { nip: data.nip },
              ...(data.nuptk ? [{ nuptk: data.nuptk }] : []),
            ],
          },
        });

        if (existingGuru) {
          return ApiResponseHelper.badRequest(
            existingGuru.nip === data.nip 
              ? 'NIP already exists' 
              : 'NUPTK already exists'
          );
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

        // Create user and guru in transaction
        const guru = await prisma.$transaction(async (tx) => {
          // Create user
          const newUser = await tx.user.create({
            data: {
              username: data.username,
              email: data.email || `${data.username}@sekolah.com`,
              password: hashedPassword,
              role: data.role,
              status: true,
            },
          });

          // Create guru
          const newGuru = await tx.guru.create({
            data: {
              userId: newUser.id,
              nip: data.nip,
              nuptk: data.nuptk,
              nama: data.nama,
              jenisKelamin: data.jenisKelamin,
              tempatLahir: data.tempatLahir,
              tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
              agama: data.agama,
              alamat: data.alamat,
              noHp: data.noHp,
              email: data.email,
              foto: data.foto,
              mataPelajaran: data.mataPelajaran,
              jabatan: data.jabatan,
              statusKepegawaian: data.statusKepegawaian,
              status: data.status,
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  role: true,
                },
              },
            },
          });

          return newGuru;
        });

        return ApiResponseHelper.created(guru, 'Guru created successfully');

      } catch (error) {
        console.error('Create guru error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
