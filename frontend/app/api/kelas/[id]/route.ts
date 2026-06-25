import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

// Validation schema for update
const updateKelasSchema = z.object({
  namaKelas: z.string().min(1, 'Nama kelas is required').optional(),
  tingkat: z.string().min(1, 'Tingkat is required').optional(),
  jurusanId: z.string().min(1, 'Jurusan is required').optional(),
  waliKelasId: z.string().nullable().optional(),
  ruangan: z.string().optional(),
});

// GET - Get single kelas by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_KELAS'],
    async (req, user) => {
      try {
        const { id } = params;

        const kelas = await prisma.kelas.findUnique({
          where: { id },
          include: {
            jurusan: true,
            tahunAjaran: true,
            waliKelas: {
              select: {
                id: true,
                nip: true,
                nama: true,
                foto: true,
              },
            },
            siswa: {
              select: {
                id: true,
                nis: true,
                nama: true,
                jenisKelamin: true,
                foto: true,
                status: true,
              },
              orderBy: {
                nama: 'asc',
              },
            },
            _count: {
              select: {
                siswa: true,
                jadwal: true,
              },
            },
          },
        });

        if (!kelas) {
          return ApiResponseHelper.notFound('Kelas not found');
        }

        return ApiResponseHelper.success(kelas);

      } catch (error) {
        console.error('Get kelas error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// PUT - Update kelas by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        const { id } = params;
        const body = await req.json();

        // Validate input
        const validation = updateKelasSchema.safeParse(body);
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

        // Check if kelas exists
        const existingKelas = await prisma.kelas.findUnique({
          where: { id },
        });

        if (!existingKelas) {
          return ApiResponseHelper.notFound('Kelas not found');
        }

        // Check if nama kelas already exists (exclude current kelas)
        if (data.namaKelas) {
          const duplicate = await prisma.kelas.findFirst({
            where: {
              AND: [
                { id: { not: id } },
                { namaKelas: data.namaKelas },
                { tahunAjaranId: existingKelas.tahunAjaranId },
              ],
            },
          });

          if (duplicate) {
            return ApiResponseHelper.badRequest('Kelas name already exists for this tahun ajaran');
          }
        }

        // Update kelas
        const kelasUpdateData: any = {};
        if (data.namaKelas) kelasUpdateData.namaKelas = data.namaKelas;
        if (data.tingkat) kelasUpdateData.tingkat = data.tingkat;
        if (data.jurusanId) kelasUpdateData.jurusanId = data.jurusanId;
        if (data.waliKelasId !== undefined) kelasUpdateData.waliKelasId = data.waliKelasId;
        if (data.ruangan !== undefined) kelasUpdateData.ruangan = data.ruangan;

        const kelas = await prisma.kelas.update({
          where: { id },
          data: kelasUpdateData,
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

        return ApiResponseHelper.success(kelas, 'Kelas updated successfully');

      } catch (error) {
        console.error('Update kelas error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// DELETE - Delete kelas by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        const { id } = params;

        // Check if kelas exists and has students
        const kelas = await prisma.kelas.findUnique({
          where: { id },
          include: {
            _count: {
              select: {
                siswa: true,
              },
            },
          },
        });

        if (!kelas) {
          return ApiResponseHelper.notFound('Kelas not found');
        }

        if (kelas._count.siswa > 0) {
          return ApiResponseHelper.badRequest('Cannot delete kelas with students');
        }

        // Delete kelas
        await prisma.kelas.delete({
          where: { id },
        });

        return ApiResponseHelper.noContent('Kelas deleted successfully');

      } catch (error) {
        console.error('Delete kelas error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
