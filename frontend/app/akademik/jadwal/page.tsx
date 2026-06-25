'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import apiClient from '@/lib/api-client';
import {
  FaPlus,
  FaFilter,
  FaCalendarAlt,
  FaPrint,
  FaDownload,
  FaClock,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from 'react-icons/fa';

interface JadwalPelajaran {
  id: string;
  tahunAjaranId: string;
  kelasId: string;
  mataPelajaranId: string;
  guruId: string;
  hari: 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU';
  jamKe: number;
  jamMulai: string;
  jamSelesai: string;
  ruangan?: string;
  tahunAjaran?: {
    tahunAjaran: string;
    status: string;
  };
  kelas?: {
    namaKelas: string;
    tingkat: string;
  };
  mataPelajaran?: {
    kode: string;
    nama: string;
  };
  guru?: {
    nip: string;
    nama: string;
  };
}

interface Kelas {
  id: string;
  namaKelas: string;
  tingkat: string;
}

interface TahunAjaran {
  id: string;
  tahunAjaran: string;
  status: string;
}

interface MataPelajaran {
  id: string;
  kode: string;
  nama: string;
}

interface Guru {
  id: string;
  nip: string;
  nama: string;
}

interface FormData {
  kelasId: string;
  tahunAjaranId: string;
  mataPelajaranId: string;
  guruId: string;
  hari: 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU';
  jamKe: number;
  jamMulai: string;
  jamSelesai: string;
  ruangan: string;
}

export default function JadwalPelajaranPage() {
  const [jadwalList, setJadwalList] = useState<JadwalPelajaran[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [mataPelajaranList, setMataPelajaranList] = useState<MataPelajaran[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    kelasId: '',
    tahunAjaranId: '',
    mataPelajaranId: '',
    guruId: '',
    hari: 'SENIN',
    jamKe: 1,
    jamMulai: '07:00',
    jamSelesai: '07:45',
    ruangan: '',
  });

  const days: Array<'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU'> = 
    ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
  
  const jamPelajaran = [
    { ke: 1, mulai: '07:00', selesai: '07:45' },
    { ke: 2, mulai: '07:45', selesai: '08:30' },
    { ke: 3, mulai: '08:30', selesai: '09:15' },
    { ke: 4, mulai: '09:15', selesai: '10:00' },
    { ke: 5, mulai: '10:15', selesai: '11:00' },
    { ke: 6, mulai: '11:00', selesai: '11:45' },
    { ke: 7, mulai: '12:00', selesai: '12:45' },
    { ke: 8, mulai: '12:45', selesai: '13:30' },
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedKelasId && selectedTahunAjaranId) {
      fetchJadwal();
    }
  }, [selectedKelasId, selectedTahunAjaranId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [kelasRes, tahunAjaranRes, mapelRes, guruRes] = await Promise.all([
        apiClient.get<{ data: Kelas[] }>('/api/kelas?limit=100'),
        apiClient.get<{ data: TahunAjaran[] }>('/api/tahun-ajaran'),
        apiClient.get<{ data: MataPelajaran[] }>('/api/mata-pelajaran?limit=100'),
        apiClient.get<{ data: Guru[] }>('/api/guru?limit=100'),
      ]);

      if (kelasRes.success && kelasRes.data?.data) setKelasList(kelasRes.data.data);
      if (tahunAjaranRes.success && tahunAjaranRes.data?.data) {
        const tahunAjaranData = tahunAjaranRes.data.data;
        setTahunAjaranList(tahunAjaranData);
        const active = tahunAjaranData.find(ta => ta.status === 'AKTIF');
        if (active) setSelectedTahunAjaranId(active.id);
      }
      if (mapelRes.success && mapelRes.data?.data) setMataPelajaranList(mapelRes.data.data);
      if (guruRes.success && guruRes.data?.data) setGuruList(guruRes.data.data);

      if (kelasRes.success && kelasRes.data?.data && kelasRes.data.data.length > 0) {
        setSelectedKelasId(kelasRes.data.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Gagal memuat data awal');
    } finally {
      setLoading(false);
    }
  };

  const fetchJadwal = async () => {
    if (!selectedKelasId || !selectedTahunAjaranId) return;
    
    try {
      const response = await apiClient.get<{ data: JadwalPelajaran[] }>(
        `/api/jadwal-pelajaran?kelasId=${selectedKelasId}&tahunAjaranId=${selectedTahunAjaranId}`
      );
      if (response.success && response.data?.data) {
        setJadwalList(response.data.data);
      } else {
        setJadwalList([]);
      }
    } catch (err) {
      console.error('Error fetching jadwal:', err);
      setJadwalList([]);
    }
  };

  const getScheduleForDayAndJam = (hari: string, jamKe: number) => {
    return jadwalList.find((s) => s.hari === hari && s.jamKe === jamKe);
  };

  const selectedKelas = kelasList.find(k => k.id === selectedKelasId);
  const selectedTahunAjaran = tahunAjaranList.find(ta => ta.id === selectedTahunAjaranId);

  const handleOpenModal = (hari?: string, jamKe?: number, jadwal?: JadwalPelajaran) => {
    if (jadwal) {
      setEditingId(jadwal.id);
      setFormData({
        kelasId: jadwal.kelasId,
        tahunAjaranId: jadwal.tahunAjaranId,
        mataPelajaranId: jadwal.mataPelajaranId,
        guruId: jadwal.guruId,
        hari: jadwal.hari,
        jamKe: jadwal.jamKe,
        jamMulai: jadwal.jamMulai,
        jamSelesai: jadwal.jamSelesai,
        ruangan: jadwal.ruangan || '',
      });
    } else {
      setEditingId(null);
      const jam = jamPelajaran.find(j => j.ke === jamKe);
      setFormData({
        kelasId: selectedKelasId,
        tahunAjaranId: selectedTahunAjaranId,
        mataPelajaranId: '',
        guruId: '',
        hari: (hari as any) || 'SENIN',
        jamKe: jamKe || 1,
        jamMulai: jam?.mulai || '07:00',
        jamSelesai: jam?.selesai || '07:45',
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
        const response = await apiClient.put(`/api/jadwal-pelajaran/${editingId}`, formData);
        if (response.success) {
          setSuccessMessage('Jadwal berhasil diupdate');
          fetchJadwal();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal mengupdate jadwal');
        }
      } else {
        const response = await apiClient.post('/api/jadwal-pelajaran', formData);
        if (response.success) {
          setSuccessMessage('Jadwal berhasil ditambahkan');
          fetchJadwal();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal menambahkan jadwal');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      return;
    }

    try {
      const response = await apiClient.delete(`/api/jadwal-pelajaran/${id}`);
      if (response.success) {
        setSuccessMessage('Jadwal berhasil dihapus');
        fetchJadwal();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Gagal menghapus jadwal');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleJamChange = (jamKe: number) => {
    const jam = jamPelajaran.find(j => j.ke === jamKe);
    if (jam) {
      setFormData({
        ...formData,
        jamKe,
        jamMulai: jam.mulai,
        jamSelesai: jam.selesai,
      });
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
            <h1 className="text-3xl font-bold text-gray-800">Jadwal Pelajaran</h1>
            <p className="text-gray-600 mt-1">Lihat dan kelola jadwal pelajaran</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
              <FaDownload /> Export Excel
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2">
              <FaPrint /> Cetak PDF
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
            >
              <FaPlus /> Tambah Jadwal
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 mb-2">Jadwal Aktif</p>
              <h2 className="text-2xl font-bold">
                {selectedKelas ? `${selectedKelas.namaKelas} - ${selectedKelas.tingkat}` : 'Pilih Kelas'}
              </h2>
              <p className="text-primary-100 mt-2">
                {selectedTahunAjaran ? `Tahun Ajaran ${selectedTahunAjaran.tahunAjaran}` : 'Pilih Tahun Ajaran'}
              </p>
            </div>
            <FaCalendarAlt className="text-6xl text-primary-200" />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaFilter className="inline mr-2" />
                Pilih Kelas
              </label>
              <select
                value={selectedKelasId}
                onChange={(e) => setSelectedKelasId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Pilih Kelas</option>
                {kelasList.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.namaKelas} - {kelas.tingkat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tahun Ajaran</label>
              <select
                value={selectedTahunAjaranId}
                onChange={(e) => setSelectedTahunAjaranId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Pilih Tahun Ajaran</option>
                {tahunAjaranList.map((ta) => (
                  <option key={ta.id} value={ta.id}>
                    {ta.tahunAjaran} - {ta.status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 flex items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-primary-600 mr-3" />
            <span className="text-gray-600 text-lg">Memuat data...</span>
          </div>
        ) : !selectedKelasId || !selectedTahunAjaranId ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
            <FaExclamationTriangle className="text-5xl mx-auto mb-4 text-yellow-500" />
            <p className="text-lg">Silakan pilih Kelas dan Tahun Ajaran terlebih dahulu</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 py-3 px-4 text-gray-700 font-semibold bg-primary-100">
                      <FaClock className="inline mr-2" />
                      Jam
                    </th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className="border border-gray-300 py-3 px-4 text-gray-700 font-semibold"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jamPelajaran.map((jam) => (
                    <tr key={jam.ke} className="hover:bg-gray-50">
                      <td className="border border-gray-300 py-3 px-4 text-center bg-gray-50">
                        <div className="font-bold text-gray-800">Jam {jam.ke}</div>
                        <div className="text-sm text-gray-600">
                          {jam.mulai} - {jam.selesai}
                        </div>
                      </td>
                      {days.map((day) => {
                        const schedule = getScheduleForDayAndJam(day, jam.ke);
                        return (
                          <td
                            key={`${day}-${jam.ke}`}
                            className="border border-gray-300 py-3 px-4 cursor-pointer hover:bg-blue-50 transition"
                            onClick={() => !schedule && handleOpenModal(day, jam.ke)}
                          >
                            {schedule ? (
                              <div className="space-y-1 group relative">
                                <div className="font-bold text-primary-600 text-sm">
                                  {schedule.mataPelajaran?.nama || '-'}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {schedule.guru?.nama || '-'}
                                </div>
                                {schedule.ruangan && (
                                  <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block">
                                    {schedule.ruangan}
                                  </div>
                                )}
                                <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenModal(day, jam.ke, schedule);
                                    }}
                                    className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                                  >
                                    <FaEdit /> Edit
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(schedule.id);
                                    }}
                                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                                  >
                                    <FaTrash /> Hapus
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-gray-400 text-sm">
                                <div className="group-hover:hidden">-</div>
                                <div className="hidden group-hover:block text-primary-600">
                                  <FaPlus className="inline" /> Tambah
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-4">Keterangan:</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-600 rounded"></div>
              <span className="text-sm text-gray-700">Mata Pelajaran</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-700 rounded"></div>
              <span className="text-sm text-gray-700">Ruang Kelas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-sm text-gray-700">Jam Kosong (klik untuk tambah)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border border-primary-300 rounded"></div>
              <span className="text-sm text-gray-700">Hover untuk aksi Edit/Hapus</span>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Edit Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Row 1: Kelas & Tahun Ajaran */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Kelas <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.kelasId}
                      onChange={(e) => setFormData({ ...formData, kelasId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                      disabled={!!editingId}
                    >
                      <option value="">Pilih Kelas</option>
                      {kelasList.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>
                          {kelas.namaKelas} - {kelas.tingkat}
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
                          {ta.tahunAjaran}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Mata Pelajaran & Guru */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Mata Pelajaran <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.mataPelajaranId}
                      onChange={(e) => setFormData({ ...formData, mataPelajaranId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="">Pilih Mata Pelajaran</option>
                      {mataPelajaranList.map((mapel) => (
                        <option key={mapel.id} value={mapel.id}>
                          {mapel.kode} - {mapel.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Guru <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.guruId}
                      onChange={(e) => setFormData({ ...formData, guruId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="">Pilih Guru</option>
                      {guruList.map((guru) => (
                        <option key={guru.id} value={guru.id}>
                          {guru.nama} ({guru.nip})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Hari & Jam Ke */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Hari <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.hari}
                      onChange={(e) => setFormData({ ...formData, hari: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Jam Ke <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.jamKe}
                      onChange={(e) => handleJamChange(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      {jamPelajaran.map((jam) => (
                        <option key={jam.ke} value={jam.ke}>
                          Jam {jam.ke} ({jam.mulai} - {jam.selesai})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 4: Jam Mulai & Jam Selesai */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Jam Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.jamMulai}
                      onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Jam Selesai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.jamSelesai}
                      onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Row 5: Ruangan */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Ruangan</label>
                  <input
                    type="text"
                    value={formData.ruangan}
                    onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Contoh: R-101, Lab Komputer, Aula"
                  />
                </div>

                {/* Error in Modal */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                    <FaExclamationTriangle className="mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Terjadi Kesalahan</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Info Note */}
                {!editingId && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                    <strong>Catatan:</strong> Sistem akan otomatis mencegah jadwal bentrok (kelas atau guru yang sama pada waktu yang sama).
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
