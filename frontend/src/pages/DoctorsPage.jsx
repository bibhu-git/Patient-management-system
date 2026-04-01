import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Stethoscope } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SPECIALIZATIONS = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Radiologist', 'Surgeon', 'Other',
];

const emptyForm = {
  name: '', specialization: 'General Physician', phone: '', email: '',
  experience: '', qualification: '', availableDays: [], consultationFee: '',
};

const avatarColors = [
  'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700',
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/doctors', { params: { search } });
      setDoctors(data);
    } catch {
      toast.error('Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (d) => {
    setEditing(d);
    setForm({ ...d, experience: String(d.experience || ''), consultationFee: String(d.consultationFee || '') });
    setModalOpen(true);
  };

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(day)
        ? f.availableDays.filter((d) => d !== day)
        : [...f.availableDays, day],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/doctors/${editing._id}`, form);
        toast.success('Doctor updated.');
      } else {
        await api.post('/doctors', form);
        toast.success('Doctor added.');
      }
      setModalOpen(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/doctors/${deleteTarget._id}`);
      toast.success('Doctor removed.');
      setDeleteTarget(null);
      fetchDoctors();
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
          <h1 className="font-display text-2xl font-bold text-slate-900">Doctors</h1>
          <p className="text-sm text-slate-500 mt-0.5">{doctors.length} doctor{doctors.length !== 1 ? 's' : ''} on staff</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="input-field pl-10"
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="card text-center py-16">
          <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No doctors found</p>
          <p className="text-sm text-slate-400 mt-1">Add your first doctor to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {doctors.map((d, i) => (
            <div key={d._id} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-semibold text-base shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                    {d.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Dr. {d.name}</p>
                    <p className="text-sm text-brand-600">{d.specialization}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(d)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-sm">
                {d.qualification && <p className="text-slate-500">{d.qualification}</p>}
                {d.experience > 0 && <p className="text-slate-500">{d.experience} years experience</p>}
                <p className="text-slate-500">{d.phone}</p>
                {d.consultationFee > 0 && (
                  <p className="font-medium text-slate-700">₹{d.consultationFee} / visit</p>
                )}
              </div>

              {d.availableDays?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {d.availableDays.map((day) => (
                    <span key={day} className="px-2 py-0.5 bg-brand-50 text-brand-600 rounded-md text-xs font-medium">
                      {day.slice(0, 3)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Doctor' : 'Add Doctor'} size="lg">
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Full Name *</label>
            <input className="input-field" placeholder="Dr. Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Specialization *</label>
            <select className="input-field" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}>
              {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Phone *</label>
            <input className="input-field" placeholder="+91 9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input-field" placeholder="doctor@clinic.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Qualification</label>
            <input className="input-field" placeholder="MBBS, MD" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
          </div>
          <div>
            <label className="label">Experience (years)</label>
            <input type="number" min="0" className="input-field" placeholder="5" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          </div>
          <div>
            <label className="label">Consultation Fee (₹)</label>
            <input type="number" min="0" className="input-field" placeholder="500" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Available Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    form.availableDays.includes(day)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Remove Dr. ${deleteTarget?.name}?`}
        message="This will remove the doctor from the system."
        loading={deleting}
      />
    </div>
  );
}
