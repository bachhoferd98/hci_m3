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
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, PROVIDER_LABELS } from '../theme';
import { RootStackParamList, CloudFile } from '../types';
import { formatBytes } from '../data/mockData';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Detail'>;
  route: RouteProp<RootStackParamList, 'Detail'>;
};

const FILE_TYPE_LABELS: Record<string, string> = {
  image: 'Bild',
  video: 'Video',
  document: 'Dokument',
  audio: 'Audio',
  archive: 'Archiv',
  other: 'Sonstiges',
};

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

export default function DetailScreen({ navigation, route }: Props) {
  const { file } = route.params;
  const providerColor = PROVIDER_COLORS[file.provider] || COLORS.primary;

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
            Alert.alert('✓ Gelöscht', 'Die Datei wurde in den Papierkorb verschoben.');
          },
        },
      ],
    );
  };

  const handleKeep = () => {
    Alert.alert('✓ Behalten', 'Die Datei bleibt in deiner Cloud.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Dateidetails</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.previewArea}>
          <Text style={styles.previewIcon}>{FILE_TYPE_ICONS[file.fileType] || '📄'}</Text>
          <Text style={styles.previewLabel}>{FILE_TYPE_LABELS[file.fileType] || 'Datei'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.fileName}>{file.name}</Text>

          <View style={styles.divider} />

          <InfoRow label="Cloud-Anbieter" value={PROVIDER_LABELS[file.provider]} valueColor={providerColor} />
          <InfoRow label="Dateigröße" value={formatBytes(file.sizeBytes)} />
          <InfoRow label="Dateityp" value={FILE_TYPE_LABELS[file.fileType] || 'Unbekannt'} />
          <InfoRow label="Zuletzt geändert" value={file.dateModified} />

          {file.isDuplicate && (
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: COLORS.duplicate + '18' }]}>
                <Text style={[styles.badgeText, { color: COLORS.duplicate }]}>Duplikat</Text>
              </View>
            </View>
          )}

          {file.isSensitive && (
            <View style={styles.sensitiveBox}>
              <Text style={styles.sensitiveIcon}>⚠️</Text>
              <View style={styles.sensitiveInfo}>
                <Text style={styles.sensitiveTitle}>Aufbewahrungspflichtig</Text>
                <Text style={styles.sensitiveDesc}>
                  Diese Datei könnte rechtlich relevant sein. Löschen auf eigene Verantwortung.
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.keepBtn]}
            onPress={handleKeep}
            activeOpacity={0.7}>
            <Text style={styles.keepBtnText}>✓ Behalten</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={handleDelete}
            activeOpacity={0.7}>
            <Text style={styles.deleteBtnText}>🗑️ Löschen</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.undoHint} activeOpacity={0.6}>
          <Text style={styles.undoHintIcon}>↩</Text>
          <Text style={styles.undoHintText}>
            Keine Sorge: Gelöschte Dateien können 30 Tage lang über den Papierkorb wiederhergestellt werden.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={[infoStyles.value, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  navTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  previewArea: {
    height: 200,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  previewIcon: {
    fontSize: 64,
    marginBottom: SPACING.sm,
  },
  previewLabel: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.surface,
    margin: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fileName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 30,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  sensitiveBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  sensitiveIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  sensitiveInfo: {
    flex: 1,
  },
  sensitiveTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.warning,
    marginBottom: 2,
  },
  sensitiveDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  actionBtn: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  keepBtn: {
    backgroundColor: COLORS.accent,
  },
  keepBtnText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
  deleteBtnText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  undoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    backgroundColor: '#F0FFF4',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  undoHintIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  undoHintText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
