# Petunjuk Instalasi dan Menjalankan Aplikasi

## 📋 Sistem yang Telah Dibuat

Frontend untuk Sistem Informasi Sekolah Terintegrasi dengan fitur:
- ✅ Landing Page
- ✅ Halaman Login
- ✅ Dashboard dengan statistik
- ✅ Layout dengan sidebar responsif
- ✅ Halaman Data Siswa (CRUD)
- ✅ Halaman PPDB Online

## 🔧 Prasyarat

Sebelum memulai, pastikan Anda telah menginstall:

1. **Node.js** (versi 18.x atau lebih baru)
   - Download dari: https://nodejs.org/
   - Pilih versi LTS (Long Term Support)
   - Install dengan cara berikut:
     - Windows: Download installer .msi dan jalankan
     - Setelah install, buka Command Prompt dan ketik `node --version` untuk memastikan terinstall

## 📦 Langkah Instalasi

### 1. Buka Command Prompt (CMD)

Tekan `Windows + R`, ketik `cmd`, lalu Enter

### 2. Navigasi ke Folder Project

```cmd
cd d:\APP\app_sekolah\frontend
```

### 3. Install Dependencies

Jalankan salah satu perintah berikut:

```cmd
npm install
```

Proses ini akan mendownload semua library yang dibutuhkan. Tunggu hingga selesai (sekitar 2-5 menit tergantung kecepatan internet).

## 🚀 Menjalankan Aplikasi

### Mode Development (Untuk Pengembangan)

Setelah instalasi selesai, jalankan:

```cmd
npm run dev
```

Tunggu beberapa detik hingga muncul pesan:

```
- Local:        http://localhost:3000
- Ready in ...ms
```

### Membuka Aplikasi di Browser

Buka browser (Chrome, Firefox, Edge, dll) dan ketik di address bar:

```
http://localhost:3000
```

## 🎯 Halaman yang Dapat Diakses

Setelah aplikasi berjalan, Anda dapat mengakses:

1. **Landing Page**: http://localhost:3000
2. **Login**: http://localhost:3000/login
3. **Dashboard**: http://localhost:3000/dashboard
4. **Data Siswa**: http://localhost:3000/master/siswa
5. **PPDB Online**: http://localhost:3000/ppdb

## 🛑 Menghentikan Aplikasi

Untuk menghentikan server development:
- Tekan `Ctrl + C` di Command Prompt
- Ketik `Y` jika diminta konfirmasi
- Atau tutup window Command Prompt

## 📱 Akses dari Perangkat Lain (Opsional)

Jika ingin mengakses dari HP/tablet yang terhubung ke jaringan yang sama:

1. Cari IP Address komputer Anda:
   ```cmd
   ipconfig
   ```
   Cari bagian "IPv4 Address" (contoh: 192.168.1.100)

2. Di HP/tablet, buka browser dan ketik:
   ```
   http://192.168.1.100:3000
   ```
   (Ganti 192.168.1.100 dengan IP Address komputer Anda)

## ⚠️ Troubleshooting

### Problem: npm tidak dikenali

**Solusi**: Node.js belum terinstall atau belum masuk PATH
- Install Node.js dari nodejs.org
- Restart Command Prompt setelah instalasi
- Coba lagi perintah `npm --version`

### Problem: Port 3000 sudah digunakan

**Solusi**: Aplikasi lain menggunakan port 3000
- Tutup aplikasi yang menggunakan port 3000
- Atau ubah port dengan cara:
  ```cmd
  set PORT=3001 && npm run dev
  ```

### Problem: Error saat npm install

**Solusi**: 
- Hapus folder `node_modules` dan file `package-lock.json`
- Jalankan kembali `npm install`
- Pastikan koneksi internet stabil

### Problem: Halaman blank/error setelah dibuka

**Solusi**:
- Refresh browser (Ctrl + F5)
- Clear cache browser
- Cek console browser (F12) untuk melihat error
- Pastikan tidak ada error di Command Prompt

## 📝 Tips Pengembangan

1. **Auto Reload**: Setiap kali Anda edit file, browser akan otomatis refresh
2. **Hot Reload**: Perubahan akan langsung terlihat tanpa reload penuh
3. **Console Log**: Gunakan `console.log()` untuk debugging
4. **Browser DevTools**: Tekan F12 untuk membuka developer tools

## 🔄 Update Dependencies (Opsional)

Untuk update library ke versi terbaru:

```cmd
npm update
```

## 🏗️ Build untuk Production (Opsional)

Jika ingin membuat build untuk deployment:

```cmd
npm run build
```

Setelah build selesai, jalankan:

```cmd
npm start
```

## 📚 Struktur File Penting

```
frontend/
├── app/                    # Halaman aplikasi
│   ├── dashboard/         # Halaman dashboard
│   ├── login/            # Halaman login
│   ├── master/           # Master data
│   │   └── siswa/       # Data siswa
│   ├── ppdb/            # PPDB Online
│   ├── globals.css      # Style global
│   ├── layout.tsx       # Layout utama
│   └── page.tsx         # Landing page
├── components/           # Komponen reusable
│   └── DashboardLayout.tsx
├── public/              # File statis (gambar, dll)
├── package.json         # Daftar dependencies
└── README.md           # Dokumentasi lengkap
```

## 🆘 Bantuan Lebih Lanjut

Jika mengalami masalah:
1. Baca file README.md untuk dokumentasi lengkap
2. Cek error message di Command Prompt
3. Cek console browser (F12)
4. Pastikan semua langkah instalasi sudah benar

## ✅ Checklist Instalasi

- [ ] Node.js terinstall (cek dengan `node --version`)
- [ ] npm terinstall (cek dengan `npm --version`)
- [ ] Sudah di folder frontend (`cd d:\APP\app_sekolah\frontend`)
- [ ] Dependencies terinstall (`npm install` berhasil)
- [ ] Server berjalan (`npm run dev` tidak error)
- [ ] Bisa akses http://localhost:3000 di browser

---

**Selamat! Aplikasi frontend sudah siap digunakan! 🎉**
