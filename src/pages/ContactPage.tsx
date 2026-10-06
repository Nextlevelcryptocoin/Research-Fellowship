import React, { useState } from 'react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { Mail, Send, CheckCircle, Clock, Shield } from 'lucide-react';

interface ContactPageProps {
  navigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-12 pb-20">
      <DisclaimerBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-8 space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
            Academic Inquiries
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Contact the Academic Secretariat
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Have questions regarding application guidelines, curriculum tracks, or credential verification? Reach out to our admissions secretariat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Institutional Contact Info */}
          <div className="md:col-span-5 space-y-4 bg-white border border-stone-200 rounded-xl p-6 text-xs text-slate-700">
            <h2 className="font-serif text-lg font-bold text-slate-950 border-b border-stone-100 pb-2">
              Secretariat Information
            </h2>

            <div className="space-y-3 pt-1">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Division
                </span>
                <p className="font-medium text-slate-900">
                  UNSP International Research Fellowship
                </p>
                <p className="text-slate-500">Academic Review & Admissions Secretariat</p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Official Fellowship Portal
                </span>
                <p className="font-mono text-slate-800">
                  https://fellowship.unspuniversity.com/
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Student Learning Management System
                </span>
                <p className="font-mono text-slate-800">
                  https://student.unspuniversity.com/
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Secretariat Hours
                </span>
                <p className="text-slate-800">
                  Monday – Friday: 09:00 – 18:00 (UTC)
                </p>
                <p className="text-slate-500">Admissions queries reviewed within 2 business days.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 text-[11px] text-slate-500">
              For certificate verification assistance, please use the automated verification ledger at <button onClick={() => navigate('/verify')} className="text-slate-900 underline">/verify</button>.
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white border border-stone-200 rounded-xl p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-700 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-slate-950">
                  Inquiry Dispatched Successfully
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{form.name}</strong>. Your inquiry has been routed to the relevant fellowship academic coordinator. A confirmation has been recorded.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inquiry regarding AI & Data Science Track Prerequisite"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Please specify your question, academic discipline, and fellowship track of interest..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 leading-relaxed focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry to Secretariat</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
