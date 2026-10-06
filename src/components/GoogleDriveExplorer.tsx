/**
 * UNSP University International Research Fellowship
 * Google Drive Workspace Explorer & Synchronizer Component
 * Adheres strictly to workspace-integration SKILL.md
 */

import React, { useState, useRef } from 'react';
import { useGoogleDrive } from '../context/GoogleDriveContext';
import { DriveFileItem } from '../services/googleDriveService';
import {
  Folder,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  File,
  Upload,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Trash2,
  AlertTriangle,
  CheckCircle,
  HardDrive,
  LogOut,
  FolderPlus,
  Sparkles,
  Download
} from 'lucide-react';

interface GoogleDriveExplorerProps {
  onSelectFile?: (file: DriveFileItem) => void;
  defaultTitle?: string;
  className?: string;
}

export const GoogleDriveExplorer: React.FC<GoogleDriveExplorerProps> = ({
  onSelectFile,
  defaultTitle = 'Google Drive Research Repository',
  className = ''
}) => {
  const {
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
    deleteFileConfirmed,
    setSearchQuery
  } = useGoogleDrive();

  // Modals & User Confirmation State
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSuccess = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const folder = await createNewFolder(newFolderName.trim());
    if (folder) {
      showSuccess(`Folder "${folder.name}" created successfully on Google Drive.`);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadFile(file);
    if (uploaded) {
      showSuccess(`File "${uploaded.name}" uploaded to Google Drive.`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Mandatory confirmation dialog execution for destructive operations
  const confirmDelete = async () => {
    if (!fileToDelete) return;
    const success = await deleteFileConfirmed(fileToDelete.id);
    if (success) {
      showSuccess(`"${fileToDelete.name}" was permanently removed from Google Drive.`);
    }
    setFileToDelete(null);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-5 h-5 text-amber-600 fill-amber-100" />;
    if (mimeType.includes('document') || mimeType.includes('text') || mimeType.includes('markdown'))
      return <FileText className="w-5 h-5 text-blue-600" />;
    if (mimeType.includes('sheet') || mimeType.includes('csv'))
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (mimeType.includes('json') || mimeType.includes('code'))
      return <FileCode className="w-5 h-5 text-purple-600" />;
    if (mimeType.includes('zip') || mimeType.includes('tar'))
      return <FileArchive className="w-5 h-5 text-amber-800" />;
    return <File className="w-5 h-5 text-slate-500" />;
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '--';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '--';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`bg-white border border-[#e6e2d8] rounded-xl overflow-hidden shadow-xs ${className}`}>
      
      {/* Explorer Header */}
      <div className="bg-[#faf8f5] p-5 border-b border-[#e6e2d8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#121927] text-[#e5c36d] flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#121927]">
              {defaultTitle}
            </h3>
            <p className="text-xs text-slate-500">
              Sync monographs, research datasets & literature files directly to your Google Drive
            </p>
          </div>
        </div>

        {/* Connection status & sign-in / sign-out button */}
        <div>
          {isConnected && googleUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#e6e2d8] text-xs">
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || 'Google User'}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#121927] text-white flex items-center justify-center text-[10px] font-bold">
                    {googleUser.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <span className="font-semibold text-[#121927] block truncate max-w-[140px]">
                    {googleUser.displayName || googleUser.email}
                  </span>
                </div>
              </div>

              <button
                onClick={disconnectGoogleDrive}
                className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Disconnect Google Drive"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Official Sign in with Google Button per SKILL.md */
            <button
              onClick={connectGoogleDrive}
              disabled={isAuthenticating}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-slate-800 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isAuthenticating ? 'Connecting...' : 'Sign in with Google to Connect Drive'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-5 py-2.5 text-xs text-red-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          {!isConnected && (
            <button
              onClick={connectGoogleDrive}
              className="underline font-semibold hover:text-red-950 cursor-pointer"
            >
              Sign In Again
            </button>
          )}
        </div>
      )}

      {/* Connected Explorer Controls */}
      {isConnected ? (
        <div className="p-5 space-y-4">
          
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-600 overflow-x-auto py-1">
              {folderPath.map((item, idx) => (
                <React.Fragment key={item.id || 'root'}>
                  {idx > 0 && <span className="text-slate-400">/</span>}
                  <button
                    onClick={() => navigateToFolder(item.id, item.name)}
                    className={`hover:text-[#121927] hover:underline cursor-pointer whitespace-nowrap ${
                      idx === folderPath.length - 1 ? 'font-bold text-[#121927]' : ''
                    }`}
                  >
                    {item.name}
                  </button>
                </React.Fragment>
              ))}
            </nav>

            {/* Buttons: Upload & New Folder */}
            <div className="flex items-center gap-2 shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="px-3 py-1.5 bg-[#121927] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to Drive</span>
              </button>

              <button
                onClick={() => setShowNewFolderModal(true)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-white border border-[#e6e2d8] hover:border-[#121927] text-[#121927] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <FolderPlus className="w-3.5 h-3.5 text-[#8c6a1e]" />
                <span>New Folder</span>
              </button>

              <button
                onClick={refreshFiles}
                disabled={isLoading}
                className="p-1.5 text-slate-600 hover:text-[#121927] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh Google Drive"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research monographs, spreadsheets and documents in Google Drive..."
              className="w-full pl-9 pr-4 py-2 bg-[#faf8f5] border border-[#e6e2d8] rounded-lg text-xs text-[#121927] focus:outline-none focus:border-[#b38a2c] focus:bg-white transition-colors"
            />
          </div>

          {/* Files List Table */}
          <div className="border border-[#e6e2d8] rounded-lg overflow-hidden">
            {isLoading && files.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#b38a2c]" />
                <p>Loading files from Google Drive...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-3">
                <Folder className="w-8 h-8 mx-auto text-slate-300" />
                <p>No files or folders found in this directory.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-[#faf8f5] border border-[#e6e2d8] hover:border-[#121927] rounded text-xs text-[#121927] font-semibold cursor-pointer"
                >
                  Upload your first research file
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf8f5] border-b border-[#e6e2d8] text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Name</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Last Modified</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f0e8]">
                    {files.map((file) => {
                      const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                      return (
                        <tr
                          key={file.id}
                          className="hover:bg-[#faf8f5]/80 transition-colors group"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {getFileIcon(file.mimeType)}
                              {isFolder ? (
                                <button
                                  onClick={() => navigateToFolder(file.id, file.name)}
                                  className="font-medium text-[#121927] hover:text-[#8c6a1e] hover:underline cursor-pointer text-left font-serif text-sm"
                                >
                                  {file.name}
                                </button>
                              ) : (
                                <span className="font-medium text-[#121927] truncate max-w-xs sm:max-w-md">
                                  {file.name}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                            {isFolder ? '--' : formatFileSize(file.size)}
                          </td>
                          <td className="py-3 px-3 text-slate-500 text-[11px]">
                            {new Date(file.modifiedTime).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                              {file.webViewLink && (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-slate-500 hover:text-[#121927] hover:bg-white rounded transition-colors"
                                  title="Open in Google Drive"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {onSelectFile && !isFolder && (
                                <button
                                  onClick={() => onSelectFile(file)}
                                  className="px-2 py-1 bg-stone-100 hover:bg-[#121927] hover:text-white rounded text-[11px] font-semibold text-[#121927] transition-colors cursor-pointer"
                                >
                                  Select
                                </button>
                              )}
                              {/* Delete button opens explicit confirmation modal */}
                              <button
                                onClick={() => setFileToDelete(file)}
                                className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Delete from Google Drive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Disconnected State / Informational Callout */
        <div className="p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#faf8f5] border border-[#e6e2d8] flex items-center justify-center mx-auto text-[#b38a2c]">
            <HardDrive className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h4 className="font-serif text-xl font-bold text-[#121927]">
              Connect Your Google Drive
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              With your permission, this integration allows you to sync and organize research drafts, literature review spreadsheets, and capstone monographs directly within your institutional Google Drive.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={connectGoogleDrive}
              disabled={isAuthenticating}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#121927] hover:bg-[#1e293b] text-white rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isAuthenticating ? 'Connecting to Google Drive...' : 'Authorize Google Drive Access'}</span>
            </button>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e6e2d8] p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="font-serif text-lg font-bold text-[#121927]">
              Create New Folder on Drive
            </h4>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g., Literature_Reviews_2026"
                  className="w-full px-3 py-2 border border-[#e6e2d8] rounded-lg text-xs focus:outline-none focus:border-[#b38a2c]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 border border-stone-200 text-xs font-semibold rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#121927] text-white text-xs font-semibold rounded-lg hover:bg-[#1e293b] cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY Confirmation Dialog for Destructive Operations per SKILL.md */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-red-200 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-slate-900">
                  Delete File from Google Drive?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-900 font-semibold">{fileToDelete.name}</strong> from your Google Drive? This action will permanently remove the file from your Drive storage.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 border border-stone-200 text-xs font-semibold rounded-lg hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
