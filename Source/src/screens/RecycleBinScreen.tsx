import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowUturnUpIcon,
  TrashIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  DocumentIcon,
  ChevronLeftIcon,
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DeletedFile, RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RecycleBin'>;
};
import { formatBytes } from '../data/mockData';

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

export default function RecycleBinScreen({ navigation }: Props) {
  const { deletedFiles, restoreFile, emptyBin } = useAppContext();

  const handleRestore = (id: string) => {
    const item = deletedFiles.find(f => f.file.id === id);
    if (!item) return;
    Alert.alert(
      'Datei wiederherstellen?',
      `"${item.file.name}" wird an ihren ursprünglichen Ort zurückverschoben.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Wiederherstellen',
          onPress: () => restoreFile(id),
        },
      ],
    );
  };

  const handleEmptyBin = () => {
    if (deletedFiles.length === 0) return;
    Alert.alert(
      'Papierkorb leeren?',
      `${deletedFiles.length} Dateien werden dauerhaft gelöscht. Dieser Vorgang kann nicht rückgängig gemacht werden.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Dauerhaft löschen',
          style: 'destructive',
          onPress: () => emptyBin(),
        },
      ],
    );
  };

  const totalBytes = deletedFiles.reduce((s, f) => s + f.file.sizeBytes, 0);
  const isEmpty = deletedFiles.length === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <ChevronLeftIcon size={22} color={COLORS.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Papierkorb</Text>
          {!isEmpty && (
            <Text style={styles.headerSub}>
              {deletedFiles.length} Datei{deletedFiles.length !== 1 ? 'en' : ''} · {formatBytes(totalBytes)}
            </Text>
          )}
        </View>
        {!isEmpty ? (
          <TouchableOpacity style={styles.emptyBtn} onPress={handleEmptyBin} activeOpacity={0.75}>
            <TrashIcon size={15} color={COLORS.danger} strokeWidth={2.5} />
            <Text style={styles.emptyBtnText}>Leeren</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrapper}>
            <TrashIcon size={44} color={COLORS.textMuted} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>Papierkorb ist leer</Text>
          <Text style={styles.emptySub}>
            Gelöschte Dateien erscheinen hier und können{'\n'}30 Tage lang wiederhergestellt werden.
          </Text>
        </View>
      ) : (
        <FlatList
          data={deletedFiles}
          keyExtractor={item => item.file.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.infoBanner}>
              <Text style={styles.infoText}>
                Dateien werden nach 30 Tagen automatisch dauerhaft gelöscht.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <DeletedFileRow item={item} onRestore={() => handleRestore(item.file.id)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function DeletedFileRow({ item, onRestore }: { item: DeletedFile; onRestore: () => void }) {
  const daysLeft = Math.max(
    0,
    30 - Math.floor((Date.now() - new Date(item.deletedAt).getTime()) / 86_400_000),
  );
  const providerColor = PROVIDER_COLORS[item.file.provider] ?? COLORS.primary;
  const expiryColor =
    daysLeft <= 3 ? COLORS.danger :
    daysLeft <= 7 ? COLORS.warning :
    COLORS.textMuted;

  return (
    <View style={row.card}>
      <View style={row.iconWrap}>
        <FileTypeIcon type={item.file.fileType} size={24} color={COLORS.textSecondary} />
      </View>
      <View style={row.info}>
        <Text style={row.name} numberOfLines={1}>{item.file.name}</Text>
        <View style={row.meta}>
          <View style={[row.badge, { backgroundColor: `${providerColor}15` }]}>
            <Text style={[row.badgeText, { color: providerColor }]}>
              {PROVIDER_LABELS[item.file.provider]}
            </Text>
          </View>
          <Text style={row.size}>{formatBytes(item.file.sizeBytes)}</Text>
        </View>
        <Text style={[row.expiry, { color: expiryColor }]}>
          Noch {daysLeft} Tag{daysLeft !== 1 ? 'e' : ''} wiederherstellbar
        </Text>
      </View>
      <TouchableOpacity style={row.restoreBtn} onPress={onRestore} activeOpacity={0.75}>
        <ArrowUturnUpIcon size={18} color={COLORS.primary} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

const row = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  badgeText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
  },
  size: {
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  expiry: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.semibold,
  },
  restoreBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  headerCenter: {
    flex: 1,
  },
  headerSpacer: {
    width: 80,
  },
  headerTitle: {
    fontSize: FONT_SIZE.heading,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  headerSub: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: FONT_WEIGHT.medium,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: `${COLORS.danger}40`,
  },
  emptyBtnText: {
    color: COLORS.danger,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.small,
  },
  infoBanner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  infoText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 40,
    paddingTop: SPACING.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.heading,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySub: {
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
