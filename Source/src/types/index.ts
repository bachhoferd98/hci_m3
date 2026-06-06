export type CloudProvider = 'google_drive' | 'dropbox' | 'icloud' | 'onedrive';

export interface CloudAccount {
  id: string;
  provider: CloudProvider;
  email: string;
  connected: boolean;
  usedBytes: number;
  totalBytes: number;
}

export interface CloudFile {
  id: string;
  name: string;
  provider: CloudProvider;
  sizeBytes: number;
  fileType: 'image' | 'video' | 'document' | 'audio' | 'archive' | 'other';
  category: JunkCategory;
  thumbnailUrl: string | null;
  dateModified: string;
  isDuplicate: boolean;
  isSensitive: boolean;
  duplicateGroupId?: string;
}

export type JunkCategory =
  | 'duplicate'
  | 'blurry_photo'
  | 'large_unused'
  | 'old_download'
  | 'screenshot'
  | 'temp_file';

export interface ScanCategory {
  id: JunkCategory;
  label: string;
  icon: string;
  fileCount: number;
  recoverableBytes: number;
  color: string;
  description: string;
}

export interface DeletedFile {
  file: CloudFile;
  deletedAt: string;
  expiresAt: string;
}

export interface ScanResult {
  categories: ScanCategory[];
  totalRecoverableBytes: number;
  totalFileCount: number;
}

export interface SwipeSession {
  filesReviewed: number;
  filesDeleted: number;
  bytesFreed: number;
  streak: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Settings: undefined;
  ScanCategories: undefined;
  Detail: { file: CloudFile };
  SwipeMode: undefined;
  RecycleBin: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
};
