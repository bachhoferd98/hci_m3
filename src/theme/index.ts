export const COLORS = {
  primary: '#1A3A5C',
  primaryLight: '#2A5A8C',
  primaryDark: '#0F2240',
  accent: '#2ECC71',
  accentDark: '#27AE60',
  danger: '#E74C3C',
  dangerLight: '#FF6B6B',
  warning: '#F39C12',
  warningLight: '#FFEAA7',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  googleDrive: '#EB493D',
  dropbox: '#1382E6',
  icloud: '#5CB2F7',
  onedrive: '#0078D4',
  duplicate: '#E74C3C',
  blurry: '#F39C12',
  large: '#8E44AD',
  oldDownload: '#3498DB',
  screenshot: '#1ABC9C',
  tempFile: '#95A5A6',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 36,
};

export const PROVIDER_LABELS: Record<string, string> = {
  google_drive: 'Google Drive',
  dropbox: 'Dropbox',
  icloud: 'iCloud',
  onedrive: 'OneDrive',
};

export const CATEGORY_LABELS: Record<string, string> = {
  duplicate: 'Duplikate',
  blurry_photo: 'Unscharfe Fotos',
  large_unused: 'Große ungenutzte Dateien',
  old_download: 'Alte Downloads',
  screenshot: 'Screenshots',
  temp_file: 'Temporäre Dateien',
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  duplicate:
    'Identische oder sehr ähnliche Dateien, die mehrfach gespeichert sind',
  blurry_photo: 'Fotos mit niedriger Auflösung oder Verwacklungsunschärfe',
  large_unused:
    'Dateien über 50 MB, die seit über 6 Monaten nicht geöffnet wurden',
  old_download: 'Downloads, die älter als 3 Monate sind',
  screenshot: 'Bildschirmfotos und Snippets',
  temp_file: 'Cache- und temporäre Dateien von Apps',
};
