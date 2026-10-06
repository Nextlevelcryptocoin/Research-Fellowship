import { FellowshipCertificate } from '../types';

export const INITIAL_CERTIFICATES: FellowshipCertificate[] = [
  {
    id: 'cert-1',
    certificateId: 'UNSP-IRF-2026-8841',
    fellowName: 'Dr. Elena Rostova',
    fellowshipProgramme: 'Artificial Intelligence & Data Science',
    researchTitle: 'Algorithmic Fairness and Mitigation of Socio-Demographic Bias in Large Language Model Alignment',
    issueDate: 'October 15, 2026',
    completionDate: 'October 10, 2026',
    programmeType: 'Privately administered international research fellowship programme',
    verificationUrl: 'https://fellowship.unspuniversity.com/verify/UNSP-IRF-2026-8841',
    status: 'VALID',
    disclaimer:
      'UNSP International Research Fellowship is a privately administered research fellowship programme open to eligible applicants worldwide. It is not, by itself, a university degree, government qualification or government-accredited academic award. Applicants should independently verify recognition requirements applicable in their country, institution or profession.'
  },
  {
    id: 'cert-2',
    certificateId: 'UNSP-IRF-2026-9022',
    fellowName: 'Marcus Adebayo',
    fellowshipProgramme: 'Climate Change & Environmental Science',
    researchTitle: 'Quantifying Sub-Saharan Urban Heat Island Vulnerability: Geospatial Remote Sensing and Localized Adaptation Strategies',
    issueDate: 'September 28, 2026',
    completionDate: 'September 20, 2026',
    programmeType: 'Privately administered international research fellowship programme',
    verificationUrl: 'https://fellowship.unspuniversity.com/verify/UNSP-IRF-2026-9022',
    status: 'VALID',
    disclaimer:
      'UNSP International Research Fellowship is a privately administered research fellowship programme open to eligible applicants worldwide. It is not, by itself, a university degree, government qualification or government-accredited academic award. Applicants should independently verify recognition requirements applicable in their country, institution or profession.'
  },
  {
    id: 'cert-3',
    certificateId: 'UNSP-IRF-2026-7731',
    fellowName: 'Aarav Mehta',
    fellowshipProgramme: 'Quantum Computing & Technologies',
    researchTitle: 'Noise Mitigation in Variational Quantum Eigensolvers for Molecular Ground State Estimations on NISQ Processors',
    issueDate: 'August 14, 2026',
    completionDate: 'August 10, 2026',
    programmeType: 'Privately administered international research fellowship programme',
    verificationUrl: 'https://fellowship.unspuniversity.com/verify/UNSP-IRF-2026-7731',
    status: 'VALID',
    disclaimer:
      'UNSP International Research Fellowship is a privately administered research fellowship programme open to eligible applicants worldwide. It is not, by itself, a university degree, government qualification or government-accredited academic award. Applicants should independently verify recognition requirements applicable in their country, institution or profession.'
  },
  {
    id: 'cert-4',
    certificateId: 'UNSP-IRF-2025-0019',
    fellowName: 'Jonathan Vance (Revoked Record)',
    fellowshipProgramme: 'Cybersecurity & Digital Governance',
    researchTitle: 'Evaluation of Zero-Trust Network Enclaves in Legacy Industrial SCADA Infrastructure',
    issueDate: 'March 10, 2025',
    completionDate: 'March 01, 2025',
    programmeType: 'Privately administered international research fellowship programme',
    verificationUrl: 'https://fellowship.unspuniversity.com/verify/UNSP-IRF-2025-0019',
    status: 'REVOKED',
    disclaimer:
      'UNSP International Research Fellowship is a privately administered research fellowship programme open to eligible applicants worldwide. It is not, by itself, a university degree, government qualification or government-accredited academic award.'
  }
];

export function lookupCertificate(certId: string): FellowshipCertificate | null {
  const normalized = certId.trim().toUpperCase();
  const match = INITIAL_CERTIFICATES.find(
    (c) => c.certificateId.toUpperCase() === normalized
  );
  return match || null;
}
