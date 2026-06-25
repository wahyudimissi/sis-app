-- CreateEnum
CREATE TYPE "StatusVerifikasi" AS ENUM ('PENDING', 'DIVERIFIKASI', 'DITOLAK', 'PERLU_PERBAIKAN');

-- CreateEnum
CREATE TYPE "StatusSeleksi" AS ENUM ('BELUM_SELEKSI', 'LULUS', 'TIDAK_LULUS', 'CADANGAN');

-- CreateTable
CREATE TABLE "pendaftaran_ppdb" (
    "id" TEXT NOT NULL,
    "noPendaftaran" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "nik" TEXT,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "agama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "rt" TEXT,
    "rw" TEXT,
    "kelurahan" TEXT,
    "kecamatan" TEXT,
    "kota" TEXT,
    "provinsi" TEXT,
    "kodePos" TEXT,
    "noHp" TEXT,
    "email" TEXT,
    "asalSekolah" TEXT NOT NULL,
    "nsnAsalSekolah" TEXT,
    "alamatSekolah" TEXT,
    "nomorIjazah" TEXT,
    "tahunLulus" TEXT NOT NULL,
    "pilihanJurusan1" TEXT NOT NULL,
    "pilihanJurusan2" TEXT,
    "namaAyah" TEXT NOT NULL,
    "namaIbu" TEXT NOT NULL,
    "pekerjaanAyah" TEXT,
    "pekerjaanIbu" TEXT,
    "penghasilanOrtu" TEXT,
    "noHpOrtu" TEXT NOT NULL,
    "emailOrtu" TEXT,
    "fotoPath" TEXT,
    "ijazahPath" TEXT,
    "skhunPath" TEXT,
    "kkPath" TEXT,
    "aktaPath" TEXT,
    "statusVerifikasi" "StatusVerifikasi" NOT NULL DEFAULT 'PENDING',
    "statusSeleksi" "StatusSeleksi" NOT NULL DEFAULT 'BELUM_SELEKSI',
    "catatanVerifikasi" TEXT,
    "nilaiSeleksi" DOUBLE PRECISION,
    "jurusanDiterima" TEXT,
    "tanggalDaftar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalVerifikasi" TIMESTAMP(3),
    "tanggalPengumuman" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pendaftaran_ppdb_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pendaftaran_ppdb_noPendaftaran_key" ON "pendaftaran_ppdb"("noPendaftaran");

-- CreateIndex
CREATE UNIQUE INDEX "pendaftaran_ppdb_nisn_key" ON "pendaftaran_ppdb"("nisn");
