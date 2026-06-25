import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/ppdb - Read pendaftaran PPDB (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const statusSeleksi = searchParams.get('statusSeleksi');
    const jurusan = searchParams.get('jurusan');
    const search = searchParams.get('search');

    const where: any = {};

    if (status) {
      where.statusVerifikasi = status;
    }

    if (statusSeleksi) {
      where.statusSeleksi = statusSeleksi;
    }

    if (jurusan) {
      where.OR = [
        { pilihanJurusan1: jurusan },
        { pilihanJurusan2: jurusan },
      ];
    }

    if (search) {
      where.OR = [
        { noPendaftaran: { contains: search, mode: 'insensitive' } },
        { nama: { contains: search, mode: 'insensitive' } },
        { nisn: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pendaftaran = await prisma.pendaftaranPPDB.findMany({
      where,
      orderBy: {
        tanggalDaftar: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: pendaftaran,
    });
  } catch (error: any) {
    console.error('Get PPDB error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch pendaftaran',
      },
      { status: 500 }
    );
  }
}

// POST /api/ppdb - Create new pendaftaran (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      // Data Pribadi
      nama,
      nisn,
      nik,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      agama,
      alamat,
      rt,
      rw,
      kelurahan,
      kecamatan,
      kota,
      provinsi,
      kodePos,
      noHp,
      email,
      
      // Asal Sekolah
      asalSekolah,
      nsnAsalSekolah,
      alamatSekolah,
      nomorIjazah,
      tahunLulus,
      
      // Pilihan Jurusan
      pilihanJurusan1,
      pilihanJurusan2,
      
      // Data Orang Tua
      namaAyah,
      namaIbu,
      pekerjaanAyah,
      pekerjaanIbu,
      penghasilanOrtu,
      noHpOrtu,
      emailOrtu,
    } = body;

    // Validation
    if (!nama || !nisn || !jenisKelamin || !tempatLahir || !tanggalLahir || !agama || !alamat) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data pribadi wajib diisi lengkap',
        },
        { status: 400 }
      );
    }

    if (!asalSekolah || !tahunLulus) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data asal sekolah wajib diisi',
        },
        { status: 400 }
      );
    }

    if (!pilihanJurusan1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pilihan jurusan 1 wajib diisi',
        },
        { status: 400 }
      );
    }

    if (!namaAyah || !namaIbu || !noHpOrtu) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data orang tua wajib diisi',
        },
        { status: 400 }
      );
    }

    // Check if NISN already exists
    const existingNisn = await prisma.pendaftaranPPDB.findUnique({
      where: { nisn },
    });

    if (existingNisn) {
      return NextResponse.json(
        {
          success: false,
          message: 'NISN sudah terdaftar',
        },
        { status: 400 }
      );
    }

    // Generate nomor pendaftaran (format: PPDB-YYYY-XXXXX)
    const year = new Date().getFullYear();
    const count = await prisma.pendaftaranPPDB.count();
    const noPendaftaran = `PPDB-${year}-${String(count + 1).padStart(5, '0')}`;

    // Create pendaftaran
    const pendaftaran = await prisma.pendaftaranPPDB.create({
      data: {
        noPendaftaran,
        nama,
        nisn,
        nik,
        jenisKelamin,
        tempatLahir,
        tanggalLahir: new Date(tanggalLahir),
        agama,
        alamat,
        rt,
        rw,
        kelurahan,
        kecamatan,
        kota,
        provinsi,
        kodePos,
        noHp,
        email,
        asalSekolah,
        nsnAsalSekolah,
        alamatSekolah,
        nomorIjazah,
        tahunLulus,
        pilihanJurusan1,
        pilihanJurusan2,
        namaAyah,
        namaIbu,
        pekerjaanAyah,
        pekerjaanIbu,
        penghasilanOrtu,
        noHpOrtu,
        emailOrtu,
        statusVerifikasi: 'PENDING',
        statusSeleksi: 'BELUM_SELEKSI',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil! Nomor pendaftaran: ' + noPendaftaran,
      data: pendaftaran,
    });
  } catch (error: any) {
    console.error('Create PPDB error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create pendaftaran',
      },
      { status: 500 }
    );
  }
}
