import React, { useState } from 'react';
import { useFellowship } from '../context/FellowshipContext';
import { useGoogleDrive } from '../context/GoogleDriveContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { GoogleDriveExplorer } from '../components/GoogleDriveExplorer';
import {
  BookOpen,
  FileText,
  Search,
  Compass,
  Database,
  BarChart2,
  PenTool,
  Upload,
  CheckCircle,
  Award,
  Layers,
  ChevronRight,
  Save,
  Send,
  HelpCircle,
  Sparkles,
  HardDrive
} from 'lucide-react';

interface ResearchCentreProps {
  navigate: (route: string) => void;
}

export const ResearchCentrePage: React.FC<ResearchCentreProps> = ({ navigate }) => {
  const { userProposal, saveProposal, submitProposal } = useFellowship();
  const { isConnected, connectGoogleDrive, exportProposalToDrive } = useGoogleDrive();

  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [driveExportStatus, setDriveExportStatus] = useState<string | null>(null);

  // Proposal form state
  const [formData, setFormData] = useState({
    researchTitle: userProposal?.researchTitle || 'Auditing Demographic Disparities in Multimodal Reasoning Models',
    background: userProposal?.background || 'Foundation models demonstrate unprecedented scale but encode systematic geographic and linguistic biases.',
    problemStatement: userProposal?.problemStatement || 'Current algorithmic fairness benchmarks fail to isolate intersectional disparities in multimodal vision-language architectures.',
    researchQuestions: userProposal?.researchQuestions || '1. How do zero-shot multimodal vision encoders propagate cultural stereotypes? 2. What regularization methods yield demographic parity?',
    researchObjectives: userProposal?.researchObjectives || 'To create a validated evaluation testbench and formal mathematical mitigation algorithm.',
    literatureSummary: userProposal?.literatureSummary || 'Synthesizes foundational literature from Buolamwini & Gebru (2018), Dwork et al. (2012), and modern EU AI Act compliance standards.',
    researchGap: userProposal?.researchGap || 'A lack of granular non-English open datasets for auditing multimodal alignment layers.',
    methodology: userProposal?.methodology || 'Empirical quantitative evaluation across 3 open-weights foundation models using counterfactual prompt matrices.',
    expectedOutcomes: userProposal?.expectedOutcomes || 'An open-source benchmark toolkit, peer-reviewed evaluation metrics, and a 10,000-word monograph.',
    references: userProposal?.references || '1. Dwork, C. et al. (2012). Fairness Through Awareness. ITCS.\n2. Bender, E. M. et al. (2021). On the Dangers of Stochastic Parrots.'
  });

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    saveProposal(formData);
    setSaveStatus('Proposal draft saved successfully.');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    submitProposal(formData);
    setSaveStatus('Proposal submitted for academic committee review.');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleExportToGoogleDrive = async () => {
    if (!isConnected) {
      const ok = await connectGoogleDrive();
      if (!ok) return;
    }
    setDriveExportStatus('Exporting proposal to Google Drive...');
    const markdownContent = `# ${formData.researchTitle}
*UNSP University International Research Fellowship*

## 1. Background & Scholarly Context
${formData.background}

## 2. Problem Statement
${formData.problemStatement}

## 3. Research Questions & Hypotheses
${formData.researchQuestions}

## 4. Research Objectives
${formData.researchObjectives}

## 5. Literature Summary & Theoretical Matrix
${formData.literatureSummary}

## 6. Research Gap & Novelty
${formData.researchGap}

## 7. Research Methodology & Data Framework
${formData.methodology}

## 8. Expected Scholarly Outcomes
${formData.expectedOutcomes}

## 9. Key References & Bibliography
${formData.references}
`;

    const res = await exportProposalToDrive(formData.researchTitle, markdownContent);
    if (res) {
      setDriveExportStatus('Exported successfully to "UNSP Research Fellowship" on Google Drive!');
    } else {
      setDriveExportStatus('Google Drive export encountered an error.');
    }
    setTimeout(() => setDriveExportStatus(null), 5000);
  };

  const workflowSteps = [
    { num: '01', name: 'Topic Selection', desc: 'Identify research scope and emerging discipline gap.' },
    { num: '02', name: 'Proposal', desc: 'Formalize problem statement, questions, and hypotheses.' },
    { num: '03', name: 'Literature Review', desc: 'Comprehensive matrix of peer-reviewed scholarship.' },
    { num: '04', name: 'Methodology', desc: 'Define empirical or doctrinal research methods.' },
    { num: '05', name: 'Research Development', desc: 'Execute primary data collection and analysis.' },
    { num: '06', name: 'Progress Review', desc: 'Structured milestone advisory consultation.' },
    { num: '07', name: 'Draft', desc: 'Draft full research monograph chapters.' },
    { num: '08', name: 'Final Submission', desc: 'Submit completed 8,000–12,000 word monograph.' },
    { num: '09', name: 'Evaluation', desc: 'Academic review committee assessment.' },
    { num: '10', name: 'Completion', desc: 'Award and digital certificate verification.' }
  ];

  return (
    <div className="space-y-10 pb-20">
      <DisclaimerBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-[#e6e2d8] pb-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>UNSP University</span>
            <span>·</span>
            <span>International Research Centre</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#121927]">
            Research Centre Workspace
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            The central scholarly infrastructure for UNSP International Research Fellows. Navigate literature synthesis, research design, methodology frameworks, and formal monograph drafting.
          </p>
        </div>

        {/* 10-Step Visual Research Workflow */}
        <div className="bg-white border border-[#e6e2d8] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="eyebrow text-[10px] uppercase tracking-wider text-[#8c6a1e] font-semibold block">
              Scholarly Method
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#121927]">
              End-to-End Research Workflow
            </h2>
            <p className="text-xs text-slate-500">
              The standardized 10-phase academic continuum required across all 13 fellowship tracks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {workflowSteps.map((ws, i) => (
              <div
                key={ws.num}
                className="border border-[#e6e2d8] rounded-lg p-3 space-y-1 bg-[#faf8f5] hover:bg-white hover:border-[#b38a2c]/60 transition-colors"
              >
                <span className="text-[10px] font-mono font-bold text-[#b38a2c] block">
                  {ws.num}
                </span>
                <p className="font-serif text-sm font-semibold text-[#121927] leading-snug">
                  {ws.name}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {ws.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace Hub with 12 Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Module Selector Sidebar */}
          <div className="lg:col-span-3 bg-white border border-stone-200 rounded-xl p-3 space-y-1">
            <p className="px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Research Modules
            </p>

            {[
              { id: 'dashboard', label: 'Research Dashboard', icon: Layers },
              { id: 'drive', label: 'Google Drive Repository', icon: HardDrive },
              { id: 'proposal', label: 'Research Proposal', icon: FileText },
              { id: 'literature', label: 'Literature Review', icon: BookOpen },
              { id: 'gap', label: 'Research Gap Analysis', icon: Search },
              { id: 'methodology', label: 'Research Methodology', icon: Compass },
              { id: 'design', label: 'Research Design', icon: Layers },
              { id: 'data_collection', label: 'Data Collection', icon: Database },
              { id: 'data_analysis', label: 'Data Analysis', icon: BarChart2 },
              { id: 'academic_writing', label: 'Academic Writing & IMRAD', icon: PenTool },
              { id: 'submission', label: 'Research Submission', icon: Upload },
              { id: 'evaluation', label: 'Evaluation & Peer Review', icon: CheckCircle },
              { id: 'completion', label: 'Research Completion & Verification', icon: Award }
            ].map((mod) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`w-full text-left px-3 py-2.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    activeModule === mod.id
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{mod.label}</span>
                  </span>
                  <ChevronRight className="w-3 h-3 opacity-50" />
                </button>
              );
            })}
          </div>

          {/* Module Content Pane */}
          <div className="lg:col-span-9 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 min-h-[600px]">
            
            {/* 1. Research Dashboard */}
            {activeModule === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Research Centre Dashboard
                  </h2>
                  <p className="text-xs text-slate-500">
                    Scholarly progress overview and active research instruments.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border border-stone-200 rounded-lg p-5 space-y-2 bg-stone-50/50">
                    <span className="font-semibold text-slate-900 block text-sm">
                      Interactive Proposal Generator
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Build, save, and submit your research proposal according to the 10-point academic rubric.
                    </p>
                    <button
                      onClick={() => setActiveModule('proposal')}
                      className="text-slate-950 font-semibold hover:underline block pt-2"
                    >
                      Open Proposal Form →
                    </button>
                  </div>

                  <div className="border border-stone-200 rounded-lg p-5 space-y-2 bg-stone-50/50">
                    <span className="font-semibold text-slate-900 block text-sm">
                      Academic Integrity & AI Use
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Review standards for ethical literature citation, empirical data verification, and responsible AI disclosures.
                    </p>
                    <button
                      onClick={() => navigate('/ai-use-policy')}
                      className="text-slate-950 font-semibold hover:underline block pt-2"
                    >
                      View AI Policy →
                    </button>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-lg p-5 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Fellowship Research Protocols
                  </h3>
                  <div className="space-y-2 text-xs text-slate-700">
                    <p>• <strong>Monograph Word Count:</strong> 8,000 to 12,000 words exclusive of references and appendices.</p>
                    <p>• <strong>Citation Standard:</strong> APA 7th Edition or Oxford/Bluebook for legal studies.</p>
                    <p>• <strong>Milestone Timing:</strong> Submit milestone updates every 4–6 weeks for advisory review.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Research Proposal Builder */}
            {activeModule === 'proposal' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-950">
                      Research Proposal Submission Interface
                    </h2>
                    <p className="text-xs text-slate-500">
                      Current Status: <strong className="text-slate-900 uppercase font-mono">{userProposal?.status || 'Draft'}</strong>
                    </p>
                  </div>

                  {saveStatus && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      {saveStatus}
                    </span>
                  )}
                </div>

                <form className="space-y-5 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-800">
                      1. Proposed Research Title *
                    </label>
                    <input
                      type="text"
                      value={formData.researchTitle}
                      onChange={(e) => setFormData({ ...formData, researchTitle: e.target.value })}
                      className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 font-serif text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800">
                        2. Background & Context *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.background}
                        onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                        className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800">
                        3. Problem Statement *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.problemStatement}
                        onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                        className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800">
                        4. Research Questions *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.researchQuestions}
                        onChange={(e) => setFormData({ ...formData, researchQuestions: e.target.value })}
                        className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800">
                        5. Research Objectives *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.researchObjectives}
                        onChange={(e) => setFormData({ ...formData, researchObjectives: e.target.value })}
                        className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800">
                        6. Literature Summary *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.literatureSummary}
                        onChange={(e) => setFormData({ ...formData, literatureSummary: e.target.value })}
                        className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800">
                        7. Research Gap *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.researchGap}
                        onChange={(e) => setFormData({ ...formData, researchGap: e.target.value })}
                        className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800">
                        8. Research Methodology *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.methodology}
                        onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                        className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800">
                        9. Expected Research Outcomes *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.expectedOutcomes}
                        onChange={(e) => setFormData({ ...formData, expectedOutcomes: e.target.value })}
                        className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-800">
                      10. Key References & Bibliography
                    </label>
                    <textarea
                      rows={3}
                      value={formData.references}
                      onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                      className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-800 font-mono text-[11px] focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  {driveExportStatus && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{driveExportStatus}</span>
                    </div>
                  )}

                  <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="px-5 py-2.5 text-xs font-semibold text-slate-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Proposal Draft</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportToGoogleDrive}
                      className="px-5 py-2.5 text-xs font-semibold text-[#121927] bg-[#faf8f5] hover:bg-white border border-[#e6e2d8] hover:border-[#121927] rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <HardDrive className="w-3.5 h-3.5 text-[#8c6a1e]" />
                      <span>Export to Google Drive</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitProposal}
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Academic Committee Review</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Google Drive Repository Module */}
            {activeModule === 'drive' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#121927]">
                    Google Drive Research Repository
                  </h2>
                  <p className="text-xs text-slate-500">
                    Browse, synchronize, and upload fellowship research materials, survey results, and monograph drafts.
                  </p>
                </div>

                <GoogleDriveExplorer defaultTitle="Fellowship Google Drive Files" />
              </div>
            )}

            {/* Other Academic Modules */}
            {activeModule === 'literature' && (
              <div className="space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-bold text-slate-950">Literature Review Methodology</h2>
                <p className="text-slate-600 leading-relaxed">
                  Systematic synthesis protocols ensure your research rests upon peer-reviewed scholarship. Fellows are required to maintain a literature matrix classifying primary doctrinal sources, empirical trials, and meta-analytic reviews.
                </p>
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
                  <p className="font-semibold text-slate-900">Recommended Synthesis Frameworks:</p>
                  <p>• PRISMA flow diagram for systematic evidence mapping</p>
                  <p>• Doctrinal treaty synthesis for international law candidates</p>
                  <p>• Thematic clustering for qualitative interdisciplinary studies</p>
                </div>
              </div>
            )}

            {activeModule === 'gap' && (
              <div className="space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-bold text-slate-950">Research Gap Analysis</h2>
                <p className="text-slate-600 leading-relaxed">
                  Every UNSP International Research Fellowship monograph must isolate a genuine deficit in current literature: theoretical inadequacy, empirical absence, contradictory findings, or lack of geographic contextualization.
                </p>
              </div>
            )}

            {activeModule === 'methodology' && (
              <div className="space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-bold text-slate-950">Research Methodology & Epistemology</h2>
                <p className="text-slate-600 leading-relaxed">
                  Choose between quantitative empirical experimentation, qualitative case comparison, doctrinal legal critique, or mixed-methods systems modeling. Ensure sample bounds and error thresholds are disclosed.
                </p>
              </div>
            )}

            {activeModule === 'design' && (
              <div className="space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-bold text-slate-950">Research Design Protocols</h2>
                <p className="text-slate-600 leading-relaxed">
                  Translating research questions into operational variables, hypotheses, and analytical testbenches.
                </p>
              </div>
            )}

            {activeModule === 'data_collection' && (
              <div className="space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-bold text-slate-950">Data Collection Standards</h2>
                <p className="text-slate-600 leading-relaxed">
                  Guidelines for primary data collection, synthetic benchmark curation, and secondary open-access dataset extraction with appropriate licensing and consent protocols.
                </p>
              </div>
            )}

            {activeModule === 'data_analysis' && (
              <div className="space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-bold text-slate-950">Data Analysis & Statistical Rigor</h2>
                <p className="text-slate-600 leading-relaxed">
                  Parametric/non-parametric tests, confidence intervals, qualitative coding reliability, and reproducible ablation experiments.
                </p>
              </div>
            )}

            {activeModule === 'academic_writing' && (
              <div className="space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-bold text-slate-950">Academic Writing & Monograph Conventions</h2>
                <p className="text-slate-600 leading-relaxed">
                  Structuring your 8,000–12,000 word monograph according to the standard academic structure: Abstract, Introduction, Literature Review, Methodology, Findings, Discussion, and Policy Recommendations.
                </p>
              </div>
            )}

            {activeModule === 'submission' && (
              <div className="space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-bold text-slate-950">Research Submission</h2>
                <p className="text-slate-600 leading-relaxed">
                  Submit your monograph deliverables directly via the fellow research submission portal.
                </p>
                <button
                  onClick={() => navigate('/student/research')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
                >
                  Go to Student Research Submission Portal →
                </button>
              </div>
            )}

            {activeModule === 'evaluation' && (
              <div className="space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-bold text-slate-950">Evaluation & Peer Review</h2>
                <p className="text-slate-600 leading-relaxed">
                  Independent committee evaluation rubric: Methodological Rigor (35%), Contribution & Originality (30%), Structure & Citation (20%), and Advisory Responsiveness (15%). Minimum passing aggregate: 70%.
                </p>
              </div>
            )}

            {activeModule === 'completion' && (
              <div className="space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-bold text-slate-950">Completion & Certificate Verification</h2>
                <p className="text-slate-600 leading-relaxed">
                  Upon satisfactory evaluation, fellows are issued a digitally signed Fellowship Certificate verifiable worldwide at <code className="bg-stone-100 px-1 py-0.5 rounded text-slate-800">https://fellowship.unspuniversity.com/verify/[ID]</code>.
                </p>
                <button
                  onClick={() => navigate('/verify')}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-stone-100 border border-stone-300 rounded hover:bg-stone-200"
                >
                  Inspect Verification Portal →
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
