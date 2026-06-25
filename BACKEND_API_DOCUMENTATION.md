# Backend API Documentation
## Sistem Informasi Sekolah

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT (Jose)
- **Validation**: Zod
- **Password Hashing**: bcryptjs

---

## API Endpoints

### Authentication APIs

#### 1. POST /api/auth/login
Login user dan generate JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@sekolah.com",
      "role": "ADMIN",
      "guru": { ... },
      "siswa": { ... },
      "orangTua": { ... }
    },
    "token": "jwt-token"
  }
}
```

#### 2. GET /api/auth/me
Get current authenticated user data.

**Headers:**
```
Cookie: auth-token=jwt-token
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "User data retrieved successfully",
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@sekolah.com",
    "role": "ADMIN",
    ...
  }
}
```

#### 3. POST /api/auth/logout
Logout user dan hapus auth cookie.

**Response Success (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### 4. POST /api/auth/register
Register new user.

**Request Body:**
```json
{
  "email": "user@sekolah.com",
  "username": "newuser",
  "password": "password123",
  "role": "ADMIN"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "username": "newuser",
    "email": "user@sekolah.com",
    "role": "ADMIN"
  }
}
```

---

### Siswa APIs

#### 1. GET /api/siswa
List all siswa with pagination and filters.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` (search by NIS/NISN/Nama)
- `kelasId` (filter by class)
- `status` (filter by status: AKTIF, LULUS, PINDAH, KELUAR, ALUMNI)

**Authorization:** SUPERADMIN, ADMIN, KEPALA_SEKOLAH, GURU, WALI_KELAS

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "nis": "2024001",
        "nisn": "1234567890",
        "nama": "Budi Santoso",
        "jenisKelamin": "L",
        "kelas": {
          "namaKelas": "XII RPL 1",
          "jurusan": { "nama": "Rekayasa Perangkat Lunak" }
        },
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

#### 2. GET /api/siswa/[id]
Get single siswa by ID.

**Authorization:** SUPERADMIN, ADMIN, KEPALA_SEKOLAH, GURU, WALI_KELAS, SISWA, ORANG_TUA

#### 3. POST /api/siswa
Create new siswa.

**Authorization:** SUPERADMIN, ADMIN

**Request Body:**
```json
{
  "nis": "2024001",
  "nisn": "1234567890",
  "nama": "Budi Santoso",
  "jenisKelamin": "L",
  "tempatLahir": "Jakarta",
  "tanggalLahir": "2007-05-15",
  "agama": "Islam",
  "alamat": "Jl. Sudirman No. 123",
  "noHp": "081234567890",
  "email": "budi@student.com",
  "kelasId": "uuid",
  "jurusanId": "uuid",
  "tahunMasuk": "2024",
  "status": "AKTIF",
  "username": "budi2024",
  "password": "password123"
}
```

#### 4. PUT /api/siswa/[id]
Update siswa by ID.

**Authorization:** SUPERADMIN, ADMIN

#### 5. DELETE /api/siswa/[id]
Delete siswa by ID.

**Authorization:** SUPERADMIN, ADMIN

---

### Guru APIs

#### 1. GET /api/guru
List all guru with pagination and filters.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` (search by NIP/Nama/Mata Pelajaran)
- `status` (filter by status: true/false)

**Authorization:** SUPERADMIN, ADMIN, KEPALA_SEKOLAH

#### 2. GET /api/guru/[id]
Get single guru by ID.

**Authorization:** SUPERADMIN, ADMIN, KEPALA_SEKOLAH, GURU, WALI_KELAS

#### 3. POST /api/guru
Create new guru.

**Authorization:** SUPERADMIN, ADMIN

**Request Body:**
```json
{
  "nip": "198501012010011001",
  "nuptk": "1234567890123456",
  "nama": "Dr. Ahmad Dahlan",
  "jenisKelamin": "L",
  "tempatLahir": "Bandung",
  "tanggalLahir": "1985-01-01",
  "agama": "Islam",
  "alamat": "Jl. Merdeka No. 45",
  "noHp": "081234567890",
  "email": "ahmad@guru.com",
  "mataPelajaran": "Matematika",
  "jabatan": "Guru Tetap",
  "statusKepegawaian": "PNS",
  "status": true,
  "username": "ahmad_guru",
  "password": "password123",
  "role": "GURU"
}
```

#### 4. PUT /api/guru/[id]
Update guru by ID.

**Authorization:** SUPERADMIN, ADMIN

#### 5. DELETE /api/guru/[id]
Delete guru by ID.

**Authorization:** SUPERADMIN, ADMIN

---

### Kelas APIs

#### 1. GET /api/kelas
List all kelas with filters.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `search` (search by nama kelas)
- `tahunAjaranId` (filter by tahun ajaran)
- `tingkat` (filter by tingkat)

**Authorization:** SUPERADMIN, ADMIN, KEPALA_SEKOLAH, GURU, WALI_KELAS

#### 2. GET /api/kelas/[id]
Get single kelas with siswa list.

#### 3. POST /api/kelas
Create new kelas.

**Authorization:** SUPERADMIN, ADMIN

**Request Body:**
```json
{
  "namaKelas": "XII RPL 1",
  "tingkat": "12",
  "jurusanId": "uuid",
  "tahunAjaranId": "uuid",
  "waliKelasId": "uuid",
  "ruangan": "Lab Komputer 1"
}
```

#### 4. PUT /api/kelas/[id]
Update kelas by ID.

**Authorization:** SUPERADMIN, ADMIN

#### 5. DELETE /api/kelas/[id]
Delete kelas by ID (only if no students).

**Authorization:** SUPERADMIN, ADMIN

---

### Mata Pelajaran APIs

#### 1. GET /api/mata-pelajaran
List all mata pelajaran.

**Query Parameters:**
- `page`, `limit`, `search`
- `kelompok` (filter: UMUM, PRODUKTIF, MUATAN_LOKAL)

**Authorization:** SUPERADMIN, ADMIN, KEPALA_SEKOLAH, GURU, WALI_KELAS

#### 2. GET /api/mata-pelajaran/[id]
Get single mata pelajaran by ID.

#### 3. POST /api/mata-pelajaran
Create new mata pelajaran.

**Authorization:** SUPERADMIN, ADMIN

**Request Body:**
```json
{
  "kode": "MTK",
  "nama": "Matematika",
  "kelompok": "UMUM",
  "jurusanId": null,
  "jamPelajaran": 4,
  "kkm": 75,
  "deskripsi": "Mata pelajaran matematika umum"
}
```

#### 4. PUT /api/mata-pelajaran/[id]
Update mata pelajaran by ID.

**Authorization:** SUPERADMIN, ADMIN

#### 5. DELETE /api/mata-pelajaran/[id]
Delete mata pelajaran by ID (only if no jadwal/nilai).

**Authorization:** SUPERADMIN, ADMIN

---

### Tahun Ajaran APIs

#### 1. GET /api/tahun-ajaran
List all tahun ajaran.

**Query Parameters:**
- `status` (filter: AKTIF, TIDAK_AKTIF, SELESAI)

**Authorization:** SUPERADMIN, ADMIN, KEPALA_SEKOLAH, GURU, WALI_KELAS

#### 2. GET /api/tahun-ajaran/[id]
Get single tahun ajaran by ID.

#### 3. POST /api/tahun-ajaran
Create new tahun ajaran.

**Authorization:** SUPERADMIN, ADMIN

**Request Body:**
```json
{
  "tahunAjaran": "2024/2025",
  "tanggalMulai": "2024-07-15",
  "tanggalSelesai": "2025-06-30",
  "status": "AKTIF",
  "isLocked": false
}
```

**Note:** Creating AKTIF tahun ajaran will deactivate other active ones.

#### 4. PUT /api/tahun-ajaran/[id]
Update tahun ajaran by ID.

**Authorization:** SUPERADMIN, ADMIN

#### 5. DELETE /api/tahun-ajaran/[id]
Delete tahun ajaran by ID (only if not locked and no related data).

**Authorization:** SUPERADMIN only

---

### Profil Sekolah APIs

#### 1. GET /api/profil-sekolah
Get profil sekolah (public access).

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "namaSekolah": "SMK Negeri 1 Jakarta",
    "npsn": "20104001",
    "alamat": "Jl. Pendidikan No. 1",
    "kepalaSekolah": "Dr. Soekarno",
    "visi": "Menjadi sekolah unggulan...",
    "misi": "1. Meningkatkan kualitas...",
    ...
  }
}
```

#### 2. POST /api/profil-sekolah
Create profil sekolah (only once).

**Authorization:** SUPERADMIN, ADMIN

#### 3. PUT /api/profil-sekolah
Update profil sekolah.

**Authorization:** SUPERADMIN, ADMIN

**Request Body:**
```json
{
  "namaSekolah": "SMK Negeri 1 Jakarta",
  "npsn": "20104001",
  "nss": "401016001001",
  "alamat": "Jl. Pendidikan No. 1",
  "kelurahan": "Menteng",
  "kecamatan": "Menteng",
  "kota": "Jakarta Pusat",
  "provinsi": "DKI Jakarta",
  "kodePos": "10310",
  "telepon": "021-1234567",
  "email": "info@smkn1jakarta.sch.id",
  "website": "https://smkn1jakarta.sch.id",
  "kepalaSekolah": "Dr. Soekarno",
  "nipKepalaSekolah": "196008171985031015",
  "akreditasi": "A",
  "tahunBerdiri": "1965",
  "visi": "Menjadi sekolah unggulan...",
  "misi": "1. Meningkatkan kualitas..."
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error message",
  "errors": {
    "fieldName": ["Validation error message"]
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `422` - Validation Error (with detailed field errors)
- `500` - Internal Server Error

---

## Role-Based Access Control

### Roles:
1. **SUPERADMIN** - Full access to everything
2. **ADMIN** - Manage master data and users
3. **KEPALA_SEKOLAH** - View reports and statistics
4. **GURU** - Manage jadwal, absensi, nilai
5. **WALI_KELAS** - Manage class-specific data
6. **SISWA** - View own data
7. **ORANG_TUA** - View student data
8. **STAFF_KEUANGAN** - Manage financial data
9. **PETUGAS_PERPUSTAKAAN** - Manage library
10. **STAFF_INVENTARIS** - Manage inventory
11. **ADMIN_PPDB** - Manage student admission
12. **ADMIN_BKK** - Manage career center

---

## Authentication

All protected endpoints require JWT token in cookie:

```
Cookie: auth-token=<jwt-token>
```

The token is automatically set by the `/api/auth/login` endpoint and expires in 7 days.

---

## Database Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE db_sekolah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure .env

Ensure your `.env` file has:

```env
DATABASE_URL="mysql://root:@localhost:3306/db_sekolah"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

### 3. Run Prisma Migrations

```bash
cd frontend
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. (Optional) Seed Database

Create `prisma/seed.ts` to populate initial data.

---

## Testing APIs

### Using cURL:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  -c cookies.txt

# Get siswa list (with cookie)
curl -X GET "http://localhost:3000/api/siswa?page=1&limit=10" \
  -b cookies.txt
```

### Using Thunder Client / Postman:

1. POST `/api/auth/login` with username/password
2. Cookie will be auto-saved
3. Make subsequent requests with the cookie

---

## Next Steps

### To Complete Backend:

1. **Academic APIs:**
   - `/api/jadwal` - Jadwal Pelajaran CRUD
   - `/api/absensi` - Absensi Siswa CRUD with statistics
   - `/api/absensi-guru` - Absensi Guru CRUD
   - `/api/nilai` - Nilai CRUD with auto-calculation
   - `/api/rapor` - Rapor generation and PDF export

2. **Additional Features:**
   - `/api/jurusan` - Jurusan CRUD
   - `/api/semester` - Semester CRUD
   - `/api/orang-tua` - Orang Tua CRUD
   - File upload for photos and documents
   - Export to Excel/PDF
   - Dashboard statistics

3. **Frontend Integration:**
   - Update frontend pages to consume APIs
   - Implement authentication flow
   - Add form validation
   - Handle loading and error states

---

## File Structure

```
frontend/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── me/route.ts
│   │   ├── siswa/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── guru/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── kelas/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── mata-pelajaran/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── tahun-ajaran/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── profil-sekolah/
│   │       └── route.ts
│   └── ... (frontend pages)
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── api-response.ts
│   └── middleware.ts
└── prisma/
    └── schema.prisma
```

---

**Created:** 2026-06-23
**Status:** Master Data APIs Complete ✅
**Next:** Academic APIs (Jadwal, Absensi, Nilai, Rapor)
