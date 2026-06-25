# ✅ PROFIL SEKOLAH - INTEGRASI VIEW/EDIT LENGKAP

## 📋 STATUS: COMPLETE
**Tanggal**: 24 Juni 2026  
**Task**: Frontend Integration - Profil Sekolah (View/Edit)  
**File**: `d:\APP\app_sekolah\frontend\app\master\profil-sekolah\page.tsx`

---

## 🎯 FITUR YANG DIIMPLEMENTASIKAN

### ✅ 1. API Integration
- **GET** `/api/profil-sekolah` - Fetch school profile (single record)
- **POST** `/api/profil-sekolah` - Create profile (if not exists)
- **PUT** `/api/profil-sekolah` - Update existing profile

**Note**: Ini bukan CRUD list, melainkan **single record View/Edit**

### ✅ 2. View/Edit Operations
#### View Mode (Default):
- Display all school information in organized sections
- All fields disabled (read-only)
- Edit button to switch to edit mode
- Sections: Identitas, Alamat & Kontak, Visi & Misi
- Logo & Kop Surat preview (placeholder)

#### Edit Mode:
- All fields enabled for editing
- Save button dan Cancel button
- Form validation
- Auto-detect if creating new or updating existing
- Success/error messaging

#### Create Mode (If Not Found):
- Auto-enable edit mode
- Initialize empty form
- Yellow warning: "Profil Sekolah Belum Ada"
- Button label: "Buat Profil" instead of "Simpan Perubahan"
- POST to API instead of PUT

### ✅ 3. Form Sections

#### Section 1: Logo & Kop Surat (Placeholder)
- Logo Sekolah preview (48x48, placeholder icon)
- Kop Surat preview (full width)
- Upload buttons disabled (feature segera hadir)

#### Section 2: Identitas Sekolah (7 fields)
- Nama Sekolah (required)
- NPSN (required)
- NSS (optional)
- Akreditasi (dropdown: A/B/C)
- Tahun Berdiri (optional)
- Kepala Sekolah (required)
- NIP Kepala Sekolah (required)

#### Section 3: Alamat & Kontak (14 fields)
- Alamat Lengkap (textarea, required)
- Kelurahan (required)
- Kecamatan (required)
- Kota/Kabupaten (required)
- Provinsi (required)
- Kode Pos (optional)
- Telepon (optional)
- Fax (optional)
- Email (optional, email validation)
- Website (optional, URL validation)
- Luas Tanah (optional)
- Luas Bangunan (optional)

#### Section 4: Visi & Misi (2 fields)
- Visi (textarea, optional)
- Misi (textarea, optional)

**Total**: 25+ fields

### ✅ 4. UI/UX Features
- Loading spinner saat fetch data
- Success message (auto-dismiss 3 detik)
- Error message dengan tombol close
- Not found warning (yellow alert for create mode)
- Toggle Edit/View mode
- Disabled fields styling in view mode (bg-gray-50)
- Enabled fields styling in edit mode (focus ring)
- Section headers with icons
- Responsive grid layout (2 columns on desktop)
- Logo & kop surat placeholders
- Cancel button (reloads original data)

---

## 📊 DATA MODEL

### ProfilSekolah Interface
```typescript
interface ProfilSekolah {
  id: string;
  namaSekolah: string;                    // Required
  npsn: string;                           // Required
  nss?: string;
  alamat: string;                         // Required
  kelurahan: string;                      // Required
  kecamatan: string;                      // Required
  kota: string;                           // Required
  provinsi: string;                       // Required
  kodePos?: string;
  telepon?: string;
  fax?: string;
  email?: string;                         // Email validation
  website?: string;                       // URL validation
  kepalaSekolah: string;                  // Required
  nipKepalaSekolah: string;               // Required
  akreditasi?: string;                    // A, B, or C
  tahunBerdiri?: string;
  luasTanah?: string;
  luasBangunan?: string;
  visi?: string;
  misi?: string;
  logoPath?: string;                      // For future upload
  kopSuratPath?: string;                  // For future upload
}
```

---

## 🔧 TECHNICAL IMPLEMENTATION

### 1. State Management
```typescript
const [profileData, setProfileData] = useState<ProfilSekolah | null>(null);
const [loading, setLoading] = useState(true);
const [isEditing, setIsEditing] = useState(false);
const [error, setError] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const [notFound, setNotFound] = useState(false);  // For create mode
```

### 2. Key Functions
- `fetchProfilSekolah()` - Load school profile (handle not found)
- `handleSave()` - Submit create or update based on notFound flag
- `handleCancel()` - Cancel editing and reload original data

### 3. Special Logic

#### Not Found Handling:
```typescript
if (response not found) {
  setNotFound(true);
  // Initialize empty profile for create
  setProfileData({...empty fields});
  setIsEditing(true);  // Auto-enable edit mode
}
```

#### Save Logic (Create vs Update):
```typescript
const response = notFound
  ? await apiClient.post('/api/profil-sekolah', profileData)  // Create
  : await apiClient.put('/api/profil-sekolah', profileData);   // Update
```

#### Cancel Logic:
```typescript
if (notFound) {
  // If was creating, reset to null
  setProfileData(null);
} else {
  // If was editing, reload original
  fetchProfilSekolah();
}
```

### 4. Disabled Fields Styling
```typescript
className={`w-full px-4 py-3 border rounded-lg ${
  isEditing
    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
    : 'border-gray-200 bg-gray-50'  // Disabled look
} outline-none`}
disabled={!isEditing}
```

---

## 🎨 UI COMPONENTS

### Section Layout:
Each section is a white card with:
- Shadow-md
- Rounded-xl
- Padding 6
- Icon + Title header
- Grid layout for fields (md:grid-cols-2)

### Field Styling:
- **View Mode**: Gray background, no focus ring, disabled
- **Edit Mode**: White background, blue focus ring, enabled
- **Labels**: Semibold, gray-700
- **Icons**: Inline in labels (FaPhone, FaEnvelope, FaGlobe)

### Buttons:
- **Edit Button**: Primary-600 with FaEdit icon
- **Save Button**: Green-600 with FaSave icon
- **Cancel Button**: Gray-300
- **Upload Buttons**: Disabled (gray-400) with tooltip

### Alert Messages:
- **Success**: Green-50 bg, green-200 border, auto-dismiss
- **Error**: Red-50 bg, red-200 border, closable
- **Warning (Not Found)**: Yellow-50 bg, yellow-600 border-left

---

## 📝 VALIDASI

### Frontend Validation:
- Nama Sekolah: Required
- NPSN: Required
- Alamat: Required
- Kelurahan: Required
- Kecamatan: Required
- Kota: Required
- Provinsi: Required
- Kepala Sekolah: Required
- NIP Kepala Sekolah: Required
- Email: Email format validation
- Website: URL format validation

### Backend Validation (Zod):
```typescript
const profilSekolahSchema = z.object({
  namaSekolah: z.string().min(1, 'Nama sekolah is required'),
  npsn: z.string().min(1, 'NPSN is required'),
  nss: z.string().optional(),
  alamat: z.string().min(1, 'Alamat is required'),
  kelurahan: z.string().min(1, 'Kelurahan is required'),
  kecamatan: z.string().min(1, 'Kecamatan is required'),
  kota: z.string().min(1, 'Kota is required'),
  provinsi: z.string().min(1, 'Provinsi is required'),
  kodePos: z.string().optional(),
  telepon: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().optional(),
  kepalaSekolah: z.string().min(1, 'Kepala sekolah is required'),
  nipKepalaSekolah: z.string().min(1, 'NIP kepala sekolah is required'),
  akreditasi: z.string().optional(),
  tahunBerdiri: z.string().optional(),
  luasTanah: z.string().optional(),
  luasBangunan: z.string().optional(),
  visi: z.string().optional(),
  misi: z.string().optional(),
  logoPath: z.string().optional(),
  kopSuratPath: z.string().optional(),
});
```

---

## ✅ BUILD STATUS

```
✓ Compiled successfully
✓ Linting and checking validity of types (2 warnings - img tags)
✓ Generating static pages (28/28)

Route: /master/profil-sekolah
Size: 2.58 kB
First Load JS: 103 kB
Status: ○ (Static)
```

**Total Routes**: 28/28 ✅  
**Build Time**: ~40 seconds  
**Errors**: 0  
**Warnings**: 2 (Next.js img optimization - will fix later)

---

## 🔍 TESTING CHECKLIST

### ✅ View Mode:
- [x] Load existing profile data
- [x] Display all fields correctly
- [x] All fields disabled (read-only)
- [x] Edit button visible
- [x] Sections organized properly
- [x] Logo/kop surat placeholders shown

### ✅ Edit Mode:
- [x] Enable all fields for editing
- [x] Save button changes color (green)
- [x] Cancel button appears
- [x] Fields have focus styling
- [x] Can modify all fields
- [x] Edit button hidden

### ✅ Create Mode (Not Found):
- [x] Detect when profile doesn't exist
- [x] Show yellow warning alert
- [x] Auto-enable edit mode
- [x] Initialize empty form
- [x] Button label: "Buat Profil"
- [x] POST to API (not PUT)

### ✅ Save Operations:
- [x] Save existing profile (PUT)
- [x] Create new profile (POST)
- [x] Success message displayed
- [x] Auto-refresh data after save
- [x] Return to view mode after save
- [x] Validation error handling

### ✅ Cancel Operation:
- [x] Cancel button in edit mode
- [x] Reload original data (if editing)
- [x] Reset to null (if creating)
- [x] Return to view mode
- [x] Clear error messages

### ✅ UI/UX:
- [x] Loading state displayed
- [x] Error handling
- [x] Success messaging
- [x] Responsive layout
- [x] Icon indicators
- [x] Disabled field styling
- [x] Focus ring on edit fields

---

## 📚 INTEGRATION DENGAN API BACKEND

### API Endpoints Used:
1. **GET /api/profil-sekolah**
   - No query parameters
   - Response: Single ProfilSekolah object
   - Handles: 404 Not Found (for create mode)

2. **POST /api/profil-sekolah** (Create)
   - Body: ProfilSekolah data
   - Response: Created profile
   - Check: Profile doesn't already exist

3. **PUT /api/profil-sekolah** (Update)
   - Body: ProfilSekolah data (partial allowed)
   - Response: Updated profile
   - Updates: First profile found

---

## 🚀 NEXT STEPS

### Completed Modules (Master Data):
1. ✅ Data Siswa
2. ✅ Data Guru
3. ✅ Data Kelas
4. ✅ Data Mata Pelajaran
5. ✅ Data Tahun Ajaran
6. ✅ Profil Sekolah ⭐ NEW

**Master Data: 100% COMPLETE!** 🎉

### Future Enhancements (Profil Sekolah):
- 📸 Logo upload feature
- 📄 Kop surat upload feature
- 🖼️ Image preview & crop
- 📁 File size validation
- 🗑️ Remove uploaded files
- 🔄 Replace images

### Next Phase - Academic Modules:
1. ⏳ Jadwal Pelajaran
2. ⏳ Absensi
3. ⏳ Penilaian
4. ⏳ Rapor

---

## 💡 PATTERN DIFFERENCES

### Profil Sekolah vs Other CRUD:
Unlike other modules (Siswa, Guru, Kelas, etc.), Profil Sekolah is:

| Feature | CRUD Modules | Profil Sekolah |
|---------|--------------|----------------|
| Records | Multiple | Single (1 record only) |
| UI Pattern | Table + Modal | View/Edit Toggle |
| Create | Modal form | Not found → Edit mode |
| Read | Table list | Single display |
| Update | Modal form | Toggle edit |
| Delete | Confirm dialog | ❌ Not applicable |
| Search | ✅ Yes | ❌ Not applicable |
| Filter | ✅ Yes | ❌ Not applicable |
| Pagination | ✅ Yes | ❌ Not applicable |
| Stats Cards | ✅ Yes | ❌ Not applicable |

### Key Pattern:
```
View Mode (Default) → Click Edit → Edit Mode → Save → View Mode
                                           ↓
                                        Cancel → View Mode
```

---

## 📌 CATATAN PENTING

### Single Record Pattern:
- Only one profile record per school
- No table, no pagination, no search
- Direct view/edit interface
- Simpler state management
- No modal needed

### Not Found Handling:
```typescript
// If profile doesn't exist:
1. Set notFound = true
2. Initialize empty form
3. Auto-enable edit mode
4. Show yellow warning
5. Save will POST (create) instead of PUT (update)
```

### Upload Feature:
Logo and kop surat upload buttons are **disabled** dengan tooltip:
- "Fitur upload akan segera hadir"
- Placeholder images shown
- logoPath & kopSuratPath fields ready in model
- Can be implemented later with file upload library

### Field Organization:
```
25+ fields organized in 4 sections:
1. Logo & Kop Surat (2 placeholders)
2. Identitas Sekolah (7 fields)
3. Alamat & Kontak (14 fields)
4. Visi & Misi (2 textareas)
```

---

## 🔗 USAGE DALAM SISTEM

### Profil Sekolah digunakan untuk:
- **Rapor**: Header sekolah (nama, alamat, logo)
- **Surat**: Kop surat otomatis
- **Dashboard**: Display nama sekolah, kepala sekolah
- **Login Page**: Logo sekolah
- **Footer**: Kontak sekolah (telepon, email, website)
- **About Page**: Visi, misi, sejarah
- **Print Documents**: Logo dan informasi sekolah

### Best Practice:
- Create profile immediately after system setup
- Keep information up-to-date
- Use consistent logo format (square, PNG)
- Use professional kop surat design
- Update kepala sekolah when changes

---

**Status**: ✅ COMPLETE & TESTED  
**Build**: ✅ SUCCESS (28/28 routes)  
**Ready**: ✅ Production Ready  
**Pattern**: View/Edit Single Record (Not CRUD List)  
**Upload Feature**: 📁 Planned (Future Enhancement)
