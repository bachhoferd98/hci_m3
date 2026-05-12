import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../theme';
import { ScanCategory } from '../types';
import { formatBytes } from '../data/mockData';

interface Props {
  category: ScanCategory;
  onPress?: () => void;
}

export default function CategoryCard({ category, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconWrapper, { backgroundColor: category.color + '18' }]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{category.label}</Text>
        <Text style={styles.description} numberOfLines={1}>{category.description}</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.fileCount}>{category.fileCount} Dateien</Text>
        <Text style={[styles.recoverable, { color: category.color }]}>
          {formatBytes(category.recoverableBytes)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  stats: {
    alignItems: 'flex-end',
  },
  fileCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  recoverable: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
  },
});
