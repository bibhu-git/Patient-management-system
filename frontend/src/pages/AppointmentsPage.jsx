import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, CalendarCheck } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUSES = ['Scheduled', 'Completed', 'Cancelled'];

const emptyForm = {
  patient: '', doctor: '', date: '', time: '', reason: '', status: 'Scheduled', notes: '',
};

const statusBadge = (status) => {
  const map = {
    Scheduled: 'badge-scheduled',
    Completed: 'badge-completed',
    Cancelled: 'badge-cancelled',
  };
  return <span className={map[status]}>{status}</span>;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments', { params: { status: statusFilter, page, limit: 8 } });
      setAppointments(data.appointments);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const openCreate = async () => {
    setEditing(null);
    setForm(emptyForm);
    await loadDropdowns();
    setModalOpen(true);
  };

  const openEdit = async (appt) => {
    setEditing(appt);
    setForm({
      patient: appt.patient?._id || '',
      doctor: appt.doctor?._id || '',
      date: appt.date?.split('T')[0] || '',
      time: appt.time || '',
      reason: appt.reason || '',
      status: appt.status || 'Scheduled',
      notes: appt.notes || '',
    });
    await loadDropdowns();
    setModalOpen(true);
  };

  const loadDropdowns = async () => {
    const [pRes, dRes] = await Promise.all([
      api.get('/patients', { params: { limit: 200 } }),
      api.get('/doctors'),
    ]);
    setPatients(pRes.data.patients);
    setDoctors(dRes.data);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/appointments/${editing._id}`, form);
        toast.success('Appointment updated.');
      } else {
        await api.post('/appointments', form);
        toast.success('Appointment booked.');
      }
      setModalOpen(false);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/appointments/${deleteTarget._id}`);
      toast.success('Appointment deleted.');
      setDeleteTarget(null);
      fetchAppointments();
    } catch {
      toast.error('Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} appointment{total !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              statusFilter === s
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16">
            <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No appointments found</p>
            <p className="text-sm text-slate-400 mt-1">Book an appointment to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Patient', 'Doctor', 'Date & Time', 'Reason', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-xs shrink-0">
                          {a.patient?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{a.patient?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-slate-800">Dr. {a.doctor?.name}</p>
                      <p className="text-xs text-slate-400">{a.doctor?.specialization}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-slate-800">{new Date(a.date).toLocaleDateString('en-IN')}</p>
                      <p className="text-xs text-slate-400">{a.time}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 max-w-[160px] truncate">{a.reason || '—'}</td>
                    <td className="px-5 py-3.5">{statusBadge(a.status)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(a)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-secondary py-1.5 text-sm disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="btn-secondary py-1.5 text-sm disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Appointment' : 'Book Appointment'} size="lg">
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Patient *</label>
            <select className="input-field" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Doctor *</label>
            <select className="input-field" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} required>
              <option value="">Select doctor</option>
              {doctors.map((d) => <option key={d._id} value={d._id}>Dr. {d.name} — {d.specialization}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date *</label>
            <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div>
            <label className="label">Time *</label>
            <input type="time" className="input-field" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Reason for Visit</label>
            <input className="input-field" placeholder="e.g. Routine check-up, Fever, Follow-up" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
          {editing && (
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}
          <div className={editing ? '' : 'sm:col-span-2'}>
            <label className="label">Notes</label>
            <textarea className="input-field resize-none" rows={2} placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update Appointment' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this appointment?"
        message="This will permanently remove the appointment record."
        loading={deleting}
      />
    </div>
  );
}
