'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import apiClient from '@/lib/api-client';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaFilePdf,
  FaUpload,
  FaFilter,
  FaUser,
  FaTimes,
  FaSpinner,
} from 'react-icons/fa';

interface Teacher {
  id: string;
  nip: string;
  nuptk?: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir?: string;
  tanggalLahir?: string;
  alamat?: string;
  noHp?: string;
  email?: string;
  foto?: string;
  mataPelajaran?: string;
  jabatan?: string;
  statusKepegawaian?: string;
  status: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

interface FormData {
  nip: string;
  nuptk: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  noHp: string;
  email: string;
  foto: string;
  mataPelajaran: string;
  jabatan: string;
  statusKepegawaian: string;
  status: boolean;
  username: string;
  password: string;
  role: 'GURU' | 'WALI_KELAS' | 'KEPALA_SEKOLAH';
}

export default function DataGuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMapel, setFilterMapel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    nip: '',
    nuptk: '',
    nama: '',
    jenisKelamin: 'L',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    email: '',
    foto: '',
    mataPelajaran: '',
    jabatan: '',
    statusKepegawaian: 'PNS',
    status: true,
    username: '',
    password: '',
    role: 'GURU',
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{data: Teacher[]}>('/api/guru');
      if (response.success && response.data?.data) {
        setTeachers(response.data.data);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Gagal memuat data guru');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = Array.isArray(teachers) ? teachers.filter((teacher) => {
    const matchesSearch =
      teacher.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.nip.includes(searchTerm) ||
      (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMapel = filterMapel === '' || (teacher.mataPelajaran && teacher.mataPelajaran.includes(filterMapel));
    const matchesStatus = filterStatus === '' || teacher.statusKepegawaian === filterStatus;
    return matchesSearch && matchesMapel && matchesStatus;
  }) : [];

  const handleOpenModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingId(teacher.id);
      setFormData({
        nip: teacher.nip,
        nuptk: teacher.nuptk || '',
        nama: teacher.nama,
        jenisKelamin: teacher.jenisKelamin,
        tempatLahir: teacher.tempatLahir || '',
        tanggalLahir: teacher.tanggalLahir || '',
        alamat: teacher.alamat || '',
        noHp: teacher.noHp || '',
        email: teacher.email || '',
        foto: teacher.foto || '',
        mataPelajaran: teacher.mataPelajaran || '',
        jabatan: teacher.jabatan || '',
        statusKepegawaian: teacher.statusKepegawaian || 'PNS',
        status: teacher.status,
        username: teacher.user?.username || '',
        password: '', // Don't prefill password for security
        role: (teacher.user?.role as 'GURU' | 'WALI_KELAS' | 'KEPALA_SEKOLAH') || 'GURU',
      });
    } else {
      setEditingId(null);
      setFormData({
        nip: '',
        nuptk: '',
        nama: '',
        jenisKelamin: 'L',
        tempatLahir: '',
        tanggalLahir: '',
        alamat: '',
        noHp: '',
        email: '',
        foto: '',
        mataPelajaran: '',
        jabatan: '',
        statusKepegawaian: 'PNS',
        status: true,
        username: '',
        password: '',
        role: 'GURU',
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
        const response = await apiClient.put(`/api/guru/${editingId}`, formData);
        if (response.success) {
          setSuccessMessage('Data guru berhasil diupdate');
          fetchTeachers();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal mengupdate data guru');
        }
      } else {
        const response = await apiClient.post('/api/guru', formData);
        if (response.success) {
          setSuccessMessage('Data guru berhasil ditambahkan');
          fetchTeachers();
          handleCloseModal();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.message || 'Gagal menambahkan data guru');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus guru ${nama}?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/api/guru/${id}`);
      if (response.success) {
        setSuccessMessage('Data guru berhasil dihapus');
        fetchTeachers();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Gagal menghapus data guru');
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
      uploadFormData.append('type', 'foto_guru');

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

  // Export to Excel
  const handleExportExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredTeachers.map((teacher, index) => ({
        'No': index + 1,
        'NIP': teacher.nip,
        'NUPTK': teacher.nuptk || '-',
        'Nama': teacher.nama,
        'Jenis Kelamin': teacher.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
        'Tempat Lahir': teacher.tempatLahir || '-',
        'Tanggal Lahir': teacher.tanggalLahir ? new Date(teacher.tanggalLahir).toLocaleDateString('id-ID') : '-',
        'Alamat': teacher.alamat || '-',
        'No HP': teacher.noHp || '-',
        'Email': teacher.email || '-',
        'Mata Pelajaran': teacher.mataPelajaran || '-',
        'Jabatan': teacher.jabatan || '-',
        'Status Kepegawaian': teacher.statusKepegawaian || '-',
        'Status': teacher.status ? 'Aktif' : 'Nonaktif',
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // No
        { wch: 20 }, // NIP
        { wch: 20 }, // NUPTK
        { wch: 25 }, // Nama
        { wch: 15 }, // Jenis Kelamin
        { wch: 20 }, // Tempat Lahir
        { wch: 15 }, // Tanggal Lahir
        { wch: 30 }, // Alamat
        { wch: 15 }, // No HP
        { wch: 25 }, // Email
        { wch: 20 }, // Mata Pelajaran
        { wch: 20 }, // Jabatan
        { wch: 20 }, // Status Kepegawaian
        { wch: 10 }, // Status
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Data Guru');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `Data_Guru_${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      setSuccessMessage(`Data berhasil di-export ke ${filename}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Export Excel error:', error);
      setError('Gagal export data ke Excel');
    }
  };

  // Export to PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF('landscape');

      // Add title
      doc.setFontSize(18);
      doc.text('Data Guru', 14, 15);

      // Add timestamp
      doc.setFontSize(10);
      doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, 14, 22);

      // Prepare table data
      const tableData = filteredTeachers.map((teacher, index) => [
        index + 1,
        teacher.nip,
        teacher.nama,
        teacher.jenisKelamin === 'L' ? 'L' : 'P',
        teacher.mataPelajaran || '-',
        teacher.jabatan || '-',
        teacher.statusKepegawaian || '-',
        teacher.status ? 'Aktif' : 'Nonaktif',
      ]);

      // Generate table
      autoTable(doc, {
        startY: 28,
        head: [['No', 'NIP', 'Nama', 'JK', 'Mata Pelajaran', 'Jabatan', 'Status Kepeg.', 'Status']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 28 },
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `Data_Guru_${timestamp}.pdf`;

      // Save PDF
      doc.save(filename);

      setSuccessMessage(`Data berhasil di-export ke ${filename}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Export PDF error:', error);
      setError('Gagal export data ke PDF');
    }
  };

  // Handle Import Excel
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('File harus berupa Excel (.xlsx atau .xls)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError('File Excel kosong');
          return;
        }

        // Process import data
        let successCount = 0;
        let failCount = 0;
        const errors: string[] = [];

        for (const row of jsonData as any[]) {
          try {
            // Map Excel columns to API format
            const guruData = {
              nip: row['NIP']?.toString() || '',
              nuptk: row['NUPTK']?.toString() || '',
              nama: row['Nama']?.toString() || '',
              jenisKelamin: row['Jenis Kelamin'] === 'Laki-laki' ? 'L' : 'P',
              tempatLahir: row['Tempat Lahir']?.toString() || '',
              tanggalLahir: row['Tanggal Lahir'] ? new Date(row['Tanggal Lahir']).toISOString().split('T')[0] : '',
              alamat: row['Alamat']?.toString() || '',
              noHp: row['No HP']?.toString() || '',
              email: row['Email']?.toString() || '',
              mataPelajaran: row['Mata Pelajaran']?.toString() || '',
              jabatan: row['Jabatan']?.toString() || '',
              statusKepegawaian: row['Status Kepegawaian']?.toString() || 'PNS',
              status: row['Status'] === 'Aktif' || row['Status'] === true,
              username: row['Username']?.toString() || row['NIP']?.toString() || '',
              password: row['Password']?.toString() || '123456', // Default password
              role: 'GURU',
            };

            // Validate required fields
            if (!guruData.nip || !guruData.nama) {
              errors.push(`Baris ${jsonData.indexOf(row) + 2}: NIP dan Nama harus diisi`);
              failCount++;
              continue;
            }

            // Send to API
            const response = await apiClient.post('/api/guru', guruData);
            if (response.success) {
              successCount++;
            } else {
              errors.push(`Baris ${jsonData.indexOf(row) + 2}: ${response.message}`);
              failCount++;
            }
          } catch (err: any) {
            errors.push(`Baris ${jsonData.indexOf(row) + 2}: ${err.message}`);
            failCount++;
          }
        }

        // Show results
        if (successCount > 0) {
          setSuccessMessage(`Berhasil import ${successCount} data guru`);
          fetchTeachers(); // Refresh data
          setTimeout(() => setSuccessMessage(''), 5000);
        }

        if (failCount > 0) {
          setError(`Gagal import ${failCount} data. ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`);
        }

      } catch (error) {
        console.error('Import error:', error);
        setError('Gagal membaca file Excel');
      }
    };

    reader.readAsBinaryString(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download Template Excel
  const handleDownloadTemplate = () => {
    try {
      const templateData = [
        {
          'NIP': '1234567890123456',
          'NUPTK': '1234567890123456',
          'Nama': 'Contoh Nama Guru',
          'Jenis Kelamin': 'Laki-laki',
          'Tempat Lahir': 'Jakarta',
          'Tanggal Lahir': '1990-01-01',
          'Alamat': 'Jl. Contoh No. 123',
          'No HP': '081234567890',
          'Email': 'guru@example.com',
          'Mata Pelajaran': 'Matematika',
          'Jabatan': 'Guru Mapel',
          'Status Kepegawaian': 'PNS',
          'Status': 'Aktif',
          'Username': 'guru123',
          'Password': '123456',
        }
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(templateData);

      // Set column widths
      ws['!cols'] = [
        { wch: 20 }, // NIP
        { wch: 20 }, // NUPTK
        { wch: 25 }, // Nama
        { wch: 15 }, // Jenis Kelamin
        { wch: 20 }, // Tempat Lahir
        { wch: 15 }, // Tanggal Lahir
        { wch: 30 }, // Alamat
        { wch: 15 }, // No HP
        { wch: 25 }, // Email
        { wch: 20 }, // Mata Pelajaran
        { wch: 20 }, // Jabatan
        { wch: 20 }, // Status Kepegawaian
        { wch: 10 }, // Status
        { wch: 15 }, // Username
        { wch: 15 }, // Password
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Template Data Guru');

      XLSX.writeFile(wb, 'Template_Import_Guru.xlsx');

      setSuccessMessage('Template berhasil didownload');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Download template error:', error);
      setError('Gagal download template');
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
            <h1 className="text-3xl font-bold text-gray-800">Data Guru</h1>
            <p className="text-gray-600 mt-1">Kelola data guru dan tenaga pendidik</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button 
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <FaFileExcel /> Export Excel
            </button>
            <button 
              onClick={handleExportPDF}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <FaFilePdf /> Export PDF
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FaUpload /> Import
            </button>
            <button 
              onClick={handleDownloadTemplate}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              title="Download template import"
            >
              <FaFileExcel /> Template
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
            >
              <FaPlus /> Tambah Guru
            </button>
          </div>
          
          {/* Hidden file input for import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Guru</p>
                <p className="text-2xl font-bold text-gray-800">{Array.isArray(teachers) ? teachers.length : 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaUser className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Guru Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {Array.isArray(teachers) ? teachers.filter((t) => t.status).length : 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaUser className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Laki-laki</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Array.isArray(teachers) ? teachers.filter((t) => t.jenisKelamin === 'L').length : 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaUser className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Perempuan</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Array.isArray(teachers) ? teachers.filter((t) => t.jenisKelamin === 'P').length : 0}
                </p>
              </div>
              <div className="bg-pink-100 p-3 rounded-lg">
                <FaUser className="text-pink-600 text-2xl" />
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
                Cari Guru
              </label>
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIP, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Mata Pelajaran */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaFilter className="inline mr-2" />
                Mata Pelajaran
              </label>
              <select
                value={filterMapel}
                onChange={(e) => setFilterMapel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Semua Mata Pelajaran</option>
                <option value="Matematika">Matematika</option>
                <option value="Bahasa">Bahasa Indonesia/Inggris</option>
                <option value="Pemrograman">Pemrograman</option>
                <option value="Jaringan">Jaringan Komputer</option>
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaFilter className="inline mr-2" />
                Status Kepegawaian
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Semua Status</option>
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="GTT">GTT/Honorer</option>
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
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">NIP</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Nama</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">L/P</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Email</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">No HP</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Mata Pelajaran</th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">Jabatan</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Status</th>
                      <th className="text-center py-4 px-6 text-gray-700 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher, index) => (
                        <tr key={teacher.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center">
                              {teacher.foto ? (
                                <img
                                  src={teacher.foto}
                                  alt={teacher.nama}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <FaUser className="text-gray-400 text-lg" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-800 font-semibold">{teacher.nip}</td>
                          <td className="py-4 px-6 text-gray-800 font-semibold">{teacher.nama}</td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                teacher.jenisKelamin === 'L'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-pink-100 text-pink-700'
                              }`}
                            >
                              {teacher.jenisKelamin}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-800">{teacher.email || '-'}</td>
                          <td className="py-4 px-6 text-gray-800">{teacher.noHp || '-'}</td>
                          <td className="py-4 px-6 text-gray-800">{teacher.mataPelajaran || '-'}</td>
                          <td className="py-4 px-6 text-gray-800">{teacher.jabatan || '-'}</td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                teacher.status
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {teacher.status ? 'Aktif' : 'Non-Aktif'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenModal(teacher)}
                                className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(teacher.id, teacher.nama)}
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
                        <td colSpan={11} className="py-8 text-center text-gray-500">
                          Data guru tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredTeachers.length} dari {teachers.length} guru
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
                  {editingId ? 'Edit Data Guru' : 'Tambah Data Guru'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Row 1: NIP & NUPTK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      NIP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                      disabled={!!editingId}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">NUPTK</label>
                    <input
                      type="text"
                      value={formData.nuptk}
                      onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                {/* Row 2: Nama & Jenis Kelamin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {/* Row 3: Tempat & Tanggal Lahir */}
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

                {/* Row 4: Email & No HP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">No HP</label>
                    <input
                      type="text"
                      value={formData.noHp}
                      onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
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

                {/* Row 6: Foto Guru */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Foto Guru</label>
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
                          <FaUser className="text-gray-400 text-3xl" />
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="fotoGuruInput"
                        accept="image/*"
                        onChange={handleFotoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="fotoGuruInput"
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

                {/* Row 7: Mata Pelajaran & Jabatan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Mata Pelajaran</label>
                    <input
                      type="text"
                      value={formData.mataPelajaran}
                      onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="Contoh: Matematika"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Jabatan</label>
                    <select
                      value={formData.jabatan}
                      onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="">Pilih Jabatan</option>
                      <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
                      <option value="Wali Kelas">Wali Kelas</option>
                      <option value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</option>
                      <option value="Kepala Sekolah">Kepala Sekolah</option>
                    </select>
                  </div>
                </div>

                {/* Row 8: Status Kepegawaian & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Status Kepegawaian</label>
                    <select
                      value={formData.statusKepegawaian}
                      onChange={(e) => setFormData({ ...formData, statusKepegawaian: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="PNS">PNS</option>
                      <option value="PPPK">PPPK</option>
                      <option value="GTT">GTT/Honorer</option>
                      <option value="GTY">GTY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Status</label>
                    <select
                      value={formData.status ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Non-Aktif</option>
                    </select>
                  </div>
                </div>

                {/* Row 9: Data Akun (only for new) */}
                {!editingId && (
                  <>
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Akun Pengguna</h3>
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
                            required
                            minLength={3}
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
                            required
                            minLength={6}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                          Role <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value as 'GURU' | 'WALI_KELAS' | 'KEPALA_SEKOLAH' })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          required
                        >
                          <option value="GURU">Guru</option>
                          <option value="WALI_KELAS">Wali Kelas</option>
                          <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                        </select>
                      </div>
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
