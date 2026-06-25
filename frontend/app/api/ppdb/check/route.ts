import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/ppdb/check - Check status pendaftaran (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { noPendaftaran, nisn } = body;

    if (!noPendaftaran || !nisn) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nomor pendaftaran dan NISN wajib diisi',
        },
        { status: 400 }
      );
    }

    // Find pendaftaran by nomor and nisn
    const pendaftaran = await prisma.pendaftaranPPDB.findFirst({
      where: {
        noPendaftaran,
        nisn,
      },
      select: {
        id: true,
        noPendaftaran: true,
        nama: true,
        nisn: true,
        pilihanJurusan1: true,
        pilihanJurusan2: true,
        statusVerifikasi: true,
        statusSeleksi: true,
        catatanVerifikasi: true,
        nilaiSeleksi: true,
        jurusanDiterima: true,
        tanggalDaftar: true,
        tanggalVerifikasi: true,
        tanggalPengumuman: true,
      },
    });

    if (!pendaftaran) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pendaftaran tidak ditemukan. Periksa kembali nomor pendaftaran dan NISN Anda.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pendaftaran,
    });
  } catch (error: any) {
    console.error('Check PPDB error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to check pendaftaran',
      },
      { status: 500 }
    );
  }
}
