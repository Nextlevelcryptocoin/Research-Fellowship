import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFellowship } from '../context/FellowshipContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ArrowLeft, CheckCircle, AlertTriangle, Send, FileText } from 'lucide-react';

interface RefundRequestPageProps {
  navigate: (route: string) => void;
}

export const RefundRequestPage: React.FC<RefundRequestPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { orders, submitRefundRequest, refundRequests } = useFellowship();

  const paidOrders = orders.filter((o) => o.paymentStatus === 'Payment Successful' || o.orderStatus === 'Paid');
  const defaultOrder = paidOrders[0] || orders[0];

  const [selectedOrderId, setSelectedOrderId] = useState(defaultOrder?.orderId || '');
  const [reason, setReason] = useState('Withdrawal prior to Phase 1 supervisory orientation');
  const [supportingInfo, setSupportingInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) {
      setError('Please select an order ID.');
      return;
    }
    setError(null);
    try {
      await submitRefundRequest({
        orderId: selectedOrderId,
        reason,
        supportingInformation: supportingInfo
      });
      setSubmitted(true);
    } catch {
      setError('Unable to submit refund request.');
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <DisclaimerBanner />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Student Dashboard</span>
        </button>

        {/* Header */}
        <div className="border-b border-stone-200 pb-6 space-y-2">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
            Financial Services · Fee Settlement
          </span>
          <h1 className="font-serif text-3xl font-bold text-slate-950">
            Submit a Refund Request
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Requests are processed under the published <button onClick={() => navigate('/refund-policy')} className="text-slate-900 underline font-medium">UNSP Fee & Refund Policy</button>. All refunds require review by the academic secretariat.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-700 mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-slate-950">
              Refund Request Submitted
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your request for Order <strong>{selectedOrderId}</strong> has been logged. Status: <strong>Under Review</strong>. You will be notified once the administration audits milestone adherence and processes the provider reversal.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/student/dashboard')}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800"
              >
                Return to Fellow Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-5 text-xs">
            
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Select Order ID *</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-lg bg-white text-slate-900 font-mono"
              >
                {orders.map((o) => (
                  <option key={o.orderId} value={o.orderId}>
                    {o.orderId} — {o.fellowshipName} (₹{o.amount.toLocaleString('en-IN')}) · Status: {o.paymentStatus}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Name</label>
                <input
                  type="text"
                  disabled
                  value={`${user?.firstName} ${user?.lastName}`}
                  className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email</label>
                <input
                  type="text"
                  disabled
                  value={user?.email}
                  className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Reason for Withdrawal / Refund *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-lg bg-white text-slate-900"
              >
                <option value="Withdrawal prior to Phase 1 supervisory orientation">
                  Withdrawal prior to Phase 1 supervisory orientation (Within 7-day policy window)
                </option>
                <option value="Medical or personal extenuating circumstances">
                  Medical or personal extenuating circumstances (Documentation provided)
                </option>
                <option value="Duplicate payment transaction">
                  Duplicate payment transaction error
                </option>
                <option value="Other administrative inquiry">
                  Other administrative inquiry
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Supporting Information / Notes</label>
              <textarea
                rows={4}
                placeholder="Provide any additional context or reference numbers..."
                value={supportingInfo}
                onChange={(e) => setSupportingInfo(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-lg text-slate-900 leading-relaxed"
              />
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-[11px] text-slate-600 leading-relaxed">
              <strong>Policy Reminder:</strong> In accordance with the UNSP Refund Policy, withdrawals submitted prior to Phase 1 supervisory consultations are eligible for an 80% refund (20% retained for admissions evaluation). Once advisory consultations commence, programme fees are non-refundable.
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Formal Refund Request</span>
            </button>
          </form>
        )}

        {/* Existing Refund Requests History */}
        {refundRequests.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="font-serif text-lg font-bold text-slate-900">Your Refund Requests</h3>
            <div className="space-y-2 text-xs">
              {refundRequests.map((r) => (
                <div key={r.id} className="p-4 bg-white border border-stone-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-mono font-semibold text-slate-900">{r.orderId}</span>
                    <p className="text-slate-600">{r.reason}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Date: {r.requestedDate}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] ${
                    r.status === 'Refunded' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
