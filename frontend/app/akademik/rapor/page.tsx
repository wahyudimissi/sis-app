'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import apiClient from '@/lib/api-client';
import {
  FaFilter,
  FaEye,
  FaFilePdf,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSchool,
  FaTimes,
  FaSave,
  FaSpinner,
  FaEdit,
} from 'react-icons/fa';

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

interface Rapor {
  id: string;
  siswaId: string;
  tahunAjaranId: string;
  semester: 'GANJIL' | 'GENAP';
  catatanWaliKelas: string | null;
  absensiSakit: number;
  absensiIzin: number;
  absensiAlpha: number;
  ekstrakurikuler: string | null;
  prestasi: string | null;
  validasiWaliKelas: boolean;
  validasiKepsek: boolean;
  status: 'BELUM' | 'PROSES' | 'SELESAI';
  tanggalGenerate: string | null;
  siswa: {
    nis: string;
    nisn?: string;
    nama: string;
    jenisKelamin?: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    agama?: string;
    alamat?: string;
    kelas?: {
      namaKelas: string;
      tingkat: string;
      jurusan?: {
        nama: string;
      };
    };
  };
  tahunAjaran?: {
    tahunAjaran: string;
  };
}

interface RaporDetail extends Rapor {
  nilai?: Array<{
    id: string;
    nilaiTugas: number | null;
    nilaiUTS: number | null;
    nilaiUAS: number | null;
    nilaiAkhir: number | null;
    predikat: string | null;
    deskripsi: string | null;
    mataPelajaran: {
      kode: string;
      nama: string;
      kelompok: string;
      kkm: number;
    };
  }>;
  rataRata?: number;
}

export default function ERaporPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [raporList, setRaporList] = useState<Rapor[]>([]);
  const [raporDetail, setRaporDetail] = useState<RaporDetail | null>(null);

  const [selectedKelasId, setSelectedKelasId] = useState<string>('');
  const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<'GANJIL' | 'GENAP'>('GANJIL');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedRaporId, setSelectedRaporId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editingCatatan, setEditingCatatan] = useState(false);
  const [catatanTemp, setCatatanTemp] = useState('');
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Load master data
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [kelasRes, tahunAjaranRes] = await Promise.all([
          apiClient.get<{ data: Kelas[] }>('/api/kelas?limit=100'),
          apiClient.get<{ data: TahunAjaran[] }>('/api/tahun-ajaran'),
        ]);

        if (kelasRes.success && kelasRes.data?.data) {
          const kelasData = Array.isArray(kelasRes.data.data) ? kelasRes.data.data : [];
          setKelasList(kelasData);
          if (kelasData.length > 0) {
            setSelectedKelasId(kelasData[0].id);
          }
        }

        if (tahunAjaranRes.success && tahunAjaranRes.data?.data) {
          const tahunAjaranData = Array.isArray(tahunAjaranRes.data.data) ? tahunAjaranRes.data.data : [];
          setTahunAjaranList(tahunAjaranData);
          const active = tahunAjaranData.find((ta) => ta.status === 'AKTIF');
          if (active) setSelectedTahunAjaranId(active.id);
        }
      } catch (err) {
        console.error('Error loading master data:', err);
        showNotification('Gagal memuat data master', 'error');
      }
    };

    loadMasterData();
  }, []);

  // Load rapor list when filters change
  useEffect(() => {
    if (!selectedKelasId || !selectedTahunAjaranId) return;

    const loadRaporList = async () => {
      setLoading(true);
      try {
        let url = `/api/rapor?kelasId=${selectedKelasId}&tahunAjaranId=${selectedTahunAjaranId}&semester=${selectedSemester}`;
        if (filterStatus) {
          url += `&status=${filterStatus}`;
        }

        const response = await apiClient.get<{ data: Rapor[] }>(url);

        if (response.success && response.data?.data) {
          const data = Array.isArray(response.data.data) ? response.data.data : [];
          setRaporList(data);
        } else {
          setRaporList([]);
        }
      } catch (err) {
        console.error('Error loading rapor list:', err);
        setRaporList([]);
        showNotification('Gagal memuat daftar rapor', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadRaporList();
  }, [selectedKelasId, selectedTahunAjaranId, selectedSemester, filterStatus]);

  // Load rapor detail
  const loadRaporDetail = async (raporId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ data: RaporDetail }>(`/api/rapor/${raporId}`);

      if (response.success && response.data?.data) {
        setRaporDetail(response.data.data);
        setCatatanTemp(response.data.data.catatanWaliKelas || '');
        setViewMode('detail');
      } else {
        showNotification('Gagal memuat detail rapor', 'error');
      }
    } catch (err) {
      console.error('Error loading rapor detail:', err);
      showNotification('Gagal memuat detail rapor', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle preview
  const handlePreview = (raporId: string) => {
    setSelectedRaporId(raporId);
    loadRaporDetail(raporId);
  };

  // Handle generate rapor massal
  const handleGenerateMassal = async () => {
    if (!selectedKelasId || !selectedTahunAjaranId) {
      showNotification('Pilih kelas dan tahun ajaran terlebih dahulu', 'error');
      return;
    }

    const confirmGenerate = window.confirm(
      'Generate rapor untuk semua siswa di kelas ini?'
    );
    if (!confirmGenerate) return;

    setGenerating(true);
    try {
      const response = await apiClient.post('/api/rapor/generate', {
        kelasId: selectedKelasId,
        tahunAjaranId: selectedTahunAjaranId,
        semester: selectedSemester,
      });

      if (response.success) {
        showNotification(
          response.message || 'Rapor berhasil di-generate',
          'success'
        );
        // Reload rapor list
        const url = `/api/rapor?kelasId=${selectedKelasId}&tahunAjaranId=${selectedTahunAjaranId}&semester=${selectedSemester}`;
        const reloadRes = await apiClient.get<{ data: Rapor[] }>(url);
        if (reloadRes.success && reloadRes.data?.data) {
          setRaporList(Array.isArray(reloadRes.data.data) ? reloadRes.data.data : []);
        }
      } else {
        showNotification(response.message || 'Gagal generate rapor', 'error');
      }
    } catch (err: any) {
      console.error('Error generating rapor:', err);
      showNotification(err.message || 'Gagal generate rapor', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // Handle save catatan
  const handleSaveCatatan = async () => {
    if (!raporDetail) return;

    setSaving(true);
    try {
      const response = await apiClient.put(`/api/rapor/${raporDetail.id}`, {
        catatanWaliKelas: catatanTemp,
      });

      if (response.success) {
        showNotification('Catatan berhasil disimpan', 'success');
        setRaporDetail({ ...raporDetail, catatanWaliKelas: catatanTemp });
        setEditingCatatan(false);
      } else {
        showNotification(response.message || 'Gagal menyimpan catatan', 'error');
      }
    } catch (err: any) {
      console.error('Error saving catatan:', err);
      showNotification(err.message || 'Gagal menyimpan catatan', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handle validasi
  const handleValidasi = async (type: 'wali' | 'kepsek') => {
    if (!raporDetail) return;

    const confirmValidasi = window.confirm(
      `Validasi rapor sebagai ${type === 'wali' ? 'Wali Kelas' : 'Kepala Sekolah'}?`
    );
    if (!confirmValidasi) return;

    setSaving(true);
    try {
      const updateData: any = {};
      if (type === 'wali') {
        updateData.validasiWaliKelas = true;
      } else {
        updateData.validasiKepsek = true;
      }

      // Check if both validations will be done
      const bothValidated =
        (type === 'wali' ? true : raporDetail.validasiWaliKelas) &&
        (type === 'kepsek' ? true : raporDetail.validasiKepsek);

      if (bothValidated) {
        updateData.status = 'SELESAI';
      }

      const response = await apiClient.put(`/api/rapor/${raporDetail.id}`, updateData);

      if (response.success) {
        showNotification('Validasi berhasil', 'success');
        // Reload detail
        loadRaporDetail(raporDetail.id);
      } else {
        showNotification(response.message || 'Gagal validasi', 'error');
      }
    } catch (err: any) {
      console.error('Error validasi:', err);
      showNotification(err.message || 'Gagal validasi', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === 'SELESAI') {
      return (
        <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          <FaCheckCircle className="mr-1" /> Selesai
        </span>
      );
    } else if (status === 'PROSES') {
      return (
        <span className="inline-flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
          <FaClock className="mr-1" /> Proses
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
          <FaTimesCircle className="mr-1" /> Belum
        </span>
      );
    }
  };

  // Get statistics
  const getStatistics = () => {
    if (!Array.isArray(raporList)) return { selesai: 0, proses: 0, belum: 0 };
    return {
      selesai: raporList.filter((r) => r.status === 'SELESAI').length,
      proses: raporList.filter((r) => r.status === 'PROSES').length,
      belum: raporList.filter((r) => r.status === 'BELUM').length,
    };
  };

  const stats = getStatistics();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Notification */}
          {notification.show && (
            <div
              className={`${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              } border px-4 py-3 rounded-lg flex items-center justify-between`}
            >
              <span>{notification.message}</span>
              <button onClick={() => setNotification({ ...notification, show: false })}>
                <FaTimes />
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">E-Rapor</h1>
              <p className="text-gray-600 mt-1">Kelola dan cetak rapor siswa digital</p>
            </div>
            {viewMode === 'list' ? (
              <button
                onClick={handleGenerateMassal}
                disabled={generating || !selectedKelasId || !selectedTahunAjaranId}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mt-4 md:mt-0 disabled:opacity-50"
              >
                {generating ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                {generating ? 'Generating...' : 'Generate Rapor Massal'}
              </button>
            ) : (
              <button
                onClick={() => setViewMode('list')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 mt-4 md:mt-0"
              >
                ← Kembali ke Daftar
              </button>
            )}
          </div>

          {viewMode === 'list' ? (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Selesai</p>
                      <p className="text-3xl font-bold text-green-600">{stats.selesai}</p>
                    </div>
                    <FaCheckCircle className="text-4xl text-green-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Proses</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.proses}</p>
                    </div>
                    <FaClock className="text-4xl text-yellow-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Belum</p>
                      <p className="text-3xl font-bold text-red-600">{stats.belum}</p>
                    </div>
                    <FaTimesCircle className="text-4xl text-red-600" />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          {kelas.namaKelas} - Tingkat {kelas.tingkat}
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
                    <label className="block text-gray-700 font-semibold mb-2">Semester</label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value as 'GANJIL' | 'GENAP')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="GANJIL">Ganjil</option>
                      <option value="GENAP">Genap</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Filter Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Semua Status</option>
                      <option value="SELESAI">Selesai</option>
                      <option value="PROSES">Proses</option>
                      <option value="BELUM">Belum</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rapor List Table */}
              {loading ? (
                <div className="bg-white rounded-xl shadow-md p-12 flex items-center justify-center">
                  <FaSpinner className="animate-spin text-4xl text-primary-600 mr-3" />
                  <span className="text-gray-600 text-lg">Memuat data...</span>
                </div>
              ) : !selectedKelasId || !selectedTahunAjaranId ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
                  <FaTimesCircle className="text-5xl mx-auto mb-4 text-yellow-500" />
                  <p className="text-lg">Silakan pilih Kelas dan Tahun Ajaran terlebih dahulu</p>
                </div>
              ) : raporList.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
                  <FaTimesCircle className="text-5xl mx-auto mb-4 text-yellow-500" />
                  <p className="text-lg">Belum ada rapor. Klik &quot;Generate Rapor Massal&quot; untuk membuat rapor.</p>
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
                          <th className="text-center py-4 px-6 text-gray-700 font-semibold">Status</th>
                          <th className="text-center py-4 px-6 text-gray-700 font-semibold">
                            Validasi Wali Kelas
                          </th>
                          <th className="text-center py-4 px-6 text-gray-700 font-semibold">
                            Validasi Kepsek
                          </th>
                          <th className="text-center py-4 px-6 text-gray-700 font-semibold">
                            Tanggal Generate
                          </th>
                          <th className="text-center py-4 px-6 text-gray-700 font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {raporList.map((rapor, index) => (
                          <tr key={rapor.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                            <td className="py-4 px-6 text-gray-800 font-semibold">{rapor.siswa.nis}</td>
                            <td className="py-4 px-6 text-gray-800">{rapor.siswa.nama}</td>
                            <td className="py-4 px-6 text-center">{getStatusBadge(rapor.status)}</td>
                            <td className="py-4 px-6 text-center">
                              {rapor.validasiWaliKelas ? (
                                <FaCheckCircle className="text-green-600 text-xl inline" />
                              ) : (
                                <FaTimesCircle className="text-red-600 text-xl inline" />
                              )}
                            </td>
                            <td className="py-4 px-6 text-center">
                              {rapor.validasiKepsek ? (
                                <FaCheckCircle className="text-green-600 text-xl inline" />
                              ) : (
                                <FaTimesCircle className="text-red-600 text-xl inline" />
                              )}
                            </td>
                            <td className="py-4 px-6 text-center text-gray-600">
                              {rapor.tanggalGenerate
                                ? new Date(rapor.tanggalGenerate).toLocaleDateString('id-ID')
                                : '-'}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handlePreview(rapor.id)}
                                  className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
                                  title="Preview"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded disabled:opacity-50"
                                  title="Download PDF"
                                  disabled={rapor.status !== 'SELESAI'}
                                >
                                  <FaFilePdf />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Detail View */
            loading ? (
              <div className="bg-white rounded-xl shadow-md p-12 flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-primary-600 mr-3" />
                <span className="text-gray-600 text-lg">Memuat detail rapor...</span>
              </div>
            ) : !raporDetail ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
                <FaTimesCircle className="text-5xl mx-auto mb-4 text-red-500" />
                <p className="text-lg">Rapor tidak ditemukan</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8">
                {/* Header Rapor */}
                <div className="border-b-2 border-gray-800 pb-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FaSchool className="text-6xl text-primary-600" />
                      <div>
                        <h2 className="text-2xl font-bold">SMK Negeri 1 Kota</h2>
                        <p className="text-gray-600">Jl. Pendidikan No. 123, Kota Besar</p>
                        <p className="text-gray-600">Telp: (021) 12345678</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-bold">LAPORAN HASIL BELAJAR SISWA</h3>
                    <p className="text-gray-600">
                      Semester {raporDetail.semester === 'GANJIL' ? 'Ganjil' : 'Genap'} Tahun
                      Ajaran {raporDetail.tahunAjaran?.tahunAjaran}
                    </p>
                  </div>
                </div>

                {/* Identitas Siswa */}
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                  <div className="flex">
                    <span className="w-40 font-semibold">Nama</span>
                    <span className="mr-2">:</span>
                    <span>{raporDetail.siswa.nama}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">Kelas</span>
                    <span className="mr-2">:</span>
                    <span>{raporDetail.siswa.kelas?.namaKelas || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">NIS</span>
                    <span className="mr-2">:</span>
                    <span>{raporDetail.siswa.nis}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">NISN</span>
                    <span className="mr-2">:</span>
                    <span>{raporDetail.siswa.nisn || '-'}</span>
                  </div>
                </div>

                {/* Nilai */}
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-3">A. Nilai Akademik</h4>
                  {raporDetail.nilai && raporDetail.nilai.length > 0 ? (
                    <>
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 py-2 px-4 text-left">No</th>
                            <th className="border border-gray-300 py-2 px-4 text-left">
                              Mata Pelajaran
                            </th>
                            <th className="border border-gray-300 py-2 px-4 text-center">Nilai</th>
                            <th className="border border-gray-300 py-2 px-4 text-center">
                              Predikat
                            </th>
                            <th className="border border-gray-300 py-2 px-4 text-left">
                              Deskripsi
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {raporDetail.nilai.map((item, index) => (
                            <tr key={item.id}>
                              <td className="border border-gray-300 py-2 px-4">{index + 1}</td>
                              <td className="border border-gray-300 py-2 px-4">
                                {item.mataPelajaran.nama}
                              </td>
                              <td className="border border-gray-300 py-2 px-4 text-center font-semibold">
                                {item.nilaiAkhir !== null ? item.nilaiAkhir : '-'}
                              </td>
                              <td className="border border-gray-300 py-2 px-4 text-center font-semibold">
                                {item.predikat || '-'}
                              </td>
                              <td className="border border-gray-300 py-2 px-4">
                                {item.deskripsi || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="text-right font-semibold text-lg">
                        Rata-rata: {raporDetail.rataRata?.toFixed(2) || '0'}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">Belum ada nilai</p>
                  )}
                </div>

                {/* Ekstrakurikuler */}
                {raporDetail.ekstrakurikuler && (
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-3">B. Ekstrakurikuler</h4>
                    <div className="border border-gray-300 p-4 rounded whitespace-pre-line">
                      {raporDetail.ekstrakurikuler}
                    </div>
                  </div>
                )}

                {/* Absensi */}
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-3">C. Ketidakhadiran</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex">
                      <span className="w-24 font-semibold">Sakit</span>
                      <span className="mr-2">:</span>
                      <span>{raporDetail.absensiSakit} hari</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 font-semibold">Izin</span>
                      <span className="mr-2">:</span>
                      <span>{raporDetail.absensiIzin} hari</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 font-semibold">Alpha</span>
                      <span className="mr-2">:</span>
                      <span>{raporDetail.absensiAlpha} hari</span>
                    </div>
                  </div>
                </div>

                {/* Catatan */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg">D. Catatan Wali Kelas</h4>
                    {!editingCatatan && (
                      <button
                        onClick={() => setEditingCatatan(true)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                    )}
                  </div>
                  {editingCatatan ? (
                    <div>
                      <textarea
                        value={catatanTemp}
                        onChange={(e) => setCatatanTemp(e.target.value)}
                        className="w-full border border-gray-300 p-4 rounded focus:ring-2 focus:ring-primary-500 outline-none"
                        rows={4}
                        placeholder="Masukkan catatan wali kelas..."
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleSaveCatatan}
                          disabled={saving}
                          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                          {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCatatan(false);
                            setCatatanTemp(raporDetail.catatanWaliKelas || '');
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="border border-gray-300 p-4 rounded whitespace-pre-line">
                      {raporDetail.catatanWaliKelas || 'Belum ada catatan'}
                    </p>
                  )}
                </div>

                {/* TTD */}
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <p className="mb-16">Orang Tua/Wali</p>
                    <p className="border-t border-gray-800 pt-2 inline-block px-8">
                      (..............................)
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="mb-16">Wali Kelas</p>
                    <p className="border-t border-gray-800 pt-2 inline-block px-8">
                      {raporDetail.validasiWaliKelas ? '(Validated)' : '(..............................)'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="mb-16">Kepala Sekolah</p>
                    <p className="border-t border-gray-800 pt-2 inline-block px-8">
                      {raporDetail.validasiKepsek ? '(Validated)' : '(..............................)'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 justify-center flex-wrap">
                  <button
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                    disabled={raporDetail.status !== 'SELESAI'}
                  >
                    <FaFilePdf /> Download PDF
                  </button>
                  {!raporDetail.validasiWaliKelas && (
                    <button
                      onClick={() => handleValidasi('wali')}
                      disabled={saving}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                      Validasi Wali Kelas
                    </button>
                  )}
                  {!raporDetail.validasiKepsek && raporDetail.validasiWaliKelas && (
                    <button
                      onClick={() => handleValidasi('kepsek')}
                      disabled={saving}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                      Validasi Kepala Sekolah
                    </button>
                  )}
                </div>

                {/* Status Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">Status Rapor:</p>
                      <div className="mt-2">{getStatusBadge(raporDetail.status)}</div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Validasi Wali Kelas:{' '}
                        {raporDetail.validasiWaliKelas ? (
                          <span className="text-green-600 font-semibold">✓ Sudah</span>
                        ) : (
                          <span className="text-red-600 font-semibold">✗ Belum</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Validasi Kepala Sekolah:{' '}
                        {raporDetail.validasiKepsek ? (
                          <span className="text-green-600 font-semibold">✓ Sudah</span>
                        ) : (
                          <span className="text-red-600 font-semibold">✗ Belum</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
