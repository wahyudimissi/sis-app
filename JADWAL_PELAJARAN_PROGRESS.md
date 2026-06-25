# 🔄 JADWAL PELAJARAN - WORK IN PROGRESS

## 📋 STATUS: PARTIALLY COMPLETE
**Tanggal**: 24 Juni 2026  
**Phase**: Backend Complete, Frontend Integration Started

---

## ✅ COMPLETED

### 1. Backend API - 100% Complete
**Files Created:**
- `frontend/app/api/jadwal-pelajaran/route.ts` (150+ lines)
- `frontend/app/api/jadwal-pelajaran/[id]/route.ts` (170+ lines)

**Features Implemented:**
- ✅ GET with filters (kelasId, tahunAjaranId, guruId, hari)
- ✅ POST with conflict detection
- ✅ PUT with conflict validation
- ✅ DELETE endpoint
- ✅ Relations included (kelas, mataPelajaran, guru, tahunAjaran)

**Conflict Detection:**
```typescript
// Check 1: Same class + day + period
if (same kelasId + hari + jamKe + tahunAjaranId) {
  return error: "Jadwal bentrok: Kelas sudah memiliki jadwal"
}

// Check 2: Same teacher + day + period
if (same guruId + hari + jamKe + tahunAjaranId) {
  return error: "Jadwal bentrok: Guru sudah mengajar di kelas lain"
}
```

**Build Status**: ✅ 30/30 routes compiled successfully

---

## 🔄 IN PROGRESS

### 2. Frontend Integration - 30% Complete
**File**: `frontend/app/akademik/jadwal/page.tsx`

**What's Done:**
- ✅ TypeScript interfaces defined
- ✅ State management setup
- ✅ API data fetching (kelas, tahun ajaran, mapel, guru)
- ✅ Grid view structure exists
- ✅ Filter dropdowns for kelas & tahun ajaran
- ✅ Auto-select active tahun ajaran

**What's Pending:**
- ⏳ Modal form for CRUD operations
- ⏳ Add/Edit/Delete handlers
- ⏳ Conflict detection UI
- ⏳ Grid cell click to add/edit
- ⏳ Success/error messaging
- ⏳ Loading states

---

## 📊 DATA MODEL

### JadwalPelajaran Interface
```typescript
interface JadwalPelajaran {
  id: string;
  tahunAjaranId: string;
  kelasId: string;
  mataPelajaranId: string;
  guruId: string;
  hari: 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU';
  jamKe: number;                          // 1-8
  jamMulai: string;                       // Format: HH:MM
  jamSelesai: string;                     // Format: HH:MM
  ruangan?: string;                       // Optional
  // Relations (from API)
  tahunAjaran?: { tahunAjaran, status };
  kelas?: { namaKelas, tingkat };
  mataPelajaran?: { kode, nama };
  guru?: { nip, nama };
}
```

### Unique Constraint
```
@@unique([kelasId, hari, jamKe, tahunAjaranId])
```
One class cannot have multiple schedules at the same time.

---

## 🎯 GRID VIEW STRUCTURE

### Layout
```
┌─────────┬────────┬────────┬────────┬────────┬────────┬────────┐
│ Jam     │ SENIN  │ SELASA │ RABU   │ KAMIS  │ JUMAT  │ SABTU  │
├─────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│ Jam 1   │ Cell   │ Cell   │ Cell   │ Cell   │ Cell   │ Cell   │
│ 07:00-  │        │        │        │        │        │        │
│ 07:45   │        │        │        │        │        │        │
├─────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│ Jam 2   │ Cell   │ Cell   │ Cell   │ Cell   │ Cell   │ Cell   │
│ ...     │        │        │        │        │        │        │
└─────────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

### Cell Content (if has schedule)
```
┌────────────────────────┐
│ MATEMATIKA             │ ← Mata Pelajaran (bold, primary)
│ Drs. Ahmad, M.Pd       │ ← Guru name (small, gray)
│ [R-101]                │ ← Ruangan (badge, blue)
│ [Edit] [Delete]        │ ← Actions (hover)
└────────────────────────┘
```

### Cell Content (empty)
```
┌────────────────────────┐
│         -              │ ← Empty indicator
│                        │
│    [+ Tambah]          │ ← Add button (on hover)
└────────────────────────┘
```

---

## 🚀 NEXT STEPS

### Priority 1: Complete CRUD Modal
```typescript
// Need to implement:
const handleOpenModal = (hari, jamKe, jadwal?) => {
  // Pre-fill form if editing
  // Show modal
}

const handleSubmit = async () => {
  // POST if creating
  // PUT if editing
  // Handle conflicts
}

const handleDelete = async (id) => {
  // Confirm dialog
  // DELETE request
}
```

### Priority 2: Grid Cell Interactions
```typescript
// Click empty cell → Open modal for create
// Click filled cell → Show edit/delete options
// Hover → Show actions
```

### Priority 3: Conflict Detection UI
```typescript
// Show error if conflict detected
// Highlight conflicting cells
// Suggest alternative times
```

### Priority 4: Polish & Features
- Print jadwal per kelas
- Export to Excel/PDF
- Copy jadwal from previous tahun ajaran
- Bulk add/edit
- Teacher schedule view (per guru)

---

## 📝 API USAGE EXAMPLES

### Fetch Jadwal for Kelas
```typescript
GET /api/jadwal-pelajaran?kelasId={id}&tahunAjaranId={id}

Response: {
  success: true,
  data: [
    {
      id: "uuid",
      hari: "SENIN",
      jamKe: 1,
      jamMulai: "07:00",
      jamSelesai: "07:45",
      mataPelajaran: { kode: "MTK", nama: "Matematika" },
      guru: { nip: "123", nama: "Ahmad" },
      ruangan: "R-101",
      ...
    },
    ...
  ]
}
```

### Create New Schedule
```typescript
POST /api/jadwal-pelajaran

Body: {
  kelasId: "uuid",
  tahunAjaranId: "uuid",
  mataPelajaranId: "uuid",
  guruId: "uuid",
  hari: "SENIN",
  jamKe: 1,
  jamMulai: "07:00",
  jamSelesai: "07:45",
  ruangan: "R-101"
}

Response: {
  success: true,
  data: { ... },
  message: "Jadwal pelajaran created successfully"
}

// Or if conflict:
Response: {
  success: false,
  message: "Jadwal bentrok: Kelas sudah memiliki jadwal di jam yang sama"
}
```

---

## 💡 IMPLEMENTATION NOTES

### State Management
```typescript
const [jadwalList, setJadwalList] = useState<JadwalPelajaran[]>([]);
const [selectedKelasId, setSelectedKelasId] = useState('');
const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState('');
const [showModal, setShowModal] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);
```

### Auto-Selection Logic
```typescript
// Auto-select active tahun ajaran
const active = tahunAjaranData.find(ta => ta.status === 'AKTIF');
if (active) setSelectedTahunAjaranId(active.id);

// Auto-select first kelas
if (kelasData.length > 0) setSelectedKelasId(kelasData[0].id);
```

### Grid Rendering
```typescript
{jamPelajaran.map((jam) => (
  <tr key={jam.ke}>
    <td>{jam.ke} - {jam.mulai}-{jam.selesai}</td>
    {days.map((day) => {
      const schedule = getScheduleForDayAndJam(day, jam.ke);
      return (
        <td key={`${day}-${jam.ke}`}>
          {schedule ? (
            <ScheduleCell schedule={schedule} />
          ) : (
            <EmptyCell day={day} jamKe={jam.ke} />
          )}
        </td>
      );
    })}
  </tr>
))}
```

---

## 🎨 UI/UX CONSIDERATIONS

### Color Coding
- **Primary-600**: Mata Pelajaran name
- **Blue-100**: Ruangan badge
- **Gray-400**: Empty cells
- **Yellow-600**: Conflict warning
- **Green-600**: Success message

### Interactions
- **Click empty cell**: Open create modal
- **Click filled cell**: Show actions (edit/delete)
- **Hover cell**: Show action buttons
- **Filter change**: Auto-reload jadwal

### Validation
- Check required fields (kelas, mapel, guru, hari, jam)
- Validate time format (HH:MM)
- Conflict detection on submit
- Confirm before delete

---

## 📌 TECHNICAL DECISIONS

### Why Grid View?
- Most intuitive for schedule visualization
- Easy to see conflicts at a glance
- Standard pattern for timetables
- Matches user mental model

### Why Separate Table for Teachers?
- Teachers teach multiple classes
- Need different view for teacher schedule
- Can be added as separate tab or page

### Why Conflict Detection?
- Prevent double booking of classes
- Prevent double booking of teachers
- Maintain schedule integrity
- Improve user experience

---

## 🔄 REMAINING WORK

### Estimated Effort: 1-2 Sessions

**Session 1** (Current):
- ✅ Backend API complete
- ✅ Frontend structure started
- ⏳ Modal form implementation
- ⏳ CRUD handlers

**Session 2** (Next):
- ⏳ Complete CRUD operations
- ⏳ Conflict detection UI
- ⏳ Print & export features
- ⏳ Polish & testing

---

## ✅ BUILD STATUS

```
✓ 30/30 Routes Compiled Successfully
✓ API Endpoints Working
✓ No TypeScript Errors
✓ No ESLint Errors
⏳ Frontend Integration In Progress
```

---

## 📖 SUMMARY

**What We Have:**
- Complete backend API with conflict detection
- Grid view structure with real data fetching
- Filter system (kelas + tahun ajaran)
- Auto-selection logic

**What We Need:**
- Modal form for CRUD
- Cell click handlers
- Conflict detection UI
- Polish & features

**Status**: 🟡 In Progress (Backend ✅, Frontend 30%)  
**Next**: Complete modal form and CRUD handlers  
**ETA**: 1-2 more sessions for full completion

---

*Last Updated: 24 Juni 2026*  
*Context: Session ended at 125k/200k tokens*  
*Recommendation: Continue in next session with fresh context*
