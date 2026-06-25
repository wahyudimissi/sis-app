# 📝 TEMPLATE INTEGRATION PATTERN

**Use this as reference untuk semua modul Master Data**

---

## STRUKTUR LENGKAP FILE

```typescript
'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import apiClient from '@/lib/api-client';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaSpinner } from 'react-icons/fa';

// ============================================
// 1. INTERFACE DEFINITIONS
// ============================================

interface YourModel {
  id: string;
  // Add all fields from Prisma schema
  // Example:
  // nama: string;
  // kode: string;
  // created_at: Date;
}

interface FormData {
  // Same as model but without id
}

// ============================================
// 2. COMPONENT
// ============================================

export default function YourPage() {
  // States
  const [items, setItems] = useState<YourModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    // Initialize with empty values
  });

  // ============================================
  // 3. FETCH DATA
  // ============================================
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<YourModel[]>('/api/your-endpoint');
      if (response.success && response.data) {
        setItems(response.data);
      }
    } catch (err) {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 4. MODAL HANDLERS
  // ============================================

  const handleOpenModal = (item?: YourModel) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        // Map all fields from item
      });
    } else {
      setEditingId(null);
      setFormData({
        // Reset to empty
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setError('');
  };

  // ============================================
  // 5. CRUD HANDLERS
  // ============================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingId) {
        const response = await apiClient.put(`/api/your-endpoint/${editingId}`, formData);
        if (response.success) {
          setSuccessMessage('Data berhasil diupdate');
          fetchData();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal mengupdate data');
        }
      } else {
        const response = await apiClient.post('/api/your-endpoint', formData);
        if (response.success) {
          setSuccessMessage('Data berhasil ditambahkan');
          fetchData();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal menambahkan data');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/api/your-endpoint/${id}`);
      if (response.success) {
        setSuccessMessage('Data berhasil dihapus');
        fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Gagal menghapus data');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  // ============================================
  // 6. FILTER DATA
  // ============================================

  const filteredItems = items.filter((item) => {
    return item.nama.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // ============================================
  // 7. RENDER
  // ============================================

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage('')}><FaTimes /></button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')}><FaTimes /></button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Your Page Title</h1>
              <p className="text-gray-600 mt-1">Description</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mt-4 md:mt-0"
            >
              <FaPlus /> Tambah Data
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-4xl text-primary-600" />
                <span className="ml-3 text-gray-600">Memuat data...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">No</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Nama</th>
                      {/* Add more columns */}
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item, index) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-6">{index + 1}</td>
                          <td className="py-4 px-6 font-semibold">{item.nama}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenModal(item)}
                                className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id, item.nama)}
                                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500">
                          Data tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal Form */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Edit Data' : 'Tambah Data'}
                  </h2>
                  <button onClick={handleCloseModal} className="text-gray-600 hover:text-gray-800">
                    <FaTimes size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Add form fields here */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nama <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>

                  {/* Error in Modal */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      {editingId ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

---

## CHECKLIST UNTUK SETIAP MODUL

- [ ] Update interface sesuai Prisma schema
- [ ] Update API endpoint path
- [ ] Update form fields
- [ ] Update table columns
- [ ] Update search/filter logic
- [ ] Test CRUD operations

---

## API ENDPOINTS REFERENCE

| Module | Endpoint | Methods |
|--------|----------|---------|
| Siswa | `/api/siswa` | GET, POST, PUT, DELETE |
| Guru | `/api/guru` | GET, POST, PUT, DELETE |
| Kelas | `/api/kelas` | GET, POST, PUT, DELETE |
| Mata Pelajaran | `/api/mata-pelajaran` | GET, POST, PUT, DELETE |
| Tahun Ajaran | `/api/tahun-ajaran` | GET, POST, PUT, DELETE |
| Profil Sekolah | `/api/profil-sekolah` | GET, PUT |

---

## NEXT: Apply to All Modules

Ready to batch create all remaining modules!

