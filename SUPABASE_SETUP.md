# Setup Supabase Database 🚀
## Sistem Informasi Sekolah

Supabase adalah alternatif terbaik untuk MySQL lokal - gratis, cloud-based, dan mudah setup!

---

## Langkah 1: Buat Akun Supabase

1. **Buka:** https://supabase.com
2. **Click:** "Start your project"
3. **Sign up dengan:**
   - GitHub account (recommended), atau
   - Email

---

## Langkah 2: Buat Project Baru

1. **Setelah login**, click "New Project"

2. **Isi form:**
   - **Name:** `app-sekolah` atau `sistem-informasi-sekolah`
   - **Database Password:** Buat password yang kuat (SIMPAN INI!)
     - Contoh: `SekolahDB2026!`
     - ⚠️ **PENTING:** Simpan password ini, akan dipakai nanti
   - **Region:** Singapore (terdekat dari Indonesia)
   - **Pricing Plan:** Free (sudah cukup untuk development)

3. **Click:** "Create new project"

4. **Tunggu ~2 menit** sampai project selesai dibuat

---

## Langkah 3: Dapatkan Connection String

1. **Setelah project ready**, klik **"Connect"** button (pojok kanan atas)

2. **Pilih:** "Connection String" → **"Connection pooling"**

3. **Copy Connection String** yang format nya seperti ini:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

4. **ATAU** bisa juga ambil dari:
   - Settings → Database → Connection string → URI (Transaction)
   - Format:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres
   ```

**⚠️ PENTING:** Ganti `[YOUR-PASSWORD]` dengan password yang tadi dibuat di Langkah 2!

---

## Langkah 4: Update .env File

1. **Buka file:** `d:\APP\app_sekolah\frontend\.env`

2. **Ganti DATABASE_URL** dari MySQL ke PostgreSQL:

   **SEBELUM (MySQL):**
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/db_sekolah"
   ```

   **SESUDAH (Supabase PostgreSQL):**
   ```env
   DATABASE_URL="postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   ```

   **Contoh lengkap:**
   ```env
   DATABASE_URL="postgresql://postgres.abcdefghijk:SekolahDB2026!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   NEXTAUTH_SECRET="your-secret-key-change-in-production"
   ```

3. **Save file**

---

## Langkah 5: Update Prisma Schema untuk PostgreSQL

Prisma schema kita perlu diubah sedikit untuk PostgreSQL:

**Buka:** `d:\APP\app_sekolah\frontend\prisma\schema.prisma`

**Ubah bagian `datasource`:**

**SEBELUM:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

**SESUDAH:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**Tambahkan juga di `.env`:**
```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

---

## Langkah 6: Run Prisma Migrations

```bash
cd d:\APP\app_sekolah

# Generate Prisma Client untuk PostgreSQL
npm run prisma:generate

# Run migrations (buat semua tabel)
npm run prisma:migrate
```

**Ketika diminta nama migration, ketik:** `init_supabase`

**Expected output:**
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
```

---

## Langkah 7: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

---

## Langkah 8: Verifikasi Database

### Cara 1: Menggunakan Supabase Dashboard

1. Buka Supabase dashboard
2. Klik project kamu
3. Klik **"Table Editor"** di sidebar
4. Kamu akan melihat semua tabel yang dibuat:
   - users
   - siswa
   - guru
   - kelas
   - mata_pelajaran
   - tahun_ajaran
   - profil_sekolah
   - dll (16 tabel total)

### Cara 2: Menggunakan Prisma Studio

```bash
npm run prisma:studio
```

Buka: http://localhost:5555

---

## 🎉 Testing

### Test 1: Register User Pertama

Open browser console (F12) di http://localhost:3000:

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

**Expected result:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid...",
    "username": "admin",
    "email": "admin@sekolah.com",
    "role": "ADMIN"
  }
}
```

### Test 2: Login

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

### Test 3: Check Supabase Table Editor

1. Buka Supabase → Table Editor → users
2. Kamu akan melihat user "admin" yang baru dibuat

---

## ✅ Checklist Setup Supabase

- [ ] Akun Supabase dibuat
- [ ] Project Supabase dibuat
- [ ] Connection string di-copy
- [ ] File `.env` diupdate dengan PostgreSQL URL
- [ ] Prisma schema diubah ke `provider = "postgresql"`
- [ ] `npm run prisma:generate` berhasil
- [ ] `npm run prisma:migrate` berhasil
- [ ] `npm run dev` berjalan tanpa error
- [ ] http://localhost:3000 terbuka
- [ ] Test register user berhasil
- [ ] Data terlihat di Supabase Table Editor

---

## 🔧 Troubleshooting

### Error: "Can't reach database server"

**Cause:** Connection string salah atau password salah

**Fix:**
1. Copy ulang connection string dari Supabase
2. Pastikan password di URL sudah benar
3. Cek tidak ada spasi extra di `.env`

### Error: "SSL connection required"

**Cause:** Butuh SSL untuk Supabase

**Fix:** Tambahkan `?sslmode=require` di akhir DATABASE_URL:
```env
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1&sslmode=require"
```

### Error: "P1001: Can't reach database"

**Cause:** Internet atau Supabase down

**Fix:**
1. Cek koneksi internet
2. Cek status Supabase: https://status.supabase.com
3. Tunggu beberapa menit

### Migration Failed

**Fix:**
1. Delete folder: `frontend/prisma/migrations/`
2. Run lagi: `npm run prisma:migrate`

---

## 📊 Supabase Free Tier Limits

✅ **Yang Included (Free):**
- 500 MB Database storage
- 1 GB File storage
- 2 GB Bandwidth
- 50,000 Monthly Active Users
- Unlimited API requests
- Social OAuth providers
- 7-day log retention

**Untuk development ini sudah LEBIH DARI CUKUP!** 🎉

---

## 💡 Tips Supabase

1. **Backup data:** Supabase auto-backup, tapi export manual juga bagus
2. **Monitor usage:** Dashboard → Settings → Usage
3. **View logs:** Dashboard → Logs
4. **SQL Editor:** Untuk run custom queries
5. **API docs:** Auto-generated REST & GraphQL APIs

---

## 🎯 Keuntungan Supabase vs MySQL Lokal

| Feature | Supabase | MySQL Lokal |
|---------|----------|-------------|
| Setup | ⚡ 5 menit | 🐌 30+ menit |
| Install | ✅ Tidak perlu | ❌ Harus install |
| Access dari mana saja | ✅ Ya | ❌ Tidak |
| Backup otomatis | ✅ Ya | ❌ Manual |
| SSL/Security | ✅ Built-in | ⚠️ Manual setup |
| Dashboard GUI | ✅ Modern | ⚠️ phpMyAdmin |
| Free tier | ✅ Generous | ❌ N/A |
| Production ready | ✅ Ya | ⚠️ Perlu config |

---

## 🚀 Next Steps

Setelah Supabase setup:

1. **Buat data awal:**
   - Admin user (via API)
   - Profil sekolah
   - Tahun ajaran aktif

2. **Test semua API endpoints:**
   - Siswa CRUD
   - Guru CRUD
   - Kelas CRUD
   - dll

3. **Connect frontend:**
   - Update pages to use real APIs
   - Add authentication flow

---

## 📞 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Prisma + Supabase:** https://www.prisma.io/docs/guides/database/supabase
- **Discord:** Supabase community

---

**You're all set with Supabase! 🎉**

Cloud database, no installation, ready to code!
