'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaIdCard,
  FaUser,
  FaClock,
  FaSpinner,
} from 'react-icons/fa';

interface AbsensiResult {
  success: boolean;
  message: string;
  data?: {
    siswa: {
      id: string;
      nama: string;
      nis: string;
      kelas: string;
      foto?: string;
    };
    absensi: {
      id: string;
      status: string;
      tanggal: string;
    };
  };
}

export default function AbsensiRFIDPage() {
  const [rfidInput, setRfidInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<AbsensiResult | null>(null);
  const [lastScanned, setLastScanned] = useState<string>('');
  const [todayCount, setTodayCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-focus input on mount and after each scan
  useEffect(() => {
    inputRef.current?.focus();
  }, [result]);

  // Handle RFID scan
  const handleRFIDScan = async (rfidCard: string) => {
    if (!rfidCard || rfidCard === lastScanned) return;

    setProcessing(true);
    setLastScanned(rfidCard);

    try {
      const response = await fetch('/api/absensi/rfid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfidCard,
          tanggal: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setTodayCount((prev) => prev + 1);
        // Play success sound (optional)
        playSound('success');
      } else {
        // Play error sound (optional)
        playSound('error');
      }

      // Clear result after 3 seconds
      setTimeout(() => {
        setResult(null);
        setRfidInput('');
        inputRef.current?.focus();
      }, 3000);
    } catch (error) {
      setResult({
        success: false,
        message: 'Gagal menghubungi server',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRfidInput(value);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout to process after 100ms (assuming RFID reader sends all at once)
    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        handleRFIDScan(value.trim());
      }
    }, 100);
  };

  // Play sound (optional)
  const playSound = (type: 'success' | 'error') => {
    // You can add actual sound files here
    console.log(`Play ${type} sound`);
  };

  // Format date time
  const formatDateTime = () => {
    const now = new Date();
    return now.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 p-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FaIdCard className="text-primary-600" />
                    Absensi RFID
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Tempelkan kartu RFID pada reader untuk mencatat kehadiran
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-primary-100 rounded-lg px-4 py-2">
                    <p className="text-sm text-primary-700 font-semibold">Hari Ini</p>
                    <p className="text-3xl font-bold text-primary-600">{todayCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Time Display */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <FaClock className="text-primary-600" />
                <span className="text-lg font-semibold">{formatDateTime()}</span>
              </div>
            </div>
          </div>

          {/* Scanner Area */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              {/* Hidden Input for RFID Scanner */}
              <input
                ref={inputRef}
                type="text"
                value={rfidInput}
                onChange={handleInputChange}
                className="sr-only"
                autoFocus
                placeholder="RFID Input"
              />

              {/* Status Display */}
              {!result && !processing && (
                <div className="text-center">
                  <div className="inline-block animate-pulse">
                    <FaIdCard className="text-9xl text-gray-300 mb-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-4">
                    Siap Menerima Kartu
                  </h2>
                  <p className="text-gray-500 text-lg">
                    Tempelkan kartu RFID Anda pada reader
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Reader Aktif</span>
                  </div>
                </div>
              )}

              {/* Processing */}
              {processing && (
                <div className="text-center">
                  <FaSpinner className="text-6xl text-primary-600 animate-spin mx-auto mb-4" />
                  <p className="text-xl text-gray-700">Memproses...</p>
                </div>
              )}

              {/* Success Result */}
              {result && result.success && result.data && (
                <div className="text-center animate-fade-in">
                  <div className="inline-block mb-6">
                    <FaCheckCircle className="text-9xl text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-green-600 mb-4">
                    Absensi Berhasil!
                  </h2>
                  
                  {/* Student Info */}
                  <div className="bg-green-50 rounded-xl p-6 mb-4">
                    <div className="flex items-center justify-center gap-6 mb-4">
                      {result.data.siswa.foto ? (
                        <img
                          src={result.data.siswa.foto}
                          alt={result.data.siswa.nama}
                          className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center border-4 border-green-500">
                          <FaUser className="text-4xl text-green-600" />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-2xl font-bold text-gray-800">
                          {result.data.siswa.nama}
                        </p>
                        <p className="text-lg text-gray-600">
                          NIS: {result.data.siswa.nis}
                        </p>
                        <p className="text-lg text-gray-600">
                          Kelas: {result.data.siswa.kelas}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 mt-4">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-xl font-bold text-green-600">HADIR</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Result */}
              {result && !result.success && (
                <div className="text-center animate-fade-in">
                  <div className="inline-block mb-6">
                    <FaTimesCircle className="text-9xl text-red-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-red-600 mb-4">
                    Gagal!
                  </h2>
                  <div className="bg-red-50 rounded-xl p-6">
                    <p className="text-xl text-red-700">{result.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Petunjuk Penggunaan:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">1.</span>
                  <span>Pastikan RFID reader terhubung dengan komputer via USB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">2.</span>
                  <span>Tempelkan kartu RFID pada reader</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">3.</span>
                  <span>Sistem akan otomatis mencatat kehadiran</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">4.</span>
                  <span>Setiap kartu hanya bisa absen 1x per hari</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
