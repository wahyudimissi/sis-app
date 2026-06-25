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

export async function GET(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_KELAS'],
    async (req, user) => {
      try {
        const { searchParams } = new URL(req.url);
        const kelasId = searchParams.get('kelasId') || '';
        const tahunAjaranId = searchParams.get('tahunAjaranId') || '';
        const guruId = searchParams.get('guruId') || '';
        const hari = searchParams.get('hari') || '';

        const where: any = {};
        if (kelasId) where.kelasId = kelasId;
        if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId;
        if (guruId) where.guruId = guruId;
        if (hari) where.hari = hari;

        const data = await prisma.jadwalPelajaran.findMany({
          where,
          include: {
            tahunAjaran: {
              select: { tahunAjaran: true, status: true },
            },
            kelas: {
              select: { namaKelas: true, tingkat: true },
            },
            mataPelajaran: {
              select: { kode: true, nama: true },
            },
            guru: {
              select: { nip: true, nama: true },
            },
          },
          orderBy: [
            { hari: 'asc' },
            { jamKe: 'asc' },
          ],
        });

        return ApiResponseHelper.success({ data });

      } catch (error) {
        console.error('Get jadwal pelajaran error:', error);
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
        const validation = jadwalPelajaranSchema.safeParse(body);
        
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

        // Check for conflicts: same kelas, hari, jamKe, tahunAjaran
        const conflictKelas = await prisma.jadwalPelajaran.findFirst({
          where: {
            kelasId: data.kelasId,
            hari: data.hari,
            jamKe: data.jamKe,
            tahunAjaranId: data.tahunAjaranId,
          },
        });

        if (conflictKelas) {
          return ApiResponseHelper.badRequest('Jadwal bentrok: Kelas sudah memiliki jadwal di jam yang sama');
        }

        // Check for conflicts: same guru, hari, jamKe, tahunAjaran
        const conflictGuru = await prisma.jadwalPelajaran.findFirst({
          where: {
            guruId: data.guruId,
            hari: data.hari,
            jamKe: data.jamKe,
            tahunAjaranId: data.tahunAjaranId,
          },
        });

        if (conflictGuru) {
          return ApiResponseHelper.badRequest('Jadwal bentrok: Guru sudah mengajar di kelas lain pada jam yang sama');
        }

        const jadwal = await prisma.jadwalPelajaran.create({
          data,
          include: {
            tahunAjaran: { select: { tahunAjaran: true } },
            kelas: { select: { namaKelas: true } },
            mataPelajaran: { select: { kode: true, nama: true } },
            guru: { select: { nip: true, nama: true } },
          },
        });

        return ApiResponseHelper.created(jadwal, 'Jadwal pelajaran created successfully');

      } catch (error) {
        console.error('Create jadwal pelajaran error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
