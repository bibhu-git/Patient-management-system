import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Action" size="sm">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="font-medium text-slate-800">{title}</p>
          <p className="text-sm text-slate-500 mt-1">{message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="btn-secondary" disabled={loading}>
          Cancel
        </button>
        <button onClick={onConfirm} className="btn-danger" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
