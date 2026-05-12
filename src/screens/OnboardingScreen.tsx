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
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, PROVIDER_LABELS } from '../theme';
import { CloudProvider, RootStackParamList } from '../types';
import CloudProviderCard from '../components/CloudProviderCard';
import { MOCK_CLOUD_ACCOUNTS, formatBytes, formatPercent } from '../data/mockData';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const { width: SCREEN_W } = Dimensions.get('window');

const PROVIDER_ICONS: Record<string, string> = {
  google_drive: 'G',
  dropbox: 'D',
  icloud: '☁',
  onedrive: 'O',
};

const PROVIDER_COLORS: Record<string, string> = {
  google_drive: COLORS.googleDrive,
  dropbox: COLORS.dropbox,
  icloud: COLORS.icloud,
  onedrive: COLORS.onedrive,
};

export default function OnboardingScreen({ navigation }: Props) {
  const [accounts, setAccounts] = useState(MOCK_CLOUD_ACCOUNTS);
  const connectedCount = accounts.filter(a => a.connected).length;

  const handleConnect = (id: string) => {
    setAccounts(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              connected: true,
              usedBytes: 2_500_000_000,
              email:
                a.provider === 'onedrive'
                  ? 'm.mueller@firma.at'
                  : a.email,
            }
          : a,
      ),
    );
  };

  const totalUsed = accounts.filter(a => a.connected).reduce((s, a) => s + a.usedBytes, 0);
  const totalAvail = accounts.filter(a => a.connected).reduce((s, a) => s + a.totalBytes, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cloud Declutter</Text>
          <Text style={styles.headerSubtitle}>
            Verbinde deine Cloud-Konten, um loszulegen
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deine Cloud-Konten</Text>
          <Text style={styles.sectionDesc}>
            Verbinde die Cloud-Dienste, die du aufräumen möchtest. Deine Daten bleiben auf deinem Gerät — wir laden nichts auf unsere Server hoch.
          </Text>
          {accounts.map(account => (
            <CloudProviderCard
              key={account.id}
              account={account}
              onConnect={() => handleConnect(account.id)}
            />
          ))}
        </View>

        <View style={styles.securityCard}>
          <Text style={styles.securityIcon}>🔒</Text>
          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>Deine Daten sind sicher</Text>
            <Text style={styles.securityDesc}>
              Alle Analysen finden lokal auf deinem Gerät statt. Wir speichern keine Dateien auf unseren Servern.
            </Text>
          </View>
        </View>

        {connectedCount > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Verbunden: {connectedCount} Konto{connectedCount !== 1 ? 's' : ''}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gesamtspeicher belegt:</Text>
              <Text style={styles.summaryValue}>
                {formatBytes(totalUsed)} / {formatBytes(totalAvail)}
              </Text>
            </View>
            <View style={styles.summaryBar}>
              <View
                style={[
                  styles.summaryBarFill,
                  {
                    width: `${formatPercent(totalUsed, totalAvail)}%`,
                    backgroundColor:
                      formatPercent(totalUsed, totalAvail) > 80
                        ? COLORS.danger
                        : COLORS.accent,
                  },
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.startButton,
              connectedCount === 0 && styles.startButtonDisabled,
            ]}
            disabled={connectedCount === 0}
            onPress={() => navigation.navigate('MainTabs')}
            activeOpacity={0.8}>
            <Text style={styles.startButtonText}>
              {connectedCount === 0
                ? 'Zuerst Konto verbinden'
                : 'Weiter zum Dashboard →'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.permissionsSection}>
          <Text style={styles.permTitle}>Welche Berechtigungen benötigen wir?</Text>
          <View style={styles.permRow}>
            <Text style={styles.permIcon}>📖</Text>
            <View style={styles.permInfo}>
              <Text style={styles.permLabel}>Lesezugriff</Text>
              <Text style={styles.permDesc}>Dateinamen, Größen und Typen lesen (kein Inhalt)</Text>
            </View>
          </View>
          <View style={styles.permRow}>
            <Text style={styles.permIcon}>🗑️</Text>
            <View style={styles.permInfo}>
              <Text style={styles.permLabel}>Löschzugriff</Text>
              <Text style={styles.permDesc}>Nur wenn du explizit Dateien löschst</Text>
            </View>
          </View>
          <View style={styles.permRow}>
            <Text style={styles.permIcon}>❌</Text>
            <View style={styles.permInfo}>
              <Text style={styles.permLabel}>Kein Hochladen</Text>
              <Text style={styles.permDesc}>Dateiinhalte werden nie an unsere Server gesendet</Text>
            </View>
          </View>
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
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZES.hero,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.lg,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    padding: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sectionDesc: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    marginHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  securityIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  securityDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderLight,
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
  summaryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  buttonContainer: {
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  startButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  startButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  permissionsSection: {
    padding: SPACING.xl,
    paddingTop: 0,
  },
  permTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  permIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
    width: 28,
    textAlign: 'center',
  },
  permInfo: {
    flex: 1,
  },
  permLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  permDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});
