import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/absensi/rfid - Record attendance via RFID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rfidCard, tanggal, mataPelajaran } = body;

    if (!rfidCard) {
      return NextResponse.json(
        {
          success: false,
          message: 'RFID card required',
        },
        { status: 400 }
      );
    }

    // Find siswa by RFID card
    const siswa = await prisma.siswa.findUnique({
      where: { rfidCard },
      include: {
        kelas: true,
      },
    });

    if (!siswa) {
      return NextResponse.json(
        {
          success: false,
          message: 'Kartu RFID tidak terdaftar',
        },
        { status: 404 }
      );
    }

    if (!siswa.kelasId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Siswa belum memiliki kelas',
        },
        { status: 400 }
      );
    }

    // Get active tahun ajaran
    const tahunAjaranAktif = await prisma.tahunAjaran.findFirst({
      where: { status: 'AKTIF' },
    });

    if (!tahunAjaranAktif) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tidak ada tahun ajaran aktif',
        },
        { status: 400 }
      );
    }

    const absensiDate = tanggal ? new Date(tanggal) : new Date();
    absensiDate.setHours(0, 0, 0, 0);

    // Check if already recorded today
    const existingAbsensi = await prisma.absensi.findFirst({
      where: {
        siswaId: siswa.id,
        tanggal: absensiDate,
        mataPelajaran: mataPelajaran || null,
      },
    });

    if (existingAbsensi) {
      return NextResponse.json(
        {
          success: false,
          message: 'Absensi sudah tercatat untuk hari ini',
          data: {
            siswa: {
              nama: siswa.nama,
              nis: siswa.nis,
              kelas: siswa.kelas?.namaKelas,
            },
            absensi: existingAbsensi,
          },
        },
        { status: 400 }
      );
    }

    // Create absensi record
    const absensi = await prisma.absensi.create({
      data: {
        tahunAjaranId: tahunAjaranAktif.id,
        kelasId: siswa.kelasId,
        siswaId: siswa.id,
        tanggal: absensiDate,
        mataPelajaran,
        status: 'HADIR',
        keterangan: 'Absensi via RFID',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Absensi berhasil dicatat',
      data: {
        siswa: {
          id: siswa.id,
          nama: siswa.nama,
          nis: siswa.nis,
          kelas: siswa.kelas?.namaKelas,
          foto: siswa.foto,
        },
        absensi,
      },
    });
  } catch (error: any) {
    console.error('RFID Absensi error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to record attendance',
      },
      { status: 500 }
    );
  }
}
