# 🔧 CARA PALING MUDAH - Setup Connection String

## ❌ Error Anda:
```
FATAL: tenant/user postgres.[YOUR-PROJECT-REF] not found
```

**Artinya:** File `.env` masih pakai placeholder, belum diisi dengan data asli Supabase!

---

## ✅ SOLUSI - 3 Cara Mudah:

---

## 🎯 **CARA 1: Copy-Paste Langsung (PALING MUDAH)**

### **Langkah:**

1. **Buka Supabase Dashboard di browser:**
   ```
   https://app.supabase.com
   ```

2. **Login dan pilih project Anda**

3. **Klik "Connect" (pojok kanan atas)**

4. **Pilih "Connection String"**

5. **Anda akan lihat string seperti ini:**
   ```
   postgres://postgres.abcxyz123:p@ssw0rd@db.abcxyz123.supabase.co:5432/postgres
   ```
   
   ATAU seperti ini:
   ```
   postgresql://postgres.abcxyz123:p@ssw0rd@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

6. **COPY SEMUA string tersebut!**

7. **Buka file: `d:\APP\app_sekolah\frontend\.env`**

8. **GANTI BARIS INI:**
   ```env
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   ```

   **DENGAN string yang Anda copy tadi, TAMBAH `?pgbouncer=true` di akhir:**
   ```env
   DATABASE_URL="postgresql://postgres.abcxyz123:p@ssw0rd@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

9. **UNTUK DIRECT_URL, gunakan Transaction connection:**
   
   Di Supabase, pilih tab **"Transaction"** atau **"Direct connection"**, copy lalu paste:
   ```env
   DIRECT_URL="postgresql://postgres.abcxyz123:p@ssw0rd@db.abcxyz123.supabase.co:5432/postgres"
   ```

10. **Save file (Ctrl + S)**

---

## 🎯 **CARA 2: Isi Manual (Step by Step)**

Anda perlu 3 informasi dari Supabase:

### **A. PROJECT REF (contoh: `abcxyz123`)**

Di Supabase Dashboard → Settings → General → Project Settings
Cari **"Reference ID"**

Atau lihat di URL browser:
```
https://app.supabase.com/project/abcxyz123/...
                                 ^^^^^^^^^ ini project ref
```

### **B. PASSWORD**

Password yang Anda buat saat create project Supabase.
Jika lupa, bisa reset di: Settings → Database → Reset Database Password

### **C. REGION (contoh: `aws-0-ap-southeast-1`)**

Di Supabase Dashboard, cek region project Anda:
- Singapore → `aws-0-ap-southeast-1`
- US East → `aws-0-us-east-1`
- dll

### **Lalu Edit `.env`:**

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"
```

**Contoh nyata:**
```env
DATABASE_URL="postgresql://postgres.abcxyz123:MyPass123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres.abcxyz123:MyPass123@db.abcxyz123.supabase.co:5432/postgres"
```

---

## 🎯 **CARA 3: Kirim Info, Saya Buatkan**

Kalau masih bingung, **screenshot atau tulis:**

1. **Project Reference ID** (dari Settings → General)
2. **Database Password** (yang Anda buat)
3. **Region** (Singapore/US/dll)

**Format:**
```
Project Ref: abcxyz123
Password: MySecretPass123
Region: Singapore (ap-southeast-1)
```

Saya akan buatkan connection string yang benar untuk Anda!

---

## 📸 **Screenshot Yang Membantu:**

Ambil screenshot dari Supabase:

1. **Dashboard → Connect → Connection String**
2. **Settings → Database → Connection info**

---

## ✅ **Cara Test Setelah Edit:**

```bash
cd d:\APP\app_sekolah\frontend
npx prisma db pull
```

**Kalau berhasil:**
```
✔ Introspected ... models
```

**Kalau masih error:**
```
FATAL: tenant/user postgres.[YOUR-PROJECT-REF] not found
```
→ Artinya masih ada `[YOUR-PROJECT-REF]` yang belum diganti!

---

## 🔍 **Common Mistakes:**

❌ **SALAH:**
```env
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:..."
                                   ^^^^^^^^^^^^^^^^^^
                                   Masih ada bracket!
```

✅ **BENAR:**
```env
DATABASE_URL="postgresql://postgres.abcxyz123:..."
                                   ^^^^^^^^^
                                   Tanpa bracket!
```

---

## 💡 **Tips:**

- Connection string JANGAN ada spasi
- Password jangan ada karakter special seperti `@`, `#` (atau harus di-encode)
- Copy paste full string dari Supabase, jangan ketik manual
- Pastikan tidak ada line break di tengah string

---

## 🆘 **Masih Error?**

**Copy-paste ini dan kirim ke saya:**

1. Isi file `.env` Anda (sensor password bagian tengahnya saja)
2. Screenshot Supabase Dashboard → Connect → Connection String
3. Error message lengkap

Saya akan bantu fix langsung!

---

**TL;DR:**
1. Buka Supabase → Connect → Copy connection string
2. Buka `frontend\.env` → Paste di `DATABASE_URL=`
3. Save file
4. Test: `npx prisma db pull`

**File location:** `d:\APP\app_sekolah\frontend\.env` ← Edit file ini!
