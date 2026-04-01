import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Stethoscope, CalendarCheck, LogOut, Activity, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/appointments', icon: CalendarCheck, label: 'Appointments' },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col h-full bg-white border-r border-slate-100 w-64 shrink-0`}>
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-display font-700 text-slate-900 leading-tight">MediCare</p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-brand-50 text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
            {admin?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{admin?.name}</p>
            <p className="text-xs text-slate-400 truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-slate-900">MediCare</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
