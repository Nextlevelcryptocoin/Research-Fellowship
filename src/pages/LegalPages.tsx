import React from 'react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { FELLOWSHIP_DISCLAIMER_TEXT } from '../data/fellowships';
import { ShieldCheck, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';

interface LegalPageProps {
  type:
    | 'terms'
    | 'privacy'
    | 'refund-policy'
    | 'research-ethics'
    | 'academic-integrity'
    | 'ai-use-policy'
    | 'fellowship-disclaimer';
  navigate: (route: string) => void;
}

export const LegalPages: React.FC<LegalPageProps> = ({ type, navigate }) => {
  const contentMap: Record<
    string,
    { title: string; subtitle: string; sections: { heading: string; body: string }[] }
  > = {
    terms: {
      title: 'Terms of Service',
      subtitle: 'Institutional regulations and portal terms governing fellowship enrollment.',
      sections: [
        {
          heading: '1. Institutional Classification',
          body: 'UNSP International Research Fellowship is a privately administered academic research programme open to eligible applicants worldwide. It is not, by itself, a university degree, government qualification or government-accredited academic award. Enrolled fellows agree that enrollment does not confer a statutory university degree or credit towards statutory licensure.'
        },
        {
          heading: '2. Fellowship Participation & Milestones',
          body: 'Fellows must maintain academic honesty, adhere to milestone submission deadlines, and engage professionally in advisory consultations. Failure to submit required deliverables may result in academic review or termination.'
        },
        {
          heading: '3. Intellectual Property of Monograph',
          body: 'Fellows retain copyright and authorship of their independent research monographs. UNSP University retains the non-exclusive license to archive, verify, and reference the abstract and monograph metadata within the institutional verification registry.'
        }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Information protection standards for applicant and fellow data.',
      sections: [
        {
          heading: '1. Information We Collect',
          body: 'We collect personal information including full name, email, phone number, country of residence, academic degrees, CVs, statements of purpose, and research submissions solely for admissions assessment and fellowship administration.'
        },
        {
          heading: '2. Use of Information',
          body: 'Candidate data is evaluated exclusively by authorized academic review committee members and assigned research advisors. We never sell, lease, or monetize fellow data to commercial third parties.'
        },
        {
          heading: '3. Verification Ledger Disclosures',
          body: 'Public verification at /verify exposes only the fellow name, fellowship programme, research monograph title, certificate ID, issue date, and validity status to prevent credential counterfeiting.'
        }
      ]
    },
    'refund-policy': {
      title: 'Fee & Refund Policy',
      subtitle: 'Financial terms and withdrawal provisions for the ₹1,50,000 programme fee.',
      sections: [
        {
          heading: '1. Transparent Programme Fee',
          body: 'The standard fellowship fee is ₹1,50,000. No fee is collected at the initial application stage. Fees are requested only upon formal academic selection by the committee.'
        },
        {
          heading: '2. Withdrawal Prior to Orientation',
          body: 'If an accepted candidate requests formal withdrawal in writing within 7 calendar days of fee settlement and prior to the commencement of Phase 1 supervisory consultations, an 80% refund is processed (with 20% retained for administrative review costs).'
        },
        {
          heading: '3. Non-Refundable Milestone Period',
          body: 'Once Phase 1 advisory orientation has begun and faculty advisory assignments are confirmed, programme fees are strictly non-refundable due to dedicated supervisory commitments.'
        }
      ]
    },
    'research-ethics': {
      title: 'Research Ethics Framework',
      subtitle: 'Standards for human subjects, empirical research, and scholarly honesty.',
      sections: [
        {
          heading: '1. Ethical Research Clearance',
          body: 'All empirical investigations involving human participants, community interviews, or sensitive secondary datasets must provide ethical declarations verifying informed consent, data anonymization, and adherence to the Declaration of Helsinki or equivalent international norms.'
        },
        {
          heading: '2. Plagiarism & Originality',
          body: 'Monographs undergo automated similarity analysis. Similarity index above 15% (excluding citations and standard legal terminology) or any instance of uncredited verbatim appropriation results in immediate disqualification and revocation of fellowship standing.'
        },
        {
          heading: '3. Data Fabrication & Falsification',
          body: 'Fabrication or intentional falsification of survey datasets, econometric models, or qualitative interview transcripts is grounds for immediate expulsion and permanent revoking of any issued credentials.'
        }
      ]
    },
    'academic-integrity': {
      title: 'Academic Integrity Policy',
      subtitle: 'Commitment to scholarship, attribution, and scholarly rigor.',
      sections: [
        {
          heading: '1. Foundational Commitment',
          body: 'UNSP University demands uncompromising fidelity to scholarly truth, rigorous attribution of ideas, and honest empirical reporting. Every fellow must sign the Academic Integrity Declaration prior to Phase 1.'
        },
        {
          heading: '2. Independent Authorship',
          body: 'The fellow must be the principal investigator and sole author of the submitted research monograph. Ghostwriting, contract research, or surrogate authorship is strictly prohibited.'
        },
        {
          heading: '3. Revocation of Certificates',
          body: 'UNSP University reserves the irrevocable right to revoke any certificate if post-issuance audits demonstrate academic fraud, copyright infringement, or credential misrepresentation.'
        }
      ]
    },
    'ai-use-policy': {
      title: 'Responsible AI Use Policy in Research',
      subtitle: 'Permissible and prohibited applications of generative AI systems.',
      sections: [
        {
          heading: '1. Disclosed AI Assistance',
          body: 'Generative AI tools (e.g. LLMs for grammar polish, coding syntax assistance, or literature search indexing) may be utilized as research instruments provided full disclosure is included in the monograph methodology section.'
        },
        {
          heading: '2. Prohibited AI Substitution',
          body: 'AI systems cannot be cited as co-authors. Whole-cloth generative text generation of literature reviews, problem statements, or analysis without critical human synthesis and verification constitutes academic misconduct.'
        },
        {
          heading: '3. Hallucination & Citation Verification',
          body: 'Fellows bear 100% personal responsibility for the factual accuracy of all citations, quotes, and mathematical proofs. Non-existent citations generated by hallucinating AI models are treated as data falsification.'
        }
      ]
    },
    'fellowship-disclaimer': {
      title: 'Fellowship Academic & Recognition Disclaimer',
      subtitle: 'Comprehensive legal notice regarding institutional scope and recognition.',
      sections: [
        {
          heading: '1. Primary Disclaimer Statement',
          body: FELLOWSHIP_DISCLAIMER_TEXT
        },
        {
          heading: '2. Independent Recognition Verification',
          body: 'Applicants and fellows should independently verify recognition requirements applicable in their country, employer, professional regulatory body, or university prior to application. UNSP University makes no warranty that private fellowship credentials satisfy statutory prerequisites for civil service or university tenure.'
        },
        {
          heading: '3. No Governmental or Diplomatic Affiliation',
          body: 'UNSP University and the UNSP International Research Fellowship are private academic entities. They do not represent, hold affiliation with, or act on behalf of the United Nations, specialized UN agencies, or any national government.'
        }
      ]
    }
  };

  const current = contentMap[type] || contentMap['fellowship-disclaimer'];

  return (
    <div className="space-y-12 pb-20">
      <DisclaimerBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="border-b border-stone-200 pb-8 space-y-3">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
            Institutional Policy & Governance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            {current.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {current.subtitle}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {current.sections.map((sec, i) => (
            <section key={i} className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-3">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-950">
                {sec.heading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {sec.body}
              </p>
            </section>
          ))}
        </div>

        {/* Quick Links to Other Policies */}
        <div className="border-t border-stone-200 pt-6 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Related Institutional Policies:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => navigate('/terms')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-slate-800"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate('/privacy')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-slate-800"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/refund-policy')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-slate-800"
            >
              Fee & Refund Policy
            </button>
            <button
              onClick={() => navigate('/research-ethics')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-slate-800"
            >
              Research Ethics
            </button>
            <button
              onClick={() => navigate('/academic-integrity')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-slate-800"
            >
              Academic Integrity
            </button>
            <button
              onClick={() => navigate('/ai-use-policy')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-slate-800"
            >
              AI Use Policy
            </button>
            <button
              onClick={() => navigate('/fellowship-disclaimer')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-slate-800"
            >
              Fellowship Disclaimer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
