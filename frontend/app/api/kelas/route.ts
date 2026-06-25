import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

// Validation schema
const kelasSchema = z.object({
  namaKelas: z.string().min(1, 'Nama kelas is required'),
  tingkat: z.string().min(1, 'Tingkat is required'),
  jurusanId: z.string().min(1, 'Jurusan is required'),
  tahunAjaranId: z.string().min(1, 'Tahun ajaran is required'),
  waliKelasId: z.string().nullable().optional(),
  ruangan: z.string().optional(),
});

// GET - List all kelas
export async function GET(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_KELAS'],
    async (req, user) => {
      try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search') || '';
        const tahunAjaranId = searchParams.get('tahunAjaranId') || '';
        const tingkat = searchParams.get('tingkat') || '';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (search) {
          where.namaKelas = { contains: search };
        }

        if (tahunAjaranId) {
          where.tahunAjaranId = tahunAjaranId;
        }

        if (tingkat) {
          where.tingkat = tingkat;
        }

        // Get total count
        const total = await prisma.kelas.count({ where });

        // Get data
        const data = await prisma.kelas.findMany({
          where,
          skip,
          take: limit,
          include: {
            jurusan: {
              select: {
                id: true,
                nama: true,
                kode: true,
              },
            },
            tahunAjaran: {
              select: {
                id: true,
                tahunAjaran: true,
                status: true,
              },
            },
            waliKelas: {
              select: {
                id: true,
                nip: true,
                nama: true,
              },
            },
            _count: {
              select: {
                siswa: true,
              },
            },
          },
          orderBy: [
            { tingkat: 'asc' },
            { namaKelas: 'asc' },
          ],
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
        console.error('Get kelas error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// POST - Create new kelas
export async function POST(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        const body = await req.json();

        // Validate input
        const validation = kelasSchema.safeParse(body);
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

        // Check if kelas already exists for this tahun ajaran
        const existingKelas = await prisma.kelas.findFirst({
          where: {
            namaKelas: data.namaKelas,
            tahunAjaranId: data.tahunAjaranId,
          },
        });

        if (existingKelas) {
          return ApiResponseHelper.badRequest('Kelas already exists for this tahun ajaran');
        }

        // Create kelas
        const kelas = await prisma.kelas.create({
          data: {
            namaKelas: data.namaKelas,
            tingkat: data.tingkat,
            jurusanId: data.jurusanId,
            tahunAjaranId: data.tahunAjaranId,
            waliKelasId: data.waliKelasId || null,
            ruangan: data.ruangan,
          },
          include: {
            jurusan: {
              select: {
                nama: true,
              },
            },
            tahunAjaran: {
              select: {
                tahunAjaran: true,
              },
            },
            waliKelas: {
              select: {
                nama: true,
              },
            },
          },
        });

        return ApiResponseHelper.created(kelas, 'Kelas created successfully');

      } catch (error) {
        console.error('Create kelas error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
