/**
 * UNSP University International Research Fellowship
 * Google Drive React Context Provider
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  initGoogleAuth,
  signInWithGoogleDrive,
  signOutGoogleDrive,
  listDriveFiles,
  createDriveFolder,
  uploadDocumentToDrive,
  uploadBinaryFileToDrive,
  deleteDriveFile,
  getOrCreateFellowshipFolder,
  DriveFileItem,
  getDriveAccessToken
} from '../services/googleDriveService';

interface GoogleDriveContextType {
  isConnected: boolean;
  googleUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  files: DriveFileItem[];
  currentFolderId: string | null;
  folderPath: { id: string | null; name: string }[];
  searchQuery: string;
  error: string | null;
  connectGoogleDrive: () => Promise<boolean>;
  disconnectGoogleDrive: () => Promise<void>;
  refreshFiles: () => Promise<void>;
  navigateToFolder: (folderId: string | null, folderName: string) => Promise<void>;
  createNewFolder: (folderName: string) => Promise<DriveFileItem | null>;
  uploadFile: (file: File) => Promise<DriveFileItem | null>;
  saveDocument: (fileName: string, content: string, mimeType?: string) => Promise<DriveFileItem | null>;
  deleteFileConfirmed: (fileId: string) => Promise<boolean>;
  exportProposalToDrive: (title: string, content: string) => Promise<DriveFileItem | null>;
  setSearchQuery: (query: string) => void;
}

const GoogleDriveContext = createContext<GoogleDriveContextType | undefined>(undefined);

export const GoogleDriveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: 'My Drive' }
  ]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setIsConnected(true);
        fetchFiles(currentFolderId, searchQuery);
      },
      () => {
        setIsConnected(false);
        setGoogleUser(null);
        setFiles([]);
      }
    );

    return () => unsubscribe();
  }, []);

  const fetchFiles = async (folderId: string | null, query?: string) => {
    if (!getDriveAccessToken()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await listDriveFiles({
        folderId: folderId || undefined,
        searchQuery: query || undefined
      });
      setFiles(res.files);
    } catch (err: any) {
      console.error('Failed to fetch Drive files:', err);
      setError(err.message || 'Unable to load Google Drive files.');
    } finally {
      setIsLoading(false);
    }
  };

  const connectGoogleDrive = async (): Promise<boolean> => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const res = await signInWithGoogleDrive();
      setGoogleUser(res.user);
      setIsConnected(true);
      await fetchFiles(currentFolderId, searchQuery);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google Drive.');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const disconnectGoogleDrive = async () => {
    try {
      await signOutGoogleDrive();
      setGoogleUser(null);
      setIsConnected(false);
      setFiles([]);
      setCurrentFolderId(null);
      setFolderPath([{ id: null, name: 'My Drive' }]);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out of Google Drive.');
    }
  };

  const refreshFiles = async () => {
    await fetchFiles(currentFolderId, searchQuery);
  };

  const navigateToFolder = async (folderId: string | null, folderName: string) => {
    setCurrentFolderId(folderId);
    if (folderId === null) {
      setFolderPath([{ id: null, name: 'My Drive' }]);
    } else {
      const existingIdx = folderPath.findIndex((p) => p.id === folderId);
      if (existingIdx !== -1) {
        setFolderPath(folderPath.slice(0, existingIdx + 1));
      } else {
        setFolderPath([...folderPath, { id: folderId, name: folderName }]);
      }
    }
    await fetchFiles(folderId, searchQuery);
  };

  const createNewFolder = async (folderName: string): Promise<DriveFileItem | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const folder = await createDriveFolder(folderName, currentFolderId || undefined);
      await fetchFiles(currentFolderId, searchQuery);
      return folder;
    } catch (err: any) {
      setError(err.message || 'Failed to create folder.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<DriveFileItem | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const uploaded = await uploadBinaryFileToDrive(file, currentFolderId || undefined);
      await fetchFiles(currentFolderId, searchQuery);
      return uploaded;
    } catch (err: any) {
      setError(err.message || 'Failed to upload file to Google Drive.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveDocument = async (
    fileName: string,
    content: string,
    mimeType = 'text/markdown'
  ): Promise<DriveFileItem | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const uploaded = await uploadDocumentToDrive({
        fileName,
        content,
        mimeType,
        parentFolderId: currentFolderId || undefined
      });
      await fetchFiles(currentFolderId, searchQuery);
      return uploaded;
    } catch (err: any) {
      setError(err.message || 'Failed to save document to Google Drive.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFileConfirmed = async (fileId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteDriveFile(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete file from Google Drive.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportProposalToDrive = async (
    title: string,
    content: string
  ): Promise<DriveFileItem | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const folder = await getOrCreateFellowshipFolder('UNSP Research Fellowship');
      const fileName = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Research_Proposal.md`;
      const uploaded = await uploadDocumentToDrive({
        fileName,
        content,
        mimeType: 'text/markdown',
        parentFolderId: folder.id,
        description: 'UNSP University International Research Fellowship Formal Proposal'
      });
      await fetchFiles(currentFolderId, searchQuery);
      return uploaded;
    } catch (err: any) {
      setError(err.message || 'Failed to export proposal to Google Drive.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetSearchQuery = (q: string) => {
    setSearchQuery(q);
    fetchFiles(currentFolderId, q);
  };

  return (
    <GoogleDriveContext.Provider
      value={{
        isConnected,
        googleUser,
        isLoading,
        isAuthenticating,
        files,
        currentFolderId,
        folderPath,
        searchQuery,
        error,
        connectGoogleDrive,
        disconnectGoogleDrive,
        refreshFiles,
        navigateToFolder,
        createNewFolder,
        uploadFile,
        saveDocument,
        deleteFileConfirmed,
        exportProposalToDrive,
        setSearchQuery: handleSetSearchQuery
      }}
    >
      {children}
    </GoogleDriveContext.Provider>
  );
};

export const useGoogleDrive = () => {
  const context = useContext(GoogleDriveContext);
  if (!context) {
    throw new Error('useGoogleDrive must be used within a GoogleDriveProvider');
  }
  return context;
};
