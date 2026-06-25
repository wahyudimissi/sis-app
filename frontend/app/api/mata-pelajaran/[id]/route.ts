import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

const updateMataPelajaranSchema = z.object({
  kode: z.string().min(1).optional(),
  nama: z.string().min(1).optional(),
  kelompok: z.enum(['UMUM', 'PRODUKTIF', 'MUATAN_LOKAL']).optional(),
  jurusanId: z.string().nullable().optional(),
  jamPelajaran: z.number().min(0).optional(),
  kkm: z.number().min(0).max(100).optional(),
  deskripsi: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_KELAS'],
    async (req, user) => {
      try {
        const mataPelajaran = await prisma.mataPelajaran.findUnique({
          where: { id: params.id },
          include: {
            jurusan: true,
            _count: {
              select: { jadwal: true, nilai: true },
            },
          },
        });

        if (!mataPelajaran) {
          return ApiResponseHelper.notFound('Mata pelajaran not found');
        }

        return ApiResponseHelper.success(mataPelajaran);

      } catch (error) {
        console.error('Get mata pelajaran error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        const body = await req.json();
        const validation = updateMataPelajaranSchema.safeParse(body);
        
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
        const existing = await prisma.mataPelajaran.findUnique({
          where: { id: params.id },
        });

        if (!existing) {
          return ApiResponseHelper.notFound('Mata pelajaran not found');
        }

        if (data.kode || data.nama) {
          const duplicate = await prisma.mataPelajaran.findFirst({
            where: {
              AND: [
                { id: { not: params.id } },
                {
                  OR: [
                    ...(data.kode ? [{ kode: data.kode }] : []),
                    ...(data.nama ? [{ nama: data.nama }] : []),
                  ],
                },
              ],
            },
          });

          if (duplicate) {
            return ApiResponseHelper.badRequest(
              duplicate.kode === data.kode ? 'Kode already exists' : 'Nama already exists'
            );
          }
        }

        const mataPelajaran = await prisma.mataPelajaran.update({
          where: { id: params.id },
          data,
          include: { jurusan: { select: { nama: true } } },
        });

        return ApiResponseHelper.success(mataPelajaran, 'Mata pelajaran updated successfully');

      } catch (error) {
        console.error('Update mata pelajaran error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        const mataPelajaran = await prisma.mataPelajaran.findUnique({
          where: { id: params.id },
          include: {
            _count: { select: { jadwal: true, nilai: true } },
          },
        });

        if (!mataPelajaran) {
          return ApiResponseHelper.notFound('Mata pelajaran not found');
        }

        if (mataPelajaran._count.jadwal > 0 || mataPelajaran._count.nilai > 0) {
          return ApiResponseHelper.badRequest('Cannot delete mata pelajaran with jadwal or nilai');
        }

        await prisma.mataPelajaran.delete({ where: { id: params.id } });

        return ApiResponseHelper.noContent('Mata pelajaran deleted successfully');

      } catch (error) {
        console.error('Delete mata pelajaran error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
