import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, User } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

const emptyForm = {
  name: '', age: '', gender: 'Male', phone: '', email: '',
  address: '', bloodGroup: '', medicalHistory: '',
};

function PatientForm({ initialValues, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(initialValues);
  const isEditing = !!initialValues._id;

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(emptyForm);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-80 md:mt-40">
      <div className="sm:col-span-2">
        <label className="label">Full Name *</label>
        <input
          className="input-field"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange('name')}
          required
        />
      </div>
      <div>
        <label className="label">Age *</label>
        <input
          type="number"
          className="input-field"
          placeholder="30"
          min="0"
          max="150"
          value={form.age}
          onChange={handleChange('age')}
          required
        />
      </div>
      <div>
        <label className="label">Gender *</label>
        <select className="input-field" value={form.gender} onChange={handleChange('gender')}>
          {GENDERS.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Phone *</label>
        <input
          className="input-field"
          placeholder="+91 9876543210"
          value={form.phone}
          onChange={handleChange('phone')}
          required
        />
      </div>
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          className="input-field"
          placeholder="patient@email.com"
          value={form.email}
          onChange={handleChange('email')}
        />
      </div>
      <div>
        <label className="label">Blood Group</label>
        <select className="input-field" value={form.bloodGroup} onChange={handleChange('bloodGroup')}>
          <option value="">Select</option>
          {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Address</label>
        <input
          className="input-field"
          placeholder="123 Main St, City"
          value={form.address}
          onChange={handleChange('address')}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label">Medical History</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Known conditions, allergies, past surgeries..."
          value={form.medicalHistory}
          onChange={handleChange('medicalHistory')}
        />
      </div>
      <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : isEditing ? 'Update Patient' : 'Register Patient'}
        </button>
      </div>
    </form>
  );
}

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/patients', { params: { search, page, limit: 8 } });
      setPatients(data.patients);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load patients.');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const openCreate = () => {
    setEditingPatient(null);
    setModalOpen(true);
  };

  const openEdit = (patient) => {
    setEditingPatient(patient);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPatient(null);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingPatient) {
        await api.put(`/patients/${editingPatient._id}`, formData);
        toast.success('Patient updated.');
      } else {
        await api.post('/patients', formData);
        toast.success('Patient registered.');
      }
      closeModal();
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/patients/${deleteTarget._id}`);
      toast.success('Patient removed.');
      setDeleteTarget(null);
      fetchPatients();
    } catch {
      toast.error('Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  const formInitialValues = editingPatient
    ? { ...editingPatient, age: String(editingPatient.age) }
    : emptyForm;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} registered patient{total !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Patient
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          className="input-field pl-10"
          placeholder="Search by name, phone or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-16">
            <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No patients found</p>
            <p className="text-sm text-slate-400 mt-1">Add your first patient to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Patient', 'Age / Gender', 'Phone', 'Blood Group', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{p.age} yrs · {p.gender}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{p.phone}</td>
                    <td className="px-5 py-3.5">
                      {p.bloodGroup
                        ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">{p.bloodGroup}</span>
                        : <span className="text-slate-300 text-sm">—</span>
                      }
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingPatient ? 'Edit Patient' : 'Register Patient'}
        size="lg"
      >
        <PatientForm
          key={editingPatient?._id ?? 'create'}
          initialValues={formInitialValues}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          saving={saving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteTarget?.name}?`}
        message="This action will remove the patient from the system. This cannot be undone."
        loading={deleting}
      />
    </div>
  );
}