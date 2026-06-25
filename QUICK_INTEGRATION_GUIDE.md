# 🚀 QUICK INTEGRATION GUIDE - Master Data

**Date:** 23 Juni 2026  
**Status:** Accelerated Integration Mode

---

## ✅ COMPLETED

### Data Siswa (100%)
- ✅ Full CRUD operations
- ✅ API integration complete
- ✅ Modal forms with validation
- ✅ Search & filter working
- ✅ Loading & error states
- ✅ Success notifications

**File:** `frontend/app/master/siswa/page.tsx`

---

## 🔄 IN PROGRESS

### Data Guru (50%)
- ✅ Started API integration
- ✅ CRUD handlers added
- ⏳ Modal form (needs completion)
- ⏳ Table update needed

**File:** `frontend/app/master/guru/page.tsx`

---

## ⏭️ SIMPLIFIED APPROACH

Untuk mempercepat, saya akan:

1. **Copy pattern dari Data Siswa** ke semua modul
2. **Update interface** sesuai backend API
3. **Update endpoint** paths
4. **Adjust form fields** per modul

---

## 📝 FAST TRACK TEMPLATE

Untuk setiap modul Master Data:

### Step 1: Update Imports
```typescript
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import apiClient from '@/lib/api-client';
```

### Step 2: Define Interface (from Prisma schema)
```typescript
interface YourModel {
  id: string;
  // fields from Prisma
}
```

### Step 3: API Integration
```typescript
const fetchData = async () => {
  const response = await apiClient.get<YourModel[]>('/api/your-endpoint');
  if (response.success && response.data) {
    setItems(response.data);
  }
};
```

### Step 4: CRUD Handlers
```typescript
// Create/Update
const handleSubmit = async (e: React.FormEvent) => {
  if (editingId) {
    await apiClient.put(`/api/endpoint/${editingId}`, formData);
  } else {
    await apiClient.post('/api/endpoint', formData);
  }
};

// Delete
const handleDelete = async (id: string) => {
  await apiClient.delete(`/api/endpoint/${id}`);
};
```

---

## 🎯 REMAINING MODULES

### Data Kelas
**Endpoint:** `/api/kelas`
**Key Fields:**
- nama (string)
- tingkat (string)
- kapasitas (number)
- waliKelasId (string)

### Mata Pelajaran
**Endpoint:** `/api/mata-pelajaran`
**Key Fields:**
- kode (string)
- nama (string)
- kelompok (string)
- jumlahJam (number)

### Tahun Ajaran
**Endpoint:** `/api/tahun-ajaran`
**Key Fields:**
- nama (string)
- tanggalMulai (date)
- tanggalSelesai (date)
- aktif (boolean)

### Profil Sekolah
**Endpoint:** `/api/profil-sekolah`
**Key Fields:**
- nama (string)
- npsn (string)
- alamat (string)
- telepon (string)
- email (string)

---

## 💡 SMART STRATEGY

Instead of manually updating each file, I can:

1. **Generate complete files** for each module
2. **Use proven pattern** from Data Siswa
3. **Batch create** all remaining modules
4. **Test together** after all done

---

## ⚡ EXECUTION PLAN

**Option A: Manual (Slow but Safe)**
- Update each file step by step
- Test after each module
- Time: 6-8 hours

**Option B: Batch Generate (Fast)**
- Create all 5 modules at once
- Use template approach
- Test all together
- Time: 2-3 hours

**Recommendation:** **Option B** - Batch Generate

---

## 🔥 NEXT ACTIONS

**IMMEDIATE:**
1. Create complete Data Guru page
2. Create complete Data Kelas page
3. Create complete Mata Pelajaran page
4. Create complete Tahun Ajaran page
5. Create complete Profil Sekolah page

**THEN:**
1. Test all modules together
2. Fix any bugs found
3. Document any issues
4. Mark phase 1 complete

---

## 📊 TIME ESTIMATE

| Module | Complexity | Time (Batch) |
|--------|------------|--------------|
| Data Guru | Medium | 30 min |
| Data Kelas | Medium | 30 min |
| Mata Pelajaran | Low | 20 min |
| Tahun Ajaran | Low | 20 min |
| Profil Sekolah | Low | 20 min |
| **TOTAL** | | **~2 hours** |

Plus testing: +1 hour
**Grand Total:** ~3 hours

---

## ✅ APPROVAL NEEDED

Should I proceed with **Batch Generate** approach?

**YES** → I'll create all 5 modules in one go  
**NO** → I'll continue manual step-by-step  

---

**Status:** Awaiting decision...

