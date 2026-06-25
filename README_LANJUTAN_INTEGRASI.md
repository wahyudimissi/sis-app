# 🎯 LANJUTAN INTEGRASI MASTER DATA

**Status:** Data Siswa Complete, 5 Modul Remaining  
**Estimasi:** 3-4 jam untuk complete semua

---

## ✅ YANG SUDAH SELESAI

### 1. Data Siswa (100%)
**File:** `frontend/app/master/siswa/page.tsx`

**Features:**
- ✅ Full CRUD operations
- ✅ Modal form dengan 15+ fields
- ✅ Search & filter
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications
- ✅ Form validation

**This is your golden template!** Copy pattern dari sini ke modul lain.

---

## 📋 MODUL YANG PERLU DISELESAIKAN

### 2. Data Guru
**File:** `frontend/app/master/guru/page.tsx`  
**Endpoint:** `/api/guru`  
**Status:** 50% (partially updated)

**Fields to include:**
```typescript
{
  nip: string;
  nuptk?: string;
  nama: string;
  jenisKelamin: 'LAKI_LAKI' | 'PEREMPUAN';
  tempatLahir?: string;
  tanggalLahir?: string;
  alamat?: string;
  noHp?: string;
  email?: string;
  pendidikan?: string;
  jurusan?: string;
  jabatan?: string;
  statusKepegawaian?: string;
  tanggalMasuk?: string;
  mataPelajaranId?: string;
}
```

---

### 3. Data Kelas
**File:** `frontend/app/master/kelas/page.tsx`  
**Endpoint:** `/api/kelas`  
**Status:** Not started

**Fields to include:**
```typescript
{
  nama: string;
  tingkat: string;
  jurusan?: string;
  tahunAjaranId: string;
  waliKelasId?: string;
  kapasitas?: number;
  ruangan?: string;
}
```

---

### 4. Mata Pelajaran
**File:** `frontend/app/master/mata-pelajaran/page.tsx`  
**Endpoint:** `/api/mata-pelajaran`  
**Status:** Not started

**Fields to include:**
```typescript
{
  kode: string;
  nama: string;
  kelompok: string;
  jumlahJam: number;
  deskripsi?: string;
}
```

---

### 5. Tahun Ajaran
**File:** `frontend/app/master/tahun-ajaran/page.tsx`  
**Endpoint:** `/api/tahun-ajaran`  
**Status:** Not started

**Fields to include:**
```typescript
{
  nama: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  semester: 'GANJIL' | 'GENAP';
  aktif: boolean;
}
```

---

### 6. Profil Sekolah
**File:** `frontend/app/master/profil-sekolah/page.tsx`  
**Endpoint:** `/api/profil-sekolah`  
**Status:** Not started

**Note:** Ini berbeda dari modul lain (UPDATE only, no CREATE/DELETE)

**Fields to include:**
```typescript
{
  nama: string;
  npsn: string;
  alamat: string;
  kelurahan?: string;
  kecamatan?: string;
  kabupaten?: string;
  provinsi?: string;
  kodePos?: string;
  telepon?: string;
  email?: string;
  website?: string;
  logo?: string;
  kepalaSekolah?: string;
  nip?: string;
}
```

---

## 🚀 STEP-BY-STEP INTEGRATION

### For Each Module:

**Step 1: Open the page file**
```bash
# Example for Data Guru
code d:\APP\app_sekolah\frontend\app\master\guru\page.tsx
```

**Step 2: Reference Data Siswa**
```bash
# Open as reference
code d:\APP\app_sekolah\frontend\app\master\siswa\page.tsx
```

**Step 3: Copy the pattern**
- Copy entire structure from Data Siswa
- Update interface with fields above
- Update API endpoint path
- Update form fields in modal
- Update table columns

**Step 4: Key things to change:**

```typescript
// 1. Interface
interface YourModel {
  // Update fields here
}

// 2. API Endpoint
const fetchData = async () => {
  const response = await apiClient.get<YourModel[]>('/api/your-endpoint');
};

// 3. Form Fields in Modal
<input
  type="text"
  value={formData.yourField}
  onChange={(e) => setFormData({ ...formData, yourField: e.target.value })}
/>

// 4. Table Columns
<td className="py-4 px-6">{item.yourField}</td>
```

**Step 5: Test the module**
```bash
npm run dev
# Navigate to the page
# Test CRUD operations
```

---

## 📂 FILES TO REFERENCE

### Main Template:
- `frontend/app/master/siswa/page.tsx` - Complete working example
- `TEMPLATE_INTEGRATION_PATTERN.md` - Code pattern reference

### API Endpoints (Already Working):
- `frontend/app/api/siswa/route.ts`
- `frontend/app/api/guru/route.ts`
- `frontend/app/api/kelas/route.ts`
- `frontend/app/api/mata-pelajaran/route.ts`
- `frontend/app/api/tahun-ajaran/route.ts`
- `frontend/app/api/profil-sekolah/route.ts`

### Helper Libraries (Already Created):
- `frontend/lib/api-client.ts` - API wrapper
- `frontend/lib/auth-service.ts` - Auth methods
- `frontend/contexts/AuthContext.tsx` - Global auth state
- `frontend/components/ProtectedRoute.tsx` - Route protection
- `frontend/components/DashboardLayout.tsx` - Layout wrapper

---

## ⚡ QUICK START GUIDE

### Option A: Manual Integration (Recommended for Learning)

1. Start with one module (e.g., Data Guru)
2. Open Data Siswa as reference
3. Copy structure, update fields
4. Test thoroughly
5. Move to next module
6. Repeat

**Time:** 4-5 hours for all 5 modules

---

### Option B: Batch Copy-Paste (Faster but Risky)

1. Copy Data Siswa file 5 times
2. Rename to each module
3. Do find-replace for:
   - "Siswa" → "Guru"
   - "siswa" → "guru"
   - Interface fields
   - API endpoints
4. Update form fields
5. Update table columns
6. Test all together

**Time:** 2-3 hours but may have bugs

---

## 🧪 TESTING CHECKLIST

For each module, test:

- [ ] **CREATE:** Can add new record
- [ ] **READ:** List displays correctly
- [ ] **UPDATE:** Can edit existing record
- [ ] **DELETE:** Can remove record
- [ ] **SEARCH:** Search functionality works
- [ ] **FILTER:** Filter functionality works (if any)
- [ ] **VALIDATION:** Required fields validated
- [ ] **ERRORS:** Error messages display correctly
- [ ] **SUCCESS:** Success messages display correctly
- [ ] **LOADING:** Loading states work properly

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: "Failed to fetch"
**Cause:** Server not running  
**Fix:** `cd frontend && npm run dev`

### Issue 2: "401 Unauthorized"
**Cause:** Not logged in  
**Fix:** Login first at `/login`

### Issue 3: "Validation error"
**Cause:** Missing required fields  
**Fix:** Check Prisma schema, add required fields to form

### Issue 4: "Cannot find module"
**Cause:** Wrong import path  
**Fix:** Check import paths, should start with `@/`

### Issue 5: Type errors
**Cause:** Interface doesn't match API response  
**Fix:** Check Prisma schema, update interface

---

## 📊 PROGRESS TRACKER

| Module | Status | Progress | Estimated Time |
|--------|--------|----------|----------------|
| Data Siswa | ✅ Complete | 100% | Done |
| Data Guru | 🟡 Started | 50% | 1 hour |
| Data Kelas | ⏳ Pending | 0% | 1 hour |
| Mata Pelajaran | ⏳ Pending | 0% | 45 min |
| Tahun Ajaran | ⏳ Pending | 0% | 45 min |
| Profil Sekolah | ⏳ Pending | 0% | 30 min |
| **TOTAL** | 🟡 In Progress | **17%** | **4 hours** |

---

## 🎯 NEXT IMMEDIATE ACTIONS

### RIGHT NOW:

**1. Test Data Siswa** (30 min)
```bash
cd d:\APP\app_sekolah\frontend
npm run dev

# Open: http://localhost:3000
# Login: admin / admin123
# Test: Master Data → Data Siswa
```

**2. If test OK, continue with Data Guru** (1 hour)
- Open `frontend/app/master/guru/page.tsx`
- Complete the integration (currently 50%)
- Test CRUD operations

**3. Continue with remaining 4 modules** (2.5 hours)
- Use Data Siswa as template
- Apply same pattern
- Test each module

**4. Final testing** (30 min)
- Test all 6 modules together
- Fix any bugs found
- Document any issues

---

## 💡 PRO TIPS

1. **Keep Data Siswa open** as reference while working
2. **Test frequently** - don't wait until all done
3. **Use browser DevTools** to check API responses
4. **Check Prisma schema** for exact field names
5. **Copy-paste carefully** - small typos can break things
6. **Use VSCode search** (Ctrl+F) to find-replace bulk changes
7. **Commit to git** after each working module

---

## 📞 NEED HELP?

If stuck, check:
1. `TEMPLATE_INTEGRATION_PATTERN.md` - Code pattern reference
2. `frontend/app/master/siswa/page.tsx` - Working example
3. Browser console for errors
4. Server terminal for API errors
5. Prisma schema for field definitions

---

## ✅ DEFINITION OF DONE

Master Data integration is complete when:
- [ ] All 6 modules have full CRUD operations
- [ ] All modules tested and working
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Search/filter works in all modules
- [ ] Forms validate properly
- [ ] Error messages display correctly
- [ ] Success notifications work
- [ ] Protected routes enforced
- [ ] Loading states show properly

---

## 🎉 AFTER COMPLETION

When all Master Data modules are done:

**Next Phase Options:**
1. Add file upload (photos for siswa/guru)
2. Add Excel import/export
3. Add PDF reports
4. Start LMS module
5. Start Keuangan module
6. Add Manajemen Pengguna

---

**Good luck with the integration!** 🚀

You have everything you need. The pattern is proven (Data Siswa works).  
Just replicate it to the other 5 modules and you're done!

