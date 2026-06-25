# Backend Setup Complete ✅
## Sistem Informasi Sekolah

**Date:** 23 Juni 2026  
**Status:** Master Data APIs Complete

---

## 🎉 What's Been Built

### 1. Database Schema (Prisma) ✅
**File:** `frontend/prisma/schema.prisma`

**16 Models Created:**
- User (Authentication)
- ProfilSekolah
- TahunAjaran
- Semester
- Jurusan
- MataPelajaran
- Kelas
- Guru
- Siswa
- OrangTua
- JadwalPelajaran
- Absensi
- AbsensiGuru
- Nilai
- Rapor

**Features:**
- Complete relationships (Foreign Keys)
- Enums for strict types
- Proper indexes for performance
- Cascade delete handling
- Timestamps (createdAt, updatedAt)

### 2. Helper Libraries ✅

**a) `lib/prisma.ts`**
- Prisma client singleton
- Prevents multiple instances in dev mode
- Global connection management

**b) `lib/auth.ts`**
- Password hashing (bcryptjs)
- JWT generation and verification (jose)
- Cookie management (httpOnly, secure)
- Token expiry: 7 days
- getCurrentUser utility

**c) `lib/api-response.ts`**
- Consistent API response format
- Success/Error helpers
- HTTP status code handlers
- Validation error formatting

**d) `lib/middleware.ts`**
- requireAuth middleware
- hasRole authorization check
- withAuth wrapper
- withAuthAndRole wrapper

### 3. Authentication APIs ✅

**Created 4 endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with JWT |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout and clear cookie |
| POST | `/api/auth/register` | Register new user |

**Features:**
- JWT token in httpOnly cookie
- Password hashing
- Role-based user data
- Input validation with Zod
- Error handling

### 4. Master Data APIs ✅

#### a) Siswa (Students) - 5 endpoints
- `GET /api/siswa` - List with pagination/search/filter
- `GET /api/siswa/[id]` - Get single with relations
- `POST /api/siswa` - Create with user account
- `PUT /api/siswa/[id]` - Update siswa and user
- `DELETE /api/siswa/[id]` - Delete with user cascade

#### b) Guru (Teachers) - 5 endpoints
- `GET /api/guru` - List with pagination/search
- `GET /api/guru/[id]` - Get single with jadwal
- `POST /api/guru` - Create with user account
- `PUT /api/guru/[id]` - Update guru and user
- `DELETE /api/guru/[id]` - Delete with user cascade

#### c) Kelas (Classes) - 5 endpoints
- `GET /api/kelas` - List with filters
- `GET /api/kelas/[id]` - Get with siswa list
- `POST /api/kelas` - Create kelas
- `PUT /api/kelas/[id]` - Update kelas
- `DELETE /api/kelas/[id]` - Delete (if no students)

#### d) Mata Pelajaran (Subjects) - 5 endpoints
- `GET /api/mata-pelajaran` - List with filters
- `GET /api/mata-pelajaran/[id]` - Get single
- `POST /api/mata-pelajaran` - Create mapel
- `PUT /api/mata-pelajaran/[id]` - Update mapel
- `DELETE /api/mata-pelajaran/[id]` - Delete (if no jadwal/nilai)

#### e) Tahun Ajaran (Academic Year) - 5 endpoints
- `GET /api/tahun-ajaran` - List all
- `GET /api/tahun-ajaran/[id]` - Get with semester
- `POST /api/tahun-ajaran` - Create (auto-deactivate others if AKTIF)
- `PUT /api/tahun-ajaran/[id]` - Update (can't if locked)
- `DELETE /api/tahun-ajaran/[id]` - Delete (if no related data)

#### f) Profil Sekolah (School Profile) - 3 endpoints
- `GET /api/profil-sekolah` - Get (public)
- `POST /api/profil-sekolah` - Create (only once)
- `PUT /api/profil-sekolah` - Update

**Total Master Data Endpoints:** 28 (22 files)

---

## 📊 Statistics

| Category | Count |
|----------|-------|
| Database Models | 16 |
| API Routes | 22 files |
| Total Endpoints | 28 |
| Helper Libraries | 4 |
| Validation Schemas | 12+ |
| Lines of Code | ~3,500+ |

---

## 🔐 Security Features

✅ Password hashing with bcrypt (10 rounds)  
✅ JWT tokens in httpOnly cookies  
✅ Role-based access control (RBAC)  
✅ Input validation with Zod  
✅ SQL injection protection (Prisma ORM)  
✅ Token expiry (7 days)  
✅ Secure cookie settings (httpOnly, sameSite, secure in production)

---

## 🚀 How to Use

### 1. Setup Database

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE db_sekolah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Environment

Edit `frontend/.env`:
```env
DATABASE_URL="mysql://root:@localhost:3306/db_sekolah"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

### 3. Run Migrations

```bash
cd frontend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Test APIs

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  -c cookies.txt
```

**Get Siswa List:**
```bash
curl -X GET "http://localhost:3000/api/siswa?page=1&limit=10" \
  -b cookies.txt
```

---

## 📋 API Features by Endpoint

### Common Features (All CRUD APIs)
- ✅ Pagination support (page, limit)
- ✅ Search functionality
- ✅ Filters (status, kategori, etc)
- ✅ Input validation with Zod
- ✅ Duplicate detection
- ✅ Relationship handling
- ✅ Transaction support
- ✅ Error handling
- ✅ Role-based authorization

### Siswa API Features
- Search by NIS/NISN/Nama
- Filter by Kelas/Status
- Include Kelas, Jurusan, OrangTua relations
- Create User account automatically
- Update User credentials
- Delete cascade (User + Siswa)

### Guru API Features
- Search by NIP/Nama/Mata Pelajaran
- Filter by Status
- Include Kelas Wali, Jadwal relations
- Support 3 roles (GURU, WALI_KELAS, KEPALA_SEKOLAH)
- Create User account automatically
- Delete cascade (User + Guru)

### Kelas API Features
- Filter by Tahun Ajaran, Tingkat
- Include Siswa count
- Include Jurusan, Wali Kelas, Tahun Ajaran
- Unique constraint per tahun ajaran
- Prevent delete if has students

### Mata Pelajaran API Features
- Filter by Kelompok (UMUM, PRODUKTIF, MUATAN_LOKAL)
- Include Jurusan relation
- Count Jadwal and Nilai
- Prevent delete if used in Jadwal/Nilai

### Tahun Ajaran API Features
- Auto-deactivate other AKTIF when creating new AKTIF
- Lock/Unlock mechanism
- Include Semester, Kelas count
- Prevent delete if locked or has data

### Profil Sekolah API Features
- Only 1 record allowed (singleton)
- Public GET access (no auth required)
- Complete school information
- Logo and letterhead path support

---

## 🎯 What's Next

### Still Need to Build:

#### 1. Academic APIs (Priority High)
- [ ] `/api/jadwal` - Jadwal Pelajaran CRUD
  - Create schedule with conflict detection
  - Filter by class/day/guru
  - Validation for time slots
  
- [ ] `/api/absensi` - Absensi Siswa CRUD
  - Daily attendance recording
  - Statistics (Hadir, Izin, Sakit, Alpha, Terlambat)
  - Filter by date/class
  - Bulk input support
  
- [ ] `/api/absensi-guru` - Absensi Guru CRUD
  - Teacher attendance
  - Monthly reports
  
- [ ] `/api/nilai` - Nilai CRUD
  - Input grades (Tugas, UTS, UAS)
  - Auto-calculate final grade
  - Grade report generation
  
- [ ] `/api/rapor` - Rapor Generation
  - Generate student report card
  - Include all grades
  - Attendance summary
  - PDF export

#### 2. Additional Master Data
- [ ] `/api/jurusan` - Jurusan CRUD
- [ ] `/api/semester` - Semester CRUD
- [ ] `/api/orang-tua` - Orang Tua CRUD

#### 3. Additional Features
- [ ] File upload (images, documents)
- [ ] Export to Excel
- [ ] Export to PDF
- [ ] Dashboard statistics API
- [ ] Notifications API

#### 4. Frontend Integration
- [ ] Create API client service
- [ ] Update all pages to use real APIs
- [ ] Implement authentication flow
- [ ] Add form validation
- [ ] Handle loading and error states
- [ ] Implement file upload UI

---

## 📝 Notes

### Transaction Usage
All create/update operations that involve multiple tables use Prisma transactions:
- Creating Siswa → creates User first, then Siswa
- Creating Guru → creates User first, then Guru
- Deleting Siswa → deletes Siswa first, then User
- Updating with User credentials → updates both in transaction

### Validation Strategy
- Client-side: Will be added in frontend
- Server-side: Zod schema validation
- Database: Unique constraints, foreign keys
- Business logic: Custom validation in route handlers

### Authorization Strategy
- Endpoint level: withAuthAndRole middleware
- Field level: Not implemented yet (future enhancement)
- Resource level: Owner check (e.g., siswa can only view own data)

---

## 🐛 Known Limitations

1. **No file upload yet** - photos, documents need file upload API
2. **No email sending** - password reset, notifications need email service
3. **No real-time** - consider WebSocket for real-time notifications
4. **No audit log** - consider adding audit trail for sensitive operations
5. **No rate limiting** - consider adding rate limiting middleware
6. **No API documentation** - consider adding Swagger/OpenAPI docs
7. **No unit tests** - add tests for critical business logic
8. **No seed data** - add seed file for initial data

---

## 📚 References

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma ORM](https://www.prisma.io/docs)
- [Zod Validation](https://zod.dev/)
- [Jose JWT](https://github.com/panva/jose)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

## ✅ Checklist for Deployment

Before deploying to production:

- [ ] Change NEXTAUTH_SECRET to strong random key
- [ ] Use production database (not localhost)
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Enable CORS properly
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Add error monitoring (Sentry)
- [ ] Add database backups
- [ ] Add health check endpoint
- [ ] Review and test all security measures

---

**Status:** Master Data Backend COMPLETE ✅  
**Next Task:** Build Academic APIs (Jadwal, Absensi, Nilai, Rapor)  
**Documentation:** See `BACKEND_API_DOCUMENTATION.md` for full API reference

---

**Created by:** Kiro AI Assistant  
**Date:** 2026-06-23
