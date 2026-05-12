import React, { useState } from 'react';
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
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, PROVIDER_LABELS } from '../theme';
import { DeletedFile } from '../types';
import { MOCK_DELETED_FILES, formatBytes } from '../data/mockData';

const FILE_TYPE_ICONS: Record<string, string> = {
  image: '🖼️',
  video: '🎬',
  document: '📄',
  audio: '🎵',
  archive: '📦',
  other: '📎',
};

export default function RecycleBinScreen() {
  const [deletedFiles, setDeletedFiles] = useState<DeletedFile[]>(MOCK_DELETED_FILES);

  const handleRestore = (id: string) => {
    const file = deletedFiles.find(f => f.file.id === id);
    if (!file) return;
    Alert.alert(
      'Datei wiederherstellen?',
      `"${file.file.name}" wird an ihren ursprünglichen Ort zurückverschoben.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Wiederherstellen',
          onPress: () => {
            setDeletedFiles(prev => prev.filter(f => f.file.id !== id));
            Alert.alert('✓ Wiederhergestellt', 'Die Datei wurde an ihren ursprünglichen Ort verschoben.');
          },
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
          onPress: () => {
            setDeletedFiles([]);
            Alert.alert('✓ Papierkorb geleert', 'Alle Dateien wurden dauerhaft gelöscht.');
          },
        },
      ],
    );
  };

  const totalBytes = deletedFiles.reduce((s, f) => s + f.file.sizeBytes, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Papierkorb</Text>
          <Text style={styles.headerSub}>
            {deletedFiles.length} Datei{deletedFiles.length !== 1 ? 'en' : ''} · {formatBytes(totalBytes)}
          </Text>
        </View>
        {deletedFiles.length > 0 && (
          <TouchableOpacity style={styles.emptyBtn} onPress={handleEmptyBin}>
            <Text style={styles.emptyBtnText}>Leeren</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoBanner}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Dateien im Papierkorb werden nach 30 Tagen automatisch dauerhaft gelöscht.
        </Text>
      </View>

      {deletedFiles.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🗑️</Text>
          <Text style={styles.emptyTitle}>Papierkorb ist leer</Text>
          <Text style={styles.emptySub}>
            Gelöschte Dateien erscheinen hier und können 30 Tage lang wiederhergestellt werden.
          </Text>
        </View>
      ) : (
        <FlatList
          data={deletedFiles}
          keyExtractor={item => item.file.id}
          renderItem={({ item }) => (
            <DeletedFileItem item={item} onRestore={() => handleRestore(item.file.id)} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

function DeletedFileItem({ item, onRestore }: { item: DeletedFile; onRestore: () => void }) {
  const daysLeft = Math.max(
    0,
    30 - Math.floor(
      (Date.now() - new Date(item.deletedAt).getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <View style={dStyles.card}>
      <View style={dStyles.iconWrapper}>
        <Text style={dStyles.fileIcon}>{FILE_TYPE_ICONS[item.file.fileType] || '📄'}</Text>
      </View>
      <View style={dStyles.info}>
        <Text style={dStyles.fileName} numberOfLines={1}>{item.file.name}</Text>
        <Text style={dStyles.fileSize}>{formatBytes(item.file.sizeBytes)}</Text>
        <Text style={dStyles.expiresText}>
          Noch {daysLeft} Tag{daysLeft !== 1 ? 'e' : ''} wiederherstellbar
        </Text>
      </View>
      <TouchableOpacity style={dStyles.restoreBtn} onPress={onRestore}>
        <Text style={dStyles.restoreBtnText}>↩</Text>
      </TouchableOpacity>
    </View>
  );
}

const dStyles = StyleSheet.create({
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
    marginBottom: 2,
  },
  fileSize: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  expiresText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.warning,
    fontWeight: '600',
    marginTop: 2,
  },
  restoreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent + '18',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  restoreBtnText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.accent,
    fontWeight: '700',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSub: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  emptyBtn: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  emptyBtnText: {
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: FONT_SIZES.md,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: '#EFF6FF',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  listContent: {
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySub: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
