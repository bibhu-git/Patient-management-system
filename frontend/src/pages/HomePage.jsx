import { Link } from 'react-router-dom';
import { Activity, Shield, Calendar, Users, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: Users, title: 'Patient Management', desc: 'Register, update and track all patient records in one place.' },
  { icon: Activity, title: 'Doctor Directory', desc: 'Manage your medical staff with specializations and availability.' },
  { icon: Calendar, title: 'Appointment Booking', desc: 'Schedule and track appointments with date, time, and status.' },
  { icon: Shield, title: 'Secure Access', desc: 'Admin-only authentication keeps patient data protected.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900">MediCare</span>
          </div>
          <Link to="/login" className="btn-primary text-sm">
            Admin Login <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-brand-100">
          <CheckCircle className="w-4 h-4" />
          Trusted Healthcare Platform
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          Modern Patient<br />
          <span className="text-brand-600">Management System</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
          Streamline your clinic's operations — from patient registration to appointment scheduling — all in a clean, intuitive interface built for healthcare professionals.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/login" className="btn-primary px-6 py-3 text-base">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/dashboard" className="btn-secondary px-6 py-3 text-base">
            View Dashboard
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card card-hover p-6">
              <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2 font-display">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} MediCare. Patient Management System.
      </footer>
    </div>
  );
}
