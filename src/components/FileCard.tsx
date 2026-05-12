import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, PROVIDER_LABELS } from '../theme';
import { CloudFile } from '../types';
import { formatBytes } from '../data/mockData';

interface Props {
  file: CloudFile;
  onPress?: () => void;
  selected?: boolean;
  onToggleSelect?: () => void;
  showCheckbox?: boolean;
}

const FILE_TYPE_ICONS: Record<string, string> = {
  image: '🖼️',
  video: '🎬',
  document: '📄',
  audio: '🎵',
  archive: '📦',
  other: '📎',
};

const PROVIDER_COLORS: Record<string, string> = {
  google_drive: COLORS.googleDrive,
  dropbox: COLORS.dropbox,
  icloud: COLORS.icloud,
  onedrive: COLORS.onedrive,
};

export default function FileCard({ file, onPress, selected, onToggleSelect, showCheckbox }: Props) {
  const providerColor = PROVIDER_COLORS[file.provider] || COLORS.primary;

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onToggleSelect || onPress}
      activeOpacity={0.7}>
      <View style={styles.iconWrapper}>
        <Text style={styles.fileIcon}>{FILE_TYPE_ICONS[file.fileType] || '📄'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.providerBadge, { backgroundColor: providerColor + '18' }]}>
            <Text style={[styles.providerBadgeText, { color: providerColor }]}>
              {PROVIDER_LABELS[file.provider]}
            </Text>
          </View>
          <Text style={styles.sizeText}>{formatBytes(file.sizeBytes)}</Text>
          <Text style={styles.dateText}>{file.dateModified}</Text>
        </View>
        {file.isSensitive && (
          <View style={styles.sensitiveRow}>
            <Text style={styles.sensitiveIcon}>⚠️</Text>
            <Text style={styles.sensitiveText}>Aufbewahrungspflichtig</Text>
          </View>
        )}
      </View>
      {showCheckbox && (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: '#F0FFF4',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  fileIcon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  fileName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  providerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  providerBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  sizeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  dateText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
  sensitiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  sensitiveIcon: {
    fontSize: 12,
  },
  sensitiveText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.warning,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  checkboxSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  checkmark: {
    color: COLORS.textOnPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});
