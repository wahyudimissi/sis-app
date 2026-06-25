import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

const updateTahunAjaranSchema = z.object({
  tahunAjaran: z.string().min(1).optional(),
  tanggalMulai: z.string().optional(),
  tanggalSelesai: z.string().optional(),
  status: z.enum(['AKTIF', 'TIDAK_AKTIF', 'SELESAI']).optional(),
  isLocked: z.boolean().optional(),
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
        const tahunAjaran = await prisma.tahunAjaran.findUnique({
          where: { id: params.id },
          include: {
            semester: true,
            _count: {
              select: { kelas: true, semester: true, jadwal: true, absensi: true, nilai: true },
            },
          },
        });

        if (!tahunAjaran) {
          return ApiResponseHelper.notFound('Tahun ajaran not found');
        }

        return ApiResponseHelper.success(tahunAjaran);

      } catch (error) {
        console.error('Get tahun ajaran error:', error);
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
        const validation = updateTahunAjaranSchema.safeParse(body);
        
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
          where: { id: params.id },
        });

        if (!existing) {
          return ApiResponseHelper.notFound('Tahun ajaran not found');
        }

        // Allow unlocking even if locked, but block other updates
        if (existing.isLocked && data.isLocked !== false) {
          // If locked and not trying to unlock, block the update
          return ApiResponseHelper.badRequest('Tahun ajaran is locked and cannot be modified');
        }

        // If status changed to AKTIF, deactivate others
        if (data.status === 'AKTIF') {
          await prisma.tahunAjaran.updateMany({
            where: {
              AND: [
                { id: { not: params.id } },
                { status: 'AKTIF' },
              ],
            },
            data: { status: 'TIDAK_AKTIF' },
          });
        }

        const updateData: any = {};
        if (data.tahunAjaran) updateData.tahunAjaran = data.tahunAjaran;
        if (data.tanggalMulai) updateData.tanggalMulai = new Date(data.tanggalMulai);
        if (data.tanggalSelesai) updateData.tanggalSelesai = new Date(data.tanggalSelesai);
        if (data.status) updateData.status = data.status;
        if (data.isLocked !== undefined) updateData.isLocked = data.isLocked;

        const tahunAjaran = await prisma.tahunAjaran.update({
          where: { id: params.id },
          data: updateData,
        });

        return ApiResponseHelper.success(tahunAjaran, 'Tahun ajaran updated successfully');

      } catch (error) {
        console.error('Update tahun ajaran error:', error);
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
        const { searchParams } = new URL(req.url);
        const cascade = searchParams.get('cascade') === 'true';

        const tahunAjaran = await prisma.tahunAjaran.findUnique({
          where: { id: params.id },
          include: {
            _count: { 
              select: { 
                kelas: true, 
                semester: true, 
                jadwal: true, 
                absensi: true, 
                nilai: true,
                rapor: true 
              } 
            },
          },
        });

        if (!tahunAjaran) {
          return ApiResponseHelper.notFound('Tahun ajaran not found');
        }

        if (tahunAjaran.isLocked) {
          return ApiResponseHelper.badRequest('Cannot delete locked tahun ajaran');
        }

        const totalRelated = Object.values(tahunAjaran._count).reduce((a, b) => a + b, 0);
        
        // If has related data and cascade=false, return error
        if (totalRelated > 0 && !cascade) {
          return ApiResponseHelper.badRequest(
            `Cannot delete tahun ajaran with related data: ${tahunAjaran._count.kelas} kelas, ` +
            `${tahunAjaran._count.semester} semester, ${tahunAjaran._count.jadwal} jadwal, ` +
            `${tahunAjaran._count.absensi} absensi, ${tahunAjaran._count.nilai} nilai, ` +
            `${tahunAjaran._count.rapor} rapor. Use cascade=true to force delete.`
          );
        }

        // CASCADE DELETE: Delete all related data in transaction
        if (cascade && totalRelated > 0) {
          await prisma.$transaction(async (tx) => {
            // 1. Delete Rapor (depends on tahunAjaran)
            const deletedRapor = await tx.rapor.deleteMany({
              where: { tahunAjaranId: params.id },
            });

            // 2. Delete Nilai (depends on tahunAjaran)
            const deletedNilai = await tx.nilai.deleteMany({
              where: { tahunAjaranId: params.id },
            });

            // 3. Delete Absensi (depends on tahunAjaran)
            const deletedAbsensi = await tx.absensi.deleteMany({
              where: { tahunAjaranId: params.id },
            });

            // 4. Delete JadwalPelajaran (depends on tahunAjaran)
            const deletedJadwal = await tx.jadwalPelajaran.deleteMany({
              where: { tahunAjaranId: params.id },
            });

            // 5. Delete Semester (depends on tahunAjaran)
            const deletedSemester = await tx.semester.deleteMany({
              where: { tahunAjaranId: params.id },
            });

            // 6. Update Siswa to remove kelas reference (kelas will be deleted)
            await tx.siswa.updateMany({
              where: {
                kelas: {
                  tahunAjaranId: params.id,
                },
              },
              data: {
                kelasId: null,
              },
            });

            // 7. Delete Kelas (depends on tahunAjaran)
            const deletedKelas = await tx.kelas.deleteMany({
              where: { tahunAjaranId: params.id },
            });

            // 8. Finally, delete TahunAjaran
            await tx.tahunAjaran.delete({
              where: { id: params.id },
            });

            console.log('Cascade delete completed:', {
              rapor: deletedRapor.count,
              nilai: deletedNilai.count,
              absensi: deletedAbsensi.count,
              jadwal: deletedJadwal.count,
              semester: deletedSemester.count,
              kelas: deletedKelas.count,
            });
          });

          return ApiResponseHelper.success(
            { 
              deleted: {
                rapor: tahunAjaran._count.rapor,
                nilai: tahunAjaran._count.nilai,
                absensi: tahunAjaran._count.absensi,
                jadwal: tahunAjaran._count.jadwal,
                semester: tahunAjaran._count.semester,
                kelas: tahunAjaran._count.kelas,
              }
            },
            `Tahun ajaran dan semua data terkait berhasil dihapus`
          );
        }

        // Simple delete if no related data
        await prisma.tahunAjaran.delete({ where: { id: params.id } });

        return ApiResponseHelper.noContent('Tahun ajaran deleted successfully');

      } catch (error) {
        console.error('Delete tahun ajaran error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
