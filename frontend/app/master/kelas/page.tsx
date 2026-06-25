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
  FaUsers,
  FaChalkboardTeacher,
  FaSchool,
  FaTimes,
  FaSpinner,
} from 'react-icons/fa';

interface Kelas {
  id: string;
  namaKelas: string;
  tingkat: string;
  ruangan?: string;
  jurusan: {
    id: string;
    nama: string;
    kode: string;
  };
  tahunAjaran: {
    id: string;
    tahunAjaran: string;
    status: string;
  };
  waliKelas?: {
    id: string;
    nip: string;
    nama: string;
  };
  _count: {
    siswa: number;
  };
}

interface Jurusan {
  id: string;
  nama: string;
  kode: string;
}

interface TahunAjaran {
  id: string;
  tahunAjaran: string;
  status: string;
}

interface Guru {
  id: string;
  nip: string;
  nama: string;
}

interface FormData {
  namaKelas: string;
  tingkat: string;
  jurusanId: string;
  tahunAjaranId: string;
  waliKelasId: string;
  ruangan: string;
}

export default function DataKelasPage() {
  const [classes, setClasses] = useState<Kelas[]>([]);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTingkat, setFilterTingkat] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    namaKelas: '',
    tingkat: 'X',
    jurusanId: '',
    tahunAjaranId: '',
    waliKelasId: '',
    ruangan: '',
  });

  // Fetch initial data
  useEffect(() => {
    fetchClasses();
    fetchJurusan();
    fetchTahunAjaran();
    fetchGuru();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ data: Kelas[] }>('/api/kelas?limit=100');
      if (response.success && response.data?.data) {
        setClasses(response.data.data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Gagal memuat data kelas');
      setClasses([]);
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

  const fetchTahunAjaran = async () => {
    try {
      const response = await apiClient.get<{ data: TahunAjaran[] }>('/api/tahun-ajaran?limit=100');
      if (response.success && response.data?.data) {
        setTahunAjaranList(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching tahun ajaran:', err);
    }
  };

  const fetchGuru = async () => {
    try {
      const response = await apiClient.get<{ data: Guru[] }>('/api/guru?limit=100');
      if (response.success && response.data?.data) {
        setGuruList(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching guru:', err);
    }
  };

  const filteredClasses = Array.isArray(classes) ? classes.filter((kelas) => {
    const matchesSearch =
      kelas.namaKelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (kelas.waliKelas && kelas.waliKelas.nama.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTingkat = filterTingkat === '' || kelas.tingkat === filterTingkat;
    const matchesJurusan = filterJurusan === '' || kelas.jurusan.id === filterJurusan;
    return matchesSearch && matchesTingkat && matchesJurusan;
  }) : [];

  const handleOpenModal = (kelas?: Kelas) => {
    if (kelas) {
      setEditingId(kelas.id);
      setFormData({
        namaKelas: kelas.namaKelas,
        tingkat: kelas.tingkat,
        jurusanId: kelas.jurusan.id,
        tahunAjaranId: kelas.tahunAjaran.id,
        waliKelasId: kelas.waliKelas?.id || '',
        ruangan: kelas.ruangan || '',
      });
    } else {
      setEditingId(null);
      // Set default tahun ajaran to active one
      const activeTahunAjaran = tahunAjaranList.find(ta => ta.status === 'AKTIF');
      setFormData({
        namaKelas: '',
        tingkat: 'X',
        jurusanId: jurusanList[0]?.id || '',
        tahunAjaranId: activeTahunAjaran?.id || tahunAjaranList[0]?.id || '',
        waliKelasId: '',
        ruangan: '',
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
      if (editingId) {
        // Update
        const response = await apiClient.put(`/api/kelas/${editingId}`, formData);
        if (response.success) {
          setSuccessMessage('Data kelas berhasil diupdate');
          fetchClasses();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal mengupdate data kelas');
        }
      } else {
        // Create
        const response = await apiClient.post('/api/kelas', formData);
        if (response.success) {
          setSuccessMessage('Data kelas berhasil ditambahkan');
          fetchClasses();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal menambahkan data kelas');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string, namaKelas: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kelas ${namaKelas}?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/api/kelas/${id}`);
      if (response.success) {
        setSuccessMessage('Data kelas berhasil dihapus');
        fetchClasses();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Gagal menghapus data kelas');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const totalSiswa = Array.isArray(classes) 
    ? classes.reduce((sum, kelas) => sum + kelas._count.siswa, 0)
    : 0;
  const rataRataSiswa = classes.length > 0 ? Math.round(totalSiswa / classes.length) : 0;

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
            <h1 className="text-3xl font-bold text-gray-800">Data Kelas</h1>
            <p className="text-gray-600 mt-1">Kelola data kelas dan rombongan belajar</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mt-4 md:mt-0"
          >
            <FaPlus /> Tambah Kelas
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Kelas</p>
                <p className="text-3xl font-bold text-gray-800">{Array.isArray(classes) ? classes.length : 0}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <FaSchool className="text-blue-600 text-3xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Siswa</p>
                <p className="text-3xl font-bold text-green-600">{totalSiswa}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <FaUsers className="text-green-600 text-3xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Rata-rata/Kelas</p>
                <p className="text-3xl font-bold text-orange-600">{rataRataSiswa}</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg">
                <FaUsers className="text-orange-600 text-3xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Wali Kelas</p>
                <p className="text-3xl font-bold text-purple-600">
                  {Array.isArray(classes) ? classes.filter(k => k.waliKelas).length : 0}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <FaChalkboardTeacher className="text-purple-600 text-3xl" />
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
                Cari Kelas
              </label>
              <input
                type="text"
                placeholder="Cari berdasarkan nama kelas atau wali kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Tingkat */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tingkat</label>
              <select
                value={filterTingkat}
                onChange={(e) => setFilterTingkat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Semua Tingkat</option>
                <option value="X">Kelas X</option>
                <option value="XI">Kelas XI</option>
                <option value="XII">Kelas XII</option>
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
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Nama Kelas</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Tingkat</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Jurusan</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Wali Kelas</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Jumlah Siswa</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Tahun Ajaran</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClasses.length > 0 ? (
                      filteredClasses.map((kelas, index) => (
                        <tr key={kelas.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                          <td className="py-4 px-6 text-gray-800 font-bold">{kelas.namaKelas}</td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {kelas.tingkat}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {kelas.jurusan.nama}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-800">{kelas.waliKelas?.nama || '-'}</td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {kelas._count.siswa} siswa
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-800">{kelas.tahunAjaran.tahunAjaran}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenModal(kelas)}
                                className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(kelas.id, kelas.namaKelas)}
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
                          Data kelas tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredClasses.length} dari {classes.length} kelas
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
                  {editingId ? 'Edit Data Kelas' : 'Tambah Data Kelas'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Row 1: Nama Kelas & Tingkat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nama Kelas <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.namaKelas}
                      onChange={(e) => setFormData({ ...formData, namaKelas: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="Contoh: X RPL 1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Tingkat <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.tingkat}
                      onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="X">Kelas X</option>
                      <option value="XI">Kelas XI</option>
                      <option value="XII">Kelas XII</option>
                      <option value="XIII">Kelas XIII</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Jurusan & Tahun Ajaran */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Jurusan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.jurusanId}
                      onChange={(e) => setFormData({ ...formData, jurusanId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="">Pilih Jurusan</option>
                      {jurusanList.map((jurusan) => (
                        <option key={jurusan.id} value={jurusan.id}>
                          {jurusan.nama} ({jurusan.kode})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Tahun Ajaran <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.tahunAjaranId}
                      onChange={(e) => setFormData({ ...formData, tahunAjaranId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                      disabled={!!editingId}
                    >
                      <option value="">Pilih Tahun Ajaran</option>
                      {tahunAjaranList.map((ta) => (
                        <option key={ta.id} value={ta.id}>
                          {ta.tahunAjaran} {ta.status === 'AKTIF' && '(Aktif)'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Wali Kelas & Ruangan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Wali Kelas</label>
                    <select
                      value={formData.waliKelasId}
                      onChange={(e) => setFormData({ ...formData, waliKelasId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="">Tanpa Wali Kelas</option>
                      {guruList.map((guru) => (
                        <option key={guru.id} value={guru.id}>
                          {guru.nama} ({guru.nip})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Ruangan</label>
                    <input
                      type="text"
                      value={formData.ruangan}
                      onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="Contoh: R-101"
                    />
                  </div>
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
