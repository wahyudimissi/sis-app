'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import apiClient from '@/lib/api-client';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaCheckCircle,
  FaLock,
  FaUnlock,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from 'react-icons/fa';

interface TahunAjaran {
  id: string;
  tahunAjaran: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'AKTIF' | 'TIDAK_AKTIF' | 'SELESAI';
  isLocked: boolean;
  _count?: {
    kelas: number;
    semester: number;
  };
}

interface FormData {
  tahunAjaran: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'AKTIF' | 'TIDAK_AKTIF' | 'SELESAI';
  isLocked: boolean;
}

export default function TahunAjaranPage() {
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    tahunAjaran: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    status: 'TIDAK_AKTIF',
    isLocked: false,
  });

  useEffect(() => {
    fetchTahunAjaran();
  }, []);

  const fetchTahunAjaran = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ data: TahunAjaran[] }>('/api/tahun-ajaran');
      if (response.success && response.data?.data) {
        setTahunAjaranList(response.data.data);
      } else {
        setTahunAjaranList([]);
      }
    } catch (err) {
      console.error('Error fetching tahun ajaran:', err);
      setError('Gagal memuat data tahun ajaran');
      setTahunAjaranList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tahunAjaran?: TahunAjaran) => {
    if (tahunAjaran) {
      // Check if locked
      if (tahunAjaran.isLocked) {
        setError('Data tahun ajaran ini sudah terkunci dan tidak dapat diubah');
        return;
      }

      setEditingId(tahunAjaran.id);
      setFormData({
        tahunAjaran: tahunAjaran.tahunAjaran,
        tanggalMulai: tahunAjaran.tanggalMulai.split('T')[0],
        tanggalSelesai: tahunAjaran.tanggalSelesai.split('T')[0],
        status: tahunAjaran.status,
        isLocked: tahunAjaran.isLocked,
      });
    } else {
      setEditingId(null);
      // Auto-generate tahun ajaran for next year
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      setFormData({
        tahunAjaran: `${currentYear}/${nextYear}`,
        tanggalMulai: `${currentYear}-07-01`,
        tanggalSelesai: `${nextYear}-06-30`,
        status: 'TIDAK_AKTIF',
        isLocked: false,
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

    // Validation
    if (new Date(formData.tanggalMulai) >= new Date(formData.tanggalSelesai)) {
      setError('Tanggal selesai harus lebih besar dari tanggal mulai');
      return;
    }

    try {
      if (editingId) {
        // Update
        const response = await apiClient.put(`/api/tahun-ajaran/${editingId}`, formData);
        if (response.success) {
          setSuccessMessage('Data tahun ajaran berhasil diupdate');
          fetchTahunAjaran();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal mengupdate data tahun ajaran');
        }
      } else {
        // Create
        const response = await apiClient.post('/api/tahun-ajaran', formData);
        if (response.success) {
          setSuccessMessage('Data tahun ajaran berhasil ditambahkan');
          fetchTahunAjaran();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal menambahkan data tahun ajaran');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string, tahunAjaran: string, isLocked: boolean, relatedData?: { kelas?: number; semester?: number }) => {
    if (isLocked) {
      setError('Data tahun ajaran yang sudah terkunci tidak dapat dihapus');
      return;
    }

    // Check for related data
    const totalRelated = (relatedData?.kelas || 0) + (relatedData?.semester || 0);
    if (totalRelated > 0) {
      // Show warning with cascade delete option
      const message = `Tahun ajaran ini memiliki ${relatedData?.kelas || 0} kelas dan ${relatedData?.semester || 0} semester.\n\n` +
        `⚠️ PERINGATAN: Menghapus tahun ajaran akan menghapus SEMUA data terkait:\n` +
        `- ${relatedData?.kelas || 0} Kelas\n` +
        `- Semua Jadwal Pelajaran\n` +
        `- Semua Data Absensi\n` +
        `- Semua Data Nilai\n\n` +
        `Data yang terhapus TIDAK DAPAT dikembalikan!\n\n` +
        `Apakah Anda yakin ingin menghapus ${tahunAjaran} beserta SEMUA data terkait?`;
      
      if (!confirm(message)) {
        return;
      }
    } else {
      // No related data, simple confirmation
      if (!confirm(`Apakah Anda yakin ingin menghapus tahun ajaran ${tahunAjaran}?`)) {
        return;
      }
    }

    try {
      // If has related data, add cascade=true parameter
      const url = totalRelated > 0 
        ? `/api/tahun-ajaran/${id}?cascade=true`
        : `/api/tahun-ajaran/${id}`;
        
      const response = await apiClient.delete(url);
      if (response.success) {
        setSuccessMessage('Data tahun ajaran berhasil dihapus');
        fetchTahunAjaran();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Gagal menghapus data tahun ajaran');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleToggleLock = async (id: string, tahunAjaran: string, currentLocked: boolean) => {
    const action = currentLocked ? 'membuka' : 'mengunci';
    if (!confirm(`Apakah Anda yakin ingin ${action} data tahun ajaran ${tahunAjaran}?`)) {
      return;
    }

    try {
      const response = await apiClient.put(`/api/tahun-ajaran/${id}`, {
        isLocked: !currentLocked,
      });
      if (response.success) {
        setSuccessMessage(`Data tahun ajaran berhasil ${currentLocked ? 'dibuka' : 'dikunci'}`);
        fetchTahunAjaran();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || `Gagal ${action} data tahun ajaran`);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const activeTahunAjaran = Array.isArray(tahunAjaranList) 
    ? tahunAjaranList.find(ta => ta.status === 'AKTIF')
    : null;

  const totalKelas = Array.isArray(tahunAjaranList)
    ? tahunAjaranList.reduce((sum, ta) => sum + (ta._count?.kelas || 0), 0)
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
            <h1 className="text-3xl font-bold text-gray-800">Tahun Ajaran</h1>
            <p className="text-gray-600 mt-1">Kelola tahun ajaran dan semester akademik</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mt-4 md:mt-0"
          >
            <FaPlus /> Tambah Tahun Ajaran
          </button>
        </div>

        {/* Active Academic Year Card */}
        {activeTahunAjaran ? (
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 mb-2">Tahun Ajaran Aktif</p>
                <h2 className="text-4xl font-bold mb-2">{activeTahunAjaran.tahunAjaran}</h2>
                <p className="text-xl">
                  {activeTahunAjaran._count?.kelas || 0} Kelas • {activeTahunAjaran._count?.semester || 0} Semester
                </p>
              </div>
              <div className="text-right">
                <FaCalendarAlt className="text-6xl text-primary-200 mb-4" />
                <p className="text-primary-100">
                  {new Date(activeTahunAjaran.tanggalMulai).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {' - '}
                  {new Date(activeTahunAjaran.tanggalSelesai).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-yellow-600 text-2xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Tidak Ada Tahun Ajaran Aktif</h3>
                <p className="text-yellow-700">Silakan aktifkan salah satu tahun ajaran untuk memulai.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Tahun Ajaran</p>
                <p className="text-3xl font-bold text-gray-800">{Array.isArray(tahunAjaranList) ? tahunAjaranList.length : 0}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <FaCalendarAlt className="text-blue-600 text-3xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Kelas</p>
                <p className="text-3xl font-bold text-green-600">{totalKelas}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Data Terkunci</p>
                <p className="text-3xl font-bold text-red-600">
                  {Array.isArray(tahunAjaranList) ? tahunAjaranList.filter(ta => ta.isLocked).length : 0}
                </p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg">
                <FaLock className="text-red-600 text-3xl" />
              </div>
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
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Tahun Ajaran</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Periode</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Kelas</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Status</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Data</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(tahunAjaranList) && tahunAjaranList.length > 0 ? (
                      tahunAjaranList.map((ta, index) => (
                        <tr key={ta.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                          <td className="py-4 px-6">
                            <span className="text-lg font-bold text-gray-800">{ta.tahunAjaran}</span>
                          </td>
                          <td className="py-4 px-6 text-gray-800">
                            {new Date(ta.tanggalMulai).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            {' - '}
                            {new Date(ta.tanggalSelesai).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {ta._count?.kelas || 0} Kelas
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            {ta.status === 'AKTIF' ? (
                              <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                <FaCheckCircle className="mr-1" /> Aktif
                              </span>
                            ) : ta.status === 'SELESAI' ? (
                              <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                                Selesai
                              </span>
                            ) : (
                              <span className="inline-flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                                Tidak Aktif
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleToggleLock(ta.id, ta.tahunAjaran, ta.isLocked)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold cursor-pointer hover:opacity-80 transition ${
                                ta.isLocked
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                              title={ta.isLocked ? 'Klik untuk membuka' : 'Klik untuk mengunci'}
                            >
                              {ta.isLocked ? (
                                <>
                                  <FaLock className="mr-1" /> Terkunci
                                </>
                              ) : (
                                <>
                                  <FaUnlock className="mr-1" /> Terbuka
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              {!ta.isLocked ? (
                                <>
                                  <button
                                    onClick={() => handleOpenModal(ta)}
                                    className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded"
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(ta.id, ta.tahunAjaran, ta.isLocked, ta._count)}
                                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                                    title="Hapus"
                                  >
                                    <FaTrash />
                                  </button>
                                </>
                              ) : (
                                <span className="text-sm text-gray-500">Terkunci</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          Belum ada data tahun ajaran
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Info */}
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="text-sm text-gray-600">
                  <strong>Info:</strong> Data yang sudah terkunci tidak dapat diubah atau dihapus untuk menjaga integritas data historis.
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
                  {editingId ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Row 1: Tahun Ajaran */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Tahun Ajaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tahunAjaran}
                    onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="2024/2025"
                    required
                    pattern="\d{4}/\d{4}"
                  />
                  <p className="text-sm text-gray-500 mt-1">Format: YYYY/YYYY (contoh: 2024/2025)</p>
                </div>

                {/* Row 2: Tanggal Mulai & Selesai */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalMulai}
                      onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Tanggal Selesai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalSelesai}
                      onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Status */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  >
                    <option value="TIDAK_AKTIF">Tidak Aktif</option>
                    <option value="AKTIF">Aktif</option>
                    <option value="SELESAI">Selesai</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Hanya satu tahun ajaran yang dapat berstatus Aktif pada satu waktu
                  </p>
                </div>

                {/* Row 4: Lock Status */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isLocked"
                      checked={formData.isLocked}
                      onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                      className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isLocked" className="ml-3 text-gray-700 font-semibold">
                      <FaLock className="inline mr-2 text-yellow-600" />
                      Kunci Data Tahun Ajaran
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-8">
                    Data yang dikunci tidak dapat diubah atau dihapus untuk menjaga integritas data historis.
                  </p>
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
