import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schema for batch generation
const generateRaporSchema = z.object({
  tahunAjaranId: z.string().uuid(),
  kelasId: z.string().uuid(),
  semester: z.enum(['GANJIL', 'GENAP']),
});

// POST: Generate rapor for entire class (batch)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN, WALI_KELAS can generate batch
    if (!['ADMIN', 'WALI_KELAS', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = generateRaporSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { tahunAjaranId, kelasId, semester } = validation.data;

    // Get all siswa in the kelas
    const siswaList = await prisma.siswa.findMany({
      where: {
        kelasId: kelasId,
        status: 'AKTIF',
      },
      select: {
        id: true,
        nis: true,
        nama: true,
      },
    });

    if (siswaList.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada siswa aktif di kelas ini' },
        { status: 400 }
      );
    }

    // Generate rapor for each siswa
    const results = await Promise.all(
      siswaList.map(async (siswa) => {
        // Calculate absensi for this siswa
        const absensiData = await prisma.absensi.groupBy({
          by: ['status'],
          where: {
            siswaId: siswa.id,
            tahunAjaranId: tahunAjaranId,
          },
          _count: {
            status: true,
          },
        });

        const absensiCount = {
          sakit: 0,
          izin: 0,
          alpha: 0,
        };

        absensiData.forEach((item) => {
          if (item.status === 'SAKIT') absensiCount.sakit = item._count.status;
          if (item.status === 'IZIN') absensiCount.izin = item._count.status;
          if (item.status === 'ALPHA') absensiCount.alpha = item._count.status;
        });

        // Check if nilai already exists
        const nilaiCount = await prisma.nilai.count({
          where: {
            siswaId: siswa.id,
            tahunAjaranId: tahunAjaranId,
            semester: semester,
          },
        });

        // Determine status: if no nilai, status = BELUM, else PROSES
        const status = nilaiCount === 0 ? 'BELUM' : 'PROSES';

        // Create or update rapor
        return prisma.rapor.upsert({
          where: {
            siswaId_tahunAjaranId_semester: {
              siswaId: siswa.id,
              tahunAjaranId: tahunAjaranId,
              semester: semester,
            },
          },
          update: {
            absensiSakit: absensiCount.sakit,
            absensiIzin: absensiCount.izin,
            absensiAlpha: absensiCount.alpha,
            status: status,
          },
          create: {
            tahunAjaranId: tahunAjaranId,
            siswaId: siswa.id,
            semester: semester,
            absensiSakit: absensiCount.sakit,
            absensiIzin: absensiCount.izin,
            absensiAlpha: absensiCount.alpha,
            status: status,
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: `Rapor berhasil di-generate untuk ${results.length} siswa`,
      data: results,
    });
  } catch (error: any) {
    console.error('Generate rapor batch error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
