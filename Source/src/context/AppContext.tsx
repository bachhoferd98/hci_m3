import React, { createContext, useContext, useState } from 'react';
import { CloudAccount, CloudFile, DeletedFile } from '../types';
import { MOCK_CLOUD_ACCOUNTS, MOCK_DELETED_FILES } from '../data/mockData';

interface AppContextValue {
  accounts: CloudAccount[];
  toggleAccount: (id: string) => void;
  deletedFiles: DeletedFile[];
  deleteFile: (file: CloudFile) => void;
  restoreFile: (fileId: string) => void;
  emptyBin: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<CloudAccount[]>(MOCK_CLOUD_ACCOUNTS);
  const [deletedFiles, setDeletedFiles] = useState<DeletedFile[]>(MOCK_DELETED_FILES);

  const toggleAccount = (id: string) => {
    setAccounts(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, connected: !a.connected, usedBytes: !a.connected ? 2_500_000_000 : 0 }
          : a,
      ),
    );
  };

  const deleteFile = (file: CloudFile) => {
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 30);
    const entry: DeletedFile = {
      file,
      deletedAt: now.toISOString().split('T')[0],
      expiresAt: expires.toISOString().split('T')[0],
    };
    setDeletedFiles(prev => [entry, ...prev]);
  };

  const restoreFile = (fileId: string) => {
    setDeletedFiles(prev => prev.filter(f => f.file.id !== fileId));
  };

  const emptyBin = () => setDeletedFiles([]);

  return (
    <AppContext.Provider value={{ accounts, toggleAccount, deletedFiles, deleteFile, restoreFile, emptyBin }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
