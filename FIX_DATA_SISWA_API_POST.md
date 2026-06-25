# Fix Data Siswa API POST - Error 422 Unprocessable Entity ✅

**Date:** 2026-06-23  
**Status:** ✅ FIXED

## Problem

User melaporkan error **422 Unprocessable Entity** dengan pesan "Validation failed" saat mencoba menambah data siswa baru melalui form.

### Error Details:
```
POST http://localhost:3001/api/siswa
Status Code: 422 (Unprocessable Entity)
Message: Validation failed
```

## Root Cause Analysis

Setelah investigasi, ditemukan **2 masalah utama**:

### 1. **Mismatch Enum `jenisKelamin`**

**Frontend menggunakan:**
```typescript
jenisKelamin: 'LAKI_LAKI' | 'PEREMPUAN'
```

**Backend/Database mengharapkan:**
```typescript
jenisKelamin: 'L' | 'P'
```

**Prisma Schema:**
```prisma
enum JenisKelamin {
  L
  P
}
```

### 2. **Missing Required Fields: `username` & `password`**

API `/api/siswa` POST endpoint **memerlukan** field `username` dan `password` untuk membuat akun user siswa, tetapi form frontend tidak mengirimkan field tersebut.

**API Validation Schema (Zod):**
```typescript
const siswaSchema = z.object({
  // ... other fields
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
```

## Solution Implemented

### 1. **Fixed `jenisKelamin` Enum Values**

#### a) Updated TypeScript Interfaces:

**File:** `frontend/app/master/siswa/page.tsx`

```typescript
// BEFORE (Wrong)
interface Student {
  jenisKelamin: 'LAKI_LAKI' | 'PEREMPUAN';
}

interface FormData {
  jenisKelamin: 'LAKI_LAKI' | 'PEREMPUAN';
}

// AFTER (Correct)
interface Student {
  jenisKelamin: 'L' | 'P';
}

interface FormData {
  jenisKelamin: 'L' | 'P';
  username: string;  // Added
  password: string;  // Added
}
```

#### b) Updated Default Values:

```typescript
// BEFORE
const [formData, setFormData] = useState<FormData>({
  jenisKelamin: 'LAKI_LAKI',
  // ...
});

// AFTER
const [formData, setFormData] = useState<FormData>({
  jenisKelamin: 'L',
  username: '',
  password: '',
  // ...
});
```

#### c) Updated Form Select Options:

```typescript
// BEFORE
<option value="LAKI_LAKI">Laki-laki</option>
<option value="PEREMPUAN">Perempuan</option>

// AFTER
<option value="L">Laki-laki</option>
<option value="P">Perempuan</option>
```

#### d) Updated Display Logic:

```typescript
// BEFORE
student.jenisKelamin === 'LAKI_LAKI'

// AFTER
student.jenisKelamin === 'L'
```

### 2. **Added Username & Password Fields**

#### a) Added to FormData interface (already shown above)

#### b) Added Form Section for Account Credentials:

```typescript
{/* Row 9: Data Akun (only for new student) */}
{!editingId && (
  <>
    <div className="border-t pt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Data Akun Siswa
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required={!editingId}
            minLength={3}
            placeholder="Minimal 3 karakter"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!editingId}
            minLength={6}
            placeholder="Minimal 6 karakter"
          />
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Username dan password akan digunakan siswa untuk login ke sistem.
      </p>
    </div>
  </>
)}
```

#### c) Updated `handleOpenModal` Function:

```typescript
// For new student
setFormData({
  // ... other fields
  username: '',
  password: '',
});

// For edit student (password not shown for security)
setFormData({
  // ... other fields from existing student
  username: '',  // Empty, not editable
  password: '',  // Empty, not editable
});
```

## Key Design Decisions

### 1. **Username/Password Only on Create**

Username dan password fields **hanya ditampilkan saat menambah siswa baru** (`!editingId`), tidak pada saat edit. 

**Alasan:**
- Security: Tidak menampilkan password yang sudah di-hash
- User Experience: Perubahan password sebaiknya dilakukan melalui fitur "Reset Password" terpisah
- Data Consistency: Username tidak boleh diubah setelah akun dibuat

### 2. **Enum `L` dan `P` vs `LAKI_LAKI` dan `PEREMPUAN`**

Menggunakan `'L'` dan `'P'` sesuai dengan **Prisma schema** dan **database design**.

**Keuntungan:**
- Database efficiency (hanya 1 karakter vs 10 karakter)
- Consistency dengan API dan backend
- Menghindari validation errors

**Display di UI:**
- Tetap menampilkan "Laki-laki" dan "Perempuan" ke user
- Hanya nilai internal yang menggunakan `'L'` / `'P'`

## Testing Steps

1. **Buka halaman Data Siswa**: `http://localhost:3001/master/siswa`
2. **Klik "Tambah Siswa"**
3. **Isi form dengan data lengkap**, termasuk:
   - NIS: 2024001
   - NISN: 0123456789
   - Nama: Test Siswa
   - Jenis Kelamin: Laki-laki (akan mengirim 'L')
   - **Username**: testsiswa (minimal 3 karakter)
   - **Password**: test123456 (minimal 6 karakter)
4. **Klik "Simpan"**
5. **Verifikasi**:
   - Request berhasil (Status 201 Created)
   - Data muncul di tabel
   - User account ter-create di database

## Expected API Request Body

```json
{
  "nis": "2024001",
  "nisn": "0123456789",
  "nama": "Test Siswa",
  "jenisKelamin": "L",
  "tempatLahir": "Jakarta",
  "tanggalLahir": "2010-01-15",
  "agama": "Islam",
  "alamat": "Jl. Test No. 123",
  "noHp": "08123456789",
  "email": "test@email.com",
  "namaOrangTua": "Orang Tua Test",
  "noHpOrangTua": "08198765432",
  "tahunMasuk": "2024",
  "status": "AKTIF",
  "username": "testsiswa",
  "password": "test123456"
}
```

## Expected API Response

```json
{
  "success": true,
  "message": "Siswa created successfully",
  "data": {
    "id": "uuid",
    "nis": "2024001",
    "nisn": "0123456789",
    "nama": "Test Siswa",
    "jenisKelamin": "L",
    "user": {
      "id": "uuid",
      "username": "testsiswa",
      "email": "test@email.com"
    }
  }
}
```

## Build Status

```bash
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (28/28)
✓ Finalizing page optimization
```

**All 28 routes built successfully!**

## Files Modified

1. **`frontend/app/master/siswa/page.tsx`**
   - Updated `Student` interface: `jenisKelamin: 'L' | 'P'`
   - Updated `FormData` interface: Added `username` and `password`
   - Updated default state values
   - Updated `handleOpenModal` function
   - Added username/password form fields (only for create)
   - Fixed display logic for jenisKelamin
   - Fixed select options values

## Database Behavior

Saat POST `/api/siswa`, backend akan:

1. **Validate** semua fields dengan Zod schema
2. **Check duplicate** NIS dan NISN
3. **Hash password** menggunakan bcryptjs
4. **Create transaction** (atomic):
   - Create `User` record dengan role `SISWA`
   - Create `Siswa` record dengan `userId` foreign key
5. **Return** siswa data dengan user info

## Security Notes

- ✅ Password di-hash sebelum disimpan ke database (bcryptjs)
- ✅ Password tidak pernah ditampilkan di form edit
- ✅ Username validation: minimal 3 karakter
- ✅ Password validation: minimal 6 karakter
- ✅ Email validation: format email valid (opsional)

## Related Issues Fixed

Issue yang sama juga ada di Data Guru page, tetapi sudah diperbaiki sebelumnya. Pola yang sama telah diterapkan konsisten.

---

**Fix Complete:** Data Siswa POST API sekarang berfungsi dengan baik. User dapat menambahkan siswa baru beserta akun login-nya.

## Next Steps

Jika ada error serupa di module lain, gunakan checklist ini:
1. ✅ Pastikan enum values match dengan Prisma schema
2. ✅ Pastikan semua required fields dari API Zod schema terkirim
3. ✅ Cek console Network tab untuk melihat request body
4. ✅ Cek response error untuk detail validation yang gagal
