import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

const jadwalPelajaranSchema = z.object({
  tahunAjaranId: z.string().min(1, 'Tahun ajaran is required'),
  kelasId: z.string().min(1, 'Kelas is required'),
  mataPelajaranId: z.string().min(1, 'Mata pelajaran is required'),
  guruId: z.string().min(1, 'Guru is required'),
  hari: z.enum(['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU']),
  jamKe: z.number().min(1).max(12),
  jamMulai: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam harus HH:MM'),
  jamSelesai: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam harus HH:MM'),
  ruangan: z.string().optional(),
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
        const jadwal = await prisma.jadwalPelajaran.findUnique({
          where: { id: params.id },
          include: {
            tahunAjaran: { select: { tahunAjaran: true, status: true } },
            kelas: { select: { namaKelas: true, tingkat: true } },
            mataPelajaran: { select: { kode: true, nama: true } },
            guru: { select: { nip: true, nama: true } },
          },
        });

        if (!jadwal) {
          return ApiResponseHelper.notFound('Jadwal pelajaran not found');
        }

        return ApiResponseHelper.success(jadwal);

      } catch (error) {
        console.error('Get jadwal pelajaran by ID error:', error);
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
        const existing = await prisma.jadwalPelajaran.findUnique({
          where: { id: params.id },
        });

        if (!existing) {
          return ApiResponseHelper.notFound('Jadwal pelajaran not found');
        }

        const body = await req.json();
        const validation = jadwalPelajaranSchema.partial().safeParse(body);
        
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

        // Check for conflicts if relevant fields changed
        if (data.kelasId || data.hari || data.jamKe || data.tahunAjaranId) {
          const conflictKelas = await prisma.jadwalPelajaran.findFirst({
            where: {
              id: { not: params.id },
              kelasId: data.kelasId || existing.kelasId,
              hari: data.hari || existing.hari,
              jamKe: data.jamKe !== undefined ? data.jamKe : existing.jamKe,
              tahunAjaranId: data.tahunAjaranId || existing.tahunAjaranId,
            },
          });

          if (conflictKelas) {
            return ApiResponseHelper.badRequest('Jadwal bentrok: Kelas sudah memiliki jadwal di jam yang sama');
          }
        }

        // Check for guru conflicts
        if (data.guruId || data.hari || data.jamKe || data.tahunAjaranId) {
          const conflictGuru = await prisma.jadwalPelajaran.findFirst({
            where: {
              id: { not: params.id },
              guruId: data.guruId || existing.guruId,
              hari: data.hari || existing.hari,
              jamKe: data.jamKe !== undefined ? data.jamKe : existing.jamKe,
              tahunAjaranId: data.tahunAjaranId || existing.tahunAjaranId,
            },
          });

          if (conflictGuru) {
            return ApiResponseHelper.badRequest('Jadwal bentrok: Guru sudah mengajar di kelas lain pada jam yang sama');
          }
        }

        const jadwal = await prisma.jadwalPelajaran.update({
          where: { id: params.id },
          data,
          include: {
            tahunAjaran: { select: { tahunAjaran: true } },
            kelas: { select: { namaKelas: true } },
            mataPelajaran: { select: { kode: true, nama: true } },
            guru: { select: { nip: true, nama: true } },
          },
        });

        return ApiResponseHelper.success(jadwal, 'Jadwal pelajaran updated successfully');

      } catch (error) {
        console.error('Update jadwal pelajaran error:', error);
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
        const existing = await prisma.jadwalPelajaran.findUnique({
          where: { id: params.id },
        });

        if (!existing) {
          return ApiResponseHelper.notFound('Jadwal pelajaran not found');
        }

        await prisma.jadwalPelajaran.delete({
          where: { id: params.id },
        });

        return ApiResponseHelper.success(null, 'Jadwal pelajaran deleted successfully');

      } catch (error) {
        console.error('Delete jadwal pelajaran error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
