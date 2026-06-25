import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get current user from token
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return ApiResponseHelper.unauthorized('Not authenticated');
    }

    // Get full user data
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
        lastLogin: true,
        guru: {
          select: {
            id: true,
            nip: true,
            nama: true,
            jenisKelamin: true,
            tempatLahir: true,
            tanggalLahir: true,
            agama: true,
            alamat: true,
            noHp: true,
            email: true,
            foto: true,
            mataPelajaran: true,
            jabatan: true,
            statusKepegawaian: true,
            status: true,
          },
        },
        siswa: {
          select: {
            id: true,
            nis: true,
            nisn: true,
            nama: true,
            jenisKelamin: true,
            tempatLahir: true,
            tanggalLahir: true,
            agama: true,
            alamat: true,
            noHp: true,
            email: true,
            foto: true,
            tahunMasuk: true,
            status: true,
            kelas: {
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
            jurusan: {
              select: {
                nama: true,
              },
            },
          },
        },
        orangTua: {
          select: {
            id: true,
            namaAyah: true,
            namaIbu: true,
            namaWali: true,
            noHpAyah: true,
            noHpIbu: true,
            noHpWali: true,
            pekerjaanAyah: true,
            pekerjaanIbu: true,
            alamat: true,
            siswa: {
              select: {
                id: true,
                nis: true,
                nama: true,
                foto: true,
                kelas: {
                  select: {
                    namaKelas: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return ApiResponseHelper.notFound('User not found');
    }

    return ApiResponseHelper.success(user, 'User data retrieved successfully');

  } catch (error) {
    console.error('Get current user error:', error);
    return ApiResponseHelper.error('Internal server error');
  }
}
