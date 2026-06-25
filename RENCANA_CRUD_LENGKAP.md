# 🎯 RENCANA CRUD LENGKAP - Semua Modul

**Berdasarkan:** PRD_Sistem_Informasi_Sekolah.md  
**Target:** Semua halaman dengan CRUD operations  
**Estimasi Total:** 3-5 bulan development

---

## 📊 STATUS SAAT INI

### ✅ Yang Sudah Ada (Foundation):
1. **Backend API** - 28 endpoints ✅
2. **Database** - 16 tables ✅
3. **Authentication** - Complete ✅
4. **Data Siswa** - CRUD Complete ✅
5. **Data Guru** - UI Complete, perlu API integration
6. **Data Kelas** - UI Complete, perlu API integration
7. **Mata Pelajaran** - UI Complete, perlu API integration
8. **Tahun Ajaran** - UI Complete, perlu API integration
9. **Profil Sekolah** - UI Complete, perlu API integration

---

## 🎯 PRIORITY ROADMAP

### **PHASE 1: Complete Master Data** (CURRENT - Week 1-2)

#### 1.1 Master Data - Data Guru ✅ (UI Done)
**Status:** Perlu API Integration  
**Estimasi:** 2-3 jam

**CRUD Operations:**
- [x] UI Complete
- [ ] Create Guru
- [ ] Read/List Guru
- [ ] Update Guru
- [ ] Delete Guru
- [ ] Search & Filter
- [ ] Modal Form Integration

**API Endpoints:** `/api/guru` ✅ (sudah ada)

---

#### 1.2 Master Data - Data Kelas ✅ (UI Done)
**Status:** Perlu API Integration  
**Estimasi:** 2-3 jam

**CRUD Operations:**
- [x] UI Complete
- [ ] Create Kelas
- [ ] Read/List Kelas
- [ ] Update Kelas
- [ ] Delete Kelas
- [ ] Assign Wali Kelas
- [ ] List Siswa per Kelas

**API Endpoints:** `/api/kelas` ✅ (sudah ada)

---

#### 1.3 Master Data - Mata Pelajaran ✅ (UI Done)
**Status:** Perlu API Integration  
**Estimasi:** 1-2 jam

**CRUD Operations:**
- [x] UI Complete
- [ ] Create Mata Pelajaran
- [ ] Read/List Mata Pelajaran
- [ ] Update Mata Pelajaran
- [ ] Delete Mata Pelajaran
- [ ] Kelompok Mapel
- [ ] Jumlah Jam

**API Endpoints:** `/api/mata-pelajaran` ✅ (sudah ada)

---

#### 1.4 Master Data - Tahun Ajaran ✅ (UI Done)
**Status:** Perlu API Integration  
**Estimasi:** 1-2 jam

**CRUD Operations:**
- [x] UI Complete
- [ ] Create Tahun Ajaran
- [ ] Read/List Tahun Ajaran
- [ ] Update Tahun Ajaran
- [ ] Delete Tahun Ajaran
- [ ] Set Active Tahun Ajaran
- [ ] Semester Management

**API Endpoints:** `/api/tahun-ajaran` ✅ (sudah ada)

---

#### 1.5 Master Data - Profil Sekolah ✅ (UI Done)
**Status:** Perlu API Integration  
**Estimasi:** 1-2 jam

**CRUD Operations:**
- [x] UI Complete
- [ ] View Profil
- [ ] Update Profil (no create/delete)
- [ ] Upload Logo (future)

**API Endpoints:** `/api/profil-sekolah` ✅ (sudah ada)

---

### **PHASE 2: Manajemen Pengguna** (Week 3)

#### 2.1 Manajemen Pengguna
**Status:** Belum dibuat  
**Estimasi:** 1 minggu

**Pages Needed:**
- `/admin/users` - List users
- `/admin/users/create` - Create user
- `/admin/users/[id]/edit` - Edit user
- `/admin/roles` - Manage roles
- `/admin/permissions` - Manage permissions

**CRUD Operations:**
- [ ] Create User
- [ ] Read/List Users
- [ ] Update User
- [ ] Delete User
- [ ] Activate/Deactivate
- [ ] Reset Password
- [ ] Assign Role
- [ ] Import Excel
- [ ] Export Excel

**API Endpoints Needed:**
- `/api/users` - GET, POST
- `/api/users/[id]` - GET, PUT, DELETE
- `/api/roles` - GET, POST, PUT, DELETE
- `/api/permissions` - GET

---

### **PHASE 3: Akademik Modules** (Week 4-6)

#### 3.1 Jadwal Pelajaran
**Status:** UI Complete, perlu API  
**Estimasi:** 1 minggu

**CRUD Operations:**
- [ ] Create Jadwal
- [ ] Read/List Jadwal (per kelas, per guru)
- [ ] Update Jadwal
- [ ] Delete Jadwal
- [ ] Validasi Bentrok
- [ ] Print Jadwal
- [ ] Copy Jadwal

**API Endpoints Needed:**
- `/api/jadwal`
- `/api/jadwal/[id]`
- `/api/jadwal/validate`

---

#### 3.2 Absensi
**Status:** UI Complete, perlu API  
**Estimasi:** 1 minggu

**CRUD Operations:**
- [ ] Input Absensi Harian
- [ ] Input Absensi Per Mapel
- [ ] Read/Rekap Absensi
- [ ] Update Absensi
- [ ] Status: Hadir, Izin, Sakit, Alfa
- [ ] Rekap per Siswa
- [ ] Rekap per Kelas
- [ ] Export PDF

**API Endpoints Needed:**
- `/api/absensi`
- `/api/absensi/rekap`
- `/api/absensi/siswa/[id]`

---

#### 3.3 Penilaian
**Status:** UI Complete, perlu API  
**Estimasi:** 1 minggu

**CRUD Operations:**
- [ ] Input Nilai Tugas
- [ ] Input Nilai Harian
- [ ] Input Nilai UTS/UAS
- [ ] Read/List Nilai
- [ ] Update Nilai
- [ ] Delete Nilai
- [ ] Bobot Nilai
- [ ] Rekap Nilai
- [ ] Export Excel

**API Endpoints Needed:**
- `/api/nilai`
- `/api/nilai/rekap`

---

#### 3.4 E-Rapor
**Status:** UI Complete, perlu API  
**Estimasi:** 2 minggu

**CRUD Operations:**
- [ ] Generate Rapor
- [ ] Input Catatan Wali Kelas
- [ ] Input Ekstrakurikuler
- [ ] Input Prestasi
- [ ] Read/View Rapor
- [ ] Validasi Wali Kelas
- [ ] Validasi Kepala Sekolah
- [ ] Print PDF
- [ ] Arsip Rapor

**API Endpoints Needed:**
- `/api/rapor`
- `/api/rapor/generate`
- `/api/rapor/[id]/print`

---

### **PHASE 4: LMS** (Week 7-9)

#### 4.1 LMS - Materi
**Status:** Belum dibuat  
**Estimasi:** 2 minggu

**CRUD Operations:**
- [ ] Create Course
- [ ] Upload Materi (PDF, Video, Link)
- [ ] Read/List Materi
- [ ] Update Materi
- [ ] Delete Materi
- [ ] Download Materi

**API Endpoints Needed:**
- `/api/lms/courses`
- `/api/lms/materials`

---

#### 4.2 LMS - Tugas
**Status:** Belum dibuat  
**Estimasi:** 1 minggu

**CRUD Operations:**
- [ ] Create Tugas
- [ ] Set Deadline
- [ ] Read/List Tugas
- [ ] Update Tugas
- [ ] Delete Tugas
- [ ] Submit Tugas (siswa)
- [ ] Grade Tugas (guru)

**API Endpoints Needed:**
- `/api/lms/assignments`
- `/api/lms/submissions`

---

### **PHASE 5: Keuangan** (Week 10-11)

#### 5.1 Keuangan/SPP
**Status:** Belum dibuat  
**Estimasi:** 2 minggu

**CRUD Operations:**
- [ ] Create Jenis Pembayaran
- [ ] Create Tagihan
- [ ] Record Pembayaran
- [ ] Read/List Tagihan
- [ ] Read Tunggakan
- [ ] Update Status Bayar
- [ ] Print Bukti Bayar
- [ ] Laporan Keuangan

**API Endpoints Needed:**
- `/api/keuangan/payment-types`
- `/api/keuangan/bills`
- `/api/keuangan/payments`

---

### **PHASE 6: Support Modules** (Week 12-14)

#### 6.1 Pengumuman
**Status:** Belum dibuat  
**Estimasi:** 3 hari

**CRUD Operations:**
- [ ] Create Pengumuman
- [ ] Read/List Pengumuman
- [ ] Update Pengumuman
- [ ] Delete Pengumuman
- [ ] Target Audience
- [ ] Schedule Publish
- [ ] Attach Files

**API Endpoints Needed:**
- `/api/pengumuman`

---

#### 6.2 Perpustakaan
**Status:** Belum dibuat  
**Estimasi:** 1 minggu

**CRUD Operations:**
- [ ] Create Buku
- [ ] Read/List Buku
- [ ] Update Buku
- [ ] Delete Buku
- [ ] Peminjaman
- [ ] Pengembalian
- [ ] Denda
- [ ] Laporan

**API Endpoints Needed:**
- `/api/perpustakaan/books`
- `/api/perpustakaan/borrowings`

---

#### 6.3 Inventaris
**Status:** Belum dibuat  
**Estimasi:** 1 minggu

**CRUD Operations:**
- [ ] Create Barang
- [ ] Read/List Barang
- [ ] Update Barang
- [ ] Delete Barang
- [ ] Barang Masuk/Keluar
- [ ] Mutasi
- [ ] Laporan

**API Endpoints Needed:**
- `/api/inventaris/items`
- `/api/inventaris/transactions`

---

### **PHASE 7: External Modules** (Week 15-18)

#### 7.1 PPDB Online
**Status:** UI basic done  
**Estimasi:** 2 minggu

**CRUD Operations:**
- [ ] Register Calon Siswa
- [ ] Upload Berkas
- [ ] Read/List Pendaftar
- [ ] Verifikasi Data
- [ ] Update Status
- [ ] Seleksi
- [ ] Pengumuman
- [ ] Print Bukti

**API Endpoints Needed:**
- `/api/ppdb/register`
- `/api/ppdb/applicants`
- `/api/ppdb/verify`

---

#### 7.2 Prakerin/PKL
**Status:** Belum dibuat  
**Estimasi:** 2 minggu

**CRUD Operations:**
- [ ] Create Tempat PKL
- [ ] Assign Siswa ke PKL
- [ ] Jurnal Harian
- [ ] Monitoring
- [ ] Penilaian
- [ ] Laporan

**API Endpoints Needed:**
- `/api/pkl/companies`
- `/api/pkl/placements`
- `/api/pkl/journals`

---

#### 7.3 BKK
**Status:** Belum dibuat  
**Estimasi:** 1 minggu

**CRUD Operations:**
- [ ] Create Perusahaan
- [ ] Create Lowongan
- [ ] Read Lowongan
- [ ] Apply Lowongan
- [ ] Track Status
- [ ] Alumni Data

**API Endpoints Needed:**
- `/api/bkk/companies`
- `/api/bkk/vacancies`
- `/api/bkk/applications`

---

## 📋 EXECUTION PLAN

### **IMMEDIATE (Now - Week 2):**

1. ✅ Fix all existing errors (DONE)
2. ⏳ **Complete Master Data API Integration** (5 modules)
   - Data Guru
   - Data Kelas
   - Mata Pelajaran
   - Tahun Ajaran
   - Profil Sekolah

**Action:** Apply Data Siswa pattern to all 5 modules  
**Time:** 8-10 hours

---

### **Week 3:**
- Build Manajemen Pengguna module
- CRUD for users, roles, permissions

---

### **Week 4-6:**
- Complete Akademik modules
- Jadwal, Absensi, Penilaian, E-Rapor

---

### **Week 7-9:**
- Build LMS module
- Materials, Assignments, Submissions

---

### **Week 10+:**
- Support modules (Keuangan, Perpustakaan, Inventaris)
- External modules (PPDB, PKL, BKK)

---

## 🎯 DECISION POINT

**Pilihan untuk Anda:**

**Option A: Continue Master Data** (Recommended)
- Complete 5 Master Data modules
- Time: 8-10 hours
- Result: All Master Data working with CRUD

**Option B: Start New Module**
- Build Manajemen Pengguna
- Time: 1 week
- Result: User management complete

**Option C: Full Acceleration**
- I generate all modules at once
- Time: Multiple weeks
- Risk: Need thorough testing

---

## 💡 RECOMMENDATION

**Start with Option A:**
1. Complete Master Data first (proven pattern)
2. Then tackle new modules one by one
3. Test thoroughly after each module
4. Build incrementally for stability

**This approach:**
- ✅ Lower risk
- ✅ Easier to debug
- ✅ Can use immediately
- ✅ Learn and adjust as we go

---

**What would you like to do?**

**A** - Complete Master Data (5 modules)  
**B** - Start Manajemen Pengguna  
**C** - Generate all modules  
**D** - Custom approach

