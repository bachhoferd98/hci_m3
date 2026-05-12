import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, PROVIDER_LABELS, CATEGORY_LABELS } from '../theme';
import { RootStackParamList, CloudFile, SwipeSession } from '../types';
import { MOCK_FILES, formatBytes } from '../data/mockData';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SwipeMode'>;
};

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

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

export default function SwipeModeScreen({ navigation }: Props) {
  const swipeableFiles = MOCK_FILES.filter(f => !f.isSensitive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [session, setSession] = useState<SwipeSession>({
    filesReviewed: 0,
    filesDeleted: 0,
    bytesFreed: 0,
    streak: 0,
  });
  const [undoVisible, setUndoVisible] = useState(false);
  const [lastKept, setLastKept] = useState<CloudFile | null>(null);
  const [finished, setFinished] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        rotate.setValue(gestureState.dx / SCREEN_W * 0.3);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          handleKeep();
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          handleDeleteSwipe();
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          Animated.spring(rotate, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    }),
  ).current;

  const handleKeep = () => {
    const file = swipeableFiles[currentIndex];
    if (!file) return;

    Animated.timing(pan, {
      toValue: { x: SCREEN_W + 100, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setLastKept(file);
      setUndoVisible(true);
      setTimeout(() => setUndoVisible(false), 4000);

      setSession(prev => ({
        ...prev,
        filesReviewed: prev.filesReviewed + 1,
        streak: 0,
      }));

      if (currentIndex + 1 >= swipeableFiles.length) {
        setFinished(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
      pan.setValue({ x: 0, y: 0 });
      rotate.setValue(0);
    });
  };

  const handleDeleteSwipe = () => {
    const file = swipeableFiles[currentIndex];
    if (!file) return;

    Animated.timing(pan, {
      toValue: { x: -SCREEN_W - 100, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setSession(prev => ({
        filesReviewed: prev.filesReviewed + 1,
        filesDeleted: prev.filesDeleted + 1,
        bytesFreed: prev.bytesFreed + file.sizeBytes,
        streak: prev.streak + 1,
      }));
      setUndoVisible(false);

      if (currentIndex + 1 >= swipeableFiles.length) {
        setFinished(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
      pan.setValue({ x: 0, y: 0 });
      rotate.setValue(0);
    });
  };

  const handleUndo = () => {
    if (lastKept) {
      setCurrentIndex(prev => prev - 1);
      setSession(prev => ({
        ...prev,
        filesReviewed: prev.filesReviewed - 1,
        streak: 0,
      }));
      setUndoVisible(false);
    }
  };

  const cardRotate = pan.x.interpolate({
    inputRange: [-SCREEN_W, 0, SCREEN_W],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const keepOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const deleteOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (finished) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.finishedContainer}>
          <Text style={styles.finishedIcon}>🎉</Text>
          <Text style={styles.finishedTitle}>Session abgeschlossen!</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{session.filesReviewed}</Text>
              <Text style={styles.statLabel}>Dateien geprüft</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{session.filesDeleted}</Text>
              <Text style={styles.statLabel}>Gelöscht</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: COLORS.accent }]}>
                {formatBytes(session.bytesFreed)}
              </Text>
              <Text style={styles.statLabel}>Freigegeben</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.navigate('MainTabs')}>
            <Text style={styles.doneButtonText}>Zurück zum Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentFile = swipeableFiles[currentIndex];
  const progress = ((currentIndex) / swipeableFiles.length) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.counterText}>
          {currentIndex + 1}/{swipeableFiles.length}
        </Text>
      </View>

      {session.streak >= 3 && (
        <View style={styles.streakBanner}>
          <Text style={styles.streakText}>🔥 {session.streak} Lösch-Streak!</Text>
        </View>
      )}

      <View style={styles.cardArea}>
        {currentFile && (
          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  { translateX: pan.x },
                  { rotate: cardRotate },
                ],
              },
            ]}
            {...panResponder.panHandlers}>
            <Animated.View style={[styles.keepOverlay, { opacity: keepOpacity }]}>
              <Text style={styles.keepOverlayText}>BEHALTEN →</Text>
            </Animated.View>
            <Animated.View style={[styles.deleteOverlay, { opacity: deleteOpacity }]}>
              <Text style={styles.deleteOverlayText}>← LÖSCHEN</Text>
            </Animated.View>

            <View style={styles.cardContent}>
              <Text style={styles.cardIcon}>{FILE_TYPE_ICONS[currentFile.fileType] || '📄'}</Text>
              <Text style={styles.cardFileName} numberOfLines={2}>{currentFile.name}</Text>
              <Text style={styles.cardSize}>{formatBytes(currentFile.sizeBytes)}</Text>
              <View style={[styles.cardProvider, { backgroundColor: (PROVIDER_COLORS[currentFile.provider] || COLORS.primary) + '18' }]}>
                <Text style={[styles.cardProviderText, { color: PROVIDER_COLORS[currentFile.provider] || COLORS.primary }]}>
                  {PROVIDER_LABELS[currentFile.provider]}
                </Text>
              </View>
              <Text style={styles.cardCategory}>{CATEGORY_LABELS[currentFile.category]}</Text>
            </View>
          </Animated.View>
        )}
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.swipeDeleteBtn} onPress={handleDeleteSwipe} activeOpacity={0.7}>
          <Text style={styles.swipeDeleteBtnIcon}>🗑️</Text>
          <Text style={styles.swipeDeleteBtnText}>Löschen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.swipeKeepBtn} onPress={handleKeep} activeOpacity={0.7}>
          <Text style={styles.swipeKeepBtnIcon}>✓</Text>
          <Text style={styles.swipeKeepBtnText}>Behalten</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sessionStats}>
        <Text style={styles.sessionStat}>
          {formatBytes(session.bytesFreed)} freigegeben
        </Text>
        <Text style={styles.sessionStat}>
          {session.filesDeleted} gelöscht
        </Text>
      </View>

      {undoVisible && (
        <TouchableOpacity style={styles.undoButton} onPress={handleUndo} activeOpacity={0.8}>
          <Text style={styles.undoButtonText}>↩ Rückgängig</Text>
        </TouchableOpacity>
      )}

      <View style={styles.swipeHint}>
        <Text style={styles.swipeHintText}>← Nach links wischen zum Löschen · Nach rechts zum Behalten →</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  closeText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textOnPrimary,
    fontWeight: '700',
    width: 30,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: SPACING.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  counterText: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  streakBanner: {
    backgroundColor: '#FFF7ED',
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  streakText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: '#EA580C',
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  card: {
    width: SCREEN_W - 64,
    height: 320,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  keepOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    transform: [{ rotate: '15deg' }],
    zIndex: 10,
  },
  keepOverlayText: {
    color: COLORS.textOnPrimary,
    fontWeight: '800',
    fontSize: FONT_SIZES.lg,
  },
  deleteOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    transform: [{ rotate: '-15deg' }],
    zIndex: 10,
  },
  deleteOverlayText: {
    color: COLORS.textOnPrimary,
    fontWeight: '800',
    fontSize: FONT_SIZES.lg,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  cardIcon: {
    fontSize: 56,
    marginBottom: SPACING.lg,
  },
  cardFileName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: 26,
  },
  cardSize: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  cardProvider: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
  },
  cardProviderText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  cardCategory: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xxxl,
    paddingVertical: SPACING.lg,
  },
  swipeDeleteBtn: {
    alignItems: 'center',
  },
  swipeDeleteBtnIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  swipeDeleteBtnText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
    fontWeight: '700',
  },
  swipeKeepBtn: {
    alignItems: 'center',
  },
  swipeKeepBtnIcon: {
    fontSize: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    color: COLORS.textOnPrimary,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 56,
    fontWeight: '800',
    marginBottom: 4,
  },
  swipeKeepBtnText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    fontWeight: '700',
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xxxl,
    paddingBottom: SPACING.md,
  },
  sessionStat: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  undoButton: {
    position: 'absolute',
    bottom: 140,
    left: SPACING.xl,
    right: SPACING.xl,
    backgroundColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  undoButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  swipeHint: {
    paddingBottom: SPACING.lg,
    alignItems: 'center',
  },
  swipeHintText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  finishedIcon: {
    fontSize: 72,
    marginBottom: SPACING.lg,
  },
  finishedTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xxxl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  statBox: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 100,
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xxxl,
  },
  doneButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
});
