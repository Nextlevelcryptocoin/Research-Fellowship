import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Application,
  ApplicationStatus,
  ResearchProposal,
  ResearchProject,
  PaymentDetails,
  FellowshipCertificate,
  MentorRecord,
  Order,
  OrderStatus,
  Stage3PaymentStatus,
  Invoice,
  EnrollmentRecord,
  EnrollmentStatus,
  FinancingApplication,
  FinancingStatus,
  RefundRequest,
  RefundStatus,
  PaymentProviderConfig,
  PaymentAuditLog,
  MasteriyoCourseMapping
} from '../types';
import { INITIAL_CERTIFICATES } from '../data/certificates';
import { FELLOWSHIPS } from '../data/fellowships';
import {
  paymentProviderService,
  DEFAULT_PAYMENT_CONFIG,
  CreateOrderParams,
  PaymentVerificationResult,
  STANDARD_PROGRAMME_FEE_INR
} from '../services/paymentProvider';
import { masteriyoService } from '../services/masteriyoIntegration';
import { MASTERIYO_COURSE_MAPPINGS, getMasteriyoCourseForFellowship } from '../data/masteriyoMappings';
import { subscribeApplicantAuth } from '../services/applicantAuth';
import { requestPaymentApi } from '../services/stripeCheckout';

interface FellowshipContextType {
  applications: Application[];
  userApplication: Application | null;
  saveApplicationDraft: (appData: Partial<Application>) => void;
  submitApplication: (appData: Partial<Application>) => void;
  cacheServerApplication: (application: Application) => void;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, notes?: string) => void;

  // Proposals & Research Projects
  proposals: ResearchProposal[];
  userProposal: ResearchProposal | null;
  saveProposal: (proposalData: Partial<ResearchProposal>) => void;
  submitProposal: (proposalData: Partial<ResearchProposal>) => void;
  updateProposalStatus: (id: string, status: ResearchProposal['status'], feedback?: string) => void;

  researchProjects: ResearchProject[];
  userResearchProject: ResearchProject | null;
  saveResearchProject: (project: Partial<ResearchProject>) => void;
  submitResearchProject: (project: Partial<ResearchProject>) => void;

  // Certificates
  certificates: FellowshipCertificate[];
  userCertificate: FellowshipCertificate | null;
  issueCertificate: (cert: Omit<FellowshipCertificate, 'id'>) => void;
  revokeCertificate: (certificateId: string) => void;

  // Mentorship
  mentorRecord: MentorRecord;
  updateMentorMilestone: (index: number, completed: boolean) => void;

  // Notifications
  notifications: { id: string; title: string; message: string; date: string; read: boolean }[];
  markNotificationAsRead: (id: string) => void;

  // ==========================================
  // STAGE 3: ORDERS, PAYMENTS, INVOICES, LMS
  // ==========================================
  orders: Order[];
  userOrder: Order | null;
  createOrder: (params: CreateOrderParams) => Promise<Order>;
  executePayment: (params: {
    orderId: string;
    simulationOutcome?: 'success' | 'failed' | 'cancelled';
    forceEnrollmentFail?: boolean;
  }) => Promise<PaymentVerificationResult>;

  invoices: Invoice[];
  userInvoice: Invoice | null;
  getInvoiceById: (invoiceId: string) => Invoice | undefined;

  enrollments: EnrollmentRecord[];
  userEnrollment: EnrollmentRecord | null;
  retryEnrollmentSync: (enrollmentId: string) => Promise<boolean>;

  financingApplications: FinancingApplication[];
  userFinancingApplication: FinancingApplication | null;
  submitFinancingApplication: (params: {
    providerId: string;
    providerName: string;
    amount: number;
    tenureMonths: number;
    notes?: string;
  }) => Promise<FinancingApplication>;
  updateFinancingStatus: (id: string, status: FinancingStatus, notes?: string) => void;

  refundRequests: RefundRequest[];
  submitRefundRequest: (params: {
    orderId: string;
    reason: string;
    supportingInformation?: string;
  }) => Promise<RefundRequest>;
  processRefund: (id: string, outcome: 'Approved' | 'Rejected', adminNotes?: string) => Promise<void>;

  paymentConfig: PaymentProviderConfig;
  updatePaymentConfig: (config: Partial<PaymentProviderConfig>) => void;

  courseMappings: MasteriyoCourseMapping[];
  updateCourseMapping: (fellowshipId: string, masteriyoCourseId: string) => void;

  auditLogs: PaymentAuditLog[];
  simulateWebhookEvent: (orderId: string, event: 'payment.captured' | 'payment.failed') => Promise<boolean>;
}

const STORAGE_KEY_APPS = 'unsp_applications';
const STORAGE_KEY_PROPOSALS = 'unsp_proposals';
const STORAGE_KEY_PROJECTS = 'unsp_research_projects';
const STORAGE_KEY_CERTS = 'unsp_certificates';
const STORAGE_KEY_ORDERS = 'unsp_orders_v3';
const STORAGE_KEY_INVOICES = 'unsp_invoices_v3';
const STORAGE_KEY_ENROLLMENTS = 'unsp_enrollments_v3';
const STORAGE_KEY_FINANCING = 'unsp_financing_v3';
const STORAGE_KEY_REFUNDS = 'unsp_refunds_v3';
const STORAGE_KEY_PAY_CONFIG = 'unsp_pay_config_v3';
const STORAGE_KEY_MAPPINGS = 'unsp_mappings_v3';
const STORAGE_KEY_AUDIT = 'unsp_audit_logs_v3';

const INITIAL_APPS: Application[] = [
  {
    id: 'app-1001',
    userId: 'usr-applicant-1',
    fellowshipId: 'fel-2',
    fellowshipTitle: 'Artificial Intelligence & Data Science',
    firstName: 'Wei',
    lastName: 'Chen',
    email: 'applicant.chen@unspuniversity.com',
    country: 'Singapore',
    phone: '+65 9123 4567',
    highestQualification: 'Master of Science in Information Systems',
    institution: 'National University of Singapore',
    fieldOfStudy: 'Computer Science & AI',
    professionalBackground: 'Data Systems Architect & Applied Research Fellow',
    researchExperience: '4 years of published quantitative research in statistical learning',
    proposedResearchArea: 'Algorithmic Fairness and Societal Alignment in Large Foundation Models',
    proposedResearchTitle: 'Auditing Demographic Disparities in Multimodal Reasoning Models',
    researchInterests: 'Algorithmic Fairness, Ethical Machine Learning & Data Governance',
    statementOfPurpose:
      'My research objective is to develop reproducible auditing frameworks that detect hidden bias amplification in foundation models deployed across civic and financial institutions.',
    expectedResearchOutcomes:
      'A benchmark evaluation dataset, mathematical fairness proofs, and a peer-reviewed research monograph for international dissemination.',
    cvFileName: 'Wei_Chen_Academic_CV_2026.pdf',
    cvFileSize: '1.4 MB',
    supportingDocName: 'Research_Writing_Sample_Published.pdf',
    status: 'Approved', // Eligible for payment
    submittedAt: '2026-09-14',
    updatedAt: '2026-09-18',
    adminNotes: 'Application approved by admissions board. Programme fee payment pending.'
  },
  {
    id: 'app-1002',
    userId: 'usr-fellow-1',
    fellowshipId: 'fel-1',
    fellowshipTitle: 'Human Rights & International Law',
    firstName: 'Dr. Elena',
    lastName: 'Rostova',
    email: 'fellow.elena@unspuniversity.com',
    country: 'Austria',
    phone: '+43 664 123456',
    highestQualification: 'Ph.D. in Computational Linguistics',
    institution: 'University of Vienna',
    fieldOfStudy: 'International Law & Human Rights',
    professionalBackground: 'Postdoctoral Research Associate',
    researchExperience: '6 years of international research on transnational treaty compliance',
    proposedResearchArea: 'Algorithmic Surveillance and International Privacy Rights Treaties',
    proposedResearchTitle: 'Cross-Border Jurisdiction in Algorithmic Surveillance and Human Rights Standards',
    researchInterests: 'Digital Privacy, ICC Jurisprudence & State Responsibility',
    statementOfPurpose:
      'To examine whether contemporary international human rights conventions sufficiently regulate extraterritorial algorithmic tracking by multinational defense contractors.',
    expectedResearchOutcomes: 'Comprehensive international legal monograph with treaty reform proposals.',
    cvFileName: 'Elena_Rostova_CV.pdf',
    cvFileSize: '2.1 MB',
    status: 'Enrolled',
    submittedAt: '2026-05-10',
    updatedAt: '2026-06-01',
    adminNotes: 'Approved, paid, and enrolled in active research cohort.'
  }
];

const INITIAL_PROPOSALS: ResearchProposal[] = [
  {
    id: 'prop-2001',
    applicationId: 'app-1001',
    userId: 'usr-applicant-1',
    researchTitle: 'Auditing Demographic Disparities in Multimodal Reasoning Models',
    background:
      'Modern foundation models demonstrate emergent reasoning but frequently inherit demographic skew from unstructured web-scraped corpuses.',
    problemStatement:
      'Current alignment benchmarks evaluate general perplexity or safety without isolating intersectional demographic disparities across non-Western linguistic contexts.',
    researchQuestions:
      '1. How do multimodal prompting variations alter demographic representation accuracy? 2. Can counterfactual latent regularization enforce statistical parity without degrading reasoning benchmarks?',
    researchObjectives:
      'To formalize an empirical auditing framework, evaluate 3 open-weights foundation models, and formulate mitigation techniques.',
    literatureSummary:
      'Reviews contemporary literature on mechanistic interpretability, algorithmic accountability, and international AI governance directives.',
    researchGap:
      'Lack of granular intersectional auditing in non-English high-stakes decision contexts.',
    methodology:
      'Quantitative empirical experimentation with controlled prompt templates, statistical variance estimation, and human-in-the-loop validation.',
    expectedOutcomes:
      'An open-source audit taxonomy, a reproducible ablation testbench, and a 10,000-word academic monograph.',
    references:
      '1. Bender et al., 2021; 2. Dwork et al., 2012; 3. European Union AI Act, 2024; 4. UN Human Rights High Commissioner Guidelines on AI, 2023.',
    status: 'Approved',
    feedback: 'Clear problem framing, rigorous methodology, approved for execution.',
    lastUpdated: '2026-09-22'
  }
];

const INITIAL_PROJECTS: ResearchProject[] = [
  {
    id: 'proj-3001',
    userId: 'usr-applicant-1',
    applicationId: 'app-1001',
    fellowshipTitle: 'Artificial Intelligence & Data Science',
    title: 'Auditing Demographic Disparities in Multimodal Reasoning Models',
    abstract:
      'This research investigates latent bias propagation through multimodal alignment stages, introducing counterfactual benchmark measures to ensure algorithmic fairness.',
    status: 'Under Review',
    submissionDate: '2026-10-02',
    mentorName: 'Prof. David Kaufman (DEMO)',
    mentorFeedback: 'Methodology chapter is sound. Ensure sample size calculations are explicit in section 3.2.',
    evaluationScore: '86/100 (Pass with Commendation)',
    milestones: [
      { title: 'Formal Proposal Defense', completed: true, dueDate: 'Week 4' },
      { title: 'Literature Review & Ethical Clearance', completed: true, dueDate: 'Week 8' },
      { title: 'Empirical Benchmark Setup & Data Audit', completed: true, dueDate: 'Week 14' },
      { title: 'Draft Monograph Submission', completed: true, dueDate: 'Week 18' },
      { title: 'Final Monograph & Code Archive', completed: false, dueDate: 'Week 24' }
    ],
    documents: [
      { name: 'Research_Proposal_Approved.pdf', uploadedAt: '2026-09-22', size: '820 KB' },
      { name: 'Midterm_Progress_Report_WeiChen.pdf', uploadedAt: '2026-10-01', size: '2.4 MB' }
    ]
  }
];

// Initial Stage 3 Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderId: 'ORD-UNSP-2026-8812',
    userId: 'usr-applicant-1',
    applicationId: 'app-1001',
    fellowshipId: 'fel-2',
    fellowshipName: 'Artificial Intelligence & Data Science',
    amount: STANDARD_PROGRAMME_FEE_INR,
    currency: 'INR',
    paymentMethod: 'upi',
    provider: 'sandbox',
    providerOrderId: 'prov_sandbox_8812',
    paymentStatus: 'Payment Pending',
    orderStatus: 'Created',
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
    invoiceId: 'UNSP-INV-2026-8812',
    isTestMode: true,
    idempotencyKey: 'idem-app-1001-init'
  },
  {
    id: 'ord-2',
    orderId: 'ORD-UNSP-2026-5501',
    userId: 'usr-fellow-1',
    applicationId: 'app-1002',
    fellowshipId: 'fel-1',
    fellowshipName: 'Human Rights & International Law',
    amount: STANDARD_PROGRAMME_FEE_INR,
    currency: 'INR',
    paymentMethod: 'indian_credit_card',
    provider: 'sandbox',
    providerOrderId: 'prov_sandbox_5501',
    paymentId: 'pay_sandbox_5501_succ',
    paymentStatus: 'Payment Successful',
    orderStatus: 'Paid',
    createdAt: '2026-05-15T14:30:00Z',
    updatedAt: '2026-05-15T14:35:00Z',
    invoiceId: 'UNSP-INV-2026-5501',
    isTestMode: true,
    idempotencyKey: 'idem-app-1002-init'
  }
];

// Initial Invoices
const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'UNSP-INV-2026-8812',
    orderId: 'ORD-UNSP-2026-8812',
    userId: 'usr-applicant-1',
    studentName: 'Wei Chen',
    email: 'applicant.chen@unspuniversity.com',
    country: 'Singapore',
    fellowship: 'Artificial Intelligence & Data Science',
    amount: 150000,
    currency: 'INR',
    taxApplicable: false,
    taxAmount: 0,
    taxNote: 'Tax details, where applicable, are determined according to applicable rules and final invoice configuration.',
    total: 150000,
    paymentDate: 'Pending Verification',
    paymentMethod: 'UPI',
    paymentStatus: 'Payment Pending'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'UNSP-INV-2026-5501',
    orderId: 'ORD-UNSP-2026-5501',
    userId: 'usr-fellow-1',
    studentName: 'Dr. Elena Rostova',
    email: 'fellow.elena@unspuniversity.com',
    country: 'Austria',
    fellowship: 'Human Rights & International Law',
    amount: 150000,
    currency: 'INR',
    taxApplicable: false,
    taxAmount: 0,
    taxNote: 'Tax details, where applicable, are determined according to applicable rules and final invoice configuration.',
    total: 150000,
    paymentDate: 'May 15, 2026',
    paymentMethod: 'Indian Credit Card',
    paymentStatus: 'Payment Successful'
  }
];

// Initial Enrollments
const INITIAL_ENROLLMENTS: EnrollmentRecord[] = [
  {
    id: 'enr-1',
    userId: 'usr-applicant-1',
    applicationId: 'app-1001',
    fellowshipId: 'fel-2',
    fellowshipName: 'Artificial Intelligence & Data Science',
    masteriyoCourseId: 'mst-course-102',
    enrollmentDate: 'Not yet enrolled',
    status: 'Payment Pending',
    lastSyncedAt: '2026-09-18',
    progressPercentage: 0
  },
  {
    id: 'enr-2',
    userId: 'usr-fellow-1',
    applicationId: 'app-1002',
    fellowshipId: 'fel-1',
    fellowshipName: 'Human Rights & International Law',
    masteriyoCourseId: 'mst-course-101',
    enrollmentDate: 'May 15, 2026',
    status: 'Enrolled',
    lastSyncedAt: '2026-10-06',
    progressPercentage: 42
  }
];

const DEMO_MENTOR_RECORD: MentorRecord = {
  id: 'mentor-rec-1',
  name: 'Prof. David Kaufman, Ph.D. (DEMO ADVISOR)',
  area: 'International Jurisprudence & Ethical AI Governance',
  demoMarker: true,
  milestones: [
    'Milestone 1: Topic Definition & Literature Matrix Validation',
    'Milestone 2: Empirical Method & Ethics Clearance Review',
    'Milestone 3: Working Draft & Statistical Review',
    'Milestone 4: Final Monograph & Evaluation Review'
  ],
  feedback:
    'Research shows high scholarly fidelity. The alignment equations are correctly derived. Proceed to chapter 4 empirical discussions.',
  meetingRecords: [
    { date: '2026-09-25', topic: 'Proposal Refinement & Literature Scope', status: 'Completed' },
    { date: '2026-10-02', topic: 'Methodological Audit & Milestone 2 Review', status: 'Completed' },
    { date: '2026-10-18', topic: 'Draft Monograph Critique & Advisory Dialogue', status: 'Scheduled' }
  ],
  nextMilestone: 'Draft Monograph Submission (Target: Week 18)'
};

const FellowshipContext = createContext<FellowshipContextType | undefined>(undefined);

export const FellowshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_APPS;
  });

  const [proposals, setProposals] = useState<ResearchProposal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROPOSALS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PROPOSALS;
  });

  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PROJECTS;
  });

  const [certificates, setCertificates] = useState<FellowshipCertificate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CERTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CERTIFICATES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ORDERS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVOICES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_INVOICES;
  });

  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENROLLMENTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ENROLLMENTS;
  });

  const [financingApplications, setFinancingApplications] = useState<FinancingApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FINANCING);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REFUNDS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentProviderConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PAYMENT_CONFIG;
  });

  const [courseMappings, setCourseMappings] = useState<MasteriyoCourseMapping[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MAPPINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return MASTERIYO_COURSE_MAPPINGS;
  });

  const [auditLogs, setAuditLogs] = useState<PaymentAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'aud-1',
        timestamp: '2026-09-18T10:00:00Z',
        eventType: 'ORDER_CREATED',
        orderId: 'ORD-UNSP-2026-8812',
        userId: 'usr-applicant-1',
        details: 'Order ORD-UNSP-2026-8812 created for ₹1,50,000 via UPI.',
        status: 'SUCCESS'
      }
    ];
  });

  const [mentorRecord, setMentorRecord] = useState<MentorRecord>(DEMO_MENTOR_RECORD);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Application Approved: Proceed to Payment',
      message: 'Your fellowship application is approved! Settle the programme fee (₹1,50,000) to activate enrollment.',
      date: '2026-09-18',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Invoice UNSP-INV-2026-8812 Ready',
      message: 'Official fellowship invoice of ₹1,50,000 generated.',
      date: '2026-09-18',
      read: false
    }
  ]);

  // Persist State
  useEffect(() => { localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PROPOSALS, JSON.stringify(proposals)); }, [proposals]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(researchProjects)); }, [researchProjects]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CERTS, JSON.stringify(certificates)); }, [certificates]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_ENROLLMENTS, JSON.stringify(enrollments)); }, [enrollments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_FINANCING, JSON.stringify(financingApplications)); }, [financingApplications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_REFUNDS, JSON.stringify(refundRequests)); }, [refundRequests]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PAY_CONFIG, JSON.stringify(paymentConfig)); }, [paymentConfig]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_MAPPINGS, JSON.stringify(courseMappings)); }, [courseMappings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs)); }, [auditLogs]);

  useEffect(() => {
    let active = true;
    let authRequest = 0;
    const unsubscribe = subscribeApplicantAuth((firebaseUser) => {
      const requestId = ++authRequest;
      setApplications((current) =>
        current.filter((application) => application.status === 'Draft')
      );
      if (!firebaseUser) return;

      void requestPaymentApi<{ applications: Application[] }>('/api/applications').then(
        ({ applications: serverApplications }) => {
          if (!active || requestId !== authRequest) return;
          setApplications((current) => {
            const localDrafts = current.filter(
              (application) =>
                application.status === 'Draft' &&
                !serverApplications.some(
                  (serverApplication) =>
                    serverApplication.fellowshipId === application.fellowshipId
                )
            );
            return [...serverApplications, ...localDrafts];
          });
        },
        (error: unknown) => {
          if (!active || requestId !== authRequest) return;
          console.error(
            'Unable to load applications from the authenticated application service.',
            error
          );
          setApplications((current) => current.filter((application) => application.status === 'Draft'));
        }
      );
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Active user's records
  const userApplication = applications[0] || null;
  const userProposal = proposals.find((p) => p.applicationId === userApplication?.id) || null;
  const userResearchProject = researchProjects.find((p) => p.applicationId === userApplication?.id) || null;
  const userCertificate = certificates[0] || null;
  const userOrder = orders.find((o) => o.applicationId === userApplication?.id) || orders[0] || null;
  const userInvoice = invoices.find((i) => i.orderId === userOrder?.orderId) || invoices[0] || null;
  const userEnrollment = enrollments.find((e) => e.applicationId === userApplication?.id) || enrollments[0] || null;
  const userFinancingApplication = financingApplications.find((f) => f.applicationId === userApplication?.id) || null;

  const logAudit = (
    eventType: PaymentAuditLog['eventType'],
    details: string,
    orderId?: string,
    status: PaymentAuditLog['status'] = 'SUCCESS'
  ) => {
    const entry: PaymentAuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      eventType,
      orderId,
      userId: userApplication?.userId,
      details,
      status
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const saveApplicationDraft = (appData: Partial<Application>) => {
    setApplications((prev) => {
      const idx = prev.findIndex((a) => a.id === appData.id || a.userId === appData.userId);
      const updatedItem: Application = {
        id: appData.id || `app-${Date.now()}`,
        userId: appData.userId || 'usr-applicant-1',
        fellowshipId: appData.fellowshipId || FELLOWSHIPS[1].id,
        fellowshipTitle: appData.fellowshipTitle || FELLOWSHIPS[1].title,
        firstName: appData.firstName || '',
        lastName: appData.lastName || '',
        email: appData.email || '',
        country: appData.country || '',
        phone: appData.phone || '',
        highestQualification: appData.highestQualification || '',
        institution: appData.institution || '',
        fieldOfStudy: appData.fieldOfStudy || '',
        professionalBackground: appData.professionalBackground || '',
        researchExperience: appData.researchExperience || '',
        proposedResearchArea: appData.proposedResearchArea || '',
        proposedResearchTitle: appData.proposedResearchTitle || '',
        researchInterests: appData.researchInterests || '',
        statementOfPurpose: appData.statementOfPurpose || '',
        expectedResearchOutcomes: appData.expectedResearchOutcomes || '',
        cvFileName: appData.cvFileName || 'Uploaded_CV.pdf',
        cvFileSize: appData.cvFileSize || '1.2 MB',
        supportingDocName: appData.supportingDocName,
        status: 'Draft',
        updatedAt: new Date().toISOString().split('T')[0]
      };

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...updatedItem, status: 'Draft' };
        return copy;
      }
      return [updatedItem, ...prev];
    });
  };

  const submitApplication = (appData: Partial<Application>) => {
    setApplications((prev) => {
      const idx = prev.findIndex((a) => a.id === appData.id || a.userId === appData.userId);
      const updatedItem: Application = {
        id: appData.id || `app-${Date.now()}`,
        userId: appData.userId || 'usr-applicant-1',
        fellowshipId: appData.fellowshipId || FELLOWSHIPS[1].id,
        fellowshipTitle: appData.fellowshipTitle || FELLOWSHIPS[1].title,
        firstName: appData.firstName || '',
        lastName: appData.lastName || '',
        email: appData.email || '',
        country: appData.country || '',
        phone: appData.phone || '',
        highestQualification: appData.highestQualification || '',
        institution: appData.institution || '',
        fieldOfStudy: appData.fieldOfStudy || '',
        professionalBackground: appData.professionalBackground || '',
        researchExperience: appData.researchExperience || '',
        proposedResearchArea: appData.proposedResearchArea || '',
        proposedResearchTitle: appData.proposedResearchTitle || '',
        researchInterests: appData.researchInterests || '',
        statementOfPurpose: appData.statementOfPurpose || '',
        expectedResearchOutcomes: appData.expectedResearchOutcomes || '',
        cvFileName: appData.cvFileName || 'Applicant_Curriculum_Vitae.pdf',
        cvFileSize: appData.cvFileSize || '1.5 MB',
        supportingDocName: appData.supportingDocName,
        status: 'Submitted',
        submittedAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedItem;
        return copy;
      }
      return [updatedItem, ...prev];
    });

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Application Submitted',
        message: 'Your fellowship application has been submitted for academic committee review.',
        date: new Date().toISOString().split('T')[0],
        read: false
      },
      ...prev
    ]);
  };

  const cacheServerApplication = (application: Application) => {
    setApplications((current) => [
      application,
      ...current.filter(
        (existing) =>
          existing.id !== application.id &&
          !(existing.status === 'Draft' && existing.fellowshipId === application.fellowshipId)
      )
    ]);
  };

  const updateApplicationStatus = (
    appId: string,
    status: ApplicationStatus,
    notes?: string
  ) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status, adminNotes: notes || a.adminNotes, updatedAt: new Date().toISOString().split('T')[0] } : a))
    );
  };

  const saveProposal = (proposalData: Partial<ResearchProposal>) => {
    setProposals((prev) => {
      const idx = prev.findIndex((p) => p.id === proposalData.id);
      const item: ResearchProposal = {
        id: proposalData.id || `prop-${Date.now()}`,
        applicationId: proposalData.applicationId || 'app-1001',
        userId: proposalData.userId || 'usr-applicant-1',
        researchTitle: proposalData.researchTitle || 'Untitled Proposal',
        background: proposalData.background || '',
        problemStatement: proposalData.problemStatement || '',
        researchQuestions: proposalData.researchQuestions || '',
        researchObjectives: proposalData.researchObjectives || '',
        literatureSummary: proposalData.literatureSummary || '',
        researchGap: proposalData.researchGap || '',
        methodology: proposalData.methodology || '',
        expectedOutcomes: proposalData.expectedOutcomes || '',
        references: proposalData.references || '',
        status: 'Draft',
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...item, status: 'Draft' };
        return copy;
      }
      return [item, ...prev];
    });
  };

  const submitProposal = (proposalData: Partial<ResearchProposal>) => {
    setProposals((prev) => {
      const idx = prev.findIndex((p) => p.id === proposalData.id);
      const item: ResearchProposal = {
        id: proposalData.id || `prop-${Date.now()}`,
        applicationId: proposalData.applicationId || 'app-1001',
        userId: proposalData.userId || 'usr-applicant-1',
        researchTitle: proposalData.researchTitle || 'Untitled Proposal',
        background: proposalData.background || '',
        problemStatement: proposalData.problemStatement || '',
        researchQuestions: proposalData.researchQuestions || '',
        researchObjectives: proposalData.researchObjectives || '',
        literatureSummary: proposalData.literatureSummary || '',
        researchGap: proposalData.researchGap || '',
        methodology: proposalData.methodology || '',
        expectedOutcomes: proposalData.expectedOutcomes || '',
        references: proposalData.references || '',
        status: 'Submitted',
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
  };

  const updateProposalStatus = (
    id: string,
    status: ResearchProposal['status'],
    feedback?: string
  ) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, feedback: feedback || p.feedback, lastUpdated: new Date().toISOString().split('T')[0] } : p))
    );
  };

  const saveResearchProject = (project: Partial<ResearchProject>) => {
    setResearchProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...project, status: 'Draft' };
        return copy;
      }
      return [{ ...INITIAL_PROJECTS[0], ...project, id: `proj-${Date.now()}`, status: 'Draft' }, ...prev];
    });
  };

  const submitResearchProject = (project: Partial<ResearchProject>) => {
    setResearchProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          ...project,
          status: 'Submitted',
          submissionDate: new Date().toISOString().split('T')[0]
        };
        return copy;
      }
      return [
        {
          ...INITIAL_PROJECTS[0],
          ...project,
          id: `proj-${Date.now()}`,
          status: 'Submitted',
          submissionDate: new Date().toISOString().split('T')[0]
        },
        ...prev
      ];
    });
  };

  const issueCertificate = (cert: Omit<FellowshipCertificate, 'id'>) => {
    const newCert: FellowshipCertificate = {
      ...cert,
      id: `cert-${Date.now()}`
    };
    setCertificates((prev) => [newCert, ...prev]);
  };

  const revokeCertificate = (certificateId: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.certificateId.toUpperCase() === certificateId.toUpperCase()
          ? { ...c, status: 'REVOKED' }
          : c
      )
    );
  };

  const updateMentorMilestone = (index: number, completed: boolean) => {
    setResearchProjects((prev) => {
      return prev.map((proj) => {
        if (proj.applicationId === userApplication?.id && proj.milestones[index]) {
          const milestones = [...proj.milestones];
          milestones[index].completed = completed;
          return { ...proj, milestones };
        }
        return proj;
      });
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // ==========================================
  // STAGE 3: ORDER CREATION & EXECUTION
  // ==========================================

  const createOrder = async (params: CreateOrderParams): Promise<Order> => {
    const order = await paymentProviderService.createPaymentOrder(params);
    setOrders((prev) => [order, ...prev]);

    // Create corresponding initial pending invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: order.invoiceId || `UNSP-INV-2026-${Date.now()}`,
      orderId: order.orderId,
      userId: order.userId,
      studentName: `${userApplication?.firstName || 'Fellow'} ${userApplication?.lastName || 'Scholar'}`,
      email: userApplication?.email || 'fellow@unspuniversity.com',
      country: userApplication?.country || 'International',
      fellowship: order.fellowshipName,
      amount: order.amount,
      currency: order.currency,
      taxApplicable: false,
      taxAmount: 0,
      taxNote: paymentConfig.taxNotice,
      total: order.amount,
      paymentDate: 'Pending Verification',
      paymentMethod: order.paymentMethod.replace(/_/g, ' ').toUpperCase(),
      paymentStatus: 'Payment Pending'
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    logAudit('ORDER_CREATED', `Order ${order.orderId} created for ${order.fellowshipName} (₹${order.amount}).`, order.orderId);
    return order;
  };

  const executePayment = async (params: {
    orderId: string;
    simulationOutcome?: 'success' | 'failed' | 'cancelled';
    forceEnrollmentFail?: boolean;
  }): Promise<PaymentVerificationResult> => {
    const targetOrder = orders.find((o) => o.orderId === params.orderId) || userOrder;
    if (!targetOrder) {
      throw new Error('Order not found');
    }

    logAudit('PAYMENT_ATTEMPT', `Payment attempt initiated for Order ${targetOrder.orderId}.`, targetOrder.orderId);

    // Call payment provider abstraction layer
    const verification = await paymentProviderService.verifyPayment(
      targetOrder,
      params.simulationOutcome || 'success'
    );

    // Update order status
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === targetOrder.orderId) {
          return {
            ...o,
            paymentStatus: verification.paymentStatus,
            orderStatus: verification.orderStatus,
            paymentId: verification.providerPaymentId,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    if (verification.verified) {
      logAudit('PAYMENT_VERIFIED', `Payment ${verification.providerPaymentId} confirmed by provider webhook.`, targetOrder.orderId);

      // 1. Update Invoice to Paid
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.orderId === targetOrder.orderId) {
            return {
              ...inv,
              paymentStatus: 'Payment Successful',
              paymentDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            };
          }
          return inv;
        })
      );

      // Submitted applications remain in the formal review queue after payment.
      const awaitingFormalReview = userApplication?.status === 'Submitted';
      if (userApplication && !awaitingFormalReview) {
        updateApplicationStatus(userApplication.id, 'Paid', 'Programme fee verified by payment gateway.');
      }

      // 3. Trigger Automatic Masteriyo LMS Enrollment
      if (paymentConfig.autoEnrollOnPayment && !awaitingFormalReview) {
        logAudit('ENROLLMENT_DISPATCHED', `Initiating Masteriyo LMS course enrollment for user ${targetOrder.userId}.`, targetOrder.orderId);

        const mapping = getMasteriyoCourseForFellowship(targetOrder.fellowshipId);
        const targetCourseId = mapping?.masteriyoCourseId || 'mst-course-101';

        // Check mock forced failure option for Requirement 22 testing
        if (params.forceEnrollmentFail) {
          setEnrollments((prev) =>
            prev.map((enr) => {
              if (enr.applicationId === targetOrder.applicationId) {
                return {
                  ...enr,
                  status: 'Enrollment Failed',
                  failureReason: 'LMS Gateway timeout during course provisioning. (Retry available in admin / student dashboard).'
                };
              }
              return enr;
            })
          );
          logAudit('ENROLLMENT_FAILED', 'Masteriyo course registration timeout. Payment remains PAID.', targetOrder.orderId, 'FAILED');
        } else {
          try {
            await masteriyoService.enrollUser(targetOrder.userId, targetCourseId);
            setEnrollments((prev) =>
              prev.map((enr) => {
                if (enr.applicationId === targetOrder.applicationId) {
                  return {
                    ...enr,
                    status: 'Enrolled',
                    enrollmentDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    lastSyncedAt: new Date().toISOString().split('T')[0],
                    failureReason: undefined
                  };
                }
                return enr;
              })
            );

            if (userApplication) {
              updateApplicationStatus(userApplication.id, 'Enrolled', 'Enrolled in UNSP Masteriyo LMS.');
            }
            logAudit('ENROLLMENT_CONFIRMED', `Fellow enrolled into Masteriyo LMS course ${targetCourseId}.`, targetOrder.orderId);
          } catch (err) {
            setEnrollments((prev) =>
              prev.map((enr) => {
                if (enr.applicationId === targetOrder.applicationId) {
                  return {
                    ...enr,
                    status: 'Enrollment Failed',
                    failureReason: 'LMS Sync Exception'
                  };
                }
                return enr;
              })
            );
          }
        }
      }

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Payment Successful (₹1,50,000)',
          message: `Your payment for ${targetOrder.fellowshipName} has been verified. Receipt generated.`,
          date: new Date().toISOString().split('T')[0],
          read: false
        },
        ...prev
      ]);
    } else {
      logAudit('PAYMENT_ATTEMPT', `Payment failed: ${verification.message}`, targetOrder.orderId, 'FAILED');
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Payment Transaction Failed',
          message: verification.message,
          date: new Date().toISOString().split('T')[0],
          read: false
        },
        ...prev
      ]);
    }

    return verification;
  };

  const retryEnrollmentSync = async (enrollmentId: string): Promise<boolean> => {
    const target = enrollments.find((e) => e.id === enrollmentId);
    if (!target) return false;

    try {
      await masteriyoService.enrollUser(target.userId, target.masteriyoCourseId);
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === enrollmentId
            ? { ...e, status: 'Enrolled', failureReason: undefined, lastSyncedAt: new Date().toISOString().split('T')[0] }
            : e
        )
      );
      logAudit('ENROLLMENT_CONFIRMED', `Manual retry succeeded for enrollment ${enrollmentId}.`, undefined, 'SUCCESS');
      return true;
    } catch {
      return false;
    }
  };

  const getInvoiceById = (invoiceId: string) => {
    return invoices.find((i) => i.invoiceNumber === invoiceId || i.id === invoiceId);
  };

  const submitFinancingApplication = async (params: {
    providerId: string;
    providerName: string;
    amount: number;
    tenureMonths: number;
    notes?: string;
  }): Promise<FinancingApplication> => {
    const app: FinancingApplication = {
      id: `fin-app-${Date.now()}`,
      userId: userApplication?.userId || 'usr-applicant-1',
      applicationId: userApplication?.id || 'app-1001',
      providerId: params.providerId,
      providerName: params.providerName,
      amount: params.amount,
      tenureMonths: params.tenureMonths,
      status: 'Submitted to Provider',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      monthlyEstimatedRepayment: Math.round(params.amount / params.tenureMonths * 1.08),
      providerReference: `FIN-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: params.notes
    };

    setFinancingApplications((prev) => [app, ...prev]);

    logAudit('SETTINGS_UPDATED', `Financing application dispatched to partner ${params.providerName} for ₹${params.amount}.`);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Financing Application Submitted',
        message: `Your financing application was routed to ${params.providerName}. Status: Under Review.`,
        date: new Date().toISOString().split('T')[0],
        read: false
      },
      ...prev
    ]);

    return app;
  };

  const updateFinancingStatus = (id: string, status: FinancingStatus, notes?: string) => {
    setFinancingApplications((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status, notes: notes || f.notes, updatedAt: new Date().toISOString() } : f))
    );
  };

  const submitRefundRequest = async (params: {
    orderId: string;
    reason: string;
    supportingInformation?: string;
  }): Promise<RefundRequest> => {
    const order = orders.find((o) => o.orderId === params.orderId) || userOrder;
    const request: RefundRequest = {
      id: `ref-req-${Date.now()}`,
      orderId: params.orderId,
      userId: userApplication?.userId || 'usr-applicant-1',
      studentName: `${userApplication?.firstName || 'Fellow'} ${userApplication?.lastName || 'Scholar'}`,
      email: userApplication?.email || 'fellow@unspuniversity.com',
      reason: params.reason,
      amount: order?.amount || 150000,
      currency: order?.currency || 'INR',
      supportingInformation: params.supportingInformation || '',
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Requested'
    };

    setRefundRequests((prev) => [request, ...prev]);

    // Update Order to Refund Requested
    setOrders((prev) =>
      prev.map((o) => (o.orderId === params.orderId ? { ...o, orderStatus: 'Refund Requested', refundStatus: 'Requested' } : o))
    );

    logAudit('REFUND_REQUESTED', `Refund requested for Order ${params.orderId}. Reason: ${params.reason}`, params.orderId, 'WARNING');

    return request;
  };

  const processRefund = async (
    id: string,
    outcome: 'Approved' | 'Rejected',
    adminNotes?: string
  ) => {
    setRefundRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: outcome === 'Approved' ? 'Refunded' : 'Rejected',
            adminNotes: adminNotes || r.adminNotes,
            processedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );

    const req = refundRequests.find((r) => r.id === id);
    if (req && outcome === 'Approved') {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === req.orderId
            ? { ...o, orderStatus: 'Refunded', paymentStatus: 'Payment Refunded', refundStatus: 'Refunded' }
            : o
        )
      );
      logAudit('REFUND_PROCESSED', `Refund of ₹${req.amount} approved and processed via payment provider.`, req.orderId);
    }
  };

  const updatePaymentConfig = (config: Partial<PaymentProviderConfig>) => {
    setPaymentConfig((prev) => {
      const updated = { ...prev, ...config };
      paymentProviderService.updateConfig(updated);
      return updated;
    });
    logAudit('SETTINGS_UPDATED', 'Payment provider configurations updated by administrator.');
  };

  const updateCourseMapping = (fellowshipId: string, masteriyoCourseId: string) => {
    setCourseMappings((prev) =>
      prev.map((m) => (m.fellowshipId === fellowshipId ? { ...m, masteriyoCourseId } : m))
    );
  };

  const simulateWebhookEvent = async (
    orderId: string,
    event: 'payment.captured' | 'payment.failed'
  ): Promise<boolean> => {
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) return false;

    const payload = paymentProviderService.generateTestWebhook(order, event);
    const validSig = paymentProviderService.verifyWebhookSignature(payload);

    if (!validSig) {
      logAudit('WEBHOOK_RECEIVED', 'Unsigned or malformed webhook discarded.', orderId, 'FAILED');
      return false;
    }

    logAudit('WEBHOOK_VERIFIED', `Valid webhook received for ${orderId}: ${event}`, orderId);

    if (event === 'payment.captured') {
      await executePayment({ orderId, simulationOutcome: 'success' });
    } else {
      await executePayment({ orderId, simulationOutcome: 'failed' });
    }
    return true;
  };

  return (
    <FellowshipContext.Provider
      value={{
        applications,
        userApplication,
        saveApplicationDraft,
        submitApplication,
        cacheServerApplication,
        updateApplicationStatus,

        proposals,
        userProposal,
        saveProposal,
        submitProposal,
        updateProposalStatus,

        researchProjects,
        userResearchProject,
        saveResearchProject,
        submitResearchProject,

        certificates,
        userCertificate,
        issueCertificate,
        revokeCertificate,

        mentorRecord,
        updateMentorMilestone,

        notifications,
        markNotificationAsRead,

        // Stage 3
        orders,
        userOrder,
        createOrder,
        executePayment,

        invoices,
        userInvoice,
        getInvoiceById,

        enrollments,
        userEnrollment,
        retryEnrollmentSync,

        financingApplications,
        userFinancingApplication,
        submitFinancingApplication,
        updateFinancingStatus,

        refundRequests,
        submitRefundRequest,
        processRefund,

        paymentConfig,
        updatePaymentConfig,

        courseMappings,
        updateCourseMapping,

        auditLogs,
        simulateWebhookEvent
      }}
    >
      {children}
    </FellowshipContext.Provider>
  );
};

export const useFellowship = () => {
  const context = useContext(FellowshipContext);
  if (!context) {
    throw new Error('useFellowship must be used within a FellowshipProvider');
  }
  return context;
};
