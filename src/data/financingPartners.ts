import { FinancingProvider } from '../types';

export const FINANCING_DISCLAIMER_TEXT =
  'UNSP University does not guarantee approval of education financing or loans. Financing decisions, credit appraisals, interest rates, processing fees and repayment schedules are made independently by the respective financial partner according to their eligibility requirements, underwriting policies and applicable terms.';

export const FINANCING_PROVIDERS: FinancingProvider[] = [
  {
    id: 'fin-part-01',
    providerName: 'GrayQuest Education Finance',
    providerType: 'FinTech Credit Line',
    website: 'https://www.grayquest.com/',
    applicationUrl: 'https://fellowship.unspuniversity.com/financing/partner-apply?provider=grayquest',
    countriesSupported: ['India'],
    currency: 'INR',
    minAmount: 50000,
    maxAmount: 200000,
    eligibilityInfo:
      'Available to Indian nationals, salaried professionals, or postgraduate applicants with a co-borrower/guarantor. Minimum monthly household income criteria apply.',
    documentationRequirements: [
      'PAN Card & Aadhaar Card of Applicant or Co-borrower',
      'Last 3 months bank statements showing regular cash flow or salary',
      'UNSP Fellowship Admission Offer Letter',
      'Proof of current residence'
    ],
    active: true,
    displayOrder: 1
  },
  {
    id: 'fin-part-02',
    providerName: 'Propelld Education Financial Services',
    providerType: 'Non-Banking Financial Company (NBFC)',
    website: 'https://www.propelld.com/',
    applicationUrl: 'https://fellowship.unspuniversity.com/financing/partner-apply?provider=propelld',
    countriesSupported: ['India'],
    currency: 'INR',
    minAmount: 75000,
    maxAmount: 300000,
    eligibilityInfo:
      'Merit-based education credit lines for specialized certifications and postgraduate research fellowships. Subject to credit score and credit assessment.',
    documentationRequirements: [
      'Identity Proof (PAN / Passport / Voter ID)',
      'Last 6 months salary slips or ITR for self-employed candidates',
      'UNSP Research Fellowship Admission Acceptance Letter',
      'Cancelled cheque or bank verification proof'
    ],
    active: true,
    displayOrder: 2
  },
  {
    id: 'fin-part-03',
    providerName: 'Prodigy Finance International Education Support',
    providerType: 'Education Loan Partner',
    website: 'https://prodigyfinance.com/',
    applicationUrl: 'https://fellowship.unspuniversity.com/financing/partner-apply?provider=prodigy',
    countriesSupported: ['International (150+ Countries)'],
    currency: 'USD',
    minAmount: 1000,
    maxAmount: 5000,
    eligibilityInfo:
      'Border-free higher education financing for international scholars. Underwritten based on future earning potential and discipline focus.',
    documentationRequirements: [
      'Valid International Passport',
      'Academic Transcripts and Undergraduate / Master’s Degree Certificate',
      'UNSP International Fellowship Formal Admission Acceptance Letter',
      'Proof of current address'
    ],
    active: true,
    displayOrder: 3
  }
];
