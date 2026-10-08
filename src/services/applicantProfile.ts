import type { User as FirebaseUser } from 'firebase/auth';

export interface ApplicantProfileData {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  country: string;
  stateProvince: string;
  dateOfBirth: string;
  gender: string;
  highestQualification: string;
  institution: string;
  currentOccupation: string;
  researchInterests: string;
  createdAt: string;
  updatedAt: string;
}

export type EditableApplicantProfile = Omit<
  ApplicantProfileData,
  'email' | 'emailVerified' | 'createdAt' | 'updatedAt'
>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isApplicantProfile(value: unknown): value is ApplicantProfileData {
  if (!isRecord(value)) return false;
  const stringFields: (keyof EditableApplicantProfile | 'email' | 'createdAt' | 'updatedAt')[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'country',
    'stateProvince',
    'dateOfBirth',
    'gender',
    'highestQualification',
    'institution',
    'currentOccupation',
    'researchInterests',
    'createdAt',
    'updatedAt'
  ];
  return (
    stringFields.every((field) => typeof value[field] === 'string') &&
    typeof value.emailVerified === 'boolean'
  );
}

async function requestProfile(
  user: FirebaseUser,
  method: 'GET' | 'PUT' | 'PATCH',
  data?: Partial<EditableApplicantProfile>
): Promise<ApplicantProfileData | null> {
  const token = await user.getIdToken();
  const response = await fetch('/api/profile', {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(data ? { 'Content-Type': 'application/json' } : {})
    },
    ...(data ? { body: JSON.stringify(data) } : {})
  });

  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      isRecord(result) && typeof result.error === 'string'
        ? result.error
        : 'Your applicant profile could not be saved.';
    throw new Error(message);
  }
  if (!isRecord(result)) {
    throw new Error('The applicant profile response was invalid.');
  }
  if (result.profile === null) return null;
  if (!isApplicantProfile(result.profile)) {
    throw new Error('The applicant profile response was invalid.');
  }
  return result.profile;
}

export function loadApplicantProfile(
  user: FirebaseUser
): Promise<ApplicantProfileData | null> {
  return requestProfile(user, 'GET');
}

export function createApplicantProfile(
  user: FirebaseUser,
  data: EditableApplicantProfile
): Promise<ApplicantProfileData | null> {
  return requestProfile(user, 'PUT', data);
}

export function patchApplicantProfile(
  user: FirebaseUser,
  data: Partial<EditableApplicantProfile>
): Promise<ApplicantProfileData | null> {
  return requestProfile(user, 'PATCH', data);
}
