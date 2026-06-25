import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Get nilai summary/statistics
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
    const mataPelajaranId = searchParams.get('mataPelajaranId');
    const tahunAjaranId = searchParams.get('tahunAjaranId');
    const semester = searchParams.get('semester');

    const where: any = {};

    if (mataPelajaranId) where.mataPelajaranId = mataPelajaranId;
    if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId;
    if (semester) where.semester = semester;

    // If kelasId provided, filter by siswa kelas
    if (kelasId) {
      where.siswa = {
        kelasId: kelasId,
      };
    }

    // Get KKM from mata pelajaran
    let kkm = 75; // default
    if (mataPelajaranId) {
      const mapel = await prisma.mataPelajaran.findUnique({
        where: { id: mataPelajaranId },
        select: { kkm: true },
      });
      if (mapel) kkm = mapel.kkm;
    }

    // Get all nilai with filters
    const nilaiList = await prisma.nilai.findMany({
      where,
      select: {
        nilaiAkhir: true,
        predikat: true,
      },
    });

    // Filter valid nilai (not null)
    const validNilai = nilaiList
      .map(n => n.nilaiAkhir)
      .filter((n): n is number => n !== null);

    // Calculate statistics
    const total = nilaiList.length;
    const rataRata = validNilai.length > 0
      ? Math.round(validNilai.reduce((a, b) => a + b, 0) / validNilai.length)
      : 0;
    const tertinggi = validNilai.length > 0 ? Math.max(...validNilai) : 0;
    const terendah = validNilai.length > 0 ? Math.min(...validNilai) : 0;
    const tuntas = validNilai.filter(n => n >= kkm).length;
    const belumTuntas = validNilai.filter(n => n < kkm).length;

    // Count by predikat
    const predikatA = nilaiList.filter(n => n.predikat === 'A').length;
    const predikatB = nilaiList.filter(n => n.predikat === 'B').length;
    const predikatC = nilaiList.filter(n => n.predikat === 'C').length;
    const predikatD = nilaiList.filter(n => n.predikat === 'D').length;
    const predikatE = nilaiList.filter(n => n.predikat === 'E').length;

    // Calculate percentages
    const persentaseTuntas = total > 0 ? ((tuntas / total) * 100).toFixed(1) : '0';
    const persentaseBelumTuntas = total > 0 ? ((belumTuntas / total) * 100).toFixed(1) : '0';

    return NextResponse.json({
      success: true,
      data: {
        total,
        rataRata,
        tertinggi,
        terendah,
        tuntas,
        belumTuntas,
        persentaseTuntas,
        persentaseBelumTuntas,
        kkm,
        predikat: {
          A: predikatA,
          B: predikatB,
          C: predikatC,
          D: predikatD,
          E: predikatE,
        },
      },
    });
  } catch (error: any) {
    console.error('Get nilai summary error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
