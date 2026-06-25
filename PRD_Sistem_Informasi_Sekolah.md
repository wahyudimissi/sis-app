# Product Requirements Document (PRD)
# Sistem Informasi Sekolah Terintegrasi

**Nama Proyek:** Sistem Informasi Sekolah Lengkap  
**Versi Dokumen:** 1.0  
**Status:** Draft  
**Jenis Aplikasi:** Web Application / Responsive Web  
**Target Pengguna:** Sekolah, Guru, Siswa, Orang Tua/Wali, Admin, Kepala Sekolah, Staff TU, Keuangan, Perpustakaan, BKK, PPDB, dan Pengelola Inventaris  

---

## 1. Ringkasan Proyek

Sistem Informasi Sekolah Terintegrasi adalah aplikasi berbasis web yang dirancang untuk membantu sekolah dalam mengelola seluruh proses administrasi, akademik, pembelajaran, keuangan, perpustakaan, inventaris, PPDB, Prakerin/PKL, BKK, pengumuman, hingga laporan dalam satu sistem terpadu.

Sistem ini bertujuan untuk menggantikan proses manual atau penggunaan banyak aplikasi terpisah menjadi satu platform yang lebih efisien, terpusat, aman, dan mudah diakses oleh pengguna sesuai hak akses masing-masing.

---

## 2. Latar Belakang

Dalam kegiatan operasional sekolah, banyak proses masih dilakukan secara manual atau menggunakan file terpisah seperti Excel, dokumen cetak, buku absensi, arsip rapor, pembayaran manual, dan pengumuman melalui media yang tidak terpusat. Kondisi tersebut dapat menyebabkan beberapa permasalahan seperti data ganda, kehilangan arsip, keterlambatan laporan, kesalahan pencatatan, serta sulitnya memantau perkembangan akademik siswa secara real-time.

Dengan adanya Sistem Informasi Sekolah Terintegrasi, sekolah dapat mengelola data dan aktivitas pendidikan secara lebih rapi, cepat, dan akurat. Sistem ini juga mendukung kebutuhan digitalisasi sekolah agar seluruh layanan akademik dan administrasi dapat dilakukan secara online.

---

## 3. Tujuan Proyek

Tujuan utama dari sistem ini adalah:

1. Menyediakan sistem terpusat untuk mengelola data sekolah.
2. Mempermudah pengelolaan data guru, siswa, kelas, jadwal, absensi, nilai, dan rapor.
3. Mendukung proses pembelajaran digital melalui LMS.
4. Mempermudah pengelolaan keuangan sekolah seperti SPP dan pembayaran lainnya.
5. Mempermudah proses PPDB Online dari pendaftaran hingga seleksi.
6. Membantu pengelolaan Prakerin/PKL dan BKK.
7. Menyediakan fitur laporan dan cetak PDF untuk kebutuhan administrasi sekolah.
8. Meningkatkan transparansi informasi kepada siswa, guru, orang tua/wali, dan manajemen sekolah.

---

## 4. Ruang Lingkup Sistem

Sistem mencakup modul utama berikut:

1. Dashboard
2. Manajemen Pengguna
3. Data Guru
4. Data Siswa
5. Data Kelas
6. Jadwal Pelajaran
7. Absensi
8. LMS
9. Penilaian
10. E-Rapor
11. Prakerin/PKL
12. BKK
13. PPDB Online
14. Perpustakaan
15. Inventaris
16. Keuangan/SPP
17. Pengumuman
18. Laporan dan Cetak PDF

Tambahan modul pendukung yang direkomendasikan:

19. Profil Sekolah
20. Tahun Ajaran dan Semester
21. Kurikulum dan Mata Pelajaran
22. Data Orang Tua/Wali
23. Kalender Akademik
24. BK/Konseling
25. Alumni
26. Notifikasi
27. Audit Log
28. Backup dan Restore Data
29. Pengaturan Sistem

---

## 5. Pengguna dan Hak Akses

### 5.1 Super Admin

Super Admin memiliki akses penuh terhadap seluruh sistem.

Hak akses:

- Mengelola semua akun pengguna.
- Mengatur role dan permission.
- Mengelola pengaturan sistem.
- Melihat seluruh data dan laporan.
- Melakukan backup dan restore data.
- Melihat audit log aktivitas pengguna.

### 5.2 Admin Sekolah / Tata Usaha

Admin Sekolah bertugas mengelola data administrasi sekolah.

Hak akses:

- Mengelola data guru.
- Mengelola data siswa.
- Mengelola data kelas.
- Mengelola jadwal pelajaran.
- Mengelola pengumuman.
- Mengelola laporan administrasi.
- Mengelola data PPDB.

### 5.3 Kepala Sekolah

Kepala Sekolah berperan sebagai pemantau dan pengambil keputusan.

Hak akses:

- Melihat dashboard ringkasan sekolah.
- Melihat laporan akademik.
- Melihat laporan keuangan.
- Melihat laporan absensi.
- Melihat laporan PPDB.
- Melihat laporan inventaris.
- Mencetak laporan yang dibutuhkan.

### 5.4 Guru

Guru bertugas mengelola aktivitas pembelajaran dan penilaian.

Hak akses:

- Melihat jadwal mengajar.
- Mengisi absensi siswa.
- Mengelola materi LMS.
- Membuat tugas dan ujian.
- Menginput nilai siswa.
- Melihat daftar siswa di kelas yang diajar.
- Mengelola nilai sesuai mata pelajaran yang diampu.

### 5.5 Wali Kelas

Wali Kelas memiliki akses tambahan terhadap kelas yang dibina.

Hak akses:

- Melihat data siswa dalam kelas.
- Memantau absensi siswa.
- Memantau nilai siswa.
- Mengelola catatan wali kelas.
- Membantu proses e-rapor.
- Mencetak rapor kelas.

### 5.6 Siswa

Siswa dapat mengakses informasi akademik dan pembelajaran.

Hak akses:

- Melihat jadwal pelajaran.
- Melihat absensi pribadi.
- Mengakses materi LMS.
- Mengumpulkan tugas.
- Melihat nilai.
- Melihat pengumuman.
- Mengakses informasi PKL.
- Mengakses informasi BKK.

### 5.7 Orang Tua/Wali

Orang tua/wali dapat memantau perkembangan siswa.

Hak akses:

- Melihat absensi anak.
- Melihat nilai anak.
- Melihat tagihan dan status pembayaran.
- Melihat pengumuman sekolah.
- Melihat rapor anak.

### 5.8 Staff Keuangan

Staff keuangan bertugas mengelola pembayaran sekolah.

Hak akses:

- Mengelola tagihan SPP.
- Mencatat pembayaran.
- Mencetak bukti pembayaran.
- Melihat tunggakan siswa.
- Membuat laporan keuangan.

### 5.9 Petugas Perpustakaan

Petugas perpustakaan mengelola data buku dan transaksi peminjaman.

Hak akses:

- Mengelola data buku.
- Mengelola anggota perpustakaan.
- Mengelola peminjaman dan pengembalian.
- Mengelola denda.
- Mencetak laporan perpustakaan.

### 5.10 Staff Inventaris

Staff inventaris mengelola aset sekolah.

Hak akses:

- Mengelola data barang.
- Mencatat barang masuk dan keluar.
- Mengelola kondisi barang.
- Mengelola lokasi barang.
- Mencetak laporan inventaris.

### 5.11 Admin PPDB

Admin PPDB mengelola proses penerimaan peserta didik baru.

Hak akses:

- Mengelola formulir PPDB.
- Memverifikasi berkas calon siswa.
- Mengelola seleksi penerimaan.
- Mengumumkan hasil PPDB.
- Mencetak laporan PPDB.

### 5.12 Admin BKK

Admin BKK mengelola informasi lowongan kerja dan alumni.

Hak akses:

- Mengelola data perusahaan.
- Mengelola lowongan kerja.
- Mengelola data alumni.
- Mengelola lamaran kerja.
- Mencetak laporan penyaluran kerja.

---

## 6. Modul dan Kebutuhan Fungsional

## 6.1 Dashboard

Dashboard berfungsi sebagai halaman utama yang menampilkan ringkasan informasi sesuai role pengguna.

Fitur:

- Ringkasan jumlah siswa, guru, kelas, mata pelajaran, dan pengguna.
- Grafik kehadiran siswa dan guru.
- Grafik pembayaran SPP.
- Ringkasan nilai akademik.
- Informasi pengumuman terbaru.
- Jadwal hari ini.
- Statistik PPDB.
- Statistik perpustakaan.
- Statistik inventaris.
- Statistik Prakerin/PKL dan BKK.

Acceptance Criteria:

- Pengguna hanya melihat data sesuai hak aksesnya.
- Data dashboard diperbarui secara real-time atau berdasarkan data terbaru.
- Dashboard dapat difilter berdasarkan tahun ajaran, semester, kelas, dan jurusan.

---

## 6.2 Manajemen Pengguna

Modul ini digunakan untuk mengatur akun pengguna, role, dan hak akses.

Fitur:

- Tambah, lihat, ubah, dan hapus pengguna.
- Aktivasi dan nonaktifkan akun.
- Reset password.
- Pengaturan role pengguna.
- Permission berdasarkan modul.
- Riwayat login pengguna.
- Import pengguna dari Excel.
- Export data pengguna.

Data utama:

- Nama pengguna
- Email/username
- Password
- Role
- Status akun
- Terakhir login

Acceptance Criteria:

- Setiap pengguna memiliki role yang jelas.
- Password tersimpan dalam bentuk terenkripsi.
- Super Admin dapat mengubah role pengguna.
- Pengguna nonaktif tidak dapat login.

---

## 6.3 Data Guru

Modul ini digunakan untuk mengelola data guru dan tenaga pendidik.

Fitur:

- Tambah, lihat, ubah, dan hapus data guru.
- Import data guru dari Excel.
- Export data guru ke Excel/PDF.
- Upload foto guru.
- Pengelompokan guru berdasarkan mata pelajaran.
- Riwayat mengajar.
- Status aktif/nonaktif guru.

Data utama:

- NIP/NUPTK
- Nama lengkap
- Jenis kelamin
- Tempat dan tanggal lahir
- Alamat
- Nomor HP
- Email
- Mata pelajaran yang diampu
- Jabatan
- Status kepegawaian
- Foto

Acceptance Criteria:

- Admin dapat mengelola data guru.
- Guru dapat melihat profilnya sendiri.
- Data guru dapat digunakan untuk penyusunan jadwal pelajaran.

---

## 6.4 Data Siswa

Modul ini digunakan untuk mengelola data siswa aktif, mutasi, dan alumni.

Fitur:

- Tambah, lihat, ubah, dan hapus data siswa.
- Import data siswa dari Excel.
- Export data siswa ke Excel/PDF.
- Upload foto siswa.
- Pengelompokan siswa berdasarkan kelas dan jurusan.
- Riwayat kelas siswa.
- Status siswa aktif, lulus, pindah, keluar, atau alumni.
- Data orang tua/wali.

Data utama:

- NIS
- NISN
- Nama lengkap
- Jenis kelamin
- Tempat dan tanggal lahir
- Agama
- Alamat
- Nomor HP siswa
- Email siswa
- Nama orang tua/wali
- Nomor HP orang tua/wali
- Kelas
- Jurusan
- Tahun masuk
- Status siswa
- Foto

Acceptance Criteria:

- Admin dapat mengelola seluruh data siswa.
- Siswa hanya dapat melihat data pribadinya.
- Data siswa dapat terhubung dengan absensi, nilai, e-rapor, keuangan, perpustakaan, dan PKL.

---

## 6.5 Data Kelas

Modul ini digunakan untuk mengelola kelas, jurusan, rombongan belajar, dan wali kelas.

Fitur:

- Tambah, lihat, ubah, dan hapus kelas.
- Pengaturan tingkat kelas.
- Pengaturan jurusan/kompetensi keahlian.
- Pengaturan wali kelas.
- Pengaturan siswa dalam kelas.
- Riwayat kenaikan kelas.

Data utama:

- Nama kelas
- Tingkat
- Jurusan
- Wali kelas
- Tahun ajaran
- Jumlah siswa

Acceptance Criteria:

- Setiap kelas memiliki wali kelas.
- Siswa hanya dapat berada pada satu kelas aktif dalam satu tahun ajaran.
- Data kelas digunakan dalam jadwal, absensi, penilaian, dan rapor.

---

## 6.6 Jadwal Pelajaran

Modul ini digunakan untuk menyusun dan mengelola jadwal pelajaran.

Fitur:

- Tambah, lihat, ubah, dan hapus jadwal.
- Pengaturan hari dan jam pelajaran.
- Pengaturan guru pengampu.
- Pengaturan mata pelajaran.
- Pengaturan ruang kelas.
- Validasi bentrok jadwal guru.
- Validasi bentrok jadwal kelas.
- Cetak jadwal kelas.
- Cetak jadwal guru.

Data utama:

- Tahun ajaran
- Semester
- Kelas
- Mata pelajaran
- Guru
- Hari
- Jam mulai
- Jam selesai
- Ruang

Acceptance Criteria:

- Sistem menolak jadwal yang bentrok.
- Guru dapat melihat jadwal mengajarnya.
- Siswa dapat melihat jadwal kelasnya.

---

## 6.7 Absensi

Modul absensi digunakan untuk mencatat kehadiran siswa dan guru.

Fitur Absensi Siswa:

- Input absensi harian.
- Input absensi per mata pelajaran.
- Status hadir, izin, sakit, alfa, terlambat.
- Rekap absensi per siswa.
- Rekap absensi per kelas.
- Cetak laporan absensi.
- Notifikasi kepada orang tua jika siswa tidak hadir.

Fitur Absensi Guru:

- Input kehadiran guru.
- Rekap kehadiran guru.
- Laporan kehadiran guru.

Acceptance Criteria:

- Guru hanya dapat mengisi absensi kelas yang diajar.
- Wali kelas dapat melihat rekap absensi kelasnya.
- Orang tua dapat melihat absensi anaknya.
- Laporan absensi dapat dicetak PDF.

---

## 6.8 LMS

Learning Management System digunakan untuk mendukung pembelajaran digital.

Fitur:

- Guru membuat kelas pembelajaran online.
- Upload materi pembelajaran.
- Upload file PDF, video, audio, gambar, dan link.
- Pembuatan tugas.
- Pengumpulan tugas oleh siswa.
- Penilaian tugas.
- Diskusi kelas.
- Kuis/ujian online sederhana.
- Batas waktu pengumpulan tugas.
- Riwayat aktivitas pembelajaran.

Data utama:

- Mata pelajaran
- Guru
- Kelas
- Materi
- Tugas
- File lampiran
- Deadline
- Jawaban siswa
- Nilai tugas

Acceptance Criteria:

- Siswa hanya dapat melihat LMS sesuai kelasnya.
- Guru hanya dapat mengelola LMS untuk mata pelajaran yang diajar.
- Sistem menyimpan status tugas: belum dikerjakan, dikumpulkan, terlambat, dinilai.

---

## 6.9 Penilaian

Modul penilaian digunakan untuk mengelola nilai siswa.

Fitur:

- Input nilai tugas.
- Input nilai harian.
- Input nilai UTS/PTS.
- Input nilai UAS/PAS.
- Input nilai praktik.
- Input nilai sikap.
- Input nilai keterampilan.
- Pengaturan bobot nilai.
- Rekap nilai per siswa.
- Rekap nilai per kelas.
- Export nilai ke Excel.
- Validasi nilai maksimal dan minimal.

Data utama:

- Siswa
- Kelas
- Mata pelajaran
- Guru
- Jenis nilai
- Nilai angka
- Predikat
- Deskripsi nilai
- Semester
- Tahun ajaran

Acceptance Criteria:

- Guru hanya dapat menginput nilai mata pelajaran yang diampu.
- Nilai dapat dihitung otomatis berdasarkan bobot.
- Wali kelas dapat melihat seluruh nilai siswa dalam kelasnya.

---

## 6.10 E-Rapor

Modul E-Rapor digunakan untuk menyusun, menampilkan, dan mencetak rapor siswa secara digital.

Fitur:

- Generate rapor dari data nilai.
- Input catatan wali kelas.
- Input ekstrakurikuler.
- Input prestasi siswa.
- Input ketidakhadiran.
- Input sikap dan deskripsi kompetensi.
- Validasi rapor oleh wali kelas.
- Validasi rapor oleh kepala sekolah.
- Cetak rapor PDF.
- Arsip rapor per semester.

Data utama:

- Identitas siswa
- Kelas
- Semester
- Tahun ajaran
- Nilai mata pelajaran
- Deskripsi capaian
- Absensi
- Ekstrakurikuler
- Catatan wali kelas
- Tanda tangan digital/identitas pejabat sekolah

Acceptance Criteria:

- Rapor hanya dapat dibuat jika nilai sudah lengkap.
- Wali kelas dapat mencetak rapor kelasnya.
- Siswa dan orang tua dapat melihat rapor setelah dipublikasikan.

---

## 6.11 Prakerin/PKL

Modul Prakerin/PKL digunakan untuk mengelola praktik kerja lapangan siswa.

Fitur:

- Data tempat PKL/perusahaan.
- Data pembimbing sekolah.
- Data pembimbing industri.
- Penempatan siswa PKL.
- Jadwal PKL.
- Monitoring kegiatan PKL.
- Jurnal harian siswa.
- Upload laporan PKL.
- Penilaian PKL oleh pembimbing.
- Cetak surat pengantar PKL.
- Cetak laporan PKL.

Data utama:

- Nama perusahaan
- Alamat perusahaan
- Kontak perusahaan
- Siswa peserta PKL
- Guru pembimbing
- Pembimbing industri
- Tanggal mulai
- Tanggal selesai
- Status PKL
- Nilai PKL

Acceptance Criteria:

- Siswa dapat mengisi jurnal PKL.
- Guru pembimbing dapat memonitor siswa bimbingannya.
- Admin dapat mencetak surat dan laporan PKL.

---

## 6.12 BKK

Bursa Kerja Khusus digunakan untuk mengelola informasi lowongan kerja, perusahaan mitra, dan alumni.

Fitur:

- Data perusahaan mitra.
- Data lowongan kerja.
- Data alumni.
- Pendaftaran lowongan oleh alumni/siswa.
- Status lamaran kerja.
- Riwayat penyaluran kerja.
- Pengumuman seleksi kerja.
- Laporan alumni bekerja, kuliah, atau belum bekerja.

Data utama:

- Nama perusahaan
- Posisi lowongan
- Kualifikasi
- Tanggal buka lowongan
- Tanggal tutup lowongan
- Pelamar
- Status seleksi
- Status alumni

Acceptance Criteria:

- Admin BKK dapat mengelola lowongan.
- Alumni dapat melihat dan melamar lowongan.
- Sekolah dapat melihat laporan keterserapan alumni.

---

## 6.13 PPDB Online

Modul PPDB Online digunakan untuk mengelola proses penerimaan peserta didik baru.

Fitur:

- Landing page PPDB.
- Form pendaftaran calon siswa.
- Upload berkas pendaftaran.
- Nomor pendaftaran otomatis.
- Verifikasi data dan berkas.
- Seleksi penerimaan.
- Pengumuman hasil seleksi.
- Daftar ulang online.
- Cetak bukti pendaftaran.
- Cetak laporan PPDB.

Data utama:

- Nomor pendaftaran
- Nama calon siswa
- NISN
- Asal sekolah
- Jurusan pilihan
- Data orang tua/wali
- Nilai/berkas pendukung
- Status verifikasi
- Status penerimaan

Acceptance Criteria:

- Calon siswa dapat mendaftar secara online.
- Admin dapat memverifikasi data calon siswa.
- Calon siswa dapat mencetak bukti pendaftaran.
- Hasil seleksi dapat diumumkan melalui sistem.

---

## 6.14 Perpustakaan

Modul perpustakaan digunakan untuk mengelola buku dan transaksi peminjaman.

Fitur:

- Data buku.
- Data kategori buku.
- Data anggota perpustakaan.
- Peminjaman buku.
- Pengembalian buku.
- Denda keterlambatan.
- Stok buku.
- Barcode/QR Code buku.
- Riwayat peminjaman.
- Laporan buku dan transaksi.

Data utama:

- Kode buku
- Judul buku
- Penulis
- Penerbit
- Tahun terbit
- Kategori
- Jumlah stok
- Lokasi rak
- Status buku

Acceptance Criteria:

- Petugas dapat mencatat peminjaman dan pengembalian buku.
- Sistem dapat menghitung denda keterlambatan.
- Siswa dapat melihat riwayat peminjaman.

---

## 6.15 Inventaris

Modul inventaris digunakan untuk mengelola barang dan aset sekolah.

Fitur:

- Data barang inventaris.
- Kategori barang.
- Lokasi barang.
- Kondisi barang.
- Barang masuk.
- Barang keluar.
- Mutasi barang.
- Penghapusan barang.
- QR Code aset.
- Laporan inventaris.

Data utama:

- Kode barang
- Nama barang
- Kategori
- Jumlah
- Lokasi
- Kondisi
- Tanggal pembelian
- Sumber dana
- Harga barang
- Status barang

Acceptance Criteria:

- Staff inventaris dapat mengelola data barang.
- Setiap barang memiliki kode unik.
- Laporan inventaris dapat dicetak PDF/Excel.

---

## 6.16 Keuangan/SPP

Modul keuangan digunakan untuk mengelola pembayaran SPP dan tagihan sekolah lainnya.

Fitur:

- Pengaturan jenis pembayaran.
- Pembuatan tagihan siswa.
- Pembayaran SPP bulanan.
- Pembayaran daftar ulang.
- Pembayaran kegiatan/lainnya.
- Status lunas, belum lunas, dan cicilan.
- Cetak bukti pembayaran.
- Laporan tunggakan.
- Laporan pemasukan.
- Rekap pembayaran per kelas.
- Notifikasi tagihan kepada orang tua/wali.

Data utama:

- Siswa
- Jenis tagihan
- Nominal tagihan
- Tanggal jatuh tempo
- Tanggal pembayaran
- Metode pembayaran
- Status pembayaran
- Petugas penerima

Acceptance Criteria:

- Staff keuangan dapat mencatat pembayaran.
- Sistem dapat menampilkan siswa yang memiliki tunggakan.
- Orang tua dapat melihat status pembayaran anak.
- Bukti pembayaran dapat dicetak PDF.

---

## 6.17 Pengumuman

Modul pengumuman digunakan untuk menyampaikan informasi kepada pengguna.

Fitur:

- Tambah, lihat, ubah, dan hapus pengumuman.
- Target pengumuman berdasarkan role, kelas, jurusan, atau semua pengguna.
- Lampiran file.
- Jadwal publikasi pengumuman.
- Notifikasi pengumuman.
- Arsip pengumuman.

Data utama:

- Judul pengumuman
- Isi pengumuman
- Target penerima
- Tanggal publikasi
- Lampiran
- Status publikasi

Acceptance Criteria:

- Pengguna hanya menerima pengumuman sesuai target.
- Admin dapat menjadwalkan pengumuman.
- Pengumuman lama tetap tersimpan sebagai arsip.

---

## 6.18 Laporan dan Cetak PDF

Modul laporan digunakan untuk menghasilkan laporan dari seluruh modul sistem.

Fitur:

- Laporan data guru.
- Laporan data siswa.
- Laporan kelas.
- Laporan jadwal pelajaran.
- Laporan absensi.
- Laporan nilai.
- Laporan rapor.
- Laporan PPDB.
- Laporan PKL.
- Laporan BKK.
- Laporan perpustakaan.
- Laporan inventaris.
- Laporan keuangan/SPP.
- Export PDF.
- Export Excel.
- Filter laporan berdasarkan tanggal, kelas, jurusan, semester, dan tahun ajaran.

Acceptance Criteria:

- Laporan dapat difilter sesuai kebutuhan.
- Laporan dapat dicetak dalam format PDF.
- Laporan tertentu dapat diekspor ke Excel.
- Kepala Sekolah dapat melihat laporan ringkasan seluruh modul.

---

## 7. Modul Tambahan yang Direkomendasikan

## 7.1 Profil Sekolah

Fitur:

- Nama sekolah
- NPSN
- Alamat
- Logo sekolah
- Kepala sekolah
- Visi dan misi
- Kontak sekolah
- Kop surat untuk cetak PDF

## 7.2 Tahun Ajaran dan Semester

Fitur:

- Pengaturan tahun ajaran aktif.
- Pengaturan semester ganjil/genap.
- Arsip data per tahun ajaran.
- Kunci data semester setelah selesai.

## 7.3 Kurikulum dan Mata Pelajaran

Fitur:

- Data mata pelajaran.
- Kelompok mata pelajaran.
- Jurusan/kompetensi keahlian.
- Capaian pembelajaran.
- Tujuan pembelajaran.
- Alokasi jam pelajaran.

## 7.4 Data Orang Tua/Wali

Fitur:

- Data ayah, ibu, dan wali.
- Nomor HP orang tua.
- Pekerjaan orang tua.
- Alamat orang tua.
- Akun orang tua untuk monitoring siswa.

## 7.5 Kalender Akademik

Fitur:

- Jadwal kegiatan sekolah.
- Jadwal ujian.
- Jadwal libur.
- Jadwal pembagian rapor.
- Jadwal PPDB.
- Jadwal PKL.

## 7.6 BK/Konseling

Fitur:

- Catatan konseling siswa.
- Riwayat pelanggaran.
- Riwayat prestasi.
- Tindak lanjut wali kelas/BK.
- Laporan perkembangan siswa.

## 7.7 Alumni

Fitur:

- Data alumni.
- Status bekerja/kuliah/wirausaha.
- Riwayat pekerjaan.
- Integrasi dengan BKK.

## 7.8 Notifikasi

Fitur:

- Notifikasi sistem.
- Notifikasi pembayaran.
- Notifikasi absensi.
- Notifikasi tugas LMS.
- Notifikasi pengumuman.
- Opsi integrasi WhatsApp Gateway/email.

## 7.9 Audit Log

Fitur:

- Mencatat aktivitas pengguna.
- Mencatat login/logout.
- Mencatat perubahan data penting.
- Menampilkan waktu, pengguna, modul, dan aktivitas.

## 7.10 Backup dan Restore Data

Fitur:

- Backup database manual.
- Backup otomatis terjadwal.
- Restore database.
- Export arsip penting.

## 7.11 Pengaturan Sistem

Fitur:

- Pengaturan identitas sekolah.
- Pengaturan logo dan kop surat.
- Pengaturan format tanggal.
- Pengaturan role dan permission.
- Pengaturan ukuran file upload.
- Pengaturan template PDF.

---

## 8. Kebutuhan Non-Fungsional

## 8.1 Keamanan

- Password wajib di-hash.
- Role-based access control.
- Validasi input pada seluruh form.
- Proteksi terhadap SQL Injection, XSS, CSRF, dan brute force login.
- Session timeout otomatis.
- Audit log untuk aktivitas penting.
- Backup data secara berkala.

## 8.2 Performa

- Halaman utama dapat dimuat dengan cepat.
- Pencarian data menggunakan pagination dan filter.
- Sistem mampu menangani banyak pengguna secara bersamaan.
- Export PDF/Excel tidak mengganggu proses utama sistem.

## 8.3 Kemudahan Penggunaan

- Tampilan responsif untuk laptop, tablet, dan smartphone.
- Menu disesuaikan dengan role pengguna.
- Form dibuat sederhana dan mudah dipahami.
- Tersedia fitur pencarian, filter, dan sorting.

## 8.4 Ketersediaan Sistem

- Sistem dapat diakses secara online 24 jam.
- Server memiliki backup rutin.
- Error sistem harus ditampilkan dengan pesan yang mudah dipahami.

## 8.5 Skalabilitas

- Sistem dapat dikembangkan untuk multi sekolah.
- Modul dapat diaktifkan atau dinonaktifkan sesuai kebutuhan sekolah.
- Struktur database mendukung pertumbuhan data setiap tahun ajaran.

---

## 9. Rekomendasi Teknologi

Rekomendasi teknologi untuk pengembangan sistem:

### Frontend

- Next.js / React.js
- Tailwind CSS atau Ant Design
- Responsive Web Design

### Backend

- Laravel / Express.js / NestJS / Next.js API Route
- REST API atau GraphQL

### Database

- PostgreSQL atau MySQL

### Storage

- Local server storage untuk tahap awal
- Object storage seperti S3-compatible storage untuk file besar
- Folder upload terstruktur berdasarkan modul dan tahun ajaran

### Deployment

- VPS Ubuntu Server
- Nginx sebagai reverse proxy
- SSL HTTPS
- Docker atau Coolify untuk deployment yang lebih mudah

### Export Dokumen

- PDF Generator
- Excel Export
- Template kop surat sekolah

---

## 10. Struktur Menu Sistem

Contoh struktur menu utama:

1. Dashboard
2. Master Data
   - Profil Sekolah
   - Tahun Ajaran
   - Semester
   - Jurusan
   - Mata Pelajaran
   - Data Guru
   - Data Siswa
   - Data Kelas
   - Data Orang Tua/Wali
3. Akademik
   - Jadwal Pelajaran
   - Absensi
   - Penilaian
   - E-Rapor
   - Kalender Akademik
4. LMS
   - Materi
   - Tugas
   - Kuis/Ujian
   - Diskusi
5. Kesiswaan
   - BK/Konseling
   - Prestasi
   - Pelanggaran
   - Prakerin/PKL
6. PPDB Online
   - Pendaftaran
   - Verifikasi
   - Seleksi
   - Daftar Ulang
7. BKK
   - Perusahaan
   - Lowongan
   - Alumni
   - Lamaran
8. Perpustakaan
   - Data Buku
   - Anggota
   - Peminjaman
   - Pengembalian
9. Inventaris
   - Data Barang
   - Barang Masuk
   - Mutasi Barang
   - Kondisi Barang
10. Keuangan
    - Jenis Pembayaran
    - Tagihan
    - Pembayaran SPP
    - Tunggakan
11. Pengumuman
12. Laporan
13. Manajemen Pengguna
14. Pengaturan Sistem
15. Audit Log

---

## 11. Alur Utama Sistem

## 11.1 Alur Login

1. Pengguna membuka halaman login.
2. Pengguna memasukkan username/email dan password.
3. Sistem memvalidasi akun.
4. Jika valid, pengguna diarahkan ke dashboard sesuai role.
5. Jika tidak valid, sistem menampilkan pesan error.

## 11.2 Alur Pengelolaan Data Siswa

1. Admin membuka menu Data Siswa.
2. Admin menambahkan data siswa atau import Excel.
3. Sistem menyimpan data siswa.
4. Admin mengelompokkan siswa ke kelas.
5. Data siswa dapat digunakan pada modul absensi, nilai, rapor, keuangan, dan perpustakaan.

## 11.3 Alur Absensi

1. Guru membuka jadwal mengajar.
2. Guru memilih kelas dan mata pelajaran.
3. Guru mengisi status kehadiran siswa.
4. Sistem menyimpan data absensi.
5. Wali kelas dan orang tua dapat melihat rekap kehadiran.

## 11.4 Alur Penilaian dan E-Rapor

1. Guru menginput nilai siswa.
2. Sistem menghitung nilai akhir berdasarkan bobot.
3. Wali kelas memeriksa kelengkapan nilai.
4. Wali kelas menambahkan catatan rapor.
5. Kepala sekolah melakukan validasi.
6. Rapor dipublikasikan.
7. Siswa/orang tua dapat melihat dan mengunduh rapor.

## 11.5 Alur Pembayaran SPP

1. Staff keuangan membuat tagihan siswa.
2. Siswa/orang tua melakukan pembayaran.
3. Staff keuangan mencatat pembayaran.
4. Sistem mengubah status tagihan menjadi lunas/cicilan.
5. Bukti pembayaran dapat dicetak.
6. Laporan pembayaran dan tunggakan dapat dilihat.

## 11.6 Alur PPDB Online

1. Calon siswa membuka halaman PPDB.
2. Calon siswa mengisi formulir pendaftaran.
3. Calon siswa mengunggah berkas.
4. Sistem membuat nomor pendaftaran otomatis.
5. Admin memverifikasi data.
6. Admin menentukan status seleksi.
7. Calon siswa melihat hasil penerimaan.
8. Calon siswa melakukan daftar ulang.

---

## 12. Entitas Database Utama

Berikut rancangan awal entitas database:

1. users
2. roles
3. permissions
4. role_permissions
5. school_profiles
6. academic_years
7. semesters
8. teachers
9. students
10. parents
11. majors
12. classes
13. class_students
14. subjects
15. schedules
16. attendances
17. lms_courses
18. lms_materials
19. lms_assignments
20. lms_submissions
21. grades
22. report_cards
23. report_card_details
24. internships
25. internship_companies
26. internship_logs
27. bkk_companies
28. job_vacancies
29. alumni
30. job_applications
31. ppdb_registrations
32. ppdb_documents
33. library_books
34. library_borrowings
35. inventory_items
36. inventory_transactions
37. payment_types
38. student_bills
39. payments
40. announcements
41. notifications
42. reports
43. audit_logs
44. system_settings
45. file_uploads

---

## 13. Kebutuhan Upload File

Sistem membutuhkan fitur upload file untuk beberapa modul.

Jenis file yang didukung:

- PDF
- DOC/DOCX
- XLS/XLSX
- JPG/JPEG
- PNG
- MP4 untuk LMS, jika dibutuhkan

Batas ukuran file awal:

- Gambar: maksimal 2 MB
- Dokumen: maksimal 10 MB
- Video: maksimal 100 MB atau menggunakan link eksternal

Struktur penyimpanan file direkomendasikan:

```text
/uploads
  /students
  /teachers
  /ppdb
  /lms
  /reports
  /library
  /inventory
  /payments
  /internship
```

---

## 14. Kebutuhan Laporan

Laporan yang perlu tersedia:

1. Laporan data guru.
2. Laporan data siswa.
3. Laporan siswa per kelas.
4. Laporan jadwal pelajaran.
5. Laporan absensi harian.
6. Laporan absensi per semester.
7. Laporan nilai siswa.
8. Laporan e-rapor.
9. Laporan pembayaran SPP.
10. Laporan tunggakan siswa.
11. Laporan PPDB.
12. Laporan PKL.
13. Laporan BKK/alumni.
14. Laporan perpustakaan.
15. Laporan inventaris.
16. Laporan pengumuman.
17. Laporan audit aktivitas pengguna.

Format laporan:

- PDF
- Excel
- Tampilan tabel di dashboard

---

## 15. Prioritas Pengembangan

## 15.1 Tahap 1 - Core System

Prioritas awal:

- Login dan manajemen pengguna
- Role dan permission
- Profil sekolah
- Tahun ajaran dan semester
- Data guru
- Data siswa
- Data kelas
- Mata pelajaran
- Jadwal pelajaran
- Dashboard dasar

## 15.2 Tahap 2 - Akademik

Fitur tahap kedua:

- Absensi
- Penilaian
- E-Rapor
- Kalender akademik
- Laporan akademik

## 15.3 Tahap 3 - Pembelajaran Digital

Fitur tahap ketiga:

- LMS
- Materi pembelajaran
- Tugas online
- Kuis/ujian sederhana
- Pengumpulan tugas

## 15.4 Tahap 4 - Administrasi Lanjutan

Fitur tahap keempat:

- Keuangan/SPP
- Perpustakaan
- Inventaris
- Pengumuman
- Notifikasi

## 15.5 Tahap 5 - Eksternal dan Karier

Fitur tahap kelima:

- PPDB Online
- Prakerin/PKL
- BKK
- Alumni

## 15.6 Tahap 6 - Optimasi

Fitur tahap keenam:

- Audit log
- Backup dan restore
- Laporan lanjutan
- Integrasi WhatsApp/email
- Optimasi performa

---

## 16. Batasan Sistem

Batasan awal sistem:

1. Sistem dikembangkan berbasis web dan responsif.
2. Sistem membutuhkan koneksi internet untuk akses online.
3. Hak akses pengguna dibatasi berdasarkan role.
4. Sistem belum wajib terintegrasi dengan Dapodik, e-Rapor resmi pemerintah, atau sistem pembayaran bank pada versi awal.
5. Fitur pembayaran online dapat dikembangkan pada tahap lanjutan.
6. Fitur WhatsApp Gateway/email dapat dikembangkan sebagai integrasi tambahan.
7. LMS pada tahap awal mendukung materi, tugas, dan kuis sederhana.

---

## 17. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Data sekolah sangat besar | Sistem lambat | Gunakan pagination, indexing database, dan optimasi query |
| Pengguna belum terbiasa | Penggunaan sistem rendah | Sediakan UI sederhana dan panduan penggunaan |
| Kesalahan input data | Data tidak akurat | Validasi form, import template, dan fitur edit data |
| Kehilangan data | Operasional terganggu | Backup otomatis dan restore data |
| Hak akses tidak tepat | Kebocoran data | Role-based access control dan audit log |
| Server down | Sistem tidak dapat diakses | Monitoring server dan backup deployment |
| File upload terlalu besar | Storage cepat penuh | Batas ukuran file dan rekomendasi object storage |

---

## 18. Indikator Keberhasilan

Sistem dianggap berhasil apabila:

1. Data guru, siswa, kelas, dan jadwal dapat dikelola dalam satu sistem.
2. Guru dapat melakukan absensi dan input nilai secara online.
3. Siswa dan orang tua dapat melihat informasi akademik sesuai aksesnya.
4. Rapor dapat dibuat dan dicetak melalui sistem.
5. Pembayaran SPP dapat dicatat dan dilaporkan dengan baik.
6. PPDB dapat dilakukan secara online.
7. Laporan dapat dicetak PDF dan/atau Excel.
8. Setiap pengguna hanya dapat mengakses fitur sesuai role.
9. Sistem dapat digunakan melalui laptop dan smartphone.
10. Data tersimpan secara aman dan dapat dibackup.

---

## 19. Kebutuhan Halaman Utama

Halaman yang perlu dibuat dalam sistem:

1. Halaman login.
2. Halaman lupa password.
3. Dashboard sesuai role.
4. Halaman data guru.
5. Halaman data siswa.
6. Halaman data kelas.
7. Halaman jadwal pelajaran.
8. Halaman absensi.
9. Halaman LMS.
10. Halaman nilai.
11. Halaman e-rapor.
12. Halaman PPDB.
13. Halaman keuangan.
14. Halaman perpustakaan.
15. Halaman inventaris.
16. Halaman PKL.
17. Halaman BKK.
18. Halaman pengumuman.
19. Halaman laporan.
20. Halaman pengaturan sistem.

---

## 20. Open Questions

Beberapa hal yang perlu dipastikan sebelum pengembangan:

1. Apakah sistem hanya digunakan untuk satu sekolah atau multi sekolah?
2. Apakah siswa dan orang tua memiliki akun login terpisah?
3. Apakah pembayaran SPP hanya dicatat manual atau akan menggunakan payment gateway?
4. Apakah LMS membutuhkan video streaming internal atau cukup upload file/link?
5. Apakah e-rapor harus mengikuti format rapor tertentu dari sekolah?
6. Apakah PPDB membutuhkan tes online?
7. Apakah absensi menggunakan input manual, QR Code, fingerprint, atau integrasi perangkat lain?
8. Apakah notifikasi akan menggunakan WhatsApp Gateway, email, atau notifikasi web?
9. Apakah sistem perlu integrasi dengan Dapodik atau aplikasi lain?
10. Apakah server akan menggunakan VPS pribadi, hosting sekolah, atau cloud provider?

---

## 21. Kesimpulan

Sistem Informasi Sekolah Terintegrasi dirancang untuk menjadi platform utama dalam mengelola kebutuhan akademik dan administrasi sekolah. Dengan modul yang lengkap mulai dari data siswa, guru, kelas, jadwal, absensi, LMS, penilaian, e-rapor, PPDB, perpustakaan, inventaris, keuangan, PKL, BKK, pengumuman, hingga laporan PDF, sistem ini diharapkan dapat meningkatkan efisiensi kerja sekolah dan memberikan akses informasi yang lebih cepat, akurat, dan transparan.

Pengembangan sistem disarankan dilakukan secara bertahap agar proses implementasi lebih terkontrol, dimulai dari modul inti seperti manajemen pengguna, data siswa, data guru, kelas, jadwal, absensi, nilai, dan rapor, kemudian dilanjutkan dengan modul pendukung seperti LMS, keuangan, PPDB, perpustakaan, inventaris, PKL, BKK, dan integrasi notifikasi.
