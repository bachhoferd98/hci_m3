import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import {
  ChevronLeftIcon,
  CheckIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  DocumentIcon,
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
import { RootStackParamList } from '../types';
import { formatBytes } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Detail'>;
  route: RouteProp<RootStackParamList, 'Detail'>;
};

const FILE_TYPE_LABELS: Record<string, string> = {
  image:    'Bild',
  video:    'Video',
  document: 'Dokument',
  audio:    'Audio',
  archive:  'Archiv',
  other:    'Sonstiges',
};

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

export default function DetailScreen({ navigation, route }: Props) {
  const { file } = route.params;
  const providerColor = PROVIDER_COLORS[file.provider] ?? COLORS.primary;
  const { deleteFile } = useAppContext();

  const handleDelete = () => {
    Alert.alert(
      'Datei löschen?',
      `"${file.name}" wird in den Papierkorb verschoben und kann 30 Tage lang wiederhergestellt werden.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            deleteFile(file);
            Alert.alert('Gelöscht', 'Die Datei wurde in den Papierkorb verschoben.');
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleKeep = () => {
    Alert.alert('Behalten', 'Die Datei bleibt in deiner Cloud.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={22} color={COLORS.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Dateidetails</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* File preview card */}
        <View style={styles.previewCard}>
          <View style={styles.previewIconCircle}>
            <FileTypeIcon type={file.fileType} size={44} color={COLORS.primary} />
          </View>
          <Text style={styles.previewFileName} numberOfLines={2}>
            {file.name}
          </Text>
          <View style={styles.previewMeta}>
            <View style={[styles.typeBadge, { backgroundColor: `${providerColor}15` }]}>
              <Text style={[styles.typeBadgeText, { color: providerColor }]}>
                {FILE_TYPE_LABELS[file.fileType] ?? 'Datei'}
              </Text>
            </View>
            <Text style={styles.previewSize}>{formatBytes(file.sizeBytes)}</Text>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Datei-Informationen</Text>
          <InfoRow
            label="Cloud-Anbieter"
            value={PROVIDER_LABELS[file.provider]}
            valueColor={providerColor}
            dot
          />
          <InfoRow label="Dateigröße"      value={formatBytes(file.sizeBytes)} />
          <InfoRow label="Dateityp"         value={FILE_TYPE_LABELS[file.fileType] ?? 'Unbekannt'} />
          <InfoRow label="Zuletzt geändert" value={file.dateModified} last />

          {file.isDuplicate && (
            <View style={styles.dupBadgeRow}>
              <View style={styles.dupBadge}>
                <Text style={styles.dupBadgeText}>Duplikat erkannt</Text>
              </View>
            </View>
          )}

          {file.isSensitive && (
            <View style={styles.sensitiveBox}>
              <ExclamationTriangleIcon size={18} color={COLORS.warning} strokeWidth={2} />
              <View style={styles.sensitiveInfo}>
                <Text style={styles.sensitiveTitle}>Aufbewahrungspflichtig</Text>
                <Text style={styles.sensitiveDesc}>
                  Diese Datei könnte rechtlich relevant sein. Löschen auf eigene Verantwortung.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.keepBtn} onPress={handleKeep} activeOpacity={0.8}>
            <View style={styles.btnRow}>
              <CheckIcon size={18} color={COLORS.onPrimary} strokeWidth={2.5} />
              <Text style={styles.keepBtnText}>Behalten</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
            <View style={styles.btnRow}>
              <TrashIcon size={18} color={COLORS.danger} strokeWidth={2.5} />
              <Text style={styles.deleteBtnText}>Löschen</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Safety note */}
        <View style={styles.safetyNote}>
          <ArrowUturnLeftIcon size={16} color={COLORS.success} strokeWidth={2.5} />
          <Text style={styles.safetyText}>
            Gelöschte Dateien können 30 Tage lang über den Papierkorb wiederhergestellt werden.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  valueColor,
  dot,
  last,
}: {
  label: string;
  value: string;
  valueColor?: string;
  dot?: boolean;
  last?: boolean;
}) {
  return (
    <View style={[infoRow.row, last && infoRow.rowLast]}>
      <Text style={infoRow.label}>{label}</Text>
      <View style={infoRow.valueWrap}>
        {dot && (
          <View style={[infoRow.dot, { backgroundColor: valueColor ?? COLORS.primary }]} />
        )}
        <Text style={[infoRow.value, valueColor ? { color: valueColor } : null]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const infoRow = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  topBarTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 40,
  },
  previewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.floating,
  },
  previewIconCircle: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  previewFileName: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING.md,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  typeBadgeText: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.bold,
  },
  previewSize: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  infoCardTitle: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  dupBadgeRow: {
    paddingVertical: SPACING.md,
  },
  dupBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${COLORS.danger}15`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  dupBadgeText: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.danger,
  },
  sensitiveBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warningBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  sensitiveInfo: {
    flex: 1,
  },
  sensitiveTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.warning,
    marginBottom: 2,
  },
  sensitiveDesc: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  keepBtn: {
    flex: 1,
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.success,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  keepBtnText: {
    color: COLORS.onPrimary,
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: `${COLORS.danger}40`,
  },
  deleteBtnText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
  },
  safetyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  safetyText: {
    flex: 1,
    fontSize: FONT_SIZE.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
