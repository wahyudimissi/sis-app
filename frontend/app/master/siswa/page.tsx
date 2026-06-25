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
  FaEye,
  FaFileExcel,
  FaFilePdf,
  FaUpload,
  FaFilter,
  FaTimes,
  FaSpinner,
  FaUser,
} from 'react-icons/fa';

interface Student {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir?: string;
  tanggalLahir?: string;
  agama?: string;
  alamat?: string;
  noHp?: string;
  email?: string;
  namaOrangTua?: string;
  noHpOrangTua?: string;
  kelasId?: string;
  tahunMasuk?: string;
  status: 'AKTIF' | 'LULUS' | 'PINDAH' | 'KELUAR';
  foto?: string;
  kelas?: {
    id: string;
    nama: string;
    tingkat: string;
  };
}

interface FormData {
  nis: string;
  nisn: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  alamat: string;
  noHp: string;
  email: string;
  foto: string;
  namaOrangTua: string;
  noHpOrangTua: string;
  kelasId: string;
  tahunMasuk: string;
  status: 'AKTIF' | 'LULUS' | 'PINDAH' | 'KELUAR';
  username: string;
  password: string;
}

export default function DataSiswaPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadingFoto, setUploadingFoto] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nis: '',
    nisn: '',
    nama: '',
    jenisKelamin: 'L',
    tempatLahir: '',
    tanggalLahir: '',
    agama: '',
    alamat: '',
    noHp: '',
    email: '',
    foto: '',
    namaOrangTua: '',
    noHpOrangTua: '',
    kelasId: '',
    tahunMasuk: new Date().getFullYear().toString(),
    status: 'AKTIF',
    username: '',
    password: '',
  });

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/siswa?limit=1000');
      if (response.success && response.data) {
        // API returns { data: [...], pagination: {...} }
        const responseData = response.data as any;
        const studentsData = Array.isArray(responseData?.data) 
          ? responseData.data 
          : Array.isArray(responseData) 
            ? responseData 
            : [];
        setStudents(studentsData);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Gagal memuat data siswa');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = Array.isArray(students) ? students.filter((student) => {
    const matchesSearch =
      student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nis.includes(searchTerm) ||
      student.nisn.includes(searchTerm);
    const matchesKelas = filterKelas === '' || student.kelas?.tingkat === filterKelas;
    const matchesStatus = filterStatus === '' || student.status === filterStatus;
    return matchesSearch && matchesKelas && matchesStatus;
  }) : [];

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingId(student.id);
      setFormData({
        nis: student.nis,
        nisn: student.nisn,
        nama: student.nama,
        jenisKelamin: student.jenisKelamin,
        tempatLahir: student.tempatLahir || '',
        tanggalLahir: student.tanggalLahir || '',
        agama: student.agama || '',
        alamat: student.alamat || '',
        noHp: student.noHp || '',
        email: student.email || '',
        foto: student.foto || '',
        namaOrangTua: student.namaOrangTua || '',
        noHpOrangTua: student.noHpOrangTua || '',
        kelasId: student.kelasId || '',
        tahunMasuk: student.tahunMasuk || new Date().getFullYear().toString(),
        status: student.status,
        username: '',
        password: '',
      });
    } else {
      setEditingId(null);
      setFormData({
        nis: '',
        nisn: '',
        nama: '',
        jenisKelamin: 'L',
        tempatLahir: '',
        tanggalLahir: '',
        agama: '',
        alamat: '',
        noHp: '',
        email: '',
        foto: '',
        namaOrangTua: '',
        noHpOrangTua: '',
        kelasId: '',
        tahunMasuk: new Date().getFullYear().toString(),
        status: 'AKTIF',
        username: '',
        password: '',
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
        const response = await apiClient.put(`/api/siswa/${editingId}`, formData);
        if (response.success) {
          setSuccessMessage('Data siswa berhasil diupdate');
          fetchStudents();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal mengupdate data siswa');
        }
      } else {
        // Create
        const response = await apiClient.post('/api/siswa', formData);
        if (response.success) {
          setSuccessMessage('Data siswa berhasil ditambahkan');
          fetchStudents();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal menambahkan data siswa');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus siswa ${nama}?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/api/siswa/${id}`);
      if (response.success) {
        setSuccessMessage('Data siswa berhasil dihapus');
        fetchStudents();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Gagal menghapus data siswa');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file maksimal 2MB');
      return;
    }

    setUploadingFoto(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', 'foto_siswa');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        setFormData({ ...formData, foto: result.data.path });
        setSuccessMessage('Foto berhasil diupload');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.message || 'Gagal upload foto');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal upload foto');
    } finally {
      setUploadingFoto(false);
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
            <h1 className="text-3xl font-bold text-gray-800">Data Siswa</h1>
            <p className="text-gray-600 mt-1">Kelola data siswa sekolah</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
              <FaFileExcel /> Export Excel
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2">
              <FaFilePdf /> Export PDF
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
              <FaUpload /> Import
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
            >
              <FaPlus /> Tambah Siswa
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                <FaSearch className="inline mr-2" />
                Cari Siswa
              </label>
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIS, atau NISN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Kelas */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaFilter className="inline mr-2" />
                Kelas
              </label>
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Semua Kelas</option>
                <option value="X">Kelas X</option>
                <option value="XI">Kelas XI</option>
                <option value="XII">Kelas XII</option>
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaFilter className="inline mr-2" />
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Semua Status</option>
                <option value="AKTIF">Aktif</option>
                <option value="LULUS">Lulus</option>
                <option value="PINDAH">Pindah</option>
                <option value="KELUAR">Keluar</option>
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
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Foto</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">NIS</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">NISN</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Nama</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">L/P</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Kelas</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Status</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center">
                              {student.foto ? (
                                <img
                                  src={student.foto}
                                  alt={student.nama}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <FaUser className="text-gray-400 text-lg" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-800 font-semibold">{student.nis}</td>
                          <td className="py-4 px-6 text-gray-800">{student.nisn}</td>
                          <td className="py-4 px-6 text-gray-800 font-semibold">{student.nama}</td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                student.jenisKelamin === 'L'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-pink-100 text-pink-700'
                              }`}
                            >
                              {student.jenisKelamin === 'L' ? 'L' : 'P'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-800">{student.kelas?.nama || '-'}</td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                student.status === 'AKTIF'
                                  ? 'bg-green-100 text-green-700'
                                  : student.status === 'LULUS'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenModal(student)}
                                className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(student.id, student.nama)}
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
                        <td colSpan={9} className="py-8 text-center text-gray-500">
                          Data siswa tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredStudents.length} dari {students.length} siswa
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Edit Data Siswa' : 'Tambah Data Siswa'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Row 1: NIS & NISN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      NIS <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nis}
                      onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      NISN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Nama */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                {/* Row 3: Jenis Kelamin & Agama */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.jenisKelamin}
                      onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Agama</label>
                    <select
                      value={formData.agama}
                      onChange={(e) => setFormData({ ...formData, agama: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="">Pilih Agama</option>
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Tempat & Tanggal Lahir */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Tempat Lahir</label>
                    <input
                      type="text"
                      value={formData.tempatLahir}
                      onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={formData.tanggalLahir}
                      onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                {/* Row 5: Alamat */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Alamat</label>
                  <textarea
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    rows={3}
                  />
                </div>

                {/* Row 6: Foto Siswa */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Foto Siswa</label>
                  <div className="flex items-start gap-4">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      {formData.foto ? (
                        <img
                          src={formData.foto}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                          <FaEye className="text-gray-400 text-3xl" />
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="fotoSiswaInput"
                        accept="image/*"
                        onChange={handleFotoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="fotoSiswaInput"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                      >
                        {uploadingFoto ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FaUpload />
                            Upload Foto
                          </>
                        )}
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Format: JPG, PNG, GIF. Maksimal 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Row 7: No HP & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">No HP</label>
                    <input
                      type="text"
                      value={formData.noHp}
                      onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                {/* Row 8: Data Orang Tua */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Orang Tua / Wali</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Nama Orang Tua / Wali</label>
                      <input
                        type="text"
                        value={formData.namaOrangTua}
                        onChange={(e) => setFormData({ ...formData, namaOrangTua: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">No HP Orang Tua</label>
                      <input
                        type="text"
                        value={formData.noHpOrangTua}
                        onChange={(e) => setFormData({ ...formData, noHpOrangTua: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 9: Tahun Masuk & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Tahun Masuk</label>
                    <input
                      type="text"
                      value={formData.tahunMasuk}
                      onChange={(e) => setFormData({ ...formData, tahunMasuk: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="AKTIF">Aktif</option>
                      <option value="LULUS">Lulus</option>
                      <option value="PINDAH">Pindah</option>
                      <option value="KELUAR">Keluar</option>
                    </select>
                  </div>
                </div>

                {/* Row 9: Data Akun (only for new student) */}
                {!editingId && (
                  <>
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Akun Siswa</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Username <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            required={!editingId}
                            minLength={3}
                            placeholder="Minimal 3 karakter"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            required={!editingId}
                            minLength={6}
                            placeholder="Minimal 6 karakter"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Username dan password akan digunakan siswa untuk login ke sistem.
                      </p>
                    </div>
                  </>
                )}

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
