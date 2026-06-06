import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeftIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  InformationCircleIcon,
} from 'react-native-heroicons/outline';
import { CloudProvider, RootStackParamList } from '../types';
import { formatBytes } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import {
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  SHADOWS,
  PROVIDER_LABELS,
} from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const PROVIDER_LOGOS: Record<CloudProvider, any> = {
  google_drive: require('../assets/images/google-drive-logo.png'),
  dropbox:      require('../assets/images/dropbox-logo.png'),
  icloud:       require('../assets/images/icloud-logo.png'),
  onedrive:     require('../assets/images/onedrive-logo.png'),
};

const PROVIDER_COLORS: Record<CloudProvider, string> = {
  google_drive: COLORS.googleDrive,
  dropbox:      COLORS.dropbox,
  icloud:       COLORS.icloud,
  onedrive:     COLORS.onedrive,
};

export default function SettingsScreen({ navigation }: Props) {
  const { accounts, toggleAccount } = useAppContext();

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
        <Text style={styles.topBarTitle}>Einstellungen</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cloud Accounts */}
        <Text style={styles.sectionLabel}>CLOUD-KONTEN</Text>
        <View style={styles.card}>
          {accounts.map((account, index) => {
            const color = PROVIDER_COLORS[account.provider as CloudProvider];
            const percent = account.connected
              ? Math.min(Math.round((account.usedBytes / account.totalBytes) * 100), 100)
              : 0;
            return (
              <View key={account.id}>
                {index > 0 && <View style={styles.divider} />}
                <View style={styles.accountRow}>
                  <View style={[styles.logoCircle, { backgroundColor: `${color}18` }]}>
                    <Image
                      source={PROVIDER_LOGOS[account.provider as CloudProvider]}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{PROVIDER_LABELS[account.provider]}</Text>
                    {account.connected ? (
                      <>
                        <Text style={styles.accountEmail} numberOfLines={1}>
                          {account.email}
                        </Text>
                        <View style={styles.progressTrack}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${percent}%`, backgroundColor: color },
                            ]}
                          />
                        </View>
                        <Text style={styles.storageText}>
                          {formatBytes(account.usedBytes)} / {formatBytes(account.totalBytes)}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.notConnectedText}>Nicht verbunden</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleAccount(account.id)}
                    style={[
                      styles.pill,
                      account.connected ? styles.pillConnected : styles.pillDisconnected,
                    ]}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        account.connected ? styles.pillTextConnected : styles.pillTextDisconnected,
                      ]}
                    >
                      {account.connected ? 'Verbunden' : 'Verbinden'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Privacy */}
        <Text style={styles.sectionLabel}>DATENSCHUTZ</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.primaryLight }]}>
              <ShieldCheckIcon size={22} color={COLORS.primary} strokeWidth={2} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Lokale Verarbeitung</Text>
              <Text style={styles.infoDesc}>
                Alle Analysen laufen auf deinem Gerät. Keine Dateien werden hochgeladen.
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.successBg }]}>
              <LockClosedIcon size={22} color={COLORS.success} strokeWidth={2} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Nur Lesezugriff</Text>
              <Text style={styles.infoDesc}>
                Wir lesen nur Dateinamen und Größen – kein Dateiinhalt wird übertragen.
              </Text>
            </View>
          </View>
        </View>

        {/* App info */}
        <Text style={styles.sectionLabel}>APP</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.border }]}>
              <InformationCircleIcon size={22} color={COLORS.textSecondary} strokeWidth={2} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Cloud Declutter</Text>
              <Text style={styles.infoDesc}>Version 1.0.0 · HCI Projekt © 2026</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  topBarTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 40,
    paddingTop: SPACING.sm,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.card,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  logoCircle: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  logo: {
    width: 30,
    height: 30,
  },
  accountInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  accountName: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  accountEmail: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  progressTrack: {
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  storageText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  notConnectedText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    minWidth: 82,
    alignItems: 'center',
  },
  pillConnected: {
    backgroundColor: COLORS.successBg,
    borderWidth: 1.5,
    borderColor: COLORS.success,
  },
  pillDisconnected: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.bold,
  },
  pillTextConnected: {
    color: COLORS.success,
  },
  pillTextDisconnected: {
    color: COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.lg,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  infoDesc: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
