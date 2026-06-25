'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import apiClient from '@/lib/api-client';
import {
  FaSave,
  FaFilter,
  FaChartLine,
  FaCalculator,
  FaCheckCircle,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa';

interface Siswa {
  id: string;
  nis: string;
  nama: string;
  jenisKelamin: string;
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
  kkm: number;
}

interface NilaiInput {
  siswaId: string;
  nilaiTugas: number | null;
  nilaiUTS: number | null;
  nilaiUAS: number | null;
  nilaiAkhir?: number | null;
  predikat?: string | null;
}

interface Summary {
  total: number;
  rataRata: number;
  tertinggi: number;
  terendah: number;
  tuntas: number;
  belumTuntas: number;
  persentaseTuntas: string;
  persentaseBelumTuntas: string;
  kkm: number;
  predikat: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
  };
}

export default function PenilaianPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [mataPelajaranList, setMataPelajaranList] = useState<MataPelajaran[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState('');
  const [selectedMapelId, setSelectedMapelId] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<'GANJIL' | 'GENAP'>('GANJIL');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [nilaiData, setNilaiData] = useState<Map<string, NilaiInput>>(new Map());
  const [summary, setSummary] = useState<Summary | null>(null);

  // Bobot nilai (konstanta)
  const BOBOT = {
    tugas: 30,
    uts: 30,
    uas: 40,
  };

  // Get KKM from selected mata pelajaran
  const kkm = mataPelajaranList.find((m) => m.id === selectedMapelId)?.kkm || 75;

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedKelasId) {
      fetchSiswaByKelas();
    }
  }, [selectedKelasId]);

  useEffect(() => {
    if (selectedKelasId && selectedMapelId && selectedTahunAjaranId) {
      fetchExistingNilai();
      fetchSummary();
    }
  }, [selectedKelasId, selectedMapelId, selectedTahunAjaranId, selectedSemester]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [kelasRes, tahunAjaranRes, mapelRes] = await Promise.all([
        apiClient.get<{ data: Kelas[] }>('/api/kelas?limit=100'),
        apiClient.get<{ data: TahunAjaran[] }>('/api/tahun-ajaran'),
        apiClient.get<{ data: MataPelajaran[] }>('/api/mata-pelajaran?limit=100'),
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
      
      if (mapelRes.success && mapelRes.data?.data) {
        const mapelData = Array.isArray(mapelRes.data.data) ? mapelRes.data.data : [];
        setMataPelajaranList(mapelData);
        if (mapelData.length > 0) {
          setSelectedMapelId(mapelData[0].id);
        }
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
        const siswa = Array.isArray(response.data.data) ? response.data.data : [];
        setSiswaList(siswa);
      } else {
        setSiswaList([]);
      }
    } catch (err) {
      console.error('Error fetching siswa:', err);
      setSiswaList([]);
    }
  };

  const fetchExistingNilai = async () => {
    if (!selectedKelasId || !selectedMapelId || !selectedTahunAjaranId) return;
    
    try {
      const response = await apiClient.get<{ data: any[] }>(
        `/api/nilai?kelasId=${selectedKelasId}&mataPelajaranId=${selectedMapelId}&tahunAjaranId=${selectedTahunAjaranId}&semester=${selectedSemester}`
      );
      
      if (response.success && response.data?.data) {
        const existing = Array.isArray(response.data.data) ? response.data.data : [];
        const nilaiMap = new Map<string, NilaiInput>();
        existing.forEach((nilai: any) => {
          nilaiMap.set(nilai.siswaId, {
            siswaId: nilai.siswaId,
            nilaiTugas: nilai.nilaiTugas,
            nilaiUTS: nilai.nilaiUTS,
            nilaiUAS: nilai.nilaiUAS,
            nilaiAkhir: nilai.nilaiAkhir,
            predikat: nilai.predikat,
          });
        });
        setNilaiData(nilaiMap);
      } else {
        setNilaiData(new Map());
      }
    } catch (err) {
      console.error('Error fetching nilai:', err);
      setNilaiData(new Map());
    }
  };

  const fetchSummary = async () => {
    if (!selectedKelasId || !selectedMapelId || !selectedTahunAjaranId) return;
    
    try {
      const response = await apiClient.get<{ data: Summary }>(
        `/api/nilai/summary?kelasId=${selectedKelasId}&mataPelajaranId=${selectedMapelId}&tahunAjaranId=${selectedTahunAjaranId}&semester=${selectedSemester}`
      );
      
      if (response.success && response.data?.data) {
        setSummary(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      setSummary(null);
    }
  };

  const handleNilaiChange = (
    siswaId: string,
    field: 'nilaiTugas' | 'nilaiUTS' | 'nilaiUAS',
    value: string
  ) => {
    // Validate: only numbers 0-100 or empty
    if (value !== '' && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100)) {
      return;
    }

    const numValue = value === '' ? null : Number(value);

    setNilaiData((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(siswaId) || {
        siswaId,
        nilaiTugas: null,
        nilaiUTS: null,
        nilaiUAS: null,
      };
      newMap.set(siswaId, { ...existing, [field]: numValue });
      return newMap;
    });
  };

  const hitungNilaiAkhir = (nilaiInput: NilaiInput): number | null => {
    const { nilaiTugas, nilaiUTS, nilaiUAS } = nilaiInput;

    if (nilaiTugas === null || nilaiUTS === null || nilaiUAS === null) {
      return null;
    }

    const nilaiAkhir =
      (nilaiTugas * BOBOT.tugas) / 100 +
      (nilaiUTS * BOBOT.uts) / 100 +
      (nilaiUAS * BOBOT.uas) / 100;

    return Math.round(nilaiAkhir);
  };

  const getPredikat = (nilai: number | null): string => {
    if (nilai === null) return '-';
    if (nilai >= 90) return 'A';
    if (nilai >= 80) return 'B';
    if (nilai >= 70) return 'C';
    if (nilai >= 60) return 'D';
    return 'E';
  };

  const getKeterangan = (nilai: number | null): string => {
    if (nilai === null) return '-';
    return nilai >= kkm ? 'Tuntas' : 'Belum Tuntas';
  };

  const getPredikatColor = (predikat: string): string => {
    switch (predikat) {
      case 'A': return 'bg-green-100 text-green-700';
      case 'B': return 'bg-blue-100 text-blue-700';
      case 'C': return 'bg-yellow-100 text-yellow-700';
      case 'D': return 'bg-orange-100 text-orange-700';
      case 'E': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleHitungSemua = () => {
    setNilaiData((prev) => {
      const newMap = new Map(prev);
      siswaList.forEach((siswa) => {
        const existing = newMap.get(siswa.id) || {
          siswaId: siswa.id,
          nilaiTugas: null,
          nilaiUTS: null,
          nilaiUAS: null,
        };
        
        const nilaiAkhir = hitungNilaiAkhir(existing);
        const predikat = getPredikat(nilaiAkhir);
        
        newMap.set(siswa.id, {
          ...existing,
          nilaiAkhir,
          predikat,
        });
      });
      return newMap;
    });
  };

  const handleSaveNilai = async () => {
    if (!selectedKelasId || !selectedTahunAjaranId || !selectedMapelId) {
      setError('Pilih kelas, mata pelajaran, dan tahun ajaran terlebih dahulu');
      return;
    }

    // Check if any student has at least one nilai filled
    const hasData = Array.from(nilaiData.values()).some(
      (nilai) => nilai.nilaiTugas !== null || nilai.nilaiUTS !== null || nilai.nilaiUAS !== null
    );
    
    if (!hasData) {
      setError('Belum ada nilai yang diisi');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Only save students with at least one nilai filled
      const nilaiList = Array.from(nilaiData.values())
        .filter((nilai) => 
          nilai.nilaiTugas !== null || nilai.nilaiUTS !== null || nilai.nilaiUAS !== null
        )
        .map((nilai) => {
          const nilaiAkhir = hitungNilaiAkhir(nilai);
          const predikat = getPredikat(nilaiAkhir);
          
          return {
            siswaId: nilai.siswaId,
            nilaiTugas: nilai.nilaiTugas,
            nilaiUTS: nilai.nilaiUTS,
            nilaiUAS: nilai.nilaiUAS,
            nilaiAkhir,
            predikat,
          };
        });

      const response = await apiClient.post('/api/nilai', {
        tahunAjaranId: selectedTahunAjaranId,
        mataPelajaranId: selectedMapelId,
        semester: selectedSemester,
        nilaiList,
      });

      if (response.success) {
        setSuccessMessage(`Nilai berhasil disimpan (${nilaiList.length} siswa)`);
        fetchExistingNilai();
        fetchSummary();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Gagal menyimpan nilai');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const selectedKelas = kelasList.find((k) => k.id === selectedKelasId);
  const selectedTahunAjaran = tahunAjaranList.find((ta) => ta.id === selectedTahunAjaranId);
  const selectedMapel = mataPelajaranList.find((m) => m.id === selectedMapelId);

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
              <h1 className="text-3xl font-bold text-gray-800">Penilaian Siswa</h1>
              <p className="text-gray-600 mt-1">Input dan kelola nilai siswa</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={handleHitungSemua}
                disabled={siswaList.length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                <FaCalculator />
                Hitung Semua
              </button>
              <button
                onClick={handleSaveNilai}
                disabled={saving}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {saving ? 'Menyimpan...' : 'Simpan Nilai'}
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Rata-rata</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {summary?.rataRata || 0}
                  </p>
                </div>
                <FaChartLine className="text-3xl text-primary-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tertinggi</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summary?.tertinggi || 0}
                  </p>
                </div>
                <FaCheckCircle className="text-3xl text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Terendah</p>
                  <p className="text-2xl font-bold text-red-600">
                    {summary?.terendah || 0}
                  </p>
                </div>
                <FaTimes className="text-3xl text-red-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tuntas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summary?.tuntas || 0}
                  </p>
                </div>
                <FaCheckCircle className="text-3xl text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Belum Tuntas</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {summary?.belumTuntas || 0}
                  </p>
                </div>
                <FaTimes className="text-3xl text-orange-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <label className="block text-gray-700 font-semibold mb-2">Mata Pelajaran</label>
                <select
                  value={selectedMapelId}
                  onChange={(e) => setSelectedMapelId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {mataPelajaranList.map((mapel) => (
                    <option key={mapel.id} value={mapel.id}>
                      {mapel.nama}
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
                <label className="block text-gray-700 font-semibold mb-2">KKM (readonly)</label>
                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 font-bold text-primary-600">
                  {kkm}
                </div>
              </div>
            </div>

            {/* Bobot Info */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                <FaChartLine className="inline mr-2" />
                Bobot Penilaian:
              </h3>
              <div className="flex gap-6 text-sm flex-wrap">
                <div>
                  <span className="font-semibold">Tugas:</span> {BOBOT.tugas}%
                </div>
                <div>
                  <span className="font-semibold">UTS:</span> {BOBOT.uts}%
                </div>
                <div>
                  <span className="font-semibold">UAS:</span> {BOBOT.uas}%
                </div>
                <div className="text-gray-600">
                  Formula: (Tugas × 30%) + (UTS × 30%) + (UAS × 40%)
                </div>
              </div>
            </div>
          </div>

          {/* Nilai Table */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-12 flex items-center justify-center">
              <FaSpinner className="animate-spin text-4xl text-primary-600 mr-3" />
              <span className="text-gray-600 text-lg">Memuat data...</span>
            </div>
          ) : !selectedKelasId || !selectedTahunAjaranId || !selectedMapelId ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
              <FaTimes className="text-5xl mx-auto mb-4 text-yellow-500" />
              <p className="text-lg">Silakan pilih Kelas, Mata Pelajaran, dan Tahun Ajaran terlebih dahulu</p>
            </div>
          ) : siswaList.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
              <FaTimes className="text-5xl mx-auto mb-4 text-yellow-500" />
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
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">
                        Tugas ({BOBOT.tugas}%)
                      </th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">
                        UTS ({BOBOT.uts}%)
                      </th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">
                        UAS ({BOBOT.uas}%)
                      </th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Nilai Akhir</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Predikat</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siswaList.map((siswa, index) => {
                      const nilai = nilaiData.get(siswa.id) || {
                        siswaId: siswa.id,
                        nilaiTugas: null,
                        nilaiUTS: null,
                        nilaiUAS: null,
                      };
                      
                      const nilaiAkhir = nilai.nilaiAkhir ?? hitungNilaiAkhir(nilai);
                      const predikat = nilai.predikat ?? getPredikat(nilaiAkhir);
                      const keterangan = getKeterangan(nilaiAkhir);

                      return (
                        <tr key={siswa.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                          <td className="py-4 px-6 text-gray-800 font-semibold">{siswa.nis}</td>
                          <td className="py-4 px-6 text-gray-800">{siswa.nama}</td>
                          <td className="py-4 px-6 text-center">
                            <input
                              type="text"
                              value={nilai.nilaiTugas ?? ''}
                              onChange={(e) =>
                                handleNilaiChange(siswa.id, 'nilaiTugas', e.target.value)
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                              placeholder="0-100"
                            />
                          </td>
                          <td className="py-4 px-6 text-center">
                            <input
                              type="text"
                              value={nilai.nilaiUTS ?? ''}
                              onChange={(e) =>
                                handleNilaiChange(siswa.id, 'nilaiUTS', e.target.value)
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                              placeholder="0-100"
                            />
                          </td>
                          <td className="py-4 px-6 text-center">
                            <input
                              type="text"
                              value={nilai.nilaiUAS ?? ''}
                              onChange={(e) =>
                                handleNilaiChange(siswa.id, 'nilaiUAS', e.target.value)
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                              placeholder="0-100"
                            />
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="font-bold text-lg text-primary-600">
                              {nilaiAkhir !== null ? nilaiAkhir : '-'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-4 py-2 rounded-full font-bold ${getPredikatColor(
                                predikat
                              )}`}
                            >
                              {predikat}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            {nilaiAkhir !== null && (
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                  keterangan === 'Tuntas'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {keterangan === 'Tuntas' && <FaCheckCircle className="mr-1" />}
                                {keterangan}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
                  <strong>Info:</strong> Input nilai dengan angka 0-100. Klik &quot;Hitung Semua&quot; untuk
                  menghitung nilai akhir otomatis untuk semua siswa (preview lokal). Nilai akhir dihitung
                  berdasarkan bobot yang telah ditentukan. Predikat: A (90-100), B (80-89), C (70-79),
                  D (60-69), E (&lt;60). Keterangan &quot;Tuntas&quot; jika nilai &gt;= KKM ({kkm}),
                  &quot;Belum Tuntas&quot; jika &lt; KKM.
                  {selectedKelas && selectedTahunAjaran && selectedMapel && (
                    <span>
                      {' '}
                      Nilai untuk <strong>{selectedKelas.namaKelas}</strong> -{' '}
                      <strong>{selectedMapel.nama}</strong> pada{' '}
                      <strong>
                        {selectedTahunAjaran.tahunAjaran} Semester {selectedSemester}
                      </strong>
                      .
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button (Bottom) */}
          {siswaList.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleSaveNilai}
                disabled={saving}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {saving ? 'Menyimpan...' : 'Simpan Nilai'}
              </button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
