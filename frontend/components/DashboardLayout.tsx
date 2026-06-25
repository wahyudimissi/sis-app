'use client';

import { useState, ReactNode, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  School,
  Calendar,
  ClipboardList,
  BookOpen,
  BarChart3,
  FileText,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  label: string;
  icon: any;
  href: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Master Data',
    icon: School,
    href: '#',
    children: [
      { label: 'Profil Sekolah', icon: School, href: '/master/profil-sekolah' },
      { label: 'Tahun Ajaran', icon: Calendar, href: '/master/tahun-ajaran' },
      { label: 'Data Jurusan', icon: BookOpen, href: '/master/jurusan' },
      { label: 'Mata Pelajaran', icon: BookOpen, href: '/master/mata-pelajaran' },
      { label: 'Data Guru', icon: Users, href: '/master/guru' },
      { label: 'Data Siswa', icon: GraduationCap, href: '/master/siswa' },
      { label: 'Data Kelas', icon: School, href: '/master/kelas' },
    ],
  },
  {
    label: 'Akademik',
    icon: BookOpen,
    href: '#',
    children: [
      { label: 'Jadwal Pelajaran', icon: Calendar, href: '/akademik/jadwal' },
      { label: 'Absensi', icon: ClipboardList, href: '/akademik/absensi' },
      { label: 'Penilaian', icon: BarChart3, href: '/akademik/penilaian' },
      { label: 'E-Rapor', icon: FileText, href: '/akademik/rapor' },
    ],
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);  // NEW

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      await logout();
    }
  };

  const toggleMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Optimized Header - No motion */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 fixed w-full top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Menu Toggle & Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Sistem Informasi Sekolah
              </h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>

          {/* Right: Notifications & User */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user?.username || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Role'}</p>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <User size={18} />
                </button>
                
                {/* Dropdown - Simple transition */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <p className="text-sm font-semibold text-gray-800">{user?.username || 'User'}</p>
                      <p className="text-xs text-gray-600">{user?.role || 'Role'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Optimized Sidebar - Smooth CSS transition */}
      <aside
        className={`fixed left-0 top-14 bottom-0 w-64 bg-white/80 backdrop-blur-md shadow-xl border-r border-gray-200/50 z-40 overflow-y-auto transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <div key={item.label}>
              {/* Parent Menu */}
              <button
                onClick={() => {
                  if (item.children) {
                    toggleMenu(item.label);
                  } else {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-lg transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.children && (
                  <ChevronRight 
                    size={16} 
                    className={`transition-transform ${expandedMenu === item.label ? 'rotate-90' : ''}`}
                  />
                )}
              </button>

              {/* Submenu - CSS transition */}
              {item.children && expandedMenu === item.label && (
                <div className="ml-4 mt-1 space-y-1 animate-slide-down">
                  {item.children.map((child) => (
                    <button
                      key={child.label}
                      onClick={() => {
                        router.push(child.href);
                        setSidebarOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors hover:translate-x-1"
                    >
                      <child.icon size={16} />
                      <span>{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Click outside overlay for user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}

      {/* Overlay for sidebar on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-14">
        <div className="p-4 sm:p-6">
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
