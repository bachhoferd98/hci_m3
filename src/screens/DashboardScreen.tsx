import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, PROVIDER_LABELS } from '../theme';
import { RootStackParamList, TabParamList, CloudProvider } from '../types';
import CloudProviderCard from '../components/CloudProviderCard';
import {
  MOCK_CLOUD_ACCOUNTS,
  getScanResult,
  formatBytes,
  formatPercent,
} from '../data/mockData';

type DashboardNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Dashboard'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: DashboardNavProp;
}

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_SIZE = 120;

const PROVIDER_COLORS: Record<string, string> = {
  google_drive: COLORS.googleDrive,
  dropbox: COLORS.dropbox,
  icloud: COLORS.icloud,
  onedrive: COLORS.onedrive,
};

export default function DashboardScreen({ navigation }: Props) {
  const [accounts] = useState(MOCK_CLOUD_ACCOUNTS.filter(a => a.connected));
  const scanResult = getScanResult();

  const totalUsed = accounts.reduce((s, a) => s + a.usedBytes, 0);
  const totalAvail = accounts.reduce((s, a) => s + a.totalBytes, 0);
  const totalPct = formatPercent(totalUsed, totalAvail);

  const segments = accounts.map(a => ({
    provider: a.provider,
    bytes: a.usedBytes,
    pct: totalAvail > 0 ? a.usedBytes / totalAvail : 0,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mein Speicher</Text>
          <Text style={styles.headerSub}>
            {formatBytes(totalUsed)} von {formatBytes(totalAvail)} belegt
          </Text>
          <View style={styles.storageRow}>
            {segments.map((seg, i) => (
              <View
                key={seg.provider}
                style={[
                  styles.storageSegment,
                  {
                    flex: seg.pct,
                    backgroundColor: PROVIDER_COLORS[seg.provider] || COLORS.primary,
                    borderTopLeftRadius: i === 0 ? 6 : 0,
                    borderBottomLeftRadius: i === 0 ? 6 : 0,
                    borderTopRightRadius: i === segments.length - 1 ? 6 : 0,
                    borderBottomRightRadius: i === segments.length - 1 ? 6 : 0,
                  },
                ]}
              />
            ))}
            <View style={[styles.storageFree, { flex: 1 - totalUsed / totalAvail }]} />
          </View>
          <View style={styles.legendRow}>
            {accounts.map(a => (
              <View key={a.id} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: PROVIDER_COLORS[a.provider] }]} />
                <Text style={styles.legendText}>{PROVIDER_LABELS[a.provider]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Schnellaktionen</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#FFF5F5' }]}
              onPress={() => navigation.navigate('ScanCategories')}
              activeOpacity={0.7}>
              <Text style={styles.actionIcon}>🔍</Text>
              <Text style={styles.actionLabel}>Scan starten</Text>
              <Text style={styles.actionSub}>{scanResult.totalFileCount} Dateien gefunden</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#F0F5FF' }]}
              onPress={() => navigation.navigate('SwipeMode')}
              activeOpacity={0.7}>
              <Text style={styles.actionIcon}>👆</Text>
              <Text style={styles.actionLabel}>Swipe-Modus</Text>
              <Text style={styles.actionSub}>Schnell durchswipen</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.deepCleanCard, { backgroundColor: '#F5F0FF' }]}
            onPress={() => navigation.navigate('ScanCategories')}
            activeOpacity={0.7}>
            <View style={styles.deepCleanInfo}>
              <Text style={styles.deepCleanIcon}>🧹</Text>
              <View>
                <Text style={styles.deepCleanLabel}>Tiefenreinigung</Text>
                <Text style={styles.deepCleanSub}>
                  {formatBytes(scanResult.totalRecoverableBytes)} freigebbar
                </Text>
              </View>
            </View>
            <Text style={styles.deepCleanArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Größte Speicherfresser</Text>
          {scanResult.categories
            .sort((a, b) => b.recoverableBytes - a.recoverableBytes)
            .slice(0, 3)
            .map(cat => (
              <View key={cat.id} style={styles.hogRow}>
                <View style={[styles.hogIcon, { backgroundColor: cat.color + '18' }]}>
                  <Text style={styles.hogIconText}>{cat.icon}</Text>
                </View>
                <View style={styles.hogInfo}>
                  <Text style={styles.hogLabel}>{cat.label}</Text>
                  <Text style={styles.hogCount}>{cat.fileCount} Dateien</Text>
                </View>
                <Text style={[styles.hogSize, { color: cat.color }]}>
                  {formatBytes(cat.recoverableBytes)}
                </Text>
              </View>
            ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verbundene Clouds</Text>
          {accounts.map(account => (
            <CloudProviderCard key={account.id} account={account} compact />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
    marginBottom: SPACING.xs,
  },
  headerSub: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: SPACING.lg,
  },
  storageRow: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  storageSegment: {
    height: '100%',
  },
  storageFree: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  quickActions: {
    padding: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  actionSub: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  deepCleanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deepCleanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  deepCleanIcon: {
    fontSize: 28,
  },
  deepCleanLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  deepCleanSub: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  deepCleanArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textSecondary,
  },
  section: {
    padding: SPACING.xl,
    paddingTop: 0,
  },
  hogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hogIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  hogIconText: {
    fontSize: 18,
  },
  hogInfo: {
    flex: 1,
  },
  hogLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  hogCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  hogSize: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
  },
});
