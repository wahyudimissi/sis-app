import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schema
const raporSchema = z.object({
  tahunAjaranId: z.string().uuid(),
  siswaId: z.string().uuid(),
  semester: z.enum(['GANJIL', 'GENAP']),
  catatanWaliKelas: z.string().optional().nullable(),
  absensiSakit: z.number().int().min(0).default(0),
  absensiIzin: z.number().int().min(0).default(0),
  absensiAlpha: z.number().int().min(0).default(0),
  ekstrakurikuler: z.string().optional().nullable(),
  prestasi: z.string().optional().nullable(),
  validasiWaliKelas: z.boolean().optional().default(false),
  validasiKepsek: z.boolean().optional().default(false),
  status: z.enum(['BELUM', 'PROSES', 'SELESAI']).optional().default('PROSES'),
});

// POST: Create/Generate rapor
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN, WALI_KELAS, KEPALA_SEKOLAH can create rapor
    if (!['ADMIN', 'WALI_KELAS', 'KEPALA_SEKOLAH', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = raporSchema.safeParse(body);

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

    const data = validation.data;

    // Auto-calculate absensi from Absensi table
    const absensiData = await prisma.absensi.groupBy({
      by: ['status'],
      where: {
        siswaId: data.siswaId,
        tahunAjaranId: data.tahunAjaranId,
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

    // Create or update rapor
    const rapor = await prisma.rapor.upsert({
      where: {
        siswaId_tahunAjaranId_semester: {
          siswaId: data.siswaId,
          tahunAjaranId: data.tahunAjaranId,
          semester: data.semester,
        },
      },
      update: {
        catatanWaliKelas: data.catatanWaliKelas,
        absensiSakit: data.absensiSakit || absensiCount.sakit,
        absensiIzin: data.absensiIzin || absensiCount.izin,
        absensiAlpha: data.absensiAlpha || absensiCount.alpha,
        ekstrakurikuler: data.ekstrakurikuler,
        prestasi: data.prestasi,
        validasiWaliKelas: data.validasiWaliKelas,
        validasiKepsek: data.validasiKepsek,
        status: data.status,
        tanggalGenerate: data.status === 'SELESAI' ? new Date() : null,
      },
      create: {
        tahunAjaranId: data.tahunAjaranId,
        siswaId: data.siswaId,
        semester: data.semester,
        catatanWaliKelas: data.catatanWaliKelas,
        absensiSakit: data.absensiSakit || absensiCount.sakit,
        absensiIzin: data.absensiIzin || absensiCount.izin,
        absensiAlpha: data.absensiAlpha || absensiCount.alpha,
        ekstrakurikuler: data.ekstrakurikuler,
        prestasi: data.prestasi,
        validasiWaliKelas: data.validasiWaliKelas,
        validasiKepsek: data.validasiKepsek,
        status: data.status,
        tanggalGenerate: data.status === 'SELESAI' ? new Date() : null,
      },
      include: {
        siswa: {
          select: {
            nis: true,
            nama: true,
            kelas: {
              select: {
                namaKelas: true,
                tingkat: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Rapor berhasil disimpan',
      data: rapor,
    });
  } catch (error: any) {
    console.error('Create rapor error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Read rapor with filters
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const kelasId = searchParams.get('kelasId');
    const siswaId = searchParams.get('siswaId');
    const tahunAjaranId = searchParams.get('tahunAjaranId');
    const semester = searchParams.get('semester');
    const status = searchParams.get('status');

    const where: any = {};

    if (siswaId) where.siswaId = siswaId;
    if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId;
    if (semester) where.semester = semester;
    if (status) where.status = status;

    // If kelasId provided, filter by siswa kelas
    if (kelasId) {
      where.siswa = {
        kelasId: kelasId,
      };
    }

    const raporList = await prisma.rapor.findMany({
      where,
      include: {
        siswa: {
          select: {
            nis: true,
            nisn: true,
            nama: true,
            jenisKelamin: true,
            kelas: {
              select: {
                namaKelas: true,
                tingkat: true,
              },
            },
          },
        },
        tahunAjaran: {
          select: {
            tahunAjaran: true,
            status: true,
          },
        },
      },
      orderBy: [
        { siswa: { nama: 'asc' } },
      ],
    });

    return NextResponse.json({
      success: true,
      data: raporList,
    });
  } catch (error: any) {
    console.error('Get rapor error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
