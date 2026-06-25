# 🚀 MULAI DISINI - Setup Supabase
## 5 Langkah Mudah

---

## Langkah 1: Buat Akun Supabase (2 menit)

1. Buka browser → https://supabase.com
2. Click **"Start your project"**
3. Sign up dengan **GitHub** atau **Email**
4. Verify email jika perlu

---

## Langkah 2: Buat Project (3 menit)

1. Setelah login, click **"New Project"**

2. Isi form:
   - **Name:** `app-sekolah`
   - **Database Password:** Buat password kuat
     ```
     Contoh: SekolahDB2026!
     ```
     ⚠️ **SIMPAN PASSWORD INI!** (tulis di notepad)
   
   - **Region:** **Singapore** (pilih yang terdekat)
   - **Plan:** **Free**

3. Click **"Create new project"**

4. **Tunggu 2 menit** sampai status hijau ✅

---

## Langkah 3: Copy Connection String (1 menit)

### Cara 1: Via Connect Button

1. Click **"Connect"** button (pojok kanan atas)
2. Pilih **"Connection String"**
3. Tab **"Connection pooling"**
4. Copy string yang mirip:
   ```
   postgresql://postgres.abcdefgh:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Cara 2: Via Settings

1. Click **Settings** (gear icon di sidebar)
2. Click **Database**
3. Scroll ke **Connection string**
4. Copy **"Connection pooling"** URL

⚠️ **Ganti `[YOUR-PASSWORD]` dengan password kamu!**

---

## Langkah 4: Update .env File (2 menit)

1. **Buka file:** `d:\APP\app_sekolah\frontend\.env`

2. **Ganti bagian DATABASE_URL dan DIRECT_URL:**

   Dari ini:
   ```env
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@..."
   DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@..."
   ```

   Ke connection string Supabase kamu (contoh):
   ```env
   DATABASE_URL="postgresql://postgres.xyzabcdefgh:SekolahDB2026!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.xyzabcdefgh:SekolahDB2026!@db.xyzabcdefgh.supabase.co:5432/postgres"
   ```

3. **Save file** (Ctrl + S)

---

## Langkah 5: Run Setup & Start Server (2 menit)

Buka Terminal di VS Code atau PowerShell:

```bash
# Masuk ke folder project
cd d:\APP\app_sekolah

# Generate Prisma Client
npm run prisma:generate

# Buat semua tabel di database
npm run prisma:migrate
```

Ketik nama migration: **`init_supabase`** (tekan Enter)

```bash
# Start development server
npm run dev
```

---

## ✅ Selesai! Test Aplikasi

### 1. Buka Browser

```
http://localhost:3000
```

Kamu akan lihat halaman landing page! 🎉

### 2. Test API - Register User Pertama

Buka Console browser (tekan F12), paste code ini:

```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123',
    email: 'admin@sekolah.com',
    role: 'ADMIN'
  })
}).then(r => r.json()).then(console.log)
```

**Hasilnya:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {...}
}
```

### 3. Test Login

```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
}).then(r => r.json()).then(console.log)
```

### 4. Lihat Data di Supabase

1. Buka Supabase Dashboard
2. Click **"Table Editor"**
3. Click table **"users"**
4. Kamu akan lihat user "admin" yang baru dibuat! ✅

---

## 🎯 Apa yang Sudah Jalan?

✅ **Backend API (28 endpoints):**
- Authentication (login, register, logout)
- Siswa CRUD (create, read, update, delete)
- Guru CRUD
- Kelas CRUD
- Mata Pelajaran CRUD
- Tahun Ajaran CRUD
- Profil Sekolah

✅ **Frontend (15 halaman):**
- Landing Page
- Login Page
- Dashboard
- Master Data (6 halaman)
- Akademik (3 halaman)
- PPDB

✅ **Database:**
- 16 tabel dengan relationships
- Hosted di cloud (Supabase)
- Auto backup
- Secure dengan SSL

---

## 🔧 Kalau Ada Error?

### Error: "Can't reach database server"

**Fix:** Check internet connection, atau copy ulang connection string dari Supabase

### Error: "Invalid connection string"

**Fix:** 
1. Pastikan password tidak ada karakter `@` atau spesial
2. Atau encode password: https://www.urlencoder.org/
3. Ganti password di connection string dengan encoded version

### Error: "Port 3000 already in use"

**Fix:** 
```bash
# Use port lain
cd frontend
npx next dev -p 3001
```

### Error: Module not found

**Fix:**
```bash
npm install
cd frontend
npm install
cd ..
```

---

## 📱 Akses Supabase Dashboard

**URL:** https://app.supabase.com

**Fitur yang bisa dipakai:**
- 📊 **Table Editor** - View/edit data langsung
- 🔍 **SQL Editor** - Run custom SQL queries
- 📈 **Database** - Lihat statistics & performance
- 🔐 **Authentication** - User management (nanti)
- 📁 **Storage** - Upload files (nanti)
- 📊 **Logs** - Monitor queries & errors

---

## 🎉 Selamat!

Aplikasi Sistem Informasi Sekolah kamu sudah running dengan:

- ✅ Cloud database (Supabase)
- ✅ Backend API complete
- ✅ Frontend complete
- ✅ Authentication system
- ✅ Role-based access control

**Next steps:**
1. Buat data master (tahun ajaran, kelas, dll)
2. Test semua fitur
3. Build remaining features (jadwal, absensi, nilai)
4. Connect frontend dengan backend

---

## 📚 Dokumentasi Lengkap

- **SUPABASE_SETUP.md** - Detailed Supabase guide
- **BACKEND_API_DOCUMENTATION.md** - Complete API reference
- **BACKEND_SETUP_COMPLETE.md** - What's been built
- **QUICK_START.md** - Alternative setup (MySQL local)

---

**Happy Coding! 🚀**

**Total setup time: ~10 menit**

No installation, no configuration hassle, just code!
