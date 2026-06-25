# 🔗 Cara Mendapatkan Supabase Connection String

## Langkah Cepat (2 menit):

### 1. Buka Supabase Dashboard
```
https://app.supabase.com
```

### 2. Pilih Project Anda
Klik project yang sudah dibuat

### 3. Ambil Connection String

**Cara 1: Via Connect Button (Mudah)**
1. Klik tombol **"Connect"** (pojok kanan atas, icon plug/colokan)
2. Pilih **"Connection String"**
3. Tab **"Connection pooling"** (untuk DATABASE_URL)
4. Copy string yang muncul

Akan tampil seperti ini:
```
postgresql://postgres.abcdefghijk:YourPassword123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

5. Tab **"Transaction"** atau **"Session"** (untuk DIRECT_URL)
6. Copy string yang muncul

Akan tampil seperti ini:
```
postgresql://postgres.abcdefghijk:YourPassword123@db.abcdefghijk.supabase.co:5432/postgres
```

**Cara 2: Via Settings**
1. Klik **Settings** (icon gear di sidebar kiri bawah)
2. Klik **Database**
3. Scroll ke bagian **"Connection string"**
4. Pilih **"Connection pooling"** - Copy untuk DATABASE_URL
5. Pilih **"Transaction"** atau **"Direct connection"** - Copy untuk DIRECT_URL

### 4. Update File .env

Buka file: `d:\APP\app_sekolah\frontend\.env`

**Ganti baris ini:**
```env
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

**Dengan connection string Anda (contoh):**
```env
DATABASE_URL="postgresql://postgres.abcdefghijk:YourPassword123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.abcdefghijk:YourPassword123@db.abcdefghijk.supabase.co:5432/postgres"
```

⚠️ **PENTING:** 
- Ganti `[YOUR-PROJECT-REF]` dengan project ref Anda
- Ganti `[YOUR-PASSWORD]` dengan password database Anda
- Jangan ada spasi
- Simpan file (Ctrl + S)

### 5. Test Connection

Setelah update .env, test connection:

```bash
cd d:\APP\app_sekolah\frontend
npx prisma db pull
```

Jika sukses, akan muncul: "Introspected X models..."

---

## ⚠️ Troubleshooting

### "Can't reach database server"

**Solusi:**
1. Pastikan password benar
2. Pastikan tidak ada karakter special yang perlu di-encode
3. Pastikan Supabase project status "Active" (hijau)
4. Check internet connection

### Password dengan karakter special

Jika password punya karakter seperti `@`, `#`, `&`, perlu di-encode:

**Online encoder:** https://www.urlencoder.org/

Contoh:
- Password: `MyPass@123`
- Encoded: `MyPass%40123`

---

## 📝 Checklist

- [ ] Buka Supabase Dashboard
- [ ] Click "Connect" atau masuk Settings → Database
- [ ] Copy Connection Pooling string (untuk DATABASE_URL)
- [ ] Copy Transaction/Direct string (untuk DIRECT_URL)
- [ ] Update file `frontend/.env`
- [ ] Save file
- [ ] Test dengan `npx prisma db pull`

---

## ✅ Setelah Update .env

Lanjutkan dengan:

```bash
cd d:\APP\app_sekolah\frontend
npx prisma migrate dev --name init_supabase
```

Atau dari root:
```bash
cd d:\APP\app_sekolah
npm run prisma:migrate
```

---

**Need help?** Screenshot Supabase Dashboard dan kirim ke developer!
