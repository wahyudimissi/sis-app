import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

// Validation schema
const updateJurusanSchema = z.object({
  kode: z.string().min(1).max(10).optional(),
  nama: z.string().min(1).optional(),
  deskripsi: z.string().optional(),
  kuota: z.number().int().min(0).optional(),
});

// GET - Get single jurusan by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_KELAS'],
    async (req, user) => {
      try {
        const jurusan = await prisma.jurusan.findUnique({
          where: { id: params.id },
          include: {
            _count: {
              select: {
                kelas: true,
                siswa: true,
                mapel: true,
              },
            },
          },
        });

        if (!jurusan) {
          return ApiResponseHelper.error('Jurusan tidak ditemukan', 404);
        }

        return ApiResponseHelper.success({
          data: jurusan,
        });

      } catch (error) {
        console.error('Get jurusan by ID error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// PUT - Update jurusan
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
        const validation = updateJurusanSchema.safeParse(body);

        if (!validation.success) {
          return ApiResponseHelper.error('Validation failed', 400);
        }

        const { kode, nama, deskripsi, kuota } = validation.data;

        // Check if jurusan exists
        const existing = await prisma.jurusan.findUnique({
          where: { id: params.id },
        });

        if (!existing) {
          return ApiResponseHelper.error('Jurusan tidak ditemukan', 404);
        }

        // If updating kode, check if new kode already exists
        if (kode && kode !== existing.kode) {
          const duplicate = await prisma.jurusan.findUnique({
            where: { kode },
          });

          if (duplicate) {
            return ApiResponseHelper.error('Kode jurusan sudah digunakan', 400);
          }
        }

        // Update jurusan
        const jurusan = await prisma.jurusan.update({
          where: { id: params.id },
          data: {
            kode: kode?.toUpperCase(),
            nama,
            deskripsi,
            kuota,
          },
        });

        return ApiResponseHelper.success({
          message: 'Jurusan berhasil diupdate',
          data: jurusan,
        });

      } catch (error) {
        console.error('Update jurusan error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// DELETE - Delete jurusan
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        // Check if jurusan exists
        const existing = await prisma.jurusan.findUnique({
          where: { id: params.id },
          include: {
            _count: {
              select: {
                kelas: true,
                siswa: true,
                mapel: true,
              },
            },
          },
        });

        if (!existing) {
          return ApiResponseHelper.error('Jurusan tidak ditemukan', 404);
        }

        // Check if jurusan has relations
        if (existing._count.kelas > 0) {
          return ApiResponseHelper.error(
            `Tidak dapat menghapus jurusan. Masih ada ${existing._count.kelas} kelas yang terhubung.`,
            400
          );
        }

        if (existing._count.siswa > 0) {
          return ApiResponseHelper.error(
            `Tidak dapat menghapus jurusan. Masih ada ${existing._count.siswa} siswa yang terhubung.`,
            400
          );
        }

        if (existing._count.mapel > 0) {
          return ApiResponseHelper.error(
            `Tidak dapat menghapus jurusan. Masih ada ${existing._count.mapel} mata pelajaran yang terhubung.`,
            400
          );
        }

        // Delete jurusan
        await prisma.jurusan.delete({
          where: { id: params.id },
        });

        return ApiResponseHelper.success({
          message: 'Jurusan berhasil dihapus',
        });

      } catch (error) {
        console.error('Delete jurusan error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
