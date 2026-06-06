import {
  CloudAccount,
  CloudFile,
  JunkCategory,
  ScanCategory,
  DeletedFile,
  ScanResult,
} from '../types';
import { COLORS, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '../theme';

const NOW = new Date();
const DAYS_AGO = (d: number) => {
  const dt = new Date(NOW);
  dt.setDate(dt.getDate() - d);
  return dt.toISOString().split('T')[0];
};
const DAYS_FROM_NOW = (d: number) => {
  const dt = new Date(NOW);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split('T')[0];
};

export const MOCK_CLOUD_ACCOUNTS: CloudAccount[] = [
  {
    id: 'gd_1',
    provider: 'google_drive',
    email: 'markus.mueller@gmail.com',
    connected: true,
    usedBytes: 12_400_000_000,
    totalBytes: 15_000_000_000,
  },
  {
    id: 'db_1',
    provider: 'dropbox',
    email: 'markus@agentur.at',
    connected: true,
    usedBytes: 1_800_000_000,
    totalBytes: 2_000_000_000,
  },
  {
    id: 'ic_1',
    provider: 'icloud',
    email: 'markus.mueller@icloud.com',
    connected: true,
    usedBytes: 4_200_000_000,
    totalBytes: 5_000_000_000,
  },
  {
    id: 'od_1',
    provider: 'onedrive',
    email: 'm.mueller@firma.at',
    connected: false,
    usedBytes: 0,
    totalBytes: 5_000_000_000,
  },
];

const FILE_THUMBNAILS: Record<string, string | null> = {
  image: 'https://picsum.photos/200/200?random=',
  video: null,
  document: null,
  audio: null,
  archive: null,
  other: null,
};

let _fileId = 0;
function makeFile(
  name: string,
  provider: CloudAccount['provider'],
  sizeBytes: number,
  fileType: CloudFile['fileType'],
  category: JunkCategory,
  extra: Partial<CloudFile> = {},
): CloudFile {
  _fileId++;
  return {
    id: `file_${_fileId}`,
    name,
    provider,
    sizeBytes,
    fileType,
    category,
    thumbnailUrl: FILE_THUMBNAILS[fileType]
      ? `${FILE_THUMBNAILS[fileType]}${_fileId}`
      : null,
    dateModified: DAYS_AGO(Math.floor(Math.random() * 365) + 30),
    isDuplicate: category === 'duplicate',
    isSensitive: false,
    ...extra,
  };
}

const DUPLICATE_GROUP_1 = 'dup_g1';
const DUPLICATE_GROUP_2 = 'dup_g2';

export const MOCK_FILES: CloudFile[] = [
  makeFile('Projektplan_2024.pdf', 'google_drive', 3_200_000, 'document', 'duplicate', { duplicateGroupId: DUPLICATE_GROUP_1, dateModified: DAYS_AGO(180) }),
  makeFile('Projektplan_2024_Kopie.pdf', 'dropbox', 3_200_000, 'document', 'duplicate', { duplicateGroupId: DUPLICATE_GROUP_1, dateModified: DAYS_AGO(170) }),
  makeFile('Urlaub_Foto_001.jpg', 'icloud', 4_500_000, 'image', 'blurry_photo', { dateModified: DAYS_AGO(200) }),
  makeFile('Urlaub_Foto_002.jpg', 'icloud', 3_800_000, 'image', 'blurry_photo', { dateModified: DAYS_AGO(200) }),
  makeFile('Urlaub_Foto_003.jpg', 'icloud', 5_100_000, 'image', 'blurry_photo', { dateModified: DAYS_AGO(200) }),
  makeFile('Urlaub_Foto_004.jpg', 'icloud', 2_900_000, 'image', 'blurry_photo', { dateModified: DAYS_AGO(200) }),
  makeFile('Urlaub_Foto_005.jpg', 'icloud', 4_200_000, 'image', 'blurry_photo', { dateModified: DAYS_AGO(200) }),
  makeFile('Kundenpräsentation_Final_v3.mp4', 'google_drive', 850_000_000, 'video', 'large_unused', { dateModified: DAYS_AGO(250) }),
  makeFile('Rohschnitt_Doku_2024.mov', 'dropbox', 1_200_000_000, 'video', 'large_unused', { dateModified: DAYS_AGO(300) }),
  makeFile('Backup_Projekt_2022.zip', 'google_drive', 450_000_000, 'archive', 'large_unused', { dateModified: DAYS_AGO(400) }),
  makeFile('Setup_Installer_v2.exe', 'google_drive', 280_000_000, 'other', 'old_download', { dateModified: DAYS_AGO(120) }),
  makeFile('Vorlesung_Skriptum_WiSe2023.pdf', 'google_drive', 15_000_000, 'document', 'old_download', { dateModified: DAYS_AGO(150) }),
  makeFile('Zoom_Meeting_Recording.mp4', 'dropbox', 320_000_000, 'video', 'old_download', { dateModified: DAYS_AGO(90) }),
  makeFile('WhatsApp_Bild_001.jpg', 'icloud', 800_000, 'image', 'screenshot', { dateModified: DAYS_AGO(60) }),
  makeFile('WhatsApp_Bild_002.jpg', 'icloud', 950_000, 'image', 'screenshot', { dateModified: DAYS_AGO(55) }),
  makeFile('Einkaufszettel_Screenshot.png', 'icloud', 400_000, 'image', 'screenshot', { dateModified: DAYS_AGO(45) }),
  makeFile('Kartenroute_Screenshot.png', 'icloud', 650_000, 'image', 'screenshot', { dateModified: DAYS_AGO(30) }),
  makeFile('Rechnungen_Screenshot.png', 'icloud', 520_000, 'image', 'screenshot', { dateModified: DAYS_AGO(20) }),
  makeFile('Cache_temp_001.tmp', 'google_drive', 50_000_000, 'other', 'temp_file', { dateModified: DAYS_AGO(90) }),
  makeFile('Cache_temp_002.tmp', 'google_drive', 35_000_000, 'other', 'temp_file', { dateModified: DAYS_AGO(80) }),
  makeFile('.DS_Store', 'dropbox', 6_000, 'other', 'temp_file', { dateModified: DAYS_AGO(365) }),
  makeFile('Präsentation_Entwurf_v1.pptx', 'dropbox', 28_000_000, 'document', 'duplicate', { duplicateGroupId: DUPLICATE_GROUP_2, dateModified: DAYS_AGO(200) }),
  makeFile('Präsentation_Entwurf_v1_Kopie.pptx', 'google_drive', 28_000_000, 'document', 'duplicate', { duplicateGroupId: DUPLICATE_GROUP_2, dateModified: DAYS_AGO(195) }),
  makeFile('Rechnung_2024_Q1.pdf', 'google_drive', 1_200_000, 'document', 'old_download', { dateModified: DAYS_AGO(100), isSensitive: true }),
  makeFile('Vertrag_Kunde_Müller.pdf', 'dropbox', 800_000, 'document', 'old_download', { dateModified: DAYS_AGO(200), isSensitive: true }),
];

export const MOCK_DELETED_FILES: DeletedFile[] = [
  {
    file: makeFile('Altes_Projekt_Backup.zip', 'google_drive', 200_000_000, 'archive', 'old_download'),
    deletedAt: DAYS_AGO(2),
    expiresAt: DAYS_FROM_NOW(28),
  },
  {
    file: makeFile('Unscharfes_Selfie.jpg', 'icloud', 3_500_000, 'image', 'blurry_photo'),
    deletedAt: DAYS_AGO(5),
    expiresAt: DAYS_FROM_NOW(25),
  },
];

export function getScanResult(): ScanResult {
  const categoryMap = new Map<JunkCategory, { count: number; bytes: number }>();

  for (const file of MOCK_FILES) {
    const existing = categoryMap.get(file.category) || { count: 0, bytes: 0 };
    existing.count++;
    existing.bytes += file.sizeBytes;
    categoryMap.set(file.category, existing);
  }

  const categoryColors: Record<JunkCategory, string> = {
    duplicate: COLORS.duplicate,
    blurry_photo: COLORS.blurry,
    large_unused: COLORS.large,
    old_download: COLORS.oldDownload,
    screenshot: COLORS.screenshot,
    temp_file: COLORS.tempFile,
  };

  const categories: ScanCategory[] = Array.from(categoryMap.entries()).map(
    ([id, { count, bytes }]) => ({
      id,
      label: CATEGORY_LABELS[id] || id,
      icon: getCategoryIcon(id),
      fileCount: count,
      recoverableBytes: bytes,
      color: categoryColors[id],
      description: CATEGORY_DESCRIPTIONS[id] || '',
    }),
  );

  const totalRecoverableBytes = categories.reduce(
    (sum, c) => sum + c.recoverableBytes,
    0,
  );
  const totalFileCount = categories.reduce((sum, c) => sum + c.fileCount, 0);

  return { categories, totalRecoverableBytes, totalFileCount };
}

function getCategoryIcon(cat: JunkCategory): string {
  const icons: Record<JunkCategory, string> = {
    duplicate: '📋',
    blurry_photo: '📷',
    large_unused: '📦',
    old_download: '📥',
    screenshot: '📱',
    temp_file: '🗑️',
  };
  return icons[cat] || '📄';
}

export function getFilesByCategory(category: JunkCategory): CloudFile[] {
  return MOCK_FILES.filter(f => f.category === category);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatPercent(used: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
}
