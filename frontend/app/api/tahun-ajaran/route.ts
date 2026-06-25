import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

const tahunAjaranSchema = z.object({
  tahunAjaran: z.string().min(1, 'Tahun ajaran is required'),
  tanggalMulai: z.string().min(1, 'Tanggal mulai is required'),
  tanggalSelesai: z.string().min(1, 'Tanggal selesai is required'),
  status: z.enum(['AKTIF', 'TIDAK_AKTIF', 'SELESAI']).default('TIDAK_AKTIF'),
  isLocked: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_KELAS'],
    async (req, user) => {
      try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || '';

        const where: any = {};
        if (status) where.status = status;

        const data = await prisma.tahunAjaran.findMany({
          where,
          include: {
            _count: {
              select: { kelas: true, semester: true },
            },
          },
          orderBy: { tahunAjaran: 'desc' },
        });

        return ApiResponseHelper.success({ data });

      } catch (error) {
        console.error('Get tahun ajaran error:', error);
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
        const validation = tahunAjaranSchema.safeParse(body);
        
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

        const existing = await prisma.tahunAjaran.findUnique({
          where: { tahunAjaran: data.tahunAjaran },
        });

        if (existing) {
          return ApiResponseHelper.badRequest('Tahun ajaran already exists');
        }

        // If status is AKTIF, deactivate other tahun ajaran
        if (data.status === 'AKTIF') {
          await prisma.tahunAjaran.updateMany({
            where: { status: 'AKTIF' },
            data: { status: 'TIDAK_AKTIF' },
          });
        }

        const tahunAjaran = await prisma.tahunAjaran.create({
          data: {
            tahunAjaran: data.tahunAjaran,
            tanggalMulai: new Date(data.tanggalMulai),
            tanggalSelesai: new Date(data.tanggalSelesai),
            status: data.status,
            isLocked: data.isLocked,
          },
        });

        return ApiResponseHelper.created(tahunAjaran, 'Tahun ajaran created successfully');

      } catch (error) {
        console.error('Create tahun ajaran error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
