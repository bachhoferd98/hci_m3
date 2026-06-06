import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, PROVIDER_LABELS } from '../theme';
import { CloudAccount } from '../types';
import { formatBytes, formatPercent } from '../data/mockData';

interface Props {
  account: CloudAccount;
  onConnect?: () => void;
  compact?: boolean;
}

const PROVIDER_COLORS: Record<string, string> = {
  google_drive: COLORS.googleDrive,
  dropbox: COLORS.dropbox,
  icloud: COLORS.icloud,
  onedrive: COLORS.onedrive,
};

const PROVIDER_ICONS: Record<string, string> = {
  google_drive: 'G',
  dropbox: 'D',
  icloud: '☁',
  onedrive: 'O',
};

export default function CloudProviderCard({ account, onConnect, compact }: Props) {
  const color = PROVIDER_COLORS[account.provider] || COLORS.primary;
  const pct = formatPercent(account.usedBytes, account.totalBytes);
  const isLow = pct >= 80;

  if (!account.connected) {
    return (
      <TouchableOpacity style={[styles.card, { borderColor: color }]} onPress={onConnect} activeOpacity={0.7}>
        <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
          <Text style={[styles.iconText, { color }]}>{PROVIDER_ICONS[account.provider]}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.providerName}>{PROVIDER_LABELS[account.provider]}</Text>
          <Text style={styles.connectText}>Verbinden</Text>
        </View>
        <View style={[styles.connectBadge, { backgroundColor: color }]}>
          <Text style={styles.connectBadgeText}>+ Verbinden</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
          <Text style={[styles.iconText, { color }]}>{PROVIDER_ICONS[account.provider]}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.providerName}>{PROVIDER_LABELS[account.provider]}</Text>
          {!compact && <Text style={styles.emailText}>{account.email}</Text>}
        </View>
        <Text style={[styles.percentText, isLow && styles.percentWarning]}>{pct}%</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: isLow ? COLORS.danger : color }]} />
      </View>
      {!compact && (
        <Text style={styles.usageText}>
          {formatBytes(account.usedBytes)} von {formatBytes(account.totalBytes)} belegt
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardCompact: {
    padding: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  providerName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  emailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  percentText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  percentWarning: {
    color: COLORS.danger,
  },
  barBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  usageText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  connectText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  connectBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  connectBadgeText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
});
