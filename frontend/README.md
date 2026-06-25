# Sistem Informasi Sekolah - Frontend

Aplikasi frontend untuk Sistem Informasi Sekolah Terintegrasi menggunakan Next.js 14, React, TypeScript, dan Tailwind CSS.

## 📋 Persyaratan Sistem

- Node.js 18.x atau lebih baru
- npm atau yarn atau pnpm

## 🚀 Instalasi

1. Pastikan Node.js sudah terinstall di komputer Anda. Jika belum, download dari [nodejs.org](https://nodejs.org/)

2. Install dependencies:

```bash
npm install
```

atau jika menggunakan yarn:

```bash
yarn install
```

atau jika menggunakan pnpm:

```bash
pnpm install
```

## 🏃‍♂️ Menjalankan Aplikasi

### Mode Development

Jalankan perintah berikut untuk menjalankan server development:

```bash
npm run dev
```

atau:

```bash
yarn dev
```

atau:

```bash
pnpm dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### Mode Production

Build aplikasi:

```bash
npm run build
```

Jalankan aplikasi production:

```bash
npm start
```

## 📁 Struktur Folder

```
frontend/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Halaman Dashboard
│   ├── login/                   # Halaman Login
│   ├── master/                  # Master Data
│   │   └── siswa/              # Data Siswa
│   ├── globals.css             # Global CSS
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # Landing Page
├── components/                  # Komponen React
│   └── DashboardLayout.tsx     # Layout Dashboard
├── public/                      # Static files
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
└── next.config.mjs             # Next.js config
```

## 🎨 Fitur yang Sudah Dibuat

### Tahap 1 - Core System (Frontend) ✅ SELESAI

✅ **Halaman Landing Page**
- Hero section dengan informasi sistem
- Fitur unggulan
- Tombol navigasi ke Login dan PPDB

✅ **Halaman Login**
- Form login dengan validasi
- Toggle show/hide password
- Remember me checkbox
- Link lupa password
- Link kembali ke beranda

✅ **Dashboard Layout**
- Sidebar navigasi responsif
- Navbar dengan notifikasi dan profil
- Menu multi-level sesuai role
- Support mobile (hamburger menu)
- Filter menu berdasarkan role pengguna

✅ **Halaman Dashboard**
- Statistik cards (Total Siswa, Guru, Kelas, Mata Pelajaran)
- Tabel absensi hari ini
- Tabel pembayaran SPP terbaru
- Widget pengumuman terkini

✅ **Halaman Data Siswa** (`/master/siswa`)
- Tabel data siswa dengan pagination
- Filter berdasarkan kelas dan status
- Pencarian berdasarkan nama, NIS, NISN
- Tombol aksi (Lihat, Edit, Hapus)
- Export Excel dan PDF
- Import data siswa
- Tambah siswa baru
- Statistik cards (Total, Aktif, L/P)

✅ **Halaman Data Guru** (`/master/guru`) - BARU!
- Tabel data guru dengan pagination
- Filter berdasarkan mata pelajaran dan status
- Pencarian berdasarkan nama, NIP, email
- Statistik cards (Total, Aktif, L/P)
- CRUD operations
- Export dan Import data

✅ **Halaman Data Kelas** (`/master/kelas`) - BARU!
- Tabel data kelas dengan pagination
- Filter berdasarkan tingkat dan jurusan
- Pencarian berdasarkan nama kelas dan wali kelas
- Statistik cards (Total Kelas, Siswa, Rata-rata, Wali Kelas)
- Pengelolaan wali kelas
- Pengelolaan jumlah siswa per kelas

✅ **Halaman Mata Pelajaran** (`/master/mata-pelajaran`) - BARU!
- Tabel mata pelajaran dengan pagination
- Filter berdasarkan kelompok dan jurusan
- Pencarian berdasarkan nama dan kode mapel
- Statistik cards (Total, Umum, Produktif, Total Jam)
- Pengelolaan KKM per mapel
- Pengelolaan jam pelajaran

✅ **Halaman Tahun Ajaran** (`/master/tahun-ajaran`) - BARU!
- Manajemen tahun ajaran dengan tab interface
- Status tahun ajaran (Aktif/Selesai)
- Manajemen semester (Ganjil/Genap)
- Lock/Unlock data semester
- Periode tahun ajaran
- Visual card untuk tahun ajaran aktif

✅ **Halaman PPDB Online** (`/ppdb`)
- Landing page PPDB dengan tab navigation
- Tab Informasi (Persyaratan & Alur)
- Tab Jadwal (Timeline PPDB)
- Tab Jurusan (Program Keahlian)
- Tab Pendaftaran (Form lengkap)
- Form pendaftaran calon siswa
- Upload berkas pendaftaran
- Pilihan jurusan

## 🎯 Fitur Menu Berdasarkan Role

### Super Admin
- Akses penuh ke semua menu

### Admin Sekolah
- Dashboard
- Master Data (semua)
- Akademik (semua)
- Kesiswaan
- PPDB
- Manajemen User
- Pengaturan

### Kepala Sekolah
- Dashboard
- Laporan (semua)
- View-only untuk data penting

### Guru
- Dashboard
- Jadwal Pelajaran
- Absensi
- Penilaian
- LMS
- Laporan

### Wali Kelas
- Dashboard
- Data Siswa (kelasnya)
- Absensi (kelasnya)
- Penilaian (kelasnya)
- E-Rapor (kelasnya)
- LMS

### Siswa
- Dashboard
- Jadwal Pelajaran
- Absensi (pribadi)
- LMS
- Nilai (pribadi)
- E-Rapor (pribadi)
- Pengumuman

### Orang Tua/Wali
- Dashboard
- Absensi anak
- Nilai anak
- E-Rapor anak
- Keuangan/SPP
- Pengumuman

### Staff Keuangan
- Dashboard
- Keuangan/SPP
- Laporan Keuangan

### Petugas Perpustakaan
- Dashboard
- Perpustakaan

### Staff Inventaris
- Dashboard
- Inventaris

### Admin PPDB
- Dashboard
- PPDB Management

### Admin BKK
- Dashboard
- BKK

## 🎨 Tema dan Warna

Aplikasi menggunakan skema warna:
- Primary: Blue (#2563eb)
- Secondary: Slate (#64748b)
- Success: Green
- Warning: Yellow
- Danger: Red

## 📱 Responsive Design

Aplikasi fully responsive dan dapat diakses melalui:
- Desktop (1024px ke atas)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔐 Keamanan (Planning)

- Authentication dengan JWT
- Role-based access control
- Protected routes
- Session timeout
- Password hashing

✅ **Halaman Jadwal Pelajaran** (`/akademik/jadwal`) - BARU!
- Grid jadwal 6 hari × 8 jam pelajaran
- Filter kelas, semester, tampilan
- Info mata pelajaran, guru, ruang
- Export Excel & PDF buttons
- Visual card tahun ajaran aktif
- Legend keterangan

✅ **Halaman Absensi** (`/akademik/absensi`) - BARU!
- Input 5 status kehadiran (Hadir, Izin, Sakit, Alpha, Terlambat)
- Statistik real-time per status
- Filter tanggal, kelas, mata pelajaran
- Bulk action "Set Semua"
- Quick action buttons per siswa
- Auto counter dan alert

✅ **Halaman Penilaian** (`/akademik/penilaian`) - BARU!
- Input nilai Tugas, UTS, UAS
- Bobot penilaian otomatis (30%, 30%, 40%)
- Hitung nilai akhir otomatis
- Predikat A-E berdasarkan nilai
- Status Tuntas/Belum Tuntas
- Statistik: Rata-rata, Tertinggi, Terendah
- Validasi input 0-100

✅ **Halaman E-Rapor** (`/akademik/rapor`) - BARU!
- Daftar rapor per kelas & semester
- Status: Selesai, Proses, Belum
- Validasi Wali Kelas & Kepala Sekolah
- Preview rapor lengkap
- Download PDF button
- Identitas siswa, nilai, ekstrakurikuler
- Absensi dan catatan wali kelas
- TTD digital ready

## 🔜 Fitur yang Akan Dibuat Selanjutnya

### Tahap 2 - Akademik ✅ SELESAI 100%
- [x] Halaman Jadwal Pelajaran ✅
- [x] Halaman Absensi ✅
- [x] Halaman Penilaian ✅
- [x] Halaman E-Rapor ✅
- [ ] Halaman Kalender Akademik (Optional)

### Tahap 3 - Akademik
- [ ] Halaman Jadwal Pelajaran
- [ ] Halaman Absensi
- [ ] Halaman Penilaian
- [ ] Halaman E-Rapor
- [ ] Halaman Kalender Akademik

### Tahap 4 - LMS
- [ ] Halaman Materi Pembelajaran
- [ ] Halaman Tugas
- [ ] Halaman Kuis/Ujian
- [ ] Halaman Diskusi

### Tahap 5 - Modul Pendukung
- [ ] Halaman Keuangan/SPP
- [ ] Halaman Perpustakaan
- [ ] Halaman Inventaris
- [ ] Halaman PPDB Online
- [ ] Halaman Prakerin/PKL
- [ ] Halaman BKK
- [ ] Halaman Pengumuman
- [ ] Halaman Laporan

### Tahap 6 - Integrasi Backend
- [ ] Setup API endpoints
- [ ] Authentication & Authorization
- [ ] CRUD operations
- [ ] File upload
- [ ] Export PDF/Excel
- [ ] Notifikasi real-time

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Charts**: Chart.js + React-chartjs-2 (coming soon)

## 📝 Catatan Pengembangan

1. **Routing**: Menggunakan Next.js App Router (bukan Pages Router)
2. **State Management**: Menggunakan React hooks (useState, useEffect)
3. **Forms**: Form validation akan ditambahkan menggunakan react-hook-form + zod
4. **API**: Integration dengan backend API akan dilakukan di tahap selanjutnya

## 🤝 Kontribusi

Untuk berkontribusi pada proyek ini:
1. Fork repository
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 Lisensi

Copyright © 2024 Sistem Informasi Sekolah

## 📞 Kontak

Untuk pertanyaan dan dukungan, silakan hubungi tim pengembang.

---

**Happy Coding! 🚀**
