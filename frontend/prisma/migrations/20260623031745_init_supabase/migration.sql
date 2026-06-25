-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_KELAS', 'SISWA', 'ORANG_TUA', 'STAFF_KEUANGAN', 'PETUGAS_PERPUSTAKAAN', 'STAFF_INVENTARIS', 'ADMIN_PPDB', 'ADMIN_BKK');

-- CreateEnum
CREATE TYPE "StatusTahunAjaran" AS ENUM ('AKTIF', 'TIDAK_AKTIF', 'SELESAI');

-- CreateEnum
CREATE TYPE "JenisSemester" AS ENUM ('GANJIL', 'GENAP');

-- CreateEnum
CREATE TYPE "KelompokMapel" AS ENUM ('UMUM', 'PRODUKTIF', 'MUATAN_LOKAL');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "StatusSiswa" AS ENUM ('AKTIF', 'LULUS', 'PINDAH', 'KELUAR', 'ALUMNI');

-- CreateEnum
CREATE TYPE "Hari" AS ENUM ('SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU');

-- CreateEnum
CREATE TYPE "StatusAbsensi" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALPHA', 'TERLAMBAT');

-- CreateEnum
CREATE TYPE "StatusRapor" AS ENUM ('BELUM', 'PROSES', 'SELESAI');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SISWA',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profil_sekolah" (
    "id" TEXT NOT NULL,
    "namaSekolah" TEXT NOT NULL,
    "npsn" TEXT NOT NULL,
    "nss" TEXT,
    "alamat" TEXT NOT NULL,
    "kelurahan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kota" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "kodePos" TEXT,
    "telepon" TEXT,
    "fax" TEXT,
    "email" TEXT,
    "website" TEXT,
    "kepalaSekolah" TEXT NOT NULL,
    "nipKepalaSekolah" TEXT NOT NULL,
    "akreditasi" TEXT,
    "tahunBerdiri" TEXT,
    "luasTanah" TEXT,
    "luasBangunan" TEXT,
    "visi" TEXT,
    "misi" TEXT,
    "logoPath" TEXT,
    "kopSuratPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profil_sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tahun_ajaran" (
    "id" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "status" "StatusTahunAjaran" NOT NULL DEFAULT 'TIDAK_AKTIF',
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tahun_ajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semester" (
    "id" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "semester" "JenisSemester" NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jurusan" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kuota" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jurusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mata_pelajaran" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kelompok" "KelompokMapel" NOT NULL,
    "jurusanId" TEXT,
    "jamPelajaran" INTEGER NOT NULL DEFAULT 0,
    "kkm" INTEGER NOT NULL DEFAULT 75,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mata_pelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kelas" (
    "id" TEXT NOT NULL,
    "namaKelas" TEXT NOT NULL,
    "tingkat" TEXT NOT NULL,
    "jurusanId" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "waliKelasId" TEXT,
    "ruangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guru" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "nuptk" TEXT,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "tempatLahir" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "agama" TEXT,
    "alamat" TEXT,
    "noHp" TEXT,
    "email" TEXT,
    "foto" TEXT,
    "mataPelajaran" TEXT,
    "jabatan" TEXT,
    "statusKepegawaian" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "tempatLahir" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "agama" TEXT,
    "alamat" TEXT,
    "noHp" TEXT,
    "email" TEXT,
    "foto" TEXT,
    "kelasId" TEXT,
    "jurusanId" TEXT,
    "tahunMasuk" TEXT,
    "status" "StatusSiswa" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orang_tua" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "namaAyah" TEXT,
    "namaIbu" TEXT,
    "namaWali" TEXT,
    "noHpAyah" TEXT,
    "noHpIbu" TEXT,
    "noHpWali" TEXT,
    "pekerjaanAyah" TEXT,
    "pekerjaanIbu" TEXT,
    "alamat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orang_tua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwal_pelajaran" (
    "id" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "mataPelajaranId" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "hari" "Hari" NOT NULL,
    "jamKe" INTEGER NOT NULL,
    "jamMulai" TEXT NOT NULL,
    "jamSelesai" TEXT NOT NULL,
    "ruangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jadwal_pelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absensi" (
    "id" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "mataPelajaran" TEXT,
    "status" "StatusAbsensi" NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absensi_guru" (
    "id" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" "StatusAbsensi" NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absensi_guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nilai" (
    "id" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "mataPelajaranId" TEXT NOT NULL,
    "semester" "JenisSemester" NOT NULL,
    "nilaiTugas" DOUBLE PRECISION,
    "nilaiUTS" DOUBLE PRECISION,
    "nilaiUAS" DOUBLE PRECISION,
    "nilaiAkhir" DOUBLE PRECISION,
    "predikat" TEXT,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nilai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rapor" (
    "id" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "semester" "JenisSemester" NOT NULL,
    "catatanWaliKelas" TEXT,
    "absensiSakit" INTEGER NOT NULL DEFAULT 0,
    "absensiIzin" INTEGER NOT NULL DEFAULT 0,
    "absensiAlpha" INTEGER NOT NULL DEFAULT 0,
    "ekstrakurikuler" TEXT,
    "prestasi" TEXT,
    "validasiWaliKelas" BOOLEAN NOT NULL DEFAULT false,
    "validasiKepsek" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusRapor" NOT NULL DEFAULT 'PROSES',
    "tanggalGenerate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rapor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "profil_sekolah_npsn_key" ON "profil_sekolah"("npsn");

-- CreateIndex
CREATE UNIQUE INDEX "tahun_ajaran_tahunAjaran_key" ON "tahun_ajaran"("tahunAjaran");

-- CreateIndex
CREATE UNIQUE INDEX "jurusan_kode_key" ON "jurusan"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "mata_pelajaran_kode_key" ON "mata_pelajaran"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "kelas_namaKelas_tahunAjaranId_key" ON "kelas"("namaKelas", "tahunAjaranId");

-- CreateIndex
CREATE UNIQUE INDEX "guru_userId_key" ON "guru"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "guru_nip_key" ON "guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_userId_key" ON "siswa"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_nis_key" ON "siswa"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_nisn_key" ON "siswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "orang_tua_userId_key" ON "orang_tua"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "jadwal_pelajaran_kelasId_hari_jamKe_tahunAjaranId_key" ON "jadwal_pelajaran"("kelasId", "hari", "jamKe", "tahunAjaranId");

-- CreateIndex
CREATE UNIQUE INDEX "absensi_siswaId_tanggal_mataPelajaran_key" ON "absensi"("siswaId", "tanggal", "mataPelajaran");

-- CreateIndex
CREATE UNIQUE INDEX "absensi_guru_guruId_tanggal_key" ON "absensi_guru"("guruId", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "nilai_siswaId_mataPelajaranId_tahunAjaranId_semester_key" ON "nilai"("siswaId", "mataPelajaranId", "tahunAjaranId", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "rapor_siswaId_tahunAjaranId_semester_key" ON "rapor"("siswaId", "tahunAjaranId", "semester");

-- AddForeignKey
ALTER TABLE "semester" ADD CONSTRAINT "semester_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "tahun_ajaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mata_pelajaran" ADD CONSTRAINT "mata_pelajaran_jurusanId_fkey" FOREIGN KEY ("jurusanId") REFERENCES "jurusan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_jurusanId_fkey" FOREIGN KEY ("jurusanId") REFERENCES "jurusan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "tahun_ajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_waliKelasId_fkey" FOREIGN KEY ("waliKelasId") REFERENCES "guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_jurusanId_fkey" FOREIGN KEY ("jurusanId") REFERENCES "jurusan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orang_tua" ADD CONSTRAINT "orang_tua_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orang_tua" ADD CONSTRAINT "orang_tua_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "tahun_ajaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "mata_pelajaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "guru"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "tahun_ajaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi_guru" ADD CONSTRAINT "absensi_guru_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "guru"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "tahun_ajaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "mata_pelajaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rapor" ADD CONSTRAINT "rapor_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "tahun_ajaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rapor" ADD CONSTRAINT "rapor_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
