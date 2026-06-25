import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

const mataPelajaranSchema = z.object({
  kode: z.string().min(1, 'Kode is required'),
  nama: z.string().min(1, 'Nama is required'),
  kelompok: z.enum(['UMUM', 'PRODUKTIF', 'MUATAN_LOKAL']),
  jurusanId: z.string().nullable().optional(),
  jamPelajaran: z.number().min(0).default(0),
  kkm: z.number().min(0).max(100).default(75),
  deskripsi: z.string().optional(),
});

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
        const kelompok = searchParams.get('kelompok') || '';

        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
          where.OR = [
            { kode: { contains: search } },
            { nama: { contains: search } },
          ];
        }

        if (kelompok) {
          where.kelompok = kelompok;
        }

        const total = await prisma.mataPelajaran.count({ where });
        const data = await prisma.mataPelajaran.findMany({
          where,
          skip,
          take: limit,
          include: {
            jurusan: {
              select: {
                nama: true,
              },
            },
          },
          orderBy: { nama: 'asc' },
        });

        return ApiResponseHelper.success({
          data,
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });

      } catch (error) {
        console.error('Get mata pelajaran error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

export async function POST(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        const body = await req.json();
        const validation = mataPelajaranSchema.safeParse(body);
        
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

        const existing = await prisma.mataPelajaran.findFirst({
          where: {
            OR: [{ kode: data.kode }, { nama: data.nama }],
          },
        });

        if (existing) {
          return ApiResponseHelper.badRequest(
            existing.kode === data.kode ? 'Kode already exists' : 'Nama already exists'
          );
        }

        const mataPelajaran = await prisma.mataPelajaran.create({
          data: {
            kode: data.kode,
            nama: data.nama,
            kelompok: data.kelompok,
            jurusanId: data.jurusanId || null,
            jamPelajaran: data.jamPelajaran,
            kkm: data.kkm,
            deskripsi: data.deskripsi,
          },
          include: {
            jurusan: { select: { nama: true } },
          },
        });

        return ApiResponseHelper.created(mataPelajaran, 'Mata pelajaran created successfully');

      } catch (error) {
        console.error('Create mata pelajaran error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
