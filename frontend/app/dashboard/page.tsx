'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaBook,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaCalendarAlt,
} from 'react-icons/fa';

export default function DashboardPage() {
  // Data akan diisi dari database (TODO: integrate with API)

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di Sistem Informasi Sekolah</p>
        </div>

        {/* Info Card - Menunggu data dari database */}
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaSchool className="text-6xl text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Sistem Informasi Sekolah</h2>
          <p className="text-gray-600 mb-4">
            Data statistik, absensi, dan informasi lainnya akan ditampilkan di sini setelah database terisi.
          </p>
          <p className="text-sm text-gray-500">
            Silakan mulai dengan mengisi data master melalui menu di sidebar.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/master/siswa"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Data Siswa</p>
                <p className="text-lg font-bold text-blue-600 group-hover:text-blue-700">Kelola Data →</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg group-hover:bg-blue-200 transition">
                <FaUserGraduate className="text-blue-600 text-3xl" />
              </div>
            </div>
          </a>

          <a
            href="/master/guru"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Data Guru</p>
                <p className="text-lg font-bold text-green-600 group-hover:text-green-700">Kelola Data →</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg group-hover:bg-green-200 transition">
                <FaChalkboardTeacher className="text-green-600 text-3xl" />
              </div>
            </div>
          </a>

          <a
            href="/master/kelas"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Data Kelas</p>
                <p className="text-lg font-bold text-purple-600 group-hover:text-purple-700">Kelola Data →</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg group-hover:bg-purple-200 transition">
                <FaSchool className="text-purple-600 text-3xl" />
              </div>
            </div>
          </a>

          <a
            href="/master/mata-pelajaran"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Mata Pelajaran</p>
                <p className="text-lg font-bold text-orange-600 group-hover:text-orange-700">Kelola Data →</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg group-hover:bg-orange-200 transition">
                <FaBook className="text-orange-600 text-3xl" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}
