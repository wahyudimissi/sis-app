import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Get single rapor by ID with full details (nilai, absensi, dll)
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

    const { id } = params;

    const rapor = await prisma.rapor.findUnique({
      where: { id },
      include: {
        siswa: {
          select: {
            nis: true,
            nisn: true,
            nama: true,
            jenisKelamin: true,
            tempatLahir: true,
            tanggalLahir: true,
            agama: true,
            alamat: true,
            kelas: {
              select: {
                namaKelas: true,
                tingkat: true,
                jurusan: {
                  select: {
                    nama: true,
                  },
                },
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
    });

    if (!rapor) {
      return NextResponse.json(
        { success: false, message: 'Rapor not found' },
        { status: 404 }
      );
    }

    // Get nilai for this rapor
    const nilaiList = await prisma.nilai.findMany({
      where: {
        siswaId: rapor.siswaId,
        tahunAjaranId: rapor.tahunAjaranId,
        semester: rapor.semester,
      },
      include: {
        mataPelajaran: {
          select: {
            kode: true,
            nama: true,
            kelompok: true,
            kkm: true,
          },
        },
      },
      orderBy: [
        { mataPelajaran: { kelompok: 'asc' } },
        { mataPelajaran: { nama: 'asc' } },
      ],
    });

    // Calculate rata-rata
    const validNilai = nilaiList
      .map((n) => n.nilaiAkhir)
      .filter((n): n is number => n !== null);
    const rataRata = validNilai.length > 0
      ? (validNilai.reduce((a, b) => a + b, 0) / validNilai.length).toFixed(2)
      : '0';

    return NextResponse.json({
      success: true,
      data: {
        ...rapor,
        nilai: nilaiList,
        rataRata: parseFloat(rataRata),
      },
    });
  } catch (error: any) {
    console.error('Get rapor by ID error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update rapor
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

    // Only ADMIN, WALI_KELAS, KEPALA_SEKOLAH can update
    if (!['ADMIN', 'WALI_KELAS', 'KEPALA_SEKOLAH', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    const rapor = await prisma.rapor.update({
      where: { id },
      data: {
        catatanWaliKelas: body.catatanWaliKelas,
        absensiSakit: body.absensiSakit,
        absensiIzin: body.absensiIzin,
        absensiAlpha: body.absensiAlpha,
        ekstrakurikuler: body.ekstrakurikuler,
        prestasi: body.prestasi,
        validasiWaliKelas: body.validasiWaliKelas,
        validasiKepsek: body.validasiKepsek,
        status: body.status,
        tanggalGenerate: body.status === 'SELESAI' ? new Date() : undefined,
      },
      include: {
        siswa: {
          select: {
            nis: true,
            nama: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Rapor berhasil diupdate',
      data: rapor,
    });
  } catch (error: any) {
    console.error('Update rapor error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete rapor
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
        { success: false, message: 'Forbidden: Only ADMIN can delete rapor' },
        { status: 403 }
      );
    }

    const { id } = params;

    await prisma.rapor.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Rapor berhasil dihapus',
    });
  } catch (error: any) {
    console.error('Delete rapor error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
