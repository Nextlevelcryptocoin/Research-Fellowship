import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFellowship } from '../context/FellowshipContext';
import { useGoogleDrive } from '../context/GoogleDriveContext';
import { GoogleDriveExplorer } from '../components/GoogleDriveExplorer';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  Upload,
  FileText,
  Save,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Paperclip,
  HardDrive
} from 'lucide-react';

interface StudentResearchPageProps {
  navigate: (route: string) => void;
}

export const StudentResearchPage: React.FC<StudentResearchPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { userResearchProject, saveResearchProject, submitResearchProject } = useFellowship();
  const { isConnected, connectGoogleDrive } = useGoogleDrive();

  const [title, setTitle] = useState(
    userResearchProject?.title || 'Auditing Demographic Disparities in Multimodal Reasoning Models'
  );
  const [abstract, setAbstract] = useState(
    userResearchProject?.abstract ||
      'This research investigates latent bias propagation through multimodal alignment stages, introducing counterfactual benchmark measures to ensure algorithmic fairness.'
  );
  const [documentName, setDocumentName] = useState('Final_Monograph_Submission_Draft.pdf');
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const status = userResearchProject?.status || 'Draft';

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    saveResearchProject({ title, abstract });
    setMessage('Research project draft successfully saved.');
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitResearchProject({ title, abstract });
    setMessage('Research monograph successfully submitted for academic committee evaluation.');
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-8 pb-20">
      <DisclaimerBanner compact />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Fellow Dashboard</span>
        </button>

        {/* Header */}
        <div className="border-b border-stone-200 pb-6 space-y-2">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
            Fellowship Research Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-slate-950">
            Research Monograph Submission
          </h1>
          <p className="text-xs text-slate-600">
            Submit intermediate chapters, proposals, and your final 8,000–12,000 word supervised research monograph.
          </p>
        </div>

        {/* Current Submission Status */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Monograph Evaluation Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-mono font-semibold px-2.5 py-1 rounded border ${
                  status === 'Completed' || status === 'Accepted'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : status === 'Revision Required'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {status.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500">
                Supervisor: {userResearchProject?.mentorName || 'Prof. David Kaufman (DEMO)'}
              </span>
            </div>
          </div>

          {userResearchProject?.evaluationScore && (
            <div className="sm:text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                Current Score
              </span>
              <span className="font-mono text-sm font-bold text-slate-900">
                {userResearchProject.evaluationScore}
              </span>
            </div>
          )}
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>{message}</span>
          </div>
        )}

        {/* Submission Form */}
        <form className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-800">
              Research Monograph Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 font-serif text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800">
              Abstract (300 – 500 words) *
            </label>
            <textarea
              rows={6}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Document Upload Area */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-800">
              Upload Monograph Deliverable (PDF, DOCX) *
            </label>
            <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center space-y-3 bg-stone-50/40">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <p className="font-medium text-slate-900">
                  Attached file: <span className="font-mono text-slate-700">{documentName}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Target length: 8,000 to 12,000 words. APA / Bluebook format.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <label className="px-4 py-2 bg-white border border-stone-300 rounded text-slate-700 hover:bg-stone-50 cursor-pointer font-medium inline-block">
                  <span>Upload Local File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setDocumentName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowDriveModal(true)}
                  className="px-4 py-2 bg-[#121927] hover:bg-[#1e293b] text-white rounded font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <HardDrive className="w-3.5 h-3.5 text-[#e5c36d]" />
                  <span>Choose from Google Drive</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-2.5 text-xs font-semibold text-slate-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Progress Draft</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Monograph for Formal Evaluation</span>
            </button>
          </div>
        </form>

        {/* Advisory Review Log */}
        {userResearchProject?.mentorFeedback && (
          <div className="border border-stone-200 bg-white rounded-xl p-6 space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              Supervisor Milestone Feedback
            </span>
            <p className="font-serif text-sm italic text-slate-800">
              “{userResearchProject.mentorFeedback}”
            </p>
            <span className="text-[11px] text-slate-500 block pt-1">
              Supervisor: {userResearchProject.mentorName}
            </span>
          </div>
        )}

        {/* Google Drive Selection Modal */}
        {showDriveModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#e6e2d8] p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#e6e2d8] pb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-[#8c6a1e]" />
                  <h3 className="font-serif text-lg font-bold text-[#121927]">
                    Select Monograph from Google Drive
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDriveModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  Close
                </button>
              </div>

              <GoogleDriveExplorer
                defaultTitle="Choose Research Monograph Document"
                onSelectFile={(f) => {
                  setDocumentName(f.name);
                  setShowDriveModal(false);
                }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
