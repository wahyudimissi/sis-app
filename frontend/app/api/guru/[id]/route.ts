import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { hashPassword } from '@/lib/auth';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

// Validation schema for update
const updateGuruSchema = z.object({
  nip: z.string().min(1, 'NIP is required').optional(),
  nuptk: z.string().optional(),
  nama: z.string().min(1, 'Nama is required').optional(),
  jenisKelamin: z.enum(['L', 'P']).optional(),
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
  status: z.boolean().optional(),
  // User credentials
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['GURU', 'WALI_KELAS', 'KEPALA_SEKOLAH']).optional(),
});

// GET - Get single guru by ID
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

        const guru = await prisma.guru.findUnique({
          where: { id },
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
                jurusan: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
            jadwal: {
              select: {
                id: true,
                hari: true,
                jamKe: true,
                jamMulai: true,
                jamSelesai: true,
                kelas: {
                  select: {
                    namaKelas: true,
                  },
                },
                mataPelajaran: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
          },
        });

        if (!guru) {
          return ApiResponseHelper.notFound('Guru not found');
        }

        return ApiResponseHelper.success(guru);

      } catch (error) {
        console.error('Get guru error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// PUT - Update guru by ID
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
        const validation = updateGuruSchema.safeParse(body);
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

        // Check if guru exists
        const existingGuru = await prisma.guru.findUnique({
          where: { id },
          include: { user: true },
        });

        if (!existingGuru) {
          return ApiResponseHelper.notFound('Guru not found');
        }

        // Check if NIP/NUPTK already exists (exclude current guru)
        if (data.nip || data.nuptk) {
          const duplicate = await prisma.guru.findFirst({
            where: {
              AND: [
                { id: { not: id } },
                {
                  OR: [
                    ...(data.nip ? [{ nip: data.nip }] : []),
                    ...(data.nuptk ? [{ nuptk: data.nuptk }] : []),
                  ],
                },
              ],
            },
          });

          if (duplicate) {
            return ApiResponseHelper.badRequest(
              duplicate.nip === data.nip 
                ? 'NIP already exists' 
                : 'NUPTK already exists'
            );
          }
        }

        // Update user and guru in transaction
        const guru = await prisma.$transaction(async (tx) => {
          // Update user if username, password or role changed
          if (data.username || data.password || data.email !== undefined || data.role) {
            const userUpdateData: any = {};
            
            if (data.username) {
              // Check if username already taken
              const existingUser = await tx.user.findFirst({
                where: {
                  AND: [
                    { id: { not: existingGuru.userId } },
                    { username: data.username },
                  ],
                },
              });

              if (existingUser) {
                throw new Error('Username already taken');
              }

              userUpdateData.username = data.username;
            }

            if (data.password) {
              userUpdateData.password = await hashPassword(data.password);
            }

            if (data.email !== undefined) {
              userUpdateData.email = data.email || `${data.username || existingGuru.user.username}@sekolah.com`;
            }

            if (data.role) {
              userUpdateData.role = data.role;
            }

            if (Object.keys(userUpdateData).length > 0) {
              await tx.user.update({
                where: { id: existingGuru.userId },
                data: userUpdateData,
              });
            }
          }

          // Update guru
          const guruUpdateData: any = {};

          if (data.nip) guruUpdateData.nip = data.nip;
          if (data.nuptk !== undefined) guruUpdateData.nuptk = data.nuptk;
          if (data.nama) guruUpdateData.nama = data.nama;
          if (data.jenisKelamin) guruUpdateData.jenisKelamin = data.jenisKelamin;
          if (data.tempatLahir !== undefined) guruUpdateData.tempatLahir = data.tempatLahir;
          if (data.tanggalLahir !== undefined) guruUpdateData.tanggalLahir = data.tanggalLahir ? new Date(data.tanggalLahir) : null;
          if (data.agama !== undefined) guruUpdateData.agama = data.agama;
          if (data.alamat !== undefined) guruUpdateData.alamat = data.alamat;
          if (data.noHp !== undefined) guruUpdateData.noHp = data.noHp;
          if (data.email !== undefined) guruUpdateData.email = data.email;
          if (data.foto !== undefined) guruUpdateData.foto = data.foto;
          if (data.mataPelajaran !== undefined) guruUpdateData.mataPelajaran = data.mataPelajaran;
          if (data.jabatan !== undefined) guruUpdateData.jabatan = data.jabatan;
          if (data.statusKepegawaian !== undefined) guruUpdateData.statusKepegawaian = data.statusKepegawaian;
          if (data.status !== undefined) guruUpdateData.status = data.status;

          const updatedGuru = await tx.guru.update({
            where: { id },
            data: guruUpdateData,
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

          return updatedGuru;
        });

        return ApiResponseHelper.success(guru, 'Guru updated successfully');

      } catch (error: any) {
        console.error('Update guru error:', error);
        
        if (error.message === 'Username already taken') {
          return ApiResponseHelper.badRequest('Username already taken');
        }
        
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// DELETE - Delete guru by ID
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

        // Check if guru exists
        const guru = await prisma.guru.findUnique({
          where: { id },
          select: { userId: true },
        });

        if (!guru) {
          return ApiResponseHelper.notFound('Guru not found');
        }

        // Delete guru and user in transaction
        await prisma.$transaction(async (tx) => {
          // Delete guru first (cascade will handle related records)
          await tx.guru.delete({
            where: { id },
          });

          // Delete user
          await tx.user.delete({
            where: { id: guru.userId },
          });
        });

        return ApiResponseHelper.noContent('Guru deleted successfully');

      } catch (error) {
        console.error('Delete guru error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
