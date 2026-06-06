// ─── Design System ────────────────────────────────────────────────────────────
// Single source of truth. No screen defines its own colors, spacing, or sizes.

export const COLORS = {
  // Backgrounds
  background:      '#F8FAFC',
  surface:         '#FFFFFF',
  surfaceElevated: '#F1F5F9',
  surfacePressed:  '#EDF2F7',

  // Brand
  primary:      '#2563EB',
  primaryLight: '#EFF6FF',
  onPrimary:    '#FFFFFF',

  // Semantic
  success:    '#059669',
  successBg:  '#ECFDF5',
  danger:     '#DC2626',
  dangerBg:   '#FEF2F2',
  warning:    '#D97706',
  warningBg:  '#FFFBEB',

  // Text
  textPrimary:   '#0F172A',
  textSecondary: '#475569',
  textMuted:     '#94A3B8',

  // Borders
  border:       '#E2E8F0',
  borderSubtle: '#F1F5F9',

  // Shadow base
  shadow: '#0F172A',

  // Cloud providers — brand colors for progress fills and dots only
  googleDrive: '#1A73E8',
  dropbox:     '#0061FF',
  icloud:      '#007AFF',
  onedrive:    '#0078D4',

  borderLight:   '#F1F5F9',

  // ─── Compat aliases (keep old code working) ───────────────────────────────
  text:          '#0F172A',
  textLight:     '#94A3B8',
  textSoft:      '#94A3B8',
  textOnPrimary: '#FFFFFF',
  onBlue:        '#FFFFFF',
  surfaceAlt:    '#F1F5F9',
  blue:          '#2563EB',
  blueLight:     '#EFF6FF',
  blueMuted:     '#93C5FD',
  accent:        '#059669',
  accentDark:    '#047857',
  // Category indicators — all blue for minimal look
  duplicate:    '#2563EB',
  blurry:       '#2563EB',
  large:        '#2563EB',
  oldDownload:  '#2563EB',
  screenshot:   '#2563EB',
  tempFile:     '#2563EB',
};

// Spacing — 4-step scale. Screen margin = lg. Section gap = xl. Card inner = md–lg.
export const SPACING = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
  xxxl: 48,
};

// Border radius
export const RADIUS = {
  sm:   8,
  md:   14,
  lg:   20,
  xl:   28,
  pill: 999,
};

// Font sizes — semantic scale
export const FONT_SIZE = {
  caption: 12,
  small:   13,
  body:    15,
  title:   18,
  heading: 22,
  display: 30,
};

// Font weights
export const FONT_WEIGHT = {
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
};

// Shadows — two levels only
export const SHADOWS = {
  card: {
    shadowColor:   '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius:  12,
    shadowOffset:  { width: 0, height: 3 } as { width: number; height: number },
    elevation:     2,
  },
  floating: {
    shadowColor:   '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius:  20,
    shadowOffset:  { width: 0, height: 6 } as { width: number; height: number },
    elevation:     6,
  },
};

// ─── Labels ──────────────────────────────────────────────────────────────────

export const PROVIDER_LABELS: Record<string, string> = {
  google_drive: 'Google Drive',
  dropbox:      'Dropbox',
  icloud:       'iCloud',
  onedrive:     'OneDrive',
};

export const CATEGORY_LABELS: Record<string, string> = {
  duplicate:    'Duplikate',
  blurry_photo: 'Unscharfe Fotos',
  large_unused: 'Große Dateien',
  old_download: 'Alte Downloads',
  screenshot:   'Screenshots',
  temp_file:    'Temporäre Dateien',
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  duplicate:    'Identische oder sehr ähnliche Dateien',
  blurry_photo: 'Fotos mit niedriger Schärfe oder Verwacklung',
  large_unused: 'Über 50 MB, seit 6+ Monaten ungenutzt',
  old_download: 'Downloads älter als 3 Monate',
  screenshot:   'Bildschirmfotos und Snippets',
  temp_file:    'Cache- und temporäre Dateien',
};

// ─── Legacy compat exports ────────────────────────────────────────────────────
export const BORDER_RADIUS = {
  sm: RADIUS.sm, md: RADIUS.md, lg: RADIUS.lg, xl: RADIUS.xl,
  xxl: RADIUS.lg, xxxl: RADIUS.xl, full: RADIUS.pill,
};
export const FONT_SIZES = {
  xs: FONT_SIZE.caption, sm: FONT_SIZE.small, md: FONT_SIZE.body,
  lg: FONT_SIZE.title, xl: FONT_SIZE.title, xxl: FONT_SIZE.heading,
  xxxl: FONT_SIZE.heading, hero: FONT_SIZE.display,
};
export const CARD_SHADOW    = SHADOWS.card;
export const CARD_SHADOW_LG = SHADOWS.floating;
