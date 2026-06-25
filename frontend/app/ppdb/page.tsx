'use client';

import { useState, useEffect } from 'react';
import {
  FaSchool,
  FaClipboardList,
  FaCheckCircle,
  FaUserPlus,
  FaFileUpload,
  FaBullhorn,
  FaCalendarAlt,
  FaSpinner,
  FaTimesCircle,
  FaSearch,
} from 'react-icons/fa';

interface FormData {
  nama: string;
  nisn: string;
  nik: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  alamat: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  noHp: string;
  email: string;
  asalSekolah: string;
  nsnAsalSekolah: string;
  alamatSekolah: string;
  nomorIjazah: string;
  tahunLulus: number;
  pilihanJurusan1: string;
  pilihanJurusan2: string;
  namaAyah: string;
  namaIbu: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  penghasilanOrtu: string;
  noHpOrtu: string;
  emailOrtu: string;
}

interface CheckStatusForm {
  noPendaftaran: string;
  nisn: string;
}

interface StatusResult {
  id: string;
  noPendaftaran: string;
  nama: string;
  nisn: string;
  pilihanJurusan1: string;
  pilihanJurusan2: string;
  statusVerifikasi: string;
  statusSeleksi: string;
  catatanVerifikasi?: string;
  nilaiSeleksi?: number;
  jurusanDiterima?: string;
  tanggalDaftar: string;
  tanggalVerifikasi?: string;
  tanggalPengumuman?: string;
}

export default function PPDBPage() {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  // Form state for pendaftaran
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    nisn: '',
    nik: '',
    jenisKelamin: '',
    tempatLahir: '',
    tanggalLahir: '',
    agama: '',
    alamat: '',
    rt: '',
    rw: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    kodePos: '',
    noHp: '',
    email: '',
    asalSekolah: '',
    nsnAsalSekolah: '',
    alamatSekolah: '',
    nomorIjazah: '',
    tahunLulus: new Date().getFullYear(),
    pilihanJurusan1: '',
    pilihanJurusan2: '',
    namaAyah: '',
    namaIbu: '',
    pekerjaanAyah: '',
    pekerjaanIbu: '',
    penghasilanOrtu: '',
    noHpOrtu: '',
    emailOrtu: '',
  });

  // Check status state
  const [checkForm, setCheckForm] = useState<CheckStatusForm>({
    noPendaftaran: '',
    nisn: '',
  });
  const [statusResult, setStatusResult] = useState<StatusResult | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      setError('Anda harus menyetujui pernyataan terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(result.message);
        // Reset form
        setFormData({
          nama: '',
          nisn: '',
          nik: '',
          jenisKelamin: '',
          tempatLahir: '',
          tanggalLahir: '',
          agama: '',
          alamat: '',
          rt: '',
          rw: '',
          kelurahan: '',
          kecamatan: '',
          kota: '',
          provinsi: '',
          kodePos: '',
          noHp: '',
          email: '',
          asalSekolah: '',
          nsnAsalSekolah: '',
          alamatSekolah: '',
          nomorIjazah: '',
          tahunLulus: new Date().getFullYear(),
          pilihanJurusan1: '',
          pilihanJurusan2: '',
          namaAyah: '',
          namaIbu: '',
          pekerjaanAyah: '',
          pekerjaanIbu: '',
          penghasilanOrtu: '',
          noHpOrtu: '',
          emailOrtu: '',
        });
        setAgreed(false);
        // Switch to check status tab
        setTimeout(() => {
          setActiveTab('cek-status');
          setSuccessMessage('');
        }, 5000);
      } else {
        setError(result.message || 'Gagal mendaftar');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkForm.noPendaftaran || !checkForm.nisn) {
      setError('Nomor pendaftaran dan NISN wajib diisi');
      return;
    }

    setCheckingStatus(true);
    setError('');
    setStatusResult(null);

    try {
      const response = await fetch('/api/ppdb/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkForm),
      });

      const result = await response.json();

      if (result.success) {
        setStatusResult(result.data);
      } else {
        setError(result.message || 'Pendaftaran tidak ditemukan');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengecek status');
    } finally {
      setCheckingStatus(false);
    }
  };

  const getStatusBadge = (status: string, type: 'verifikasi' | 'seleksi') => {
    if (type === 'verifikasi') {
      switch (status) {
        case 'PENDING':
          return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">Menunggu Verifikasi</span>;
        case 'DIVERIFIKASI':
          return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Terverifikasi</span>;
        case 'DITOLAK':
          return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">Ditolak</span>;
        case 'PERLU_PERBAIKAN':
          return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">Perlu Perbaikan</span>;
        default:
          return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">{status}</span>;
      }
    } else {
      switch (status) {
        case 'BELUM_SELEKSI':
          return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">Belum Seleksi</span>;
        case 'LULUS':
          return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">✅ LULUS</span>;
        case 'TIDAK_LULUS':
          return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">Tidak Lulus</span>;
        case 'CADANGAN':
          return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">Cadangan</span>;
        default:
          return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">{status}</span>;
      }
    }
  };

  const timeline = [
    { title: 'Pendaftaran Online', date: '1 - 15 Maret 2024', status: 'active' },
    { title: 'Verifikasi Berkas', date: '16 - 20 Maret 2024', status: 'upcoming' },
    { title: 'Seleksi', date: '21 - 25 Maret 2024', status: 'upcoming' },
    { title: 'Pengumuman', date: '26 Maret 2024', status: 'upcoming' },
    { title: 'Daftar Ulang', date: '27 - 31 Maret 2024', status: 'upcoming' },
  ];

  const jurusan = [
    {
      nama: 'Rekayasa Perangkat Lunak (RPL)',
      deskripsi: 'Mempelajari pengembangan aplikasi dan sistem software',
      kuota: 72,
    },
    {
      nama: 'Teknik Komputer dan Jaringan (TKJ)',
      deskripsi: 'Mempelajari instalasi, konfigurasi, dan maintenance jaringan komputer',
      kuota: 72,
    },
    {
      nama: 'Akuntansi dan Keuangan Lembaga (AKL)',
      deskripsi: 'Mempelajari pencatatan, pengelolaan, dan pelaporan keuangan',
      kuota: 36,
    },
    {
      nama: 'Bisnis Daring dan Pemasaran (BDP)',
      deskripsi: 'Mempelajari strategi pemasaran digital dan e-commerce',
      kuota: 36,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaSchool className="text-4xl" />
              <div>
                <h1 className="text-2xl font-bold">PPDB Online</h1>
                <p className="text-sm text-primary-100">SMA Negeri 1 - Tahun Ajaran 2024/2025</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="/"
                className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition text-sm"
              >
                Beranda
              </a>
              <a
                href="/login"
                className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-400 transition text-sm border border-white"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Penerimaan Peserta Didik Baru 2024/2025
          </h2>
          <p className="text-xl mb-8">
            Bergabunglah dengan sekolah terbaik untuk masa depan cerah Anda!
          </p>
          <button
            onClick={() => setActiveTab('daftar')}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition shadow-lg"
          >
            <FaUserPlus className="inline mr-2" />
            Daftar Sekarang
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === 'info'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-primary-600'
              }`}
            >
              <FaBullhorn className="inline mr-2" />
              Informasi
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === 'timeline'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-primary-600'
              }`}
            >
              <FaCalendarAlt className="inline mr-2" />
              Jadwal
            </button>
            <button
              onClick={() => setActiveTab('jurusan')}
              className={`px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === 'jurusan'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-primary-600'
              }`}
            >
              <FaClipboardList className="inline mr-2" />
              Jurusan
            </button>
            <button
              onClick={() => setActiveTab('daftar')}
              className={`px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === 'daftar'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-primary-600'
              }`}
            >
              <FaUserPlus className="inline mr-2" />
              Pendaftaran
            </button>
            <button
              onClick={() => setActiveTab('cek-status')}
              className={`px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === 'cek-status'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-primary-600'
              }`}
            >
              <FaSearch className="inline mr-2" />
              Cek Status
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            <div className="flex items-center">
              <FaCheckCircle className="mr-3 text-xl" />
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaTimesCircle className="mr-3 text-xl" />
                <p>{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
                <FaTimesCircle />
              </button>
            </div>
          </div>
        )}
        
        {/* Tab: Informasi */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Persyaratan Pendaftaran
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">Dokumen yang Diperlukan:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Fotocopy Ijazah SMP/Sederajat yang telah dilegalisir (1 lembar)</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Fotocopy SKHUN yang telah dilegalisir (1 lembar)</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Fotocopy Kartu Keluarga (1 lembar)</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Fotocopy Akta Kelahiran (1 lembar)</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Pas Foto 3x4 berwarna (3 lembar)</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Surat Keterangan Lulus dari Sekolah (jika ijazah belum keluar)</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">Ketentuan Umum:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Lulus SMP/MTs/Sederajat</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Maksimal usia 21 tahun pada tahun ajaran baru</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Sehat jasmani dan rohani</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Tidak buta warna untuk jurusan tertentu</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span>Bersedia mengikuti seluruh tahapan seleksi</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Alur Pendaftaran
              </h2>
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { icon: FaUserPlus, title: 'Daftar Online', desc: 'Isi formulir pendaftaran' },
                  { icon: FaFileUpload, title: 'Upload Berkas', desc: 'Upload dokumen persyaratan' },
                  { icon: FaClipboardList, title: 'Verifikasi', desc: 'Admin memverifikasi data' },
                  { icon: FaCheckCircle, title: 'Seleksi', desc: 'Proses seleksi penerimaan' },
                  { icon: FaBullhorn, title: 'Pengumuman', desc: 'Lihat hasil seleksi' },
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="text-3xl text-primary-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Timeline */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Jadwal PPDB 2024/2025
            </h2>
            <div className="max-w-3xl mx-auto">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start mb-8 last:mb-0">
                  <div className="flex flex-col items-center mr-6">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        item.status === 'active'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {item.status === 'active' ? (
                        <FaCheckCircle className="text-2xl" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-1 h-20 bg-gray-300 my-2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-2">
                      <FaCalendarAlt className="inline mr-2" />
                      {item.date}
                    </p>
                    {item.status === 'active' && (
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Sedang Berlangsung
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Jurusan */}
        {activeTab === 'jurusan' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Program Keahlian yang Tersedia
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {jurusan.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary-100 p-4 rounded-lg">
                      <FaClipboardList className="text-3xl text-primary-600" />
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Kuota: {item.kuota} siswa
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.nama}</h3>
                  <p className="text-gray-600 mb-4">{item.deskripsi}</p>
                  <button className="text-primary-600 hover:text-primary-700 font-semibold">
                    Pelajari Lebih Lanjut →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Pendaftaran */}
        {activeTab === 'daftar' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Formulir Pendaftaran PPDB
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Data Pribadi */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Data Pribadi</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">NISN *</label>
                      <input
                        type="text"
                        name="nisn"
                        value={formData.nisn}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Nomor Induk Siswa Nasional"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        NIK
                      </label>
                      <input
                        type="text"
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Nomor Induk Kependudukan"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Tempat Lahir *
                      </label>
                      <input
                        type="text"
                        name="tempatLahir"
                        value={formData.tempatLahir}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Kota/Kabupaten"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Tanggal Lahir *
                      </label>
                      <input
                        type="date"
                        name="tanggalLahir"
                        value={formData.tanggalLahir}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Jenis Kelamin *
                      </label>
                      <select
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                      >
                        <option value="">Pilih</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Agama *</label>
                      <select
                        name="agama"
                        value={formData.agama}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                      >
                        <option value="">Pilih</option>
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Konghucu">Konghucu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Nomor HP *
                      </label>
                      <input
                        type="tel"
                        name="noHp"
                        value={formData.noHp}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-700 font-semibold mb-2">Alamat *</label>
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      rows={3}
                      placeholder="Alamat lengkap"
                      required
                    ></textarea>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">RT</label>
                      <input
                        type="text"
                        name="rt"
                        value={formData.rt}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="001"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">RW</label>
                      <input
                        type="text"
                        name="rw"
                        value={formData.rw}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="002"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Kelurahan</label>
                      <input
                        type="text"
                        name="kelurahan"
                        value={formData.kelurahan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Kelurahan"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Kecamatan</label>
                      <input
                        type="text"
                        name="kecamatan"
                        value={formData.kecamatan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Kecamatan"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Kota/Kabupaten</label>
                      <input
                        type="text"
                        name="kota"
                        value={formData.kota}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Kota"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Provinsi</label>
                      <input
                        type="text"
                        name="provinsi"
                        value={formData.provinsi}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Provinsi"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Kode Pos</label>
                      <input
                        type="text"
                        name="kodePos"
                        value={formData.kodePos}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* Asal Sekolah */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Asal Sekolah</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Nama Sekolah *
                      </label>
                      <input
                        type="text"
                        name="asalSekolah"
                        value={formData.asalSekolah}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="SMP/MTs asal"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        NSN Sekolah
                      </label>
                      <input
                        type="text"
                        name="nsnAsalSekolah"
                        value={formData.nsnAsalSekolah}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Nomor Statistik Nasional"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Alamat Sekolah
                      </label>
                      <input
                        type="text"
                        name="alamatSekolah"
                        value={formData.alamatSekolah}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Alamat sekolah"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Nomor Ijazah
                      </label>
                      <input
                        type="text"
                        name="nomorIjazah"
                        value={formData.nomorIjazah}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Nomor ijazah"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Tahun Lulus *
                      </label>
                      <input
                        type="number"
                        name="tahunLulus"
                        value={formData.tahunLulus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="2024"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Pilihan Jurusan */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Pilihan Jurusan</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Pilihan 1 *
                      </label>
                      <select
                        name="pilihanJurusan1"
                        value={formData.pilihanJurusan1}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                      >
                        <option value="">Pilih Jurusan</option>
                        <option value="RPL">Rekayasa Perangkat Lunak</option>
                        <option value="TKJ">Teknik Komputer dan Jaringan</option>
                        <option value="AKL">Akuntansi dan Keuangan Lembaga</option>
                        <option value="BDP">Bisnis Daring dan Pemasaran</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Pilihan 2</label>
                      <select
                        name="pilihanJurusan2"
                        value={formData.pilihanJurusan2}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      >
                        <option value="">Pilih Jurusan</option>
                        <option value="RPL">Rekayasa Perangkat Lunak</option>
                        <option value="TKJ">Teknik Komputer dan Jaringan</option>
                        <option value="AKL">Akuntansi dan Keuangan Lembaga</option>
                        <option value="BDP">Bisnis Daring dan Pemasaran</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Orang Tua */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Data Orang Tua/Wali</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Nama Ayah *</label>
                      <input
                        type="text"
                        name="namaAyah"
                        value={formData.namaAyah}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Nama lengkap ayah"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Nama Ibu *</label>
                      <input
                        type="text"
                        name="namaIbu"
                        value={formData.namaIbu}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Nama lengkap ibu"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Pekerjaan Ayah</label>
                      <input
                        type="text"
                        name="pekerjaanAyah"
                        value={formData.pekerjaanAyah}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Pekerjaan ayah"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Pekerjaan Ibu</label>
                      <input
                        type="text"
                        name="pekerjaanIbu"
                        value={formData.pekerjaanIbu}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Pekerjaan ibu"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Penghasilan Orang Tua
                      </label>
                      <select
                        name="penghasilanOrtu"
                        value={formData.penghasilanOrtu}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      >
                        <option value="">Pilih Range</option>
                        <option value="< 1 juta">&lt; 1 juta</option>
                        <option value="1-3 juta">1-3 juta</option>
                        <option value="3-5 juta">3-5 juta</option>
                        <option value="> 5 juta">&gt; 5 juta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Nomor HP Orang Tua *
                      </label>
                      <input
                        type="tel"
                        name="noHpOrtu"
                        value={formData.noHpOrtu}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">Email Orang Tua</label>
                      <input
                        type="email"
                        name="emailOrtu"
                        value={formData.emailOrtu}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Agreement */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 mr-3"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      required
                    />
                    <span className="text-gray-700 text-sm">
                      Saya menyatakan bahwa data yang saya isi adalah benar dan dapat
                      dipertanggungjawabkan. Jika dikemudian hari terbukti data yang saya isi
                      tidak benar, saya bersedia menerima sanksi sesuai ketentuan yang berlaku.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        nama: '',
                        nisn: '',
                        nik: '',
                        jenisKelamin: '',
                        tempatLahir: '',
                        tanggalLahir: '',
                        agama: '',
                        alamat: '',
                        rt: '',
                        rw: '',
                        kelurahan: '',
                        kecamatan: '',
                        kota: '',
                        provinsi: '',
                        kodePos: '',
                        noHp: '',
                        email: '',
                        asalSekolah: '',
                        nsnAsalSekolah: '',
                        alamatSekolah: '',
                        nomorIjazah: '',
                        tahunLulus: new Date().getFullYear(),
                        pilihanJurusan1: '',
                        pilihanJurusan2: '',
                        namaAyah: '',
                        namaIbu: '',
                        pekerjaanAyah: '',
                        pekerjaanIbu: '',
                        penghasilanOrtu: '',
                        noHpOrtu: '',
                        emailOrtu: '',
                      });
                      setAgreed(false);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                    disabled={loading}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Mendaftar...
                      </span>
                    ) : (
                      'Daftar Sekarang'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab: Cek Status */}
        {activeTab === 'cek-status' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Cek Status Pendaftaran
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Masukkan nomor pendaftaran dan NISN Anda untuk melihat status pendaftaran
              </p>

              {!statusResult ? (
                <form onSubmit={handleCheckStatus} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nomor Pendaftaran *
                    </label>
                    <input
                      type="text"
                      value={checkForm.noPendaftaran}
                      onChange={(e) => setCheckForm({ ...checkForm, noPendaftaran: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="PPDB-2024-00001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">NISN *</label>
                    <input
                      type="text"
                      value={checkForm.nisn}
                      onChange={(e) => setCheckForm({ ...checkForm, nisn: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Masukkan NISN"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={checkingStatus}
                  >
                    {checkingStatus ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Mengecek...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FaSearch className="mr-2" />
                        Cek Status
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Status Result */}
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border-2 border-primary-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-primary-800">{statusResult.nama}</h3>
                      <button
                        onClick={() => {
                          setStatusResult(null);
                          setCheckForm({ noPendaftaran: '', nisn: '' });
                        }}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <FaTimesCircle className="text-xl" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Nomor Pendaftaran</p>
                        <p className="font-bold text-primary-700">{statusResult.noPendaftaran}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">NISN</p>
                        <p className="font-bold text-primary-700">{statusResult.nisn}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Pilihan Jurusan 1</p>
                        <p className="font-semibold">{statusResult.pilihanJurusan1}</p>
                      </div>
                      {statusResult.pilihanJurusan2 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Pilihan Jurusan 2</p>
                          <p className="font-semibold">{statusResult.pilihanJurusan2}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Verifikasi */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaFileUpload className="mr-2 text-primary-600" />
                      Status Verifikasi
                    </h4>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-700">Status:</span>
                      {getStatusBadge(statusResult.statusVerifikasi, 'verifikasi')}
                    </div>
                    {statusResult.tanggalVerifikasi && (
                      <div className="text-sm text-gray-600">
                        Diverifikasi pada: {new Date(statusResult.tanggalVerifikasi).toLocaleDateString('id-ID')}
                      </div>
                    )}
                    {statusResult.catatanVerifikasi && (
                      <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <p className="text-sm font-semibold text-yellow-800">Catatan:</p>
                        <p className="text-sm text-yellow-700">{statusResult.catatanVerifikasi}</p>
                      </div>
                    )}
                  </div>

                  {/* Status Seleksi */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaCheckCircle className="mr-2 text-primary-600" />
                      Status Seleksi
                    </h4>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-700">Status:</span>
                      {getStatusBadge(statusResult.statusSeleksi, 'seleksi')}
                    </div>
                    {statusResult.nilaiSeleksi && (
                      <div className="text-sm text-gray-600 mb-2">
                        Nilai Seleksi: <span className="font-bold">{statusResult.nilaiSeleksi}</span>
                      </div>
                    )}
                    {statusResult.jurusanDiterima && (
                      <div className="mt-3 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
                        <p className="text-sm font-semibold text-green-800 mb-1">Diterima di:</p>
                        <p className="text-lg font-bold text-green-700">{statusResult.jurusanDiterima}</p>
                      </div>
                    )}
                    {statusResult.tanggalPengumuman && (
                      <div className="text-sm text-gray-600 mt-2">
                        Diumumkan pada: {new Date(statusResult.tanggalPengumuman).toLocaleDateString('id-ID')}
                      </div>
                    )}
                  </div>

                  {/* Info Box */}
                  {statusResult.statusSeleksi === 'LULUS' && (
                    <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
                      <h4 className="text-lg font-bold text-green-800 mb-3">
                        🎉 Selamat! Anda Diterima
                      </h4>
                      <p className="text-green-700 mb-4">
                        Silakan lakukan daftar ulang sesuai jadwal yang telah ditentukan. Bawa dokumen persyaratan lengkap.
                      </p>
                      <div className="text-sm text-green-600">
                        <p>Tanggal Daftar Ulang: 27 - 31 Maret 2024</p>
                        <p>Hubungi: (021) 12345678 untuk informasi lebih lanjut</p>
                      </div>
                    </div>
                  )}

                  {statusResult.statusVerifikasi === 'PERLU_PERBAIKAN' && (
                    <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-6">
                      <h4 className="text-lg font-bold text-orange-800 mb-3">
                        ⚠️ Perlu Perbaikan
                      </h4>
                      <p className="text-orange-700">
                        Silakan perbaiki data atau berkas yang belum sesuai. Lihat catatan verifikasi di atas.
                      </p>
                    </div>
                  )}

                  {/* Button to check again */}
                  <button
                    onClick={() => {
                      setStatusResult(null);
                      setCheckForm({ noPendaftaran: '', nisn: '' });
                    }}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cek Pendaftaran Lain
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 SMA Negeri 1. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">
            Untuk informasi lebih lanjut hubungi: (021) 12345678 | email@smkn1.sch.id
          </p>
        </div>
      </footer>
    </div>
  );
}
