'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import apiClient from '@/lib/api-client';
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBook,
  FaClock,
  FaTimes,
  FaSpinner,
} from 'react-icons/fa';

interface MataPelajaran {
  id: string;
  kode: string;
  nama: string;
  kelompok: 'UMUM' | 'PRODUKTIF' | 'MUATAN_LOKAL';
  jurusanId?: string | null;
  jamPelajaran: number;
  kkm: number;
  deskripsi?: string | null;
  jurusan?: {
    id: string;
    nama: string;
    kode: string;
  } | null;
}

interface Jurusan {
  id: string;
  nama: string;
  kode: string;
}

interface FormData {
  kode: string;
  nama: string;
  kelompok: 'UMUM' | 'PRODUKTIF' | 'MUATAN_LOKAL';
  jurusanId: string;
  jamPelajaran: number;
  kkm: number;
  deskripsi: string;
}

export default function MataPelajaranPage() {
  const [mataPelajaran, setMataPelajaran] = useState<MataPelajaran[]>([]);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelompok, setFilterKelompok] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    kode: '',
    nama: '',
    kelompok: 'UMUM',
    jurusanId: '',
    jamPelajaran: 2,
    kkm: 75,
    deskripsi: '',
  });

  // Fetch initial data
  useEffect(() => {
    fetchMataPelajaran();
    fetchJurusan();
  }, []);

  const fetchMataPelajaran = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ data: MataPelajaran[] }>('/api/mata-pelajaran?limit=100');
      if (response.success && response.data?.data) {
        setMataPelajaran(response.data.data);
      } else {
        setMataPelajaran([]);
      }
    } catch (err) {
      console.error('Error fetching mata pelajaran:', err);
      setError('Gagal memuat data mata pelajaran');
      setMataPelajaran([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchJurusan = async () => {
    try {
      const response = await apiClient.get<{ data: Jurusan[] }>('/api/jurusan?limit=100');
      if (response.success && response.data?.data) {
        setJurusanList(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching jurusan:', err);
    }
  };

  const filteredSubjects = Array.isArray(mataPelajaran) ? mataPelajaran.filter((subject) => {
    const matchesSearch =
      subject.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKelompok = filterKelompok === '' || subject.kelompok === filterKelompok;
    const matchesJurusan = filterJurusan === '' || subject.jurusanId === filterJurusan;
    return matchesSearch && matchesKelompok && matchesJurusan;
  }) : [];

  const handleOpenModal = (mapel?: MataPelajaran) => {
    if (mapel) {
      setEditingId(mapel.id);
      setFormData({
        kode: mapel.kode,
        nama: mapel.nama,
        kelompok: mapel.kelompok,
        jurusanId: mapel.jurusanId || '',
        jamPelajaran: mapel.jamPelajaran,
        kkm: mapel.kkm,
        deskripsi: mapel.deskripsi || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        kode: '',
        nama: '',
        kelompok: 'UMUM',
        jurusanId: '',
        jamPelajaran: 2,
        kkm: 75,
        deskripsi: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        ...formData,
        jurusanId: formData.jurusanId || null,
        jamPelajaran: Number(formData.jamPelajaran),
        kkm: Number(formData.kkm),
      };

      if (editingId) {
        // Update
        const response = await apiClient.put(`/api/mata-pelajaran/${editingId}`, payload);
        if (response.success) {
          setSuccessMessage('Data mata pelajaran berhasil diupdate');
          fetchMataPelajaran();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal mengupdate data mata pelajaran');
        }
      } else {
        // Create
        const response = await apiClient.post('/api/mata-pelajaran', payload);
        if (response.success) {
          setSuccessMessage('Data mata pelajaran berhasil ditambahkan');
          fetchMataPelajaran();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal menambahkan data mata pelajaran');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus mata pelajaran ${nama}?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/api/mata-pelajaran/${id}`);
      if (response.success) {
        setSuccessMessage('Data mata pelajaran berhasil dihapus');
        fetchMataPelajaran();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Gagal menghapus data mata pelajaran');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const totalJamPelajaran = Array.isArray(mataPelajaran) 
    ? mataPelajaran.reduce((sum, mapel) => sum + mapel.jamPelajaran, 0)
    : 0;

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage('')}>
              <FaTimes />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')}>
              <FaTimes />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mata Pelajaran</h1>
            <p className="text-gray-600 mt-1">Kelola data mata pelajaran dan kurikulum</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mt-4 md:mt-0"
          >
            <FaPlus /> Tambah Mata Pelajaran
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Mapel</p>
                <p className="text-3xl font-bold text-gray-800">{Array.isArray(mataPelajaran) ? mataPelajaran.length : 0}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <FaBook className="text-blue-600 text-3xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Mapel Umum</p>
                <p className="text-3xl font-bold text-green-600">
                  {Array.isArray(mataPelajaran) ? mataPelajaran.filter((s) => s.kelompok === 'UMUM').length : 0}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <FaBook className="text-green-600 text-3xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Mapel Produktif</p>
                <p className="text-3xl font-bold text-orange-600">
                  {Array.isArray(mataPelajaran) ? mataPelajaran.filter((s) => s.kelompok === 'PRODUKTIF').length : 0}
                </p>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg">
                <FaBook className="text-orange-600 text-3xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Jam/Minggu</p>
                <p className="text-3xl font-bold text-purple-600">{totalJamPelajaran}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <FaClock className="text-purple-600 text-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaSearch className="inline mr-2" />
                Cari Mata Pelajaran
              </label>
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Kelompok */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Kelompok Mapel</label>
              <select
                value={filterKelompok}
                onChange={(e) => setFilterKelompok(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Semua Kelompok</option>
                <option value="UMUM">Umum</option>
                <option value="PRODUKTIF">Produktif</option>
                <option value="MUATAN_LOKAL">Muatan Lokal</option>
              </select>
            </div>

            {/* Filter Jurusan */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Jurusan</label>
              <select
                value={filterJurusan}
                onChange={(e) => setFilterJurusan(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Semua Jurusan</option>
                {jurusanList.map((jurusan) => (
                  <option key={jurusan.id} value={jurusan.id}>
                    {jurusan.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-600" />
              <span className="ml-3 text-gray-600">Memuat data...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">No</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Kode</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Nama Mata Pelajaran</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Kelompok</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Jurusan</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Jam/Minggu</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">KKM</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubjects.length > 0 ? (
                      filteredSubjects.map((subject, index) => (
                        <tr key={subject.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
                              {subject.kode}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-800 font-semibold">{subject.nama}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                subject.kelompok === 'UMUM'
                                  ? 'bg-green-100 text-green-700'
                                  : subject.kelompok === 'PRODUKTIF'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {subject.kelompok === 'UMUM' ? 'Umum' : subject.kelompok === 'PRODUKTIF' ? 'Produktif' : 'Muatan Lokal'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-800">{subject.jurusan?.nama || 'Semua Jurusan'}</td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {subject.jamPelajaran} JP
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {subject.kkm}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenModal(subject)}
                                className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(subject.id, subject.nama)}
                                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                                title="Hapus"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500">
                          Data mata pelajaran tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredSubjects.length} dari {mataPelajaran.length} mata pelajaran
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Row 1: Kode & Nama */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Kode Mata Pelajaran <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.kode}
                      onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none uppercase"
                      placeholder="Contoh: MTK, BIND"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Kode unik mata pelajaran</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Kelompok Mapel <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.kelompok}
                      onChange={(e) => setFormData({ ...formData, kelompok: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="UMUM">Umum</option>
                      <option value="PRODUKTIF">Produktif</option>
                      <option value="MUATAN_LOKAL">Muatan Lokal</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Nama Mata Pelajaran */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nama Mata Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Contoh: Matematika, Bahasa Indonesia"
                    required
                  />
                </div>

                {/* Row 3: Jurusan (Optional) */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Jurusan (Opsional)
                  </label>
                  <select
                    value={formData.jurusanId}
                    onChange={(e) => setFormData({ ...formData, jurusanId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="">Semua Jurusan</option>
                    {jurusanList.map((jurusan) => (
                      <option key={jurusan.id} value={jurusan.id}>
                        {jurusan.nama} ({jurusan.kode})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Kosongkan jika mata pelajaran untuk semua jurusan
                  </p>
                </div>

                {/* Row 4: Jam Pelajaran & KKM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Jam Pelajaran/Minggu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.jamPelajaran}
                      onChange={(e) => setFormData({ ...formData, jamPelajaran: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      min="0"
                      max="20"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Jumlah jam per minggu</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      KKM (Kriteria Ketuntasan Minimal) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.kkm}
                      onChange={(e) => setFormData({ ...formData, kkm: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      min="0"
                      max="100"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Nilai KKM (0-100)</p>
                  </div>
                </div>

                {/* Row 5: Deskripsi */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    rows={3}
                    placeholder="Deskripsi singkat tentang mata pelajaran ini..."
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
