import React, { useRef } from 'react';
import { Invoice } from '../types';
import { Printer, Download, ShieldCheck, CheckCircle, Clock } from 'lucide-react';
import { FELLOWSHIP_DISCLAIMER_TEXT } from '../data/fellowships';

interface InvoiceViewProps {
  invoice: Invoice;
  isReceipt?: boolean;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice, isReceipt = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.paymentStatus === 'Payment Successful';

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex justify-end gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Invoice Card */}
      <div
        ref={containerRef}
        className="bg-white border border-stone-300 rounded-xl p-8 sm:p-12 shadow-sm text-xs text-slate-800 space-y-8 max-w-3xl mx-auto print:border-none print:shadow-none print:p-0"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-1">
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-950 block">
              UNSP University
            </span>
            <p className="font-medium text-slate-700 text-xs">
              UNSP International Research Fellowship
            </p>
            <p className="text-[11px] font-serif italic text-amber-900/80">
              Research · Innovation · Impact · Global Knowledge
            </p>
            <p className="text-[11px] text-slate-500 font-mono pt-1">
              Portal: https://fellowship.unspuniversity.com/
            </p>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-block uppercase font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-stone-100 text-slate-800 border border-stone-200">
              {isReceipt ? 'Official Payment Receipt' : 'Fellowship Fee Invoice'}
            </span>
            <p className="font-mono text-sm font-bold text-slate-950 pt-1">
              {invoice.invoiceNumber}
            </p>
            <p className="text-slate-500 text-[11px]">
              Order ID: <span className="font-mono text-slate-700">{invoice.orderId}</span>
            </p>
            <p className="text-slate-500 text-[11px]">
              Date: <span className="text-slate-700">{invoice.paymentDate}</span>
            </p>
          </div>
        </div>

        {/* Bill To & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
              Billed To (Fellow Candidate)
            </span>
            <p className="font-serif text-base font-bold text-slate-900">
              {invoice.studentName}
            </p>
            <p className="text-slate-600">{invoice.email}</p>
            <p className="text-slate-600">Country: {invoice.country}</p>
            <p className="text-[11px] text-slate-500 font-mono">User ID: {invoice.userId}</p>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
              Payment & Settlement Status
            </span>
            <span
              className={`inline-flex items-center gap-1 font-mono font-semibold px-2.5 py-1 rounded border text-xs ${
                isPaid
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {isPaid ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {invoice.paymentStatus}
            </span>
            <p className="text-slate-600 text-[11px] pt-1">
              Method: <strong className="text-slate-800">{invoice.paymentMethod}</strong>
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Duration</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="p-3 space-y-0.5">
                  <p className="font-semibold text-slate-900">
                    {invoice.fellowship}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    UNSP International Research Fellowship · Supervised Monograph Curriculum
                  </p>
                </td>
                <td className="p-3 text-center font-mono text-slate-600">
                  24 Weeks
                </td>
                <td className="p-3 text-right font-mono font-semibold text-slate-900">
                  ₹{invoice.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2 border-t border-stone-200 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium text-slate-900">₹{invoice.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Tax / GST:</span>
              <span className="font-mono">₹{invoice.taxAmount}</span>
            </div>
            <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-sm text-slate-950">
              <span>Total Amount:</span>
              <span className="font-mono text-base">₹{invoice.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Tax Note */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded text-[11px] text-slate-500 leading-relaxed">
          <strong>Tax Note:</strong> {invoice.taxNote}
        </div>

        {/* Institutional Legal Disclaimer */}
        <div className="border-t border-stone-200 pt-4 space-y-1 text-[10px] text-slate-500 leading-relaxed">
          <p className="font-semibold text-slate-700">
            Institutional Transparency Notice:
          </p>
          <p>{FELLOWSHIP_DISCLAIMER_TEXT}</p>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-400 border-t border-stone-100 pt-4">
          This is a computer-generated institutional document issued by UNSP University International Research Fellowship.
        </div>
      </div>
    </div>
  );
};
