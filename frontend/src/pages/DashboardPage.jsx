import { useEffect, useState } from 'react';
import { Users, Stethoscope, CalendarCheck, Clock } from 'lucide-react';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

const statusBadge = (status) => {
  const map = {
    Scheduled: 'badge-scheduled',
    Completed: 'badge-completed',
    Cancelled: 'badge-cancelled',
  };
  return <span className={map[status] || 'badge-scheduled'}>{status}</span>;
};

export default function DashboardPage() {
  const { admin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );

  const { stats, recentAppointments, appointmentsByStatus } = data || {};

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Patients" value={stats?.totalPatients ?? 0} icon={Users} color="blue" />
        <StatCard label="Total Doctors" value={stats?.totalDoctors ?? 0} icon={Stethoscope} color="green" />
        <StatCard label="All Appointments" value={stats?.totalAppointments ?? 0} icon={CalendarCheck} color="purple" />
        <StatCard label="Today's Appointments" value={stats?.todayAppointments ?? 0} icon={Clock} color="orange" sub="Scheduled for today" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-display font-semibold text-slate-800 mb-4">Recent Appointments</h2>
          {recentAppointments?.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No appointments yet.</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments?.map((appt) => (
                <div key={appt._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm shrink-0">
                    {appt.patient?.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{appt.patient?.name}</p>
                    <p className="text-xs text-slate-400 truncate">Dr. {appt.doctor?.name} · {appt.doctor?.specialization}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {statusBadge(appt.status)}
                    <p className="text-xs text-slate-400 mt-1">{new Date(appt.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-display font-semibold text-slate-800 mb-4">Appointment Status</h2>
          <div className="space-y-3">
            {['Scheduled', 'Completed', 'Cancelled'].map((status) => {
              const found = appointmentsByStatus?.find((s) => s._id === status);
              const count = found?.count ?? 0;
              const total = stats?.totalAppointments || 1;
              const pct = Math.round((count / total) * 100);
              const colors = { Scheduled: 'bg-blue-500', Completed: 'bg-green-500', Cancelled: 'bg-red-400' };

              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600">{status}</span>
                    <span className="font-medium text-slate-800">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${colors[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
