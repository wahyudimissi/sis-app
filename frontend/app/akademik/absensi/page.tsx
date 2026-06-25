'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import apiClient from '@/lib/api-client';
import {
  FaSave,
  FaFilter,
  FaCalendarAlt,
  FaChartBar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimes,
  FaSpinner,
} from 'react-icons/fa';

interface Siswa {
  id: string;
  nis: string;
  nama: string;
  jenisKelamin: string;
}

interface Absensi {
  id: string;
  siswaId: string;
  status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPHA' | 'TERLAMBAT';
  keterangan?: string;
  siswa?: Siswa;
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

interface StudentRow {
  id: string;
  nis: string;
  nama: string;
  status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPHA' | 'TERLAMBAT' | null;
  keterangan: string;
}

export default function AbsensiPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [mataPelajaranList, setMataPelajaranList] = useState<MataPelajaran[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [absensiData, setAbsensiData] = useState<Absensi[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState('');
  const [selectedMapelId, setSelectedMapelId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedKelasId) {
      fetchSiswaByKelas();
    }
  }, [selectedKelasId]);

  useEffect(() => {
    if (selectedKelasId && selectedDate && selectedTahunAjaranId) {
      fetchExistingAbsensi();
    }
  }, [selectedKelasId, selectedDate, selectedTahunAjaranId, selectedMapelId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [kelasRes, tahunAjaranRes, mapelRes] = await Promise.all([
        apiClient.get<{ data: Kelas[] }>('/api/kelas?limit=100'),
        apiClient.get<{ data: TahunAjaran[] }>('/api/tahun-ajaran'),
        apiClient.get<{ data: MataPelajaran[] }>('/api/mata-pelajaran?limit=100'),
      ]);

      if (kelasRes.success && kelasRes.data?.data) {
        setKelasList(kelasRes.data.data);
        if (kelasRes.data.data.length > 0) {
          setSelectedKelasId(kelasRes.data.data[0].id);
        }
      }
      
      if (tahunAjaranRes.success && tahunAjaranRes.data?.data) {
        const tahunAjaranData = tahunAjaranRes.data.data;
        setTahunAjaranList(tahunAjaranData);
        const active = tahunAjaranData.find(ta => ta.status === 'AKTIF');
        if (active) setSelectedTahunAjaranId(active.id);
      }
      
      if (mapelRes.success && mapelRes.data?.data) {
        setMataPelajaranList(mapelRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Gagal memuat data awal');
    } finally {
      setLoading(false);
    }
  };

  const fetchSiswaByKelas = async () => {
    if (!selectedKelasId) return;
    
    try {
      const response = await apiClient.get<{ data: Siswa[] }>(
        `/api/siswa?kelasId=${selectedKelasId}&limit=100`
      );
      
      if (response.success && response.data?.data) {
        const siswa = response.data.data;
        setSiswaList(siswa);
        
        // Initialize student rows with null status
        const rows = siswa.map(s => ({
          id: s.id,
          nis: s.nis,
          nama: s.nama,
          status: null as any,
          keterangan: '',
        }));
        setStudentRows(rows);
      } else {
        setSiswaList([]);
        setStudentRows([]);
      }
    } catch (err) {
      console.error('Error fetching siswa:', err);
      setSiswaList([]);
      setStudentRows([]);
    }
  };

  const fetchExistingAbsensi = async () => {
    if (!selectedKelasId || !selectedDate || !selectedTahunAjaranId) return;
    
    try {
      const mapelParam = selectedMapelId ? `&mataPelajaran=${selectedMapelId}` : '';
      const response = await apiClient.get<{ data: Absensi[] }>(
        `/api/absensi?kelasId=${selectedKelasId}&tanggal=${selectedDate}&tahunAjaranId=${selectedTahunAjaranId}${mapelParam}`
      );
      
      if (response.success && response.data?.data) {
        const existing = response.data.data;
        setAbsensiData(existing);
        
        // Update student rows with existing absensi
        setStudentRows(prev => 
          prev.map(row => {
            const found = existing.find(a => a.siswaId === row.id);
            if (found) {
              return {
                ...row,
                status: found.status,
                keterangan: found.keterangan || '',
              };
            }
            return { ...row, status: null, keterangan: '' };
          })
        );
      } else {
        setAbsensiData([]);
        // Reset status to null
        setStudentRows(prev => 
          prev.map(row => ({ ...row, status: null, keterangan: '' }))
        );
      }
    } catch (err) {
      console.error('Error fetching absensi:', err);
      setAbsensiData([]);
    }
  };

  const handleStatusChange = (siswaId: string, status: StudentRow['status']) => {
    setStudentRows(prev =>
      prev.map(row =>
        row.id === siswaId ? { ...row, status } : row
      )
    );
  };

  const handleSetAll = (status: StudentRow['status']) => {
    setStudentRows(prev => prev.map(row => ({ ...row, status })));
  };

  const handleSaveAbsensi = async () => {
    if (!selectedKelasId || !selectedTahunAjaranId) {
      setError('Pilih kelas dan tahun ajaran terlebih dahulu');
      return;
    }

    // Check if any student has status
    const hasData = studentRows.some(row => row.status !== null);
    if (!hasData) {
      setError('Belum ada status kehadiran yang diisi');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const mapel = selectedMapelId
        ? mataPelajaranList.find(m => m.id === selectedMapelId)?.nama
        : undefined;

      const absensiList = studentRows
        .filter(row => row.status !== null)
        .map(row => ({
          siswaId: row.id,
          status: row.status as string,
          keterangan: row.keterangan || undefined,
        }));

      const response = await apiClient.post('/api/absensi', {
        tahunAjaranId: selectedTahunAjaranId,
        kelasId: selectedKelasId,
        tanggal: selectedDate,
        mataPelajaran: mapel,
        absensiList,
      });

      if (response.success) {
        setSuccessMessage(`Absensi berhasil disimpan (${absensiList.length} siswa)`);
        fetchExistingAbsensi(); // Refresh data
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Gagal menyimpan absensi');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const getStatusCount = (status: StudentRow['status']) => {
    return studentRows.filter(s => s.status === status).length;
  };

  const getStatusButton = (
    student: StudentRow,
    status: StudentRow['status'],
    label: string,
    colorClass: string,
    icon: any
  ) => {
    const isActive = student.status === status;
    return (
      <button
        onClick={() => handleStatusChange(student.id, status)}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-sm transition ${
          isActive
            ? `${colorClass} text-white`
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  const selectedKelas = kelasList.find(k => k.id === selectedKelasId);
  const selectedTahunAjaran = tahunAjaranList.find(ta => ta.id === selectedTahunAjaranId);

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
            <h1 className="text-3xl font-bold text-gray-800">Absensi Siswa</h1>
            <p className="text-gray-600 mt-1">Input dan kelola kehadiran siswa</p>
          </div>
          <button
            onClick={handleSaveAbsensi}
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mt-4 md:mt-0 disabled:opacity-50"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving ? 'Menyimpan...' : 'Simpan Absensi'}
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Hadir</p>
                <p className="text-2xl font-bold text-green-600">
                  {getStatusCount('HADIR')}
                </p>
              </div>
              <FaCheckCircle className="text-3xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Izin</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {getStatusCount('IZIN')}
                </p>
              </div>
              <FaExclamationTriangle className="text-3xl text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sakit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {getStatusCount('SAKIT')}
                </p>
              </div>
              <FaChartBar className="text-3xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Alpha</p>
                <p className="text-2xl font-bold text-red-600">
                  {getStatusCount('ALPHA')}
                </p>
              </div>
              <FaTimesCircle className="text-3xl text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Terlambat</p>
                <p className="text-2xl font-bold text-orange-600">
                  {getStatusCount('TERLAMBAT')}
                </p>
              </div>
              <FaClock className="text-3xl text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Tanggal
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaFilter className="inline mr-2" />
                Kelas
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
                    {ta.tahunAjaran}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mata Pelajaran (Opsional)</label>
              <select
                value={selectedMapelId}
                onChange={(e) => setSelectedMapelId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Absensi Harian (Semua)</option>
                {mataPelajaranList.map((mapel) => (
                  <option key={mapel.id} value={mapel.id}>
                    {mapel.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Set Semua</label>
              <select
                onChange={(e) =>
                  handleSetAll(
                    e.target.value === '' ? null : (e.target.value as StudentRow['status'])
                  )
                }
                value=""
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Pilih Status</option>
                <option value="HADIR">Hadir Semua</option>
                <option value="IZIN">Izin Semua</option>
                <option value="SAKIT">Sakit Semua</option>
                <option value="ALPHA">Alpha Semua</option>
              </select>
            </div>
          </div>
        </div>

        {/* Absensi Table */}
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
        ) : studentRows.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
            <FaExclamationTriangle className="text-5xl mx-auto mb-4 text-yellow-500" />
            <p className="text-lg">Tidak ada siswa di kelas ini</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">No</th>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">NIS</th>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">Nama Siswa</th>
                    <th className="text-center py-4 px-6 text-gray-700 font-semibold">Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody>
                  {studentRows.map((student, index) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                      <td className="py-4 px-6 text-gray-800 font-semibold">{student.nis}</td>
                      <td className="py-4 px-6 text-gray-800 font-semibold">{student.nama}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {getStatusButton(
                            student,
                            'HADIR',
                            'Hadir',
                            'bg-green-600',
                            <FaCheckCircle />
                          )}
                          {getStatusButton(
                            student,
                            'IZIN',
                            'Izin',
                            'bg-yellow-600',
                            <FaExclamationTriangle />
                          )}
                          {getStatusButton(
                            student,
                            'SAKIT',
                            'Sakit',
                            'bg-blue-600',
                            <FaChartBar />
                          )}
                          {getStatusButton(
                            student,
                            'ALPHA',
                            'Alpha',
                            'bg-red-600',
                            <FaTimesCircle />
                          )}
                          {getStatusButton(
                            student,
                            'TERLAMBAT',
                            'Terlambat',
                            'bg-orange-600',
                            <FaClock />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Alert */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Info:</strong> Pastikan data absensi sudah benar sebelum menyimpan.
                Absensi yang sudah disimpan dapat diubah kembali dengan mengubah status dan menyimpan ulang.
                {selectedKelas && selectedTahunAjaran && (
                  <span> Absensi untuk <strong>{selectedKelas.namaKelas}</strong> pada <strong>{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button (Bottom) */}
        {studentRows.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleSaveAbsensi}
              disabled={saving}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {saving ? 'Menyimpan...' : 'Simpan Absensi'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}
