import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  PhotoIcon,
  ArchiveBoxIcon,
  ArrowDownTrayIcon,
  DevicePhoneMobileIcon,
  TrashIcon,
  DocumentIcon,
} from 'react-native-heroicons/outline';
import {
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  SHADOWS,
  CATEGORY_LABELS,
} from '../theme';
import { RootStackParamList, JunkCategory } from '../types';
import FileCard from '../components/FileCard';
import { getScanResult, getFilesByCategory, formatBytes } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ScanCategories'>;
};

function CategoryIcon({ id, size, color }: { id: string; size: number; color: string }) {
  const p = { size, color, strokeWidth: 2 as const };
  switch (id) {
    case 'duplicate':    return <DocumentDuplicateIcon {...p} />;
    case 'blurry_photo': return <PhotoIcon {...p} />;
    case 'large_unused': return <ArchiveBoxIcon {...p} />;
    case 'old_download': return <ArrowDownTrayIcon {...p} />;
    case 'screenshot':   return <DevicePhoneMobileIcon {...p} />;
    case 'temp_file':    return <TrashIcon {...p} />;
    default:             return <DocumentIcon {...p} />;
  }
}

export default function ScanCategoriesScreen({ navigation }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<JunkCategory | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const scanResult = getScanResult();

  const { deletedFiles, deleteFile } = useAppContext();
  const deletedIds = new Set(deletedFiles.map(d => d.file.id));
  const files = selectedCategory
    ? getFilesByCategory(selectedCategory).filter(f => !deletedIds.has(f.id))
    : [];
  const selectedBytes = files
    .filter(f => selectedFiles.has(f.id))
    .reduce((s, f) => s + f.sizeBytes, 0);

  const toggleFile = (id: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll   = () => setSelectedFiles(new Set(files.filter(f => !f.isSensitive).map(f => f.id)));
  const deselectAll = () => setSelectedFiles(new Set());

  const handleDelete = () => {
    if (selectedFiles.size === 0) return;
    Alert.alert(
      `${selectedFiles.size} Dateien löschen?`,
      `${formatBytes(selectedBytes)} werden in den Papierkorb verschoben.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            files.filter(f => selectedFiles.has(f.id)).forEach(f => deleteFile(f));
            Alert.alert('Erledigt', `${formatBytes(selectedBytes)} freigegeben.`);
            setSelectedFiles(new Set());
          },
        },
      ],
    );
  };

  const sorted = [...scanResult.categories].sort((a, b) => b.recoverableBytes - a.recoverableBytes);

  // ── FILE LIST ──────────────────────────────────────────────────────────────
  if (selectedCategory) {
    const cat = scanResult.categories.find(c => c.id === selectedCategory);
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => { setSelectedCategory(null); setSelectedFiles(new Set()); }}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon size={22} color={COLORS.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.titleBlock}>
            <Text style={styles.topBarTitle}>{cat?.label ?? CATEGORY_LABELS[selectedCategory]}</Text>
            <Text style={styles.topBarSub}>
              {files.length} Dateien{cat ? ` · ${formatBytes(cat.recoverableBytes)}` : ''}
            </Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.selectBar}>
          <TouchableOpacity onPress={selectAll} style={styles.selectBarBtn} activeOpacity={0.7}>
            <Text style={styles.selectBarBtnText}>Alle</Text>
          </TouchableOpacity>
          <View style={styles.selectBarDivider} />
          <TouchableOpacity onPress={deselectAll} style={styles.selectBarBtn} activeOpacity={0.7}>
            <Text style={styles.selectBarBtnText}>Keine</Text>
          </TouchableOpacity>
          <Text style={styles.selectBarCount}>
            {selectedFiles.size > 0 ? `${selectedFiles.size} ausgewählt` : 'Tippe zum Auswählen'}
          </Text>
        </View>

        <FlatList
          data={files}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.fileList}
          renderItem={({ item }) => (
            <FileCard
              file={item}
              selected={selectedFiles.has(item.id)}
              onToggleSelect={() => toggleFile(item.id)}
              showCheckbox
              onPress={() => navigation.navigate('Detail', { file: item })}
            />
          )}
        />

        {selectedFiles.size > 0 && (
          <View style={styles.deleteBar}>
            <View>
              <Text style={styles.deleteBarTitle}>{selectedFiles.size} Dateien</Text>
              <Text style={styles.deleteBarSub}>{formatBytes(selectedBytes)} · In Papierkorb</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
              <Text style={styles.deleteBtnText}>Löschen</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ── CATEGORY LIST ──────────────────────────────────────────────────────────
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
        <Text style={styles.topBarTitle}>Scan-Ergebnisse</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={sorted}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.catList}
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Scan abgeschlossen</Text>
              <View style={styles.summaryBadge}>
                <CheckIcon size={18} color={COLORS.success} strokeWidth={2.5} />
              </View>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{scanResult.totalFileCount}</Text>
                <Text style={styles.statLabel}>Dateien</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: COLORS.success }]}>
                  {formatBytes(scanResult.totalRecoverableBytes)}
                </Text>
                <Text style={styles.statLabel}>Freigebbar</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{sorted.length}</Text>
                <Text style={styles.statLabel}>Kategorien</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const share = Math.min(
            Math.round((item.recoverableBytes / scanResult.totalRecoverableBytes) * 100),
            100,
          );
          return (
            <TouchableOpacity
              style={styles.catCard}
              onPress={() => setSelectedCategory(item.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.catIconBox, { backgroundColor: `${item.color}18` }]}>
                <CategoryIcon id={item.id} size={24} color={item.color} />
              </View>
              <View style={styles.catInfo}>
                <Text style={styles.catName}>{item.label}</Text>
                <Text style={styles.catDesc} numberOfLines={1}>{item.description}</Text>
                <View style={styles.catProgress}>
                  <View
                    style={[
                      styles.catProgressFill,
                      { width: `${share}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.catStats}>
                <Text style={[styles.catSize, { color: item.color }]}>
                  {formatBytes(item.recoverableBytes)}
                </Text>
                <Text style={styles.catCount}>{item.fileCount} Dat.</Text>
              </View>
              <View style={styles.catChevron}>
                <ChevronRightIcon size={17} color={COLORS.border} strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

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
  titleBlock: {
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  topBarSub: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  // ── Category list ──
  catList: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 30,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  summaryTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  summaryBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.heading,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  catCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  catIconBox: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  catInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  catName: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  catDesc: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  catProgress: {
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  catStats: {
    alignItems: 'flex-end',
    marginRight: SPACING.sm,
  },
  catSize: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: 2,
  },
  catCount: {
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  catChevron: {
    justifyContent: 'center',
  },
  // ── File list ──
  selectBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  selectBarBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
  },
  selectBarBtnText: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  selectBarDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.border,
  },
  selectBarCount: {
    flex: 1,
    textAlign: 'right',
    fontSize: FONT_SIZE.small,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  fileList: {
    padding: SPACING.lg,
    paddingBottom: 120,
  },
  deleteBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  deleteBarTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  deleteBarSub: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  deleteBtn: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    shadowColor: COLORS.danger,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  deleteBtnText: {
    color: COLORS.onPrimary,
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
  },
});
