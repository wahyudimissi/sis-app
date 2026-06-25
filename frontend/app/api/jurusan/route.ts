import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

// Validation schema
const jurusanSchema = z.object({
  kode: z.string().min(1).max(10),
  nama: z.string().min(1),
  deskripsi: z.string().optional(),
  kuota: z.number().int().min(0).optional(),
});

// GET - List all jurusan
export async function GET(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_KELAS'],
    async (req, user) => {
      try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '100');

        // Get data with counts
        const data = await prisma.jurusan.findMany({
          take: limit,
          include: {
            _count: {
              select: {
                kelas: true,
                siswa: true,
                mapel: true,
              },
            },
          },
          orderBy: {
            nama: 'asc',
          },
        });

        return ApiResponseHelper.success({
          data,
        });

      } catch (error) {
        console.error('Get jurusan error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// POST - Create new jurusan
export async function POST(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        const body = await req.json();
        const validation = jurusanSchema.safeParse(body);

        if (!validation.success) {
          return ApiResponseHelper.error('Validation failed', 400);
        }

        const { kode, nama, deskripsi, kuota } = validation.data;

        // Check if kode already exists
        const existing = await prisma.jurusan.findUnique({
          where: { kode },
        });

        if (existing) {
          return ApiResponseHelper.error('Kode jurusan sudah digunakan', 400);
        }

        // Create jurusan
        const jurusan = await prisma.jurusan.create({
          data: {
            kode: kode.toUpperCase(),
            nama,
            deskripsi,
            kuota,
          },
        });

        return ApiResponseHelper.success({
          message: 'Jurusan berhasil ditambahkan',
          data: jurusan,
        });

      } catch (error) {
        console.error('Create jurusan error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
