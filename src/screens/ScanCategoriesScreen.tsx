import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, CATEGORY_LABELS } from '../theme';
import { RootStackParamList, JunkCategory } from '../types';
import CategoryCard from '../components/CategoryCard';
import FileCard from '../components/FileCard';
import { getScanResult, getFilesByCategory, formatBytes } from '../data/mockData';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ScanCategories'>;
};

export default function ScanCategoriesScreen({ navigation }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<JunkCategory | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const scanResult = getScanResult();

  const files = selectedCategory ? getFilesByCategory(selectedCategory) : [];
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

  const selectAll = () => {
    const nonSensitive = files.filter(f => !f.isSensitive);
    setSelectedFiles(new Set(nonSensitive.map(f => f.id)));
  };

  const deselectAll = () => setSelectedFiles(new Set());

  const handleDelete = () => {
    if (selectedFiles.size === 0) return;
    Alert.alert(
      `${selectedFiles.size} Dateien löschen?`,
      `${formatBytes(selectedBytes)} werden in den Papierkorb verschoben und können 30 Tage lang wiederhergestellt werden.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Sicher löschen',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '✓ Gelöscht',
              `${formatBytes(selectedBytes)} freigegeben. Dateien sind im Papierkorb wiederherstellbar.`,
            );
            setSelectedFiles(new Set());
          },
        },
      ],
    );
  };

  if (selectedCategory) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => { setSelectedCategory(null); setSelectedFiles(new Set()); }}>
            <Text style={styles.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>{CATEGORY_LABELS[selectedCategory]}</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.actionBar}>
          <TouchableOpacity onPress={selectAll}>
            <Text style={styles.actionLink}>Alle auswählen</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deselectAll}>
            <Text style={styles.actionLink}>Auswahl aufheben</Text>
          </TouchableOpacity>
          <Text style={styles.selectedCount}>{selectedFiles.size} ausgewählt</Text>
        </View>

        <FlatList
          data={files}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <FileCard
              file={item}
              selected={selectedFiles.has(item.id)}
              onToggleSelect={() => toggleFile(item.id)}
              showCheckbox
              onPress={() => navigation.navigate('Detail', { file: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
        />

        {selectedFiles.size > 0 && (
          <View style={styles.deleteBar}>
            <View>
              <Text style={styles.deleteLabel}>
                {selectedFiles.size} Dateien ({formatBytes(selectedBytes)})
              </Text>
              <Text style={styles.deleteSub}>In Papierkorb verschieben</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Löschen</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan-Ergebnisse</Text>
        <Text style={styles.headerSub}>
          {scanResult.totalFileCount} Dateien · {formatBytes(scanResult.totalRecoverableBytes)} freigebbar
        </Text>
      </View>
      <FlatList
        data={scanResult.categories.sort((a, b) => b.recoverableBytes - a.recoverableBytes)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => setSelectedCategory(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  headerSub: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
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
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  actionLink: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  selectedCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.xl,
    paddingBottom: 100,
  },
  deleteBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  deleteSub: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  deleteButtonText: {
    color: COLORS.textOnPrimary,
    fontWeight: '700',
    fontSize: FONT_SIZES.md,
  },
});
