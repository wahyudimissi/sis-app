import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET: Get absensi summary/statistics
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
    const tanggalMulai = searchParams.get('tanggalMulai');
    const tanggalSelesai = searchParams.get('tanggalSelesai');
    const tahunAjaranId = searchParams.get('tahunAjaranId');

    const where: any = {};

    if (kelasId) where.kelasId = kelasId;
    if (siswaId) where.siswaId = siswaId;
    if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId;

    // Date range
    if (tanggalMulai && tanggalSelesai) {
      where.tanggal = {
        gte: new Date(tanggalMulai),
        lte: new Date(tanggalSelesai),
      };
    }

    // Get summary counts
    const [total, hadir, izin, sakit, alpha, terlambat] = await Promise.all([
      prisma.absensi.count({ where }),
      prisma.absensi.count({ where: { ...where, status: 'HADIR' } }),
      prisma.absensi.count({ where: { ...where, status: 'IZIN' } }),
      prisma.absensi.count({ where: { ...where, status: 'SAKIT' } }),
      prisma.absensi.count({ where: { ...where, status: 'ALPHA' } }),
      prisma.absensi.count({ where: { ...where, status: 'TERLAMBAT' } }),
    ]);

    // Calculate percentages
    const persentaseHadir = total > 0 ? ((hadir / total) * 100).toFixed(1) : '0';
    const persentaseIzin = total > 0 ? ((izin / total) * 100).toFixed(1) : '0';
    const persentaseSakit = total > 0 ? ((sakit / total) * 100).toFixed(1) : '0';
    const persentaseAlpha = total > 0 ? ((alpha / total) * 100).toFixed(1) : '0';
    const persentaseTerlambat = total > 0 ? ((terlambat / total) * 100).toFixed(1) : '0';

    return NextResponse.json({
      success: true,
      data: {
        total,
        hadir,
        izin,
        sakit,
        alpha,
        terlambat,
        persentaseHadir,
        persentaseIzin,
        persentaseSakit,
        persentaseAlpha,
        persentaseTerlambat,
      },
    });
  } catch (error: any) {
    console.error('Get absensi summary error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
