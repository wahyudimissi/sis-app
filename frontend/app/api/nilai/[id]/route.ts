import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const updateNilaiSchema = z.object({
  nilaiTugas: z.number().min(0).max(100).optional().nullable(),
  nilaiUTS: z.number().min(0).max(100).optional().nullable(),
  nilaiUAS: z.number().min(0).max(100).optional().nullable(),
  nilaiAkhir: z.number().min(0).max(100).optional().nullable(),
  predikat: z.string().optional().nullable(),
  deskripsi: z.string().optional().nullable(),
});

// Helper functions
function hitungNilaiAkhir(
  nilaiTugas: number | null | undefined,
  nilaiUTS: number | null | undefined,
  nilaiUAS: number | null | undefined
): number | null {
  if (
    nilaiTugas === null || nilaiTugas === undefined ||
    nilaiUTS === null || nilaiUTS === undefined ||
    nilaiUAS === null || nilaiUAS === undefined
  ) {
    return null;
  }

  const hasil = (nilaiTugas * 30) / 100 + (nilaiUTS * 30) / 100 + (nilaiUAS * 40) / 100;
  return Math.round(hasil);
}

function getPredikat(nilaiAkhir: number | null): string | null {
  if (nilaiAkhir === null) return null;
  if (nilaiAkhir >= 90) return 'A';
  if (nilaiAkhir >= 80) return 'B';
  if (nilaiAkhir >= 70) return 'C';
  if (nilaiAkhir >= 60) return 'D';
  return 'E';
}

// GET: Get single nilai by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const nilai = await prisma.nilai.findUnique({
      where: { id: params.id },
      include: {
        siswa: {
          select: {
            nis: true,
            nama: true,
            jenisKelamin: true,
          },
        },
        mataPelajaran: {
          select: {
            kode: true,
            nama: true,
            kkm: true,
          },
        },
        tahunAjaran: {
          select: {
            tahunAjaran: true,
            status: true,
          },
        },
      },
    });

    if (!nilai) {
      return NextResponse.json(
        { success: false, message: 'Nilai not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: nilai,
    });
  } catch (error: any) {
    console.error('Get nilai by ID error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update nilai
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN, GURU can update
    if (!['ADMIN', 'GURU', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateNilaiSchema.safeParse(body);

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

    const {
      nilaiTugas,
      nilaiUTS,
      nilaiUAS,
      nilaiAkhir: providedNilaiAkhir,
      predikat: providedPredikat,
      deskripsi,
    } = validation.data;

    // Auto-calculate if not provided
    const nilaiAkhir = providedNilaiAkhir ?? hitungNilaiAkhir(nilaiTugas, nilaiUTS, nilaiUAS);
    const predikat = providedPredikat ?? getPredikat(nilaiAkhir);

    const nilai = await prisma.nilai.update({
      where: { id: params.id },
      data: {
        nilaiTugas,
        nilaiUTS,
        nilaiUAS,
        nilaiAkhir,
        predikat,
        deskripsi,
      },
      include: {
        siswa: {
          select: {
            nis: true,
            nama: true,
          },
        },
        mataPelajaran: {
          select: {
            kode: true,
            nama: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Nilai berhasil diupdate',
      data: nilai,
    });
  } catch (error: any) {
    console.error('Update nilai error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete nilai
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN can delete
    if (!['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Only admin can delete nilai' },
        { status: 403 }
      );
    }

    await prisma.nilai.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Nilai berhasil dihapus',
    });
  } catch (error: any) {
    console.error('Delete nilai error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
