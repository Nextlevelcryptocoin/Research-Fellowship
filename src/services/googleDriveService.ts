/**
 * UNSP University International Research Fellowship
 * Google Drive API & Workspace Integration Layer
 * Compliant with workspace-integration SKILL.md specification
 */

import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, ensureFirebaseAuthPersistence } from './firebase';
export { auth } from './firebase';

/**
 * Configured OAuth Scopes matching applet permissions
 */
export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts'
];

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink?: string;
  webContentLink?: string;
  parents?: string[];
  iconLink?: string;
  thumbnailLink?: string;
}

// In-memory token storage (MANDATORY per SKILL.md: Never in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

const provider = new GoogleAuthProvider();
GOOGLE_DRIVE_SCOPES.forEach((scope) => {
  provider.addScope(scope);
});
provider.setCustomParameters({
  prompt: 'consent'
});

/**
 * Initialize Google Auth listener
 */
export const initGoogleAuth = (
  onSuccess?: (user: FirebaseUser, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onSuccess) onSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not yet acquired in this session
        if (onFailure) onFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onFailure) onFailure();
    }
  });
};

/**
 * Sign in with Google with popup and retrieve in-memory access token
 */
export const signInWithGoogleDrive = async (): Promise<{
  user: FirebaseUser;
  accessToken: string;
}> => {
  try {
    await ensureFirebaseAuthPersistence();
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google Workspace OAuth did not return an access token.');
    }
    cachedAccessToken = credential.accessToken;
    return {
      user: result.user,
      accessToken: cachedAccessToken
    };
  } catch (error: any) {
    console.error('Google Drive Authentication error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current in-memory access token
 */
export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Sign out and clear in-memory token
 */
export const signOutGoogleDrive = async (): Promise<void> => {
  try {
    await signOut(auth);
  } finally {
    cachedAccessToken = null;
  }
};

/**
 * Drive API Helper: Ensure token exists
 */
const requireToken = (): string => {
  if (!cachedAccessToken) {
    throw new Error('Please sign in to Google Drive with permission to access your research files.');
  }
  return cachedAccessToken;
};

/**
 * List files and folders from Google Drive
 */
export const listDriveFiles = async (options?: {
  folderId?: string;
  searchQuery?: string;
  pageSize?: number;
  pageToken?: string;
}): Promise<{ files: DriveFileItem[]; nextPageToken?: string }> => {
  const token = requireToken();
  const pageSize = options?.pageSize || 30;

  let queryParts: string[] = ['trashed = false'];

  if (options?.folderId) {
    queryParts.push(`'${options.folderId}' in parents`);
  }

  if (options?.searchQuery?.trim()) {
    const term = options.searchQuery.trim().replace(/'/g, "\\'");
    queryParts.push(`name contains '${term}'`);
  }

  const q = encodeURIComponent(queryParts.join(' and '));
  const fields = encodeURIComponent(
    'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, parents, iconLink, thumbnailLink)'
  );

  let url = `https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=${pageSize}&fields=${fields}&orderBy=folder,modifiedTime desc`;
  if (options?.pageToken) {
    url += `&pageToken=${encodeURIComponent(options.pageToken)}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Google Drive API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken
  };
};

/**
 * Create a new folder on Google Drive
 */
export const createDriveFolder = async (
  folderName: string,
  parentFolderId?: string
): Promise<DriveFileItem> => {
  const token = requireToken();
  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,modifiedTime,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create folder on Google Drive');
  }

  return response.json();
};

/**
 * Upload text/document/markdown content to Google Drive (Multipart Upload)
 */
export const uploadDocumentToDrive = async (params: {
  fileName: string;
  content: string;
  mimeType?: string;
  parentFolderId?: string;
  description?: string;
}): Promise<DriveFileItem> => {
  const token = requireToken();
  const mimeType = params.mimeType || 'text/markdown';

  const metadata: any = {
    name: params.fileName,
    mimeType,
    description: params.description || 'UNSP University International Research Fellowship Monograph'
  };

  if (params.parentFolderId) {
    metadata.parents = [params.parentFolderId];
  }

  const boundary = '-------UNSPFellowshipDriveBoundary' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    params.content +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload document to Google Drive');
  }

  return response.json();
};

/**
 * Upload a binary File object (PDF, DOCX, ZIP, etc.) to Google Drive
 */
export const uploadBinaryFileToDrive = async (
  file: File,
  parentFolderId?: string
): Promise<DriveFileItem> => {
  const token = requireToken();

  const metadata: any = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    description: 'UNSP Research Fellowship Submission'
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  // 1. Initiate Resumable Upload
  const initResponse = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': file.type || 'application/octet-stream',
        'X-Upload-Content-Length': file.size.toString()
      },
      body: JSON.stringify(metadata)
    }
  );

  if (!initResponse.ok) {
    const errorData = await initResponse.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to initialize Google Drive upload session');
  }

  const uploadUrl = initResponse.headers.get('Location');
  if (!uploadUrl) {
    throw new Error('Google Drive upload endpoint did not provide a resumable location URI');
  }

  // 2. Upload Binary Stream
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'application/octet-stream'
    },
    body: file
  });

  if (!uploadResponse.ok) {
    const errorData = await uploadResponse.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to stream file payload to Google Drive');
  }

  return uploadResponse.json();
};

/**
 * Delete a file or folder from Google Drive
 * (Note: Destructive action caller MUST request user confirmation first!)
 */
export const deleteDriveFile = async (fileId: string): Promise<void> => {
  const token = requireToken();
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete file from Google Drive');
  }
};

/**
 * Get or create dedicated fellowship folder
 */
export const getOrCreateFellowshipFolder = async (folderTitle = 'UNSP Research Fellowship'): Promise<DriveFileItem> => {
  const { files } = await listDriveFiles({
    searchQuery: folderTitle
  });

  const existing = files.find(
    (f) => f.name.toLowerCase() === folderTitle.toLowerCase() && f.mimeType === 'application/vnd.google-apps.folder'
  );

  if (existing) {
    return existing;
  }

  return createDriveFolder(folderTitle);
};
