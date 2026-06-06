import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from 'react-native-heroicons/outline';
import {
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  SHADOWS,
  PROVIDER_LABELS,
} from '../theme';
import { CloudFile } from '../types';
import { formatBytes } from '../data/mockData';

interface Props {
  file: CloudFile;
  onPress?: () => void;
  selected?: boolean;
  onToggleSelect?: () => void;
  showCheckbox?: boolean;
}

const PROVIDER_COLORS: Record<string, string> = {
  google_drive: COLORS.googleDrive,
  dropbox:      COLORS.dropbox,
  icloud:       COLORS.icloud,
  onedrive:     COLORS.onedrive,
};

function FileTypeIcon({ type, size, color }: { type: string; size: number; color: string }) {
  const p = { size, color, strokeWidth: 2 as const };
  switch (type) {
    case 'image':    return <PhotoIcon {...p} />;
    case 'video':    return <VideoCameraIcon {...p} />;
    case 'document': return <DocumentTextIcon {...p} />;
    case 'audio':    return <MusicalNoteIcon {...p} />;
    case 'archive':  return <ArchiveBoxIcon {...p} />;
    default:         return <DocumentIcon {...p} />;
  }
}

export default function FileCard({ file, onPress, selected, onToggleSelect, showCheckbox }: Props) {
  const providerColor = PROVIDER_COLORS[file.provider] ?? COLORS.primary;

  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowSelected]}
      onPress={onToggleSelect ?? onPress}
      activeOpacity={0.75}
    >
      {/* Thumbnail */}
      <View style={[styles.thumb, selected && styles.thumbSelected]}>
        <FileTypeIcon
          type={file.fileType}
          size={22}
          color={selected ? COLORS.primary : COLORS.textSecondary}
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{file.name}</Text>
        <View style={styles.meta}>
          <View style={[styles.providerDot, { backgroundColor: providerColor }]} />
          <Text style={styles.metaText}>
            {PROVIDER_LABELS[file.provider]} · {formatBytes(file.sizeBytes)} · {file.dateModified}
          </Text>
        </View>
        {file.isSensitive && (
          <View style={styles.sensitiveRow}>
            <ExclamationTriangleIcon size={11} color={COLORS.warning} strokeWidth={2.5} />
            <Text style={styles.sensitiveText}>Aufbewahrungspflichtig</Text>
          </View>
        )}
      </View>

      {/* Checkbox */}
      {showCheckbox && (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <CheckIcon size={13} color={COLORS.onPrimary} strokeWidth={3} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  rowSelected: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.primary,
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  thumbSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  providerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaText: {
    fontSize: FONT_SIZE.caption,
    color: COLORS.textMuted,
    flex: 1,
  },
  sensitiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  sensitiveText: {
    fontSize: FONT_SIZE.caption,
    color: COLORS.warning,
    fontWeight: FONT_WEIGHT.semibold,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
