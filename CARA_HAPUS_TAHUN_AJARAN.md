# CARA MENGHAPUS TAHUN AJARAN DENGAN DATA TERKAIT 📋

**Masalah**: Tahun ajaran 2026/2027 memiliki "1 Kelas" dan tidak bisa dihapus  
**Penyebab**: Sistem memblokir delete untuk menjaga integritas data  
**Solusi**: Ikuti langkah-langkah di bawah ini

---

## 🔍 MENGAPA TIDAK BISA DIHAPUS?

### Proteksi Database

Sistem **tidak mengizinkan** penghapusan tahun ajaran yang masih memiliki data terkait:
- ✅ **1 Kelas** terdaftar pada tahun ajaran ini
- Jika ada **Jadwal, Absensi, atau Nilai** → juga tidak bisa dihapus

### Tujuan Proteksi:
1. **Mencegah Data Orphan**: Kelas tidak akan kehilangan referensi tahun ajaran
2. **Integritas Referensial**: Jadwal, absensi, nilai tetap valid
3. **Audit Trail**: Data historis terjaga

---

## ✅ SOLUSI: 2 OPSI

### OPSI 1: Hapus Data Terkait (Untuk Data Testing) 🗑️

**Gunakan opsi ini jika:**
- Tahun ajaran adalah data testing/percobaan
- Tidak ada data penting yang perlu disimpan
- Ingin membersihkan database

#### Langkah-Langkah:

**Step 1: Hapus Kelas Terlebih Dahulu**

1. **Login** sebagai Admin/Superadmin
2. Navigasi ke: **Master Data → Data Kelas**
3. Lihat tabel kelas
4. **Filter** atau cari kelas yang tahun ajarannya **2026/2027**
5. Untuk setiap kelas:
   - Klik tombol **Hapus** (trash icon merah)
   - Confirm delete
6. Ulangi sampai semua kelas untuk tahun ajaran 2026/2027 terhapus

**Step 2: Hapus Semester (Jika Ada)**

1. Navigasi ke: **Akademik → Semester** (jika menu ada)
2. Cari semester untuk tahun ajaran 2026/2027
3. Hapus semua semester terkait

**Step 3: Kembali ke Tahun Ajaran**

1. Navigasi ke: **Master Data → Tahun Ajaran**
2. Lihat card tahun ajaran 2026/2027
3. Card sekarang menunjukkan: **"0 Kelas • 0 Semester"**
4. Klik tombol **Delete** (trash icon merah)
5. Confirm: "Apakah Anda yakin ingin menghapus tahun ajaran 2026/2027?"
6. ✅ **Berhasil Dihapus!**


---

### OPSI 2: Lock Tahun Ajaran (Untuk Data Produksi) 🔒

**Gunakan opsi ini jika:**
- Tahun ajaran adalah data produksi/real
- Ada data penting (absensi, nilai siswa) yang perlu disimpan
- Ingin archive untuk audit/laporan di masa depan

#### Keuntungan Lock:
- ✅ Data tetap tersimpan (tidak hilang)
- ✅ Tidak bisa diedit atau dihapus secara tidak sengaja
- ✅ Tetap bisa dilihat untuk laporan
- ✅ Best practice untuk data retention

#### Langkah-Langkah:

1. **Login** sebagai Admin/Superadmin
2. Navigasi ke: **Master Data → Tahun Ajaran**
3. Lihat baris tahun ajaran yang ingin di-lock
4. Klik tombol **"Terbuka"** (badge hijau dengan icon unlock 🔓)
5. Confirm: "Apakah Anda yakin ingin mengunci data tahun ajaran 2026/2027?"
6. ✅ **Status berubah menjadi "Terkunci"** (badge merah dengan icon lock 🔒)

**Hasil:**
- Badge: 🔒 **Terkunci** (merah)
- Tombol Edit: **Disabled** (tidak bisa edit)
- Tombol Delete: **Disabled** (tidak bisa hapus)
- Data: **Read-only** (hanya bisa dilihat)

**Untuk Unlock:**
- Klik tombol **"Terkunci"** (badge merah)
- Confirm unlock
- Status kembali ke **"Terbuka"** (hijau)

---

## 🎯 REKOMENDASI

### Untuk Data Testing/Development:
✅ **Gunakan OPSI 1** (Hapus data terkait, lalu hapus tahun ajaran)

**Alasan:**
- Database bersih
- Tidak ada data sampah
- Mudah untuk testing ulang

### Untuk Data Produksi/Real School:
✅ **Gunakan OPSI 2** (Lock tahun ajaran)

**Alasan:**
- Data siswa tetap tersimpan
- Absensi dan nilai tidak hilang
- Bisa untuk generate rapor masa lalu
- Audit trail terjaga
- Comply dengan regulasi penyimpanan data pendidikan

---

## ⚠️ PERINGATAN

### Sebelum Menghapus Tahun Ajaran:

**Pikirkan 2x jika:**
- ❌ Tahun ajaran sudah berisi absensi siswa
- ❌ Sudah ada nilai/rapor siswa
- ❌ Data untuk laporan pemerintah (Dapodik, dll)
- ❌ Tahun ajaran yang sudah selesai (bukan data testing)

**Dalam kasus di atas → JANGAN HAPUS!**
→ Gunakan fitur **Lock** saja

### Aman untuk Dihapus jika:
- ✅ Data testing/percobaan
- ✅ Tahun ajaran salah buat
- ✅ Duplikat data
- ✅ Belum ada data penting (siswa, absensi, nilai)

---

## 🔧 ERROR MESSAGES & SOLUSI

### Error 1: "Tidak dapat menghapus tahun ajaran yang memiliki X kelas dan Y semester"

**Penyebab**: Masih ada data kelas/semester terkait

**Solusi**: 
- Hapus semua kelas untuk tahun ajaran tersebut dulu
- Atau gunakan fitur Lock instead

---

### Error 2: "Data tahun ajaran yang sudah terkunci tidak dapat dihapus"

**Penyebab**: Tahun ajaran dalam status "Terkunci"

**Solusi**:
1. Unlock dulu: Klik tombol "Terkunci"
2. Setelah status "Terbuka", baru bisa dihapus
3. **Atau** biarkan tetap terkunci (recommended untuk data produksi)

---

### Error 3: "Forbidden - You do not have permission"

**Penyebab**: User role tidak cukup (bukan ADMIN/SUPERADMIN)

**Solusi**:
- Login dengan akun ADMIN atau SUPERADMIN
- Atau minta admin untuk menghapus

---

## 📊 CONTOH KASUS

### Kasus 1: Setup Awal Sekolah (Testing)

**Situasi:**
- Baru install sistem
- Bikin tahun ajaran 2026/2027 untuk testing
- Bikin 1 kelas testing
- Testing selesai, mau clean database

**Action:**
1. Go to Data Kelas → Hapus kelas testing
2. Go to Tahun Ajaran → Hapus tahun ajaran 2026/2027
3. ✅ Database bersih, siap untuk data real

---

### Kasus 2: Tahun Ajaran Salah Input

**Situasi:**
- Salah bikin tahun ajaran "2025/2026" (seharusnya "2026/2027")
- Belum ada data apapun
- Mau hapus yang salah

**Action:**
1. Pastikan tidak ada kelas/data terkait
2. Go to Tahun Ajaran → Hapus yang salah
3. Bikin yang benar
4. ✅ Problem solved

---

### Kasus 3: Tahun Ajaran Sudah Selesai (2023/2024)

**Situasi:**
- Tahun ajaran 2023/2024 sudah selesai
- Siswa sudah lulus
- Ingin "archive" data lama

**Action:**
1. **JANGAN HAPUS!** 
2. Gunakan fitur **Lock**
3. Status jadi "Terkunci"
4. ✅ Data tersimpan untuk laporan/audit
5. Database tetap organized

---

## 📞 BUTUH BANTUAN?

Jika masih mengalami kesulitan:

1. **Check Error Message**: Baca pesan error dengan teliti
2. **Follow Step-by-Step**: Ikuti langkah di atas sesuai urutan
3. **Check Related Data**: Pastikan tidak ada kelas/semester yang tersisa
4. **Consider Locking**: Pertimbangkan Lock daripada Delete

---

## ✅ CHECKLIST SEBELUM DELETE

Sebelum menghapus tahun ajaran, pastikan:

- [ ] Sudah backup database (jika ada data penting)
- [ ] Tahun ajaran tidak memiliki kelas terkait (0 Kelas)
- [ ] Tahun ajaran tidak memiliki semester terkait (0 Semester)
- [ ] Tahun ajaran dalam status "Terbuka" (tidak terkunci)
- [ ] User login sebagai ADMIN atau SUPERADMIN
- [ ] Yakin data tidak diperlukan untuk audit/laporan
- [ ] Sudah diskusi dengan tim (jika data produksi)

**Jika semua checklist ✅ → Aman untuk DELETE**

**Jika ragu → Gunakan LOCK saja!** 🔒

---

## 🎓 BEST PRACTICES

### DO ✅
- Lock tahun ajaran yang sudah selesai
- Hapus hanya data testing/salah
- Backup sebelum delete
- Check related data dulu

### DON'T ❌
- Hapus tahun ajaran dengan data siswa
- Hapus tanpa backup
- Hapus data produksi
- Ignore error messages

---

**Last Updated**: Context Transfer #5  
**Status**: Production-ready with improved error handling  
**Build**: 48/48 routes ✅

