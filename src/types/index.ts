export type UserRole = 'applicant' | 'fellow' | 'mentor' | 'evaluator' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  highestQualification: string;
  professionalBackground: string;
  researchInterests: string;
  role: UserRole;
  createdAt: string;
}

export interface FellowshipProgram {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  researchAreas: string[];
  learningOutcomes: string[];
  eligibility: string[];
  duration: string;
  researchMethodology: string[];
  programmeStructure: {
    phase: string;
    duration: string;
    focus: string;
  }[];
  coreModules: string[];
  specialisedResearchModule: string;
  researchProject: {
    description: string;
    deliverables: string[];
    wordCountTarget: string;
  };
  mentorship: string;
  evaluation: {
    criteria: string[];
    passingGrade: string;
  };
  certificateDetails: string;
  fee: string; // "₹1,50,000"
  faq: { question: string; answer: string }[];
  disclaimer: string;
}

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Additional Information Required'
  | 'Approved'
  | 'Rejected'
  | 'Payment Pending'
  | 'Paid'
  | 'Enrolled'
  | 'Active'
  | 'Completed'
  | 'Withdrawn';

export interface Application {
  id: string;
  userId: string;
  fellowshipId: string;
  fellowshipTitle: string;
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  // Academic Info
  highestQualification: string;
  institution: string;
  fieldOfStudy: string;
  professionalBackground: string;
  researchExperience: string;
  // Research Info
  proposedResearchArea: string;
  proposedResearchTitle: string;
  researchInterests: string;
  statementOfPurpose: string;
  expectedResearchOutcomes: string;
  // Documents
  cvFileName?: string;
  cvFileSize?: string;
  supportingDocName?: string;
  // Status and metadata
  status: ApplicationStatus;
  submittedAt?: string;
  updatedAt: string;
  adminNotes?: string;
}

export type ProposalStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Revision Required' | 'Approved';

export interface ResearchProposal {
  id: string;
  applicationId: string;
  userId: string;
  researchTitle: string;
  background: string;
  problemStatement: string;
  researchQuestions: string;
  researchObjectives: string;
  literatureSummary: string;
  researchGap: string;
  methodology: string;
  expectedOutcomes: string;
  references: string;
  status: ProposalStatus;
  feedback?: string;
  lastUpdated: string;
}

export type ResearchProjectStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Revision Required'
  | 'Accepted'
  | 'Completed';

export interface ResearchProject {
  id: string;
  userId: string;
  applicationId: string;
  fellowshipTitle: string;
  title: string;
  abstract: string;
  status: ResearchProjectStatus;
  submissionDate?: string;
  milestones: {
    title: string;
    completed: boolean;
    dueDate: string;
  }[];
  mentorName: string;
  mentorFeedback?: string;
  evaluationScore?: string;
  documents: {
    name: string;
    uploadedAt: string;
    size: string;
  }[];
}

export type CertificateStatus = 'VALID' | 'NOT FOUND' | 'REVOKED';

export interface FellowshipCertificate {
  id: string;
  certificateId: string;
  fellowName: string;
  fellowshipProgramme: string;
  researchTitle: string;
  issueDate: string;
  completionDate: string;
  programmeType: string;
  verificationUrl: string;
  status: CertificateStatus;
  disclaimer: string;
}

export interface PaymentDetails {
  id: string;
  applicationId: string;
  userId: string;
  amount: string; // "₹1,50,000"
  status: 'PENDING' | 'PAID' | 'VERIFICATION_REQUIRED';
  invoiceNumber: string;
  date: string;
  paymentMethod?: 'UPI' | 'Indian Cards' | 'Net Banking' | 'International Cards' | 'Approved Gateway';
  referenceNumber?: string;
}

export interface MentorRecord {
  id: string;
  name: string;
  area: string;
  demoMarker: boolean;
  milestones: string[];
  feedback: string;
  meetingRecords: {
    date: string;
    topic: string;
    status: 'Scheduled' | 'Completed';
  }[];
  nextMilestone: string;
}

// ==========================================
// STAGE 3: PAYMENTS, EMI, FINANCING, ORDERS
// ==========================================

export type Stage3PaymentStatus =
  | 'Payment Pending'
  | 'Payment Processing'
  | 'Payment Successful'
  | 'Payment Failed'
  | 'Payment Cancelled'
  | 'Payment Refunded'
  | 'Payment Partially Refunded'
  | 'Payment Verification Required';

export type OrderStatus =
  | 'Created'
  | 'Pending'
  | 'Processing'
  | 'Paid'
  | 'Failed'
  | 'Cancelled'
  | 'Refund Requested'
  | 'Refunded'
  | 'Partially Refunded';

export type PaymentMethodCategory =
  | 'upi'
  | 'indian_credit_card'
  | 'indian_debit_card'
  | 'international_credit_card'
  | 'international_debit_card'
  | 'net_banking'
  | 'wallets'
  | 'emi'
  | 'financing';

export interface EmiPlan {
  id: string;
  months: number;
  providerName: string;
  interestRateAnnual: number;
  monthlyInstallment: number;
  totalPayable: number;
  processingFee: number;
  isNoCost: boolean;
  eligibilityConditions: string;
}

export interface Order {
  id: string;
  orderId: string; // e.g. ORD-UNSP-2026-8819
  userId: string;
  applicationId: string;
  fellowshipId: string;
  fellowshipName: string;
  amount: number; // 150000
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  paymentMethod: PaymentMethodCategory;
  provider: 'sandbox' | 'razorpay' | 'stripe' | 'cashfree';
  providerOrderId?: string;
  paymentId?: string;
  paymentStatus: Stage3PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  invoiceId?: string;
  refundStatus?: RefundStatus;
  emiPlan?: EmiPlan;
  isTestMode: boolean;
  idempotencyKey: string;
}

export type FinancingStatus =
  | 'Not Started'
  | 'Application Started'
  | 'Documents Required'
  | 'Submitted to Provider'
  | 'Under Provider Review'
  | 'Approved by Provider'
  | 'Declined by Provider'
  | 'Disbursed'
  | 'Cancelled';

export interface FinancingProvider {
  id: string;
  providerName: string;
  providerType: 'Non-Banking Financial Company (NBFC)' | 'Education Loan Partner' | 'FinTech Credit Line';
  website: string;
  applicationUrl: string;
  countriesSupported: string[];
  currency: string;
  minAmount: number;
  maxAmount: number;
  eligibilityInfo: string;
  documentationRequirements: string[];
  active: boolean;
  displayOrder: number;
}

export interface FinancingApplication {
  id: string;
  userId: string;
  applicationId: string;
  providerId: string;
  providerName: string;
  amount: number;
  tenureMonths: number;
  status: FinancingStatus;
  submittedAt: string;
  updatedAt: string;
  monthlyEstimatedRepayment?: number;
  providerReference?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. UNSP-INV-2026-8812
  orderId: string;
  userId: string;
  studentName: string;
  email: string;
  country: string;
  fellowship: string;
  amount: number; // 150000
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  taxApplicable: boolean;
  taxAmount: number;
  taxNote: string;
  total: number;
  paymentDate: string;
  paymentMethod: string;
  paymentStatus: Stage3PaymentStatus;
}

export type RefundStatus =
  | 'Requested'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Processing'
  | 'Refunded';

export interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  studentName: string;
  email: string;
  reason: string;
  amount: number;
  currency: string;
  supportingInformation: string;
  requestedDate: string;
  status: RefundStatus;
  adminNotes?: string;
  processedAt?: string;
}

export type EnrollmentStatus =
  | 'Not Eligible'
  | 'Payment Pending'
  | 'Payment Verified'
  | 'Enrollment Pending'
  | 'Enrollment Processing'
  | 'Enrolled'
  | 'Enrollment Failed'
  | 'Suspended'
  | 'Completed';

export interface EnrollmentRecord {
  id: string;
  userId: string;
  applicationId: string;
  fellowshipId: string;
  fellowshipName: string;
  masteriyoCourseId: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
  lastSyncedAt: string;
  progressPercentage: number;
  failureReason?: string;
}

export interface MasteriyoCourseMapping {
  fellowshipId: string;
  fellowshipSlug: string;
  fellowshipTitle: string;
  masteriyoCourseId: string;
  masteriyoCourseSlug: string;
}

export interface PaymentProviderConfig {
  activeProvider: 'sandbox' | 'razorpay' | 'stripe' | 'cashfree';
  testMode: boolean;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  supportedMethods: Record<PaymentMethodCategory, boolean>;
  emiEnabled: boolean;
  financingEnabled: boolean;
  maskedKeyId: string; // e.g. "••••••••••••••••34a1"
  maskedWebhookSecret: string; // e.g. "••••••••••••••••99f2"
  autoEnrollOnPayment: boolean;
  invoicePrefix: string;
  taxNotice: string;
}

export interface PaymentAuditLog {
  id: string;
  timestamp: string;
  eventType:
    | 'ORDER_CREATED'
    | 'PAYMENT_ATTEMPT'
    | 'WEBHOOK_RECEIVED'
    | 'WEBHOOK_VERIFIED'
    | 'PAYMENT_VERIFIED'
    | 'ENROLLMENT_DISPATCHED'
    | 'ENROLLMENT_CONFIRMED'
    | 'ENROLLMENT_FAILED'
    | 'REFUND_REQUESTED'
    | 'REFUND_PROCESSED'
    | 'SETTINGS_UPDATED';
  orderId?: string;
  userId?: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

