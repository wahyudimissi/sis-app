import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { hashPassword } from '@/lib/auth';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

// Validation schema for update
const updateSiswaSchema = z.object({
  nis: z.string().min(1, 'NIS is required').optional(),
  nisn: z.string().min(1, 'NISN is required').optional(),
  nama: z.string().min(1, 'Nama is required').optional(),
  jenisKelamin: z.enum(['L', 'P']).optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  agama: z.string().optional(),
  alamat: z.string().optional(),
  noHp: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  foto: z.string().optional(),
  rfidCard: z.string().nullable().optional(),
  kelasId: z.string().nullable().optional(),
  jurusanId: z.string().nullable().optional(),
  tahunMasuk: z.string().optional(),
  status: z.enum(['AKTIF', 'LULUS', 'PINDAH', 'KELUAR', 'ALUMNI']).optional(),
  // User credentials
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

// GET - Get single siswa by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_KELAS', 'SISWA', 'ORANG_TUA'],
    async (req, user) => {
      try {
        const { id } = params;

        const siswa = await prisma.siswa.findUnique({
          where: { id },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                status: true,
              },
            },
            kelas: {
              select: {
                id: true,
                namaKelas: true,
                tingkat: true,
                ruangan: true,
                waliKelas: {
                  select: {
                    nama: true,
                  },
                },
                jurusan: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
            jurusan: {
              select: {
                id: true,
                nama: true,
                kode: true,
              },
            },
            orangTua: {
              select: {
                namaAyah: true,
                namaIbu: true,
                namaWali: true,
                noHpAyah: true,
                noHpIbu: true,
                noHpWali: true,
                pekerjaanAyah: true,
                pekerjaanIbu: true,
                alamat: true,
              },
            },
          },
        });

        if (!siswa) {
          return ApiResponseHelper.notFound('Siswa not found');
        }

        return ApiResponseHelper.success(siswa);

      } catch (error) {
        console.error('Get siswa error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// PUT - Update siswa by ID
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
        const validation = updateSiswaSchema.safeParse(body);
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

        // Check if siswa exists
        const existingSiswa = await prisma.siswa.findUnique({
          where: { id },
          include: { user: true },
        });

        if (!existingSiswa) {
          return ApiResponseHelper.notFound('Siswa not found');
        }

        // Check if NIS/NISN already exists (exclude current siswa)
        if (data.nis || data.nisn || data.rfidCard) {
          const duplicate = await prisma.siswa.findFirst({
            where: {
              AND: [
                { id: { not: id } },
                {
                  OR: [
                    ...(data.nis ? [{ nis: data.nis }] : []),
                    ...(data.nisn ? [{ nisn: data.nisn }] : []),
                    ...(data.rfidCard ? [{ rfidCard: data.rfidCard }] : []),
                  ],
                },
              ],
            },
          });

          if (duplicate) {
            let message = 'NISN already exists';
            if (duplicate.nis === data.nis) message = 'NIS already exists';
            if (data.rfidCard && duplicate.rfidCard === data.rfidCard) {
              message = 'RFID card already registered';
            }
            return ApiResponseHelper.badRequest(message);
          }
        }

        // Update user and siswa in transaction
        const siswa = await prisma.$transaction(async (tx) => {
          // Update user if username or password changed
          if (data.username || data.password || data.email !== undefined) {
            const userUpdateData: any = {};
            
            if (data.username) {
              // Check if username already taken
              const existingUser = await tx.user.findFirst({
                where: {
                  AND: [
                    { id: { not: existingSiswa.userId } },
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
              userUpdateData.email = data.email || `${data.username || existingSiswa.user.username}@sekolah.com`;
            }

            if (Object.keys(userUpdateData).length > 0) {
              await tx.user.update({
                where: { id: existingSiswa.userId },
                data: userUpdateData,
              });
            }
          }

          // Update siswa
          const siswaUpdateData: any = {};

          if (data.nis) siswaUpdateData.nis = data.nis;
          if (data.nisn) siswaUpdateData.nisn = data.nisn;
          if (data.nama) siswaUpdateData.nama = data.nama;
          if (data.jenisKelamin) siswaUpdateData.jenisKelamin = data.jenisKelamin;
          if (data.tempatLahir !== undefined) siswaUpdateData.tempatLahir = data.tempatLahir;
          if (data.tanggalLahir !== undefined) siswaUpdateData.tanggalLahir = data.tanggalLahir ? new Date(data.tanggalLahir) : null;
          if (data.agama !== undefined) siswaUpdateData.agama = data.agama;
          if (data.alamat !== undefined) siswaUpdateData.alamat = data.alamat;
          if (data.noHp !== undefined) siswaUpdateData.noHp = data.noHp;
          if (data.email !== undefined) siswaUpdateData.email = data.email;
          if (data.foto !== undefined) siswaUpdateData.foto = data.foto;
          if (data.rfidCard !== undefined) siswaUpdateData.rfidCard = data.rfidCard || null;
          if (data.kelasId !== undefined) siswaUpdateData.kelasId = data.kelasId;
          if (data.jurusanId !== undefined) siswaUpdateData.jurusanId = data.jurusanId;
          if (data.tahunMasuk !== undefined) siswaUpdateData.tahunMasuk = data.tahunMasuk;
          if (data.status) siswaUpdateData.status = data.status;

          const updatedSiswa = await tx.siswa.update({
            where: { id },
            data: siswaUpdateData,
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
              kelas: {
                select: {
                  namaKelas: true,
                },
              },
              jurusan: {
                select: {
                  nama: true,
                },
              },
            },
          });

          return updatedSiswa;
        });

        return ApiResponseHelper.success(siswa, 'Siswa updated successfully');

      } catch (error: any) {
        console.error('Update siswa error:', error);
        
        if (error.message === 'Username already taken') {
          return ApiResponseHelper.badRequest('Username already taken');
        }
        
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

// DELETE - Delete siswa by ID
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

        // Check if siswa exists
        const siswa = await prisma.siswa.findUnique({
          where: { id },
          select: { userId: true },
        });

        if (!siswa) {
          return ApiResponseHelper.notFound('Siswa not found');
        }

        // Delete siswa and user in transaction
        await prisma.$transaction(async (tx) => {
          // Delete siswa first (cascade will handle related records)
          await tx.siswa.delete({
            where: { id },
          });

          // Delete user
          await tx.user.delete({
            where: { id: siswa.userId },
          });
        });

        return ApiResponseHelper.noContent('Siswa deleted successfully');

      } catch (error) {
        console.error('Delete siswa error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
