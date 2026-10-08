import { ApiError } from './http';

export interface ApplicationSubmissionData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  highestQualification: string;
  institution: string;
  fieldOfStudy: string;
  professionalBackground: string;
  researchExperience: string;
  proposedResearchArea: string;
  proposedResearchTitle: string;
  researchInterests: string;
  statementOfPurpose: string;
  expectedResearchOutcomes: string;
  cvFileName: string;
  supportingDocName: string;
}

export interface ApplicationRow {
  id: string;
  applicant_uid: string;
  fellowship_id: string;
  fellowship_name: string;
  status: string;
  submission_data: ApplicationSubmissionData | null;
  created_at: Date | string;
  updated_at: Date | string;
}

const FIELD_LIMITS: Record<keyof ApplicationSubmissionData, number> = {
  firstName: 100,
  lastName: 100,
  email: 254,
  country: 100,
  phone: 40,
  highestQualification: 200,
  institution: 200,
  fieldOfStudy: 200,
  professionalBackground: 2_000,
  researchExperience: 5_000,
  proposedResearchArea: 500,
  proposedResearchTitle: 300,
  researchInterests: 2_000,
  statementOfPurpose: 10_000,
  expectedResearchOutcomes: 5_000,
  cvFileName: 255,
  supportingDocName: 255
};

const REQUIRED_FIELDS = new Set<keyof ApplicationSubmissionData>([
  'firstName',
  'lastName',
  'email',
  'country',
  'phone',
  'highestQualification',
  'institution',
  'fieldOfStudy',
  'professionalBackground',
  'proposedResearchArea',
  'proposedResearchTitle',
  'statementOfPurpose',
  'expectedResearchOutcomes'
]);

export function parseApplicationSubmission(
  body: Record<string, unknown>
): { fellowshipId: string; submissionData: ApplicationSubmissionData } {
  if (
    'applicant_uid' in body ||
    'applicantUid' in body ||
    'userId' in body ||
    'id' in body ||
    'status' in body
  ) {
    throw new ApiError(400, 'Applicant identity, application ID, and status are server-controlled.');
  }

  if (
    typeof body.fellowshipId !== 'string' ||
    body.fellowshipId.trim().length < 1 ||
    body.fellowshipId.length > 100
  ) {
    throw new ApiError(400, 'A valid fellowshipId is required.');
  }

  if (
    typeof body.submissionData !== 'object' ||
    body.submissionData === null ||
    Array.isArray(body.submissionData)
  ) {
    throw new ApiError(400, 'Application submission data is required.');
  }

  const input = body.submissionData as Record<string, unknown>;
  if (
    'applicant_uid' in input ||
    'applicantUid' in input ||
    'userId' in input ||
    'id' in input ||
    'status' in input
  ) {
    throw new ApiError(400, 'Applicant identity, application ID, and status are server-controlled.');
  }

  const submissionData = {} as ApplicationSubmissionData;
  for (const [field, maxLength] of Object.entries(FIELD_LIMITS) as [
    keyof ApplicationSubmissionData,
    number
  ][]) {
    const value = input[field];
    if (value === undefined && !REQUIRED_FIELDS.has(field)) {
      submissionData[field] = '';
      continue;
    }
    if (typeof value !== 'string') {
      throw new ApiError(400, `Application field "${field}" must be text.`);
    }

    const normalized = value.trim();
    if (REQUIRED_FIELDS.has(field) && !normalized) {
      throw new ApiError(400, `Application field "${field}" is required.`);
    }
    if (normalized.length > maxLength) {
      throw new ApiError(400, `Application field "${field}" exceeds its maximum length.`);
    }
    submissionData[field] = normalized;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submissionData.email)) {
    throw new ApiError(400, 'A valid contact email address is required.');
  }

  return {
    fellowshipId: body.fellowshipId.trim(),
    submissionData
  };
}

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function toApplicationRecord(row: ApplicationRow) {
  const createdAt = toIsoString(row.created_at);
  return {
    ...(row.submission_data ?? {}),
    id: row.id,
    userId: row.applicant_uid,
    fellowshipId: row.fellowship_id,
    fellowshipTitle: row.fellowship_name,
    status: row.status,
    submittedAt: createdAt.slice(0, 10),
    updatedAt: toIsoString(row.updated_at)
  };
}
