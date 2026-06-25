'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import apiClient from '@/lib/api-client';
import {
  FaSchool,
  FaSave,
  FaEdit,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaImage,
  FaFileAlt,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from 'react-icons/fa';

interface ProfilSekolah {
  id: string;
  namaSekolah: string;
  npsn: string;
  nss?: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kodePos?: string;
  telepon?: string;
  fax?: string;
  email?: string;
  website?: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  akreditasi?: string;
  tahunBerdiri?: string;
  luasTanah?: string;
  luasBangunan?: string;
  visi?: string;
  misi?: string;
  logoPath?: string;
  kopSuratPath?: string;
}

export default function ProfilSekolahPage() {
  const [profileData, setProfileData] = useState<ProfilSekolah | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingKopSurat, setUploadingKopSurat] = useState(false);

  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName]?.[0] || '';
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingLogo(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        setProfileData({ ...profileData!, logoPath: result.data.path });
        setSuccessMessage('Logo berhasil diupload');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.message || 'Gagal upload logo');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat upload');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleKopSuratUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingKopSurat(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'kopsurat');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        setProfileData({ ...profileData!, kopSuratPath: result.data.path });
        setSuccessMessage('Kop surat berhasil diupload');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.message || 'Gagal upload kop surat');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat upload');
    } finally {
      setUploadingKopSurat(false);
    }
  };

  useEffect(() => {
    fetchProfilSekolah();
  }, []);

  const fetchProfilSekolah = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const response = await apiClient.get<ProfilSekolah>('/api/profil-sekolah');
      if (response.success && response.data) {
        setProfileData(response.data);
      } else {
        setNotFound(true);
        // Initialize with empty data for create
        setProfileData({
          id: '',
          namaSekolah: '',
          npsn: '',
          nss: '',
          alamat: '',
          kelurahan: '',
          kecamatan: '',
          kota: '',
          provinsi: '',
          kodePos: '',
          telepon: '',
          fax: '',
          email: '',
          website: '',
          kepalaSekolah: '',
          nipKepalaSekolah: '',
          akreditasi: 'A',
          tahunBerdiri: '',
          luasTanah: '',
          luasBangunan: '',
          visi: '',
          misi: '',
        });
        setIsEditing(true); // Auto-enable edit mode for create
      }
    } catch (err: any) {
      console.error('Error fetching profil sekolah:', err);
      if (err.message && err.message.includes('not found')) {
        setNotFound(true);
        // Initialize with empty data for create
        setProfileData({
          id: '',
          namaSekolah: '',
          npsn: '',
          nss: '',
          alamat: '',
          kelurahan: '',
          kecamatan: '',
          kota: '',
          provinsi: '',
          kodePos: '',
          telepon: '',
          fax: '',
          email: '',
          website: '',
          kepalaSekolah: '',
          nipKepalaSekolah: '',
          akreditasi: 'A',
          tahunBerdiri: '',
          luasTanah: '',
          luasBangunan: '',
          visi: '',
          misi: '',
        });
        setIsEditing(true);
      } else {
        setError('Gagal memuat data profil sekolah');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profileData) return;
    
    setError('');
    setValidationErrors({});
    
    try {
      const response = notFound
        ? await apiClient.post('/api/profil-sekolah', profileData)
        : await apiClient.put('/api/profil-sekolah', profileData);

      if (response.success) {
        setSuccessMessage(notFound ? 'Profil sekolah berhasil dibuat' : 'Profil sekolah berhasil diupdate');
        setIsEditing(false);
        setNotFound(false);
        fetchProfilSekolah(); // Refresh data
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        // Handle validation errors
        if (response.errors) {
          setValidationErrors(response.errors);
          setError('Mohon periksa form, ada field yang belum terisi dengan benar');
        } else {
          setError(response.message || 'Gagal menyimpan data profil sekolah');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setValidationErrors({});
    if (notFound) {
      // If was creating new, reset to empty
      setProfileData(null);
    } else {
      // If was editing, reload original data
      fetchProfilSekolah();
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-4xl text-primary-600" />
            <span className="ml-3 text-gray-600">Memuat data...</span>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!profileData) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-600 text-2xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Gagal Memuat Data</h3>
                <p className="text-red-700">Terjadi kesalahan saat memuat profil sekolah.</p>
                <button
                  onClick={fetchProfilSekolah}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

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

        {/* Not Found Warning (Creating New) */}
        {notFound && isEditing && (
          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-yellow-600 text-2xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Profil Sekolah Belum Ada</h3>
                <p className="text-yellow-700">Anda sedang membuat profil sekolah baru. Lengkapi form di bawah dan klik Simpan.</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Profil Sekolah</h1>
            <p className="text-gray-600 mt-1">Kelola informasi profil sekolah</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mt-4 md:mt-0"
            >
              <FaEdit /> Edit Profil
            </button>
          )}
        </div>

        {/* Logo & Banner */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <FaImage className="inline mr-2" />
              Logo Sekolah
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                {profileData.logoPath ? (
                  <img src={profileData.logoPath} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <FaSchool className="text-6xl text-gray-400" />
                )}
              </div>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e)}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`${
                      uploadingLogo
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
                    } text-white px-4 py-2 rounded-lg transition inline-flex items-center gap-2`}
                  >
                    {uploadingLogo ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaImage />
                        Upload Logo
                      </>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Max 2MB, format: JPG, PNG, GIF</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <FaFileAlt className="inline mr-2" />
              Kop Surat
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                {profileData.kopSuratPath ? (
                  <img src={profileData.kopSuratPath} alt="Kop Surat" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <p className="text-gray-400">Preview Kop Surat</p>
                )}
              </div>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    id="kopsurat-upload"
                    accept="image/*"
                    onChange={(e) => handleKopSuratUpload(e)}
                    className="hidden"
                    disabled={uploadingKopSurat}
                  />
                  <label
                    htmlFor="kopsurat-upload"
                    className={`${
                      uploadingKopSurat
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
                    } text-white px-4 py-2 rounded-lg transition inline-flex items-center gap-2`}
                  >
                    {uploadingKopSurat ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaFileAlt />
                        Upload Kop Surat
                      </>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Max 2MB, format: JPG, PNG, GIF</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Identitas Sekolah */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            <FaSchool className="inline mr-2" />
            Identitas Sekolah
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nama Sekolah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileData.namaSekolah}
                onChange={(e) =>
                  setProfileData({ ...profileData, namaSekolah: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? `${getFieldError('namaSekolah') ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent`
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
              {getFieldError('namaSekolah') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('namaSekolah')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                NPSN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileData.npsn}
                onChange={(e) => setProfileData({ ...profileData, npsn: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? `${getFieldError('npsn') ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent`
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
              {getFieldError('npsn') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('npsn')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">NSS</label>
              <input
                type="text"
                value={profileData.nss}
                onChange={(e) => setProfileData({ ...profileData, nss: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Akreditasi</label>
              <select
                value={profileData.akreditasi}
                onChange={(e) => setProfileData({ ...profileData, akreditasi: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              >
                <option value="A">A (Unggul)</option>
                <option value="B">B (Baik Sekali)</option>
                <option value="C">C (Baik)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tahun Berdiri</label>
              <input
                type="text"
                value={profileData.tahunBerdiri}
                onChange={(e) => setProfileData({ ...profileData, tahunBerdiri: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Kepala Sekolah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileData.kepalaSekolah}
                onChange={(e) =>
                  setProfileData({ ...profileData, kepalaSekolah: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? `${getFieldError('kepalaSekolah') ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent`
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
              {getFieldError('kepalaSekolah') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('kepalaSekolah')}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                NIP Kepala Sekolah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileData.nipKepalaSekolah}
                onChange={(e) =>
                  setProfileData({ ...profileData, nipKepalaSekolah: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? `${getFieldError('nipKepalaSekolah') ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent`
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
              {getFieldError('nipKepalaSekolah') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('nipKepalaSekolah')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Alamat & Kontak */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            <FaMapMarkerAlt className="inline mr-2" />
            Alamat & Kontak
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                value={profileData.alamat}
                onChange={(e) => setProfileData({ ...profileData, alamat: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? `${getFieldError('alamat') ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent`
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
              {getFieldError('alamat') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('alamat')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Kelurahan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileData.kelurahan}
                onChange={(e) => setProfileData({ ...profileData, kelurahan: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? `${getFieldError('kelurahan') ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent`
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
              {getFieldError('kelurahan') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('kelurahan')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Kecamatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileData.kecamatan}
                onChange={(e) => setProfileData({ ...profileData, kecamatan: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? `${getFieldError('kecamatan') ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent`
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
              {getFieldError('kecamatan') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('kecamatan')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Kota/Kabupaten <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileData.kota}
                onChange={(e) => setProfileData({ ...profileData, kota: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? `${getFieldError('kota') ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent`
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
              {getFieldError('kota') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('kota')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Provinsi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileData.provinsi}
                onChange={(e) => setProfileData({ ...profileData, provinsi: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? `${getFieldError('provinsi') ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent`
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
              {getFieldError('provinsi') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('provinsi')}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaPhone className="inline mr-2" />
                Telepon
              </label>
              <input
                type="text"
                value={profileData.telepon}
                onChange={(e) => setProfileData({ ...profileData, telepon: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaGlobe className="inline mr-2" />
                Website
              </label>
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Luas Tanah (m²)</label>
              <input
                type="text"
                value={profileData.luasTanah}
                onChange={(e) => setProfileData({ ...profileData, luasTanah: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Luas Bangunan (m²)</label>
              <input
                type="text"
                value={profileData.luasBangunan}
                onChange={(e) => setProfileData({ ...profileData, luasBangunan: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
            </div>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Visi & Misi</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Visi</label>
              <textarea
                value={profileData.visi}
                onChange={(e) => setProfileData({ ...profileData, visi: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Misi</label>
              <textarea
                value={profileData.misi}
                onChange={(e) => setProfileData({ ...profileData, misi: e.target.value })}
                disabled={!isEditing}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isEditing
                    ? 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50'
                } outline-none`}
              />
            </div>
          </div>
        </div>

        {/* Save Button (Bottom) */}
        {isEditing && (
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <FaSave /> {notFound ? 'Buat Profil' : 'Simpan Perubahan'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}
