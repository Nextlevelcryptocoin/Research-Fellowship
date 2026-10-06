import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFellowship } from '../context/FellowshipContext';
import { FELLOWSHIPS, FELLOWSHIP_DISCLAIMER_TEXT } from '../data/fellowships';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  FileText,
  Upload,
  Save,
  Send,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';

interface ApplyPageProps {
  navigate: (route: string) => void;
  initialFellowshipSlug?: string;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({ navigate, initialFellowshipSlug }) => {
  const { user } = useAuth();
  const { userApplication, saveApplicationDraft, submitApplication } = useFellowship();

  const matchedFellowship = initialFellowshipSlug
    ? FELLOWSHIPS.find((f) => f.slug === initialFellowshipSlug)
    : undefined;

  const [formData, setFormData] = useState({
    fellowshipId: matchedFellowship ? matchedFellowship.id : userApplication?.fellowshipId || FELLOWSHIPS[0].id,
    fellowshipTitle: matchedFellowship ? matchedFellowship.title : userApplication?.fellowshipTitle || FELLOWSHIPS[0].title,
    // Personal Information
    firstName: user?.firstName || userApplication?.firstName || '',
    lastName: user?.lastName || userApplication?.lastName || '',
    email: user?.email || userApplication?.email || '',
    country: user?.country || userApplication?.country || '',
    phone: user?.phone || userApplication?.phone || '',
    // Academic Information
    highestQualification: user?.highestQualification || userApplication?.highestQualification || '',
    institution: userApplication?.institution || '',
    fieldOfStudy: userApplication?.fieldOfStudy || '',
    professionalBackground: user?.professionalBackground || userApplication?.professionalBackground || '',
    researchExperience: userApplication?.researchExperience || '',
    // Research Information
    proposedResearchArea: userApplication?.proposedResearchArea || '',
    proposedResearchTitle: userApplication?.proposedResearchTitle || '',
    researchInterests: user?.researchInterests || userApplication?.researchInterests || '',
    statementOfPurpose: userApplication?.statementOfPurpose || '',
    expectedResearchOutcomes: userApplication?.expectedResearchOutcomes || '',
    // Documents
    cvFileName: userApplication?.cvFileName || 'Applicant_Curriculum_Vitae.pdf',
    supportingDocName: userApplication?.supportingDocName || 'Writing_Sample_Published.pdf'
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleFellowshipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = FELLOWSHIPS.find((f) => f.id === e.target.value);
    if (selected) {
      setFormData({
        ...formData,
        fellowshipId: selected.id,
        fellowshipTitle: selected.title
      });
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    saveApplicationDraft(formData);
    setStatusMessage('Application draft saved successfully. You can return at any time.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication(formData);
    setSubmittedSuccess(true);
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <div className="bg-white border border-stone-200 rounded-xl p-8 sm:p-10 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-950">
            Application Submitted Successfully
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Your application for the <strong>{formData.fellowshipTitle}</strong> has been received by the UNSP Academic Review Committee. You may track your application status in your Fellow Dashboard.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Go to Fellow Dashboard →
            </button>
            <button
              onClick={() => navigate('/fellowships')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-800 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Browse Other Fellowships
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <DisclaimerBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-6 space-y-2">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
            Admissions · 2026 Cohorts
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950">
            Fellowship Application System
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Submit your research proposal, academic background, and statement of purpose for independent faculty review.
          </p>
          <div className="pt-1 flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Programme Fee: <strong className="text-slate-950">₹1,50,000</strong></span>
            <span>·</span>
            <span>Fee settled only after selection</span>
          </div>
        </div>

        {statusMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 text-xs">
          
          {/* SECTION 1: PROGRAMME SELECTION */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-2">
              1. Selected Fellowship Programme
            </h2>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Choose from the 13 International Fellowships *
              </label>
              <select
                value={formData.fellowshipId}
                onChange={handleFellowshipChange}
                className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 font-medium bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
              >
                {FELLOWSHIPS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title} (₹1,50,000 · 24 Weeks)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 2: PERSONAL INFORMATION */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-2">
              2. Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Country of Residence *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Contact Telephone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ACADEMIC INFORMATION */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-2">
              3. Academic & Professional Credentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Highest Qualification *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master of Science, LL.M., Ph.D."
                  value={formData.highestQualification}
                  onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Awarding University / Institution *</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Field of Study *</label>
                <input
                  type="text"
                  required
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Professional Background *</label>
                <input
                  type="text"
                  required
                  placeholder="Current position / organizational role"
                  value={formData.professionalBackground}
                  onChange={(e) => setFormData({ ...formData, professionalBackground: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Previous Research Experience *</label>
              <textarea
                rows={3}
                placeholder="Briefly describe your prior research experience, publications, or scholarly projects..."
                value={formData.researchExperience}
                onChange={(e) => setFormData({ ...formData, researchExperience: e.target.value })}
                className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 4: RESEARCH PROPOSAL INFORMATION */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-2">
              4. Research Scope & Statement of Purpose
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Proposed Research Area *</label>
                <input
                  type="text"
                  required
                  value={formData.proposedResearchArea}
                  onChange={(e) => setFormData({ ...formData, proposedResearchArea: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Proposed Research Title *</label>
                <input
                  type="text"
                  required
                  value={formData.proposedResearchTitle}
                  onChange={(e) => setFormData({ ...formData, proposedResearchTitle: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 font-serif"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Statement of Purpose (500 – 800 words) *</label>
              <textarea
                rows={5}
                required
                placeholder="Detail why you are applying, the theoretical problem you seek to address, and how this fellowship aligns with your scholarly goals..."
                value={formData.statementOfPurpose}
                onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Expected Research Outcomes *</label>
              <textarea
                rows={3}
                required
                placeholder="What deliverables do you expect to generate? (e.g. Monograph, benchmark code, policy framework)..."
                value={formData.expectedResearchOutcomes}
                onChange={(e) => setFormData({ ...formData, expectedResearchOutcomes: e.target.value })}
                className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 5: DOCUMENTS */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-2">
              5. Documents (Curriculum Vitae & Writing Sample)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-stone-200 rounded-lg p-4 bg-stone-50/50 space-y-2">
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Curriculum Vitae (PDF) *</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Current attached: {formData.cvFileName}
                </p>
                <label className="text-slate-900 underline text-[11px] cursor-pointer block">
                  <span>Replace CV</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({ ...formData, cvFileName: e.target.files[0].name });
                      }
                    }}
                  />
                </label>
              </div>

              <div className="border border-stone-200 rounded-lg p-4 bg-stone-50/50 space-y-2">
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Supporting Academic Sample (Optional)</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Current attached: {formData.supportingDocName}
                </p>
                <label className="text-slate-900 underline text-[11px] cursor-pointer block">
                  <span>Replace Document</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({ ...formData, supportingDocName: e.target.files[0].name });
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Transparency Disclaimer Notice */}
          <aside className="border border-amber-200 bg-amber-50/80 rounded-xl p-5 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-800" />
              <span>Applicant Legal & Recognition Declaration</span>
            </div>
            <p className="leading-relaxed">
              {FELLOWSHIP_DISCLAIMER_TEXT}
            </p>
          </aside>

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-2.5 text-xs font-semibold text-slate-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Application Draft</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Formal Application</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
