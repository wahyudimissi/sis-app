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
  FaTimes,
  FaSpinner,
  FaBook,
} from 'react-icons/fa';

interface Jurusan {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  kuota?: number;
  createdAt: string;
  _count?: {
    kelas: number;
    siswa: number;
    mapel: number;
  };
}

interface FormData {
  kode: string;
  nama: string;
  deskripsi: string;
  kuota: string;
}

export default function DataJurusanPage() {
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    kode: '',
    nama: '',
    deskripsi: '',
    kuota: '',
  });

  useEffect(() => {
    fetchJurusan();
  }, []);

  const fetchJurusan = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ data: Jurusan[] }>('/api/jurusan');
      if (response.success && response.data?.data) {
        const jurusanData = Array.isArray(response.data.data) ? response.data.data : [];
        setJurusanList(jurusanData);
      } else {
        setJurusanList([]);
      }
    } catch (err) {
      console.error('Error fetching jurusan:', err);
      setError('Gagal memuat data jurusan');
      setJurusanList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJurusan = Array.isArray(jurusanList) ? jurusanList.filter((jurusan) => {
    const matchesSearch =
      jurusan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurusan.kode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) : [];

  const handleOpenModal = (jurusan?: Jurusan) => {
    if (jurusan) {
      setEditingId(jurusan.id);
      setFormData({
        kode: jurusan.kode,
        nama: jurusan.nama,
        deskripsi: jurusan.deskripsi || '',
        kuota: jurusan.kuota?.toString() || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        kode: '',
        nama: '',
        deskripsi: '',
        kuota: '',
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
        kode: formData.kode.toUpperCase(),
        nama: formData.nama,
        deskripsi: formData.deskripsi || undefined,
        kuota: formData.kuota ? parseInt(formData.kuota) : undefined,
      };

      if (editingId) {
        const response = await apiClient.put(`/api/jurusan/${editingId}`, payload);
        if (response.success) {
          setSuccessMessage('Data jurusan berhasil diupdate');
          fetchJurusan();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal mengupdate data jurusan');
        }
      } else {
        const response = await apiClient.post('/api/jurusan', payload);
        if (response.success) {
          setSuccessMessage('Data jurusan berhasil ditambahkan');
          fetchJurusan();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal menambahkan data jurusan');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus jurusan ${nama}?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/api/jurusan/${id}`);
      if (response.success) {
        setSuccessMessage('Data jurusan berhasil dihapus');
        fetchJurusan();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Gagal menghapus data jurusan');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">Data Jurusan</h1>
            <p className="text-gray-600 mt-1">Kelola data jurusan/program keahlian sekolah</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mt-4 md:mt-0"
          >
            <FaPlus /> Tambah Jurusan
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Jurusan</p>
                <p className="text-3xl font-bold text-primary-600">
                  {Array.isArray(jurusanList) ? jurusanList.length : 0}
                </p>
              </div>
              <FaBook className="text-4xl text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Kelas</p>
                <p className="text-3xl font-bold text-blue-600">
                  {Array.isArray(jurusanList) 
                    ? jurusanList.reduce((sum, j) => sum + (j._count?.kelas || 0), 0)
                    : 0}
                </p>
              </div>
              <FaBook className="text-4xl text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Siswa</p>
                <p className="text-3xl font-bold text-green-600">
                  {Array.isArray(jurusanList)
                    ? jurusanList.reduce((sum, j) => sum + (j._count?.siswa || 0), 0)
                    : 0}
                </p>
              </div>
              <FaBook className="text-4xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <FaSearch className="text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Cari jurusan berdasarkan kode atau nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
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
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Nama Jurusan</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Deskripsi</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Kuota</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Kelas</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Siswa</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJurusan.length > 0 ? (
                      filteredJurusan.map((jurusan, index) => (
                        <tr key={jurusan.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-700">
                              {jurusan.kode}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-800 font-semibold">{jurusan.nama}</td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {jurusan.deskripsi || '-'}
                          </td>
                          <td className="py-4 px-6 text-center text-gray-800">
                            {jurusan.kuota || '-'}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                              {jurusan._count?.kelas || 0} kelas
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                              {jurusan._count?.siswa || 0} siswa
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenModal(jurusan)}
                                className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(jurusan.id, jurusan.nama)}
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
                          Data jurusan tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredJurusan.length} dari {Array.isArray(jurusanList) ? jurusanList.length : 0} jurusan
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
                  {editingId ? 'Edit Data Jurusan' : 'Tambah Data Jurusan'}
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
                      Kode Jurusan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.kode}
                      onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none uppercase"
                      placeholder="Contoh: RPL, TKJ, AKL"
                      required
                      maxLength={10}
                    />
                    <p className="text-xs text-gray-500 mt-1">Maksimal 10 karakter, otomatis uppercase</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nama Jurusan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="Contoh: Rekayasa Perangkat Lunak"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Kuota */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Kuota Siswa (Opsional)
                  </label>
                  <input
                    type="number"
                    value={formData.kuota}
                    onChange={(e) => setFormData({ ...formData, kuota: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Contoh: 180"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Jumlah maksimal siswa yang dapat diterima</p>
                </div>

                {/* Row 3: Deskripsi */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    rows={4}
                    placeholder="Deskripsi singkat tentang jurusan..."
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
