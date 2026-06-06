import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  XMarkIcon,
  CheckIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ForwardIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  DocumentIcon,
} from 'react-native-heroicons/outline';
import {
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  SHADOWS,
  PROVIDER_LABELS,
  CATEGORY_LABELS,
} from '../theme';
import { RootStackParamList, CloudFile, SwipeSession } from '../types';
import { MOCK_FILES, formatBytes } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SwipeMode'>;
};

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

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

export default function SwipeModeScreen({ navigation }: Props) {
  const swipeableFiles = MOCK_FILES.filter(f => !f.isSensitive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { deleteFile } = useAppContext();
  const [session, setSession] = useState<SwipeSession>({
    filesReviewed: 0,
    filesDeleted:  0,
    bytesFreed:    0,
    streak:        0,
  });
  const [undoEnabled, setUndoEnabled] = useState(false);
  const [lastAction, setLastAction] = useState<{ file: CloudFile; action: 'keep' | 'delete' } | null>(null);
  const [finished, setFinished] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;

  const handlersRef = useRef({
    handleKeep:   () => {},
    handleDelete: () => {},
    handleSkip:   () => {},
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        pan.setValue({ x: g.dx, y: g.dy });
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD)        handlersRef.current.handleKeep();
        else if (g.dx < -SWIPE_THRESHOLD)  handlersRef.current.handleDelete();
        else if (g.dy < -SWIPE_THRESHOLD)  handlersRef.current.handleSkip();
        else Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    }),
  ).current;

  const advance = (index: number) => {
    if (index + 1 >= swipeableFiles.length) setFinished(true);
    else setCurrentIndex(index + 1);
    pan.setValue({ x: 0, y: 0 });
  };

  const handleKeep = () => {
    const file = swipeableFiles[currentIndex];
    if (!file) return;
    Animated.timing(pan, {
      toValue: { x: SCREEN_W + 100, y: 0 },
      duration: 240,
      useNativeDriver: false,
    }).start(() => {
      setLastAction({ file, action: 'keep' });
      setUndoEnabled(true);
      setSession(p => ({ ...p, filesReviewed: p.filesReviewed + 1, streak: 0 }));
      advance(currentIndex);
    });
  };

  const handleDelete = () => {
    const file = swipeableFiles[currentIndex];
    if (!file) return;
    Animated.timing(pan, {
      toValue: { x: -SCREEN_W - 100, y: 0 },
      duration: 240,
      useNativeDriver: false,
    }).start(() => {
      deleteFile(file);
      setLastAction({ file, action: 'delete' });
      setUndoEnabled(true);
      setSession(p => ({
        filesReviewed: p.filesReviewed + 1,
        filesDeleted:  p.filesDeleted + 1,
        bytesFreed:    p.bytesFreed + file.sizeBytes,
        streak:        p.streak + 1,
      }));
      advance(currentIndex);
    });
  };

  const handleSkip = () => {
    const file = swipeableFiles[currentIndex];
    if (!file) return;
    Animated.timing(pan, {
      toValue: { x: 0, y: -500 },
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setUndoEnabled(false);
      advance(currentIndex);
    });
  };

  handlersRef.current = { handleKeep, handleDelete, handleSkip };

  const handleUndo = () => {
    if (!lastAction || !undoEnabled) return;
    setCurrentIndex(p => p - 1);
    if (lastAction.action === 'delete') {
      setSession(p => ({
        ...p,
        filesReviewed: p.filesReviewed - 1,
        filesDeleted:  p.filesDeleted - 1,
        bytesFreed:    p.bytesFreed - lastAction.file.sizeBytes,
        streak:        Math.max(p.streak - 1, 0),
      }));
    } else {
      setSession(p => ({ ...p, filesReviewed: p.filesReviewed - 1, streak: 0 }));
    }
    setUndoEnabled(false);
    setLastAction(null);
    pan.setValue({ x: 0, y: 0 });
  };

  const cardRotate = pan.x.interpolate({
    inputRange: [-SCREEN_W, 0, SCREEN_W],
    outputRange: ['-12deg', '0deg', '12deg'],
  });
  const keepOpacity   = pan.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const deleteOpacity = pan.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  const progress = (currentIndex / swipeableFiles.length) * 100;

  // ── FINISHED ───────────────────────────────────────────────────────────────
  if (finished) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.finishedWrap}>
          <View style={styles.finishedIcon}>
            <CheckIcon size={44} color={COLORS.primary} strokeWidth={2} />
          </View>
          <Text style={styles.finishedTitle}>Session abgeschlossen!</Text>
          <Text style={styles.finishedSub}>{session.filesReviewed} Dateien bewertet</Text>

          <View style={styles.finishedStatsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statVal}>{session.filesReviewed}</Text>
              <Text style={styles.statLbl}>Geprüft</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.dangerBg }]}>
              <Text style={[styles.statVal, { color: COLORS.danger }]}>{session.filesDeleted}</Text>
              <Text style={styles.statLbl}>Gelöscht</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.successBg }]}>
              <Text style={[styles.statVal, { color: COLORS.success, fontSize: FONT_SIZE.title }]}>
                {formatBytes(session.bytesFreed)}
              </Text>
              <Text style={styles.statLbl}>Freigegeben</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.navigate('MainTabs')}
            activeOpacity={0.8}
          >
            <Text style={styles.doneBtnText}>Zurück zum Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const file = swipeableFiles[currentIndex];
  const providerColor = file ? (PROVIDER_COLORS[file.provider] ?? COLORS.primary) : COLORS.primary;

  // ── SWIPE VIEW ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <ChevronLeftIcon size={22} color={COLORS.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <Text style={styles.progressLabel}>{currentIndex + 1} / {swipeableFiles.length}</Text>
      </View>

      {/* Streak */}
      {session.streak >= 3 && (
        <View style={styles.streak}>
          <Text style={styles.streakText}>{session.streak}× Lösch-Streak</Text>
        </View>
      )}

      {/* Card area */}
      <View style={styles.cardArea}>
        {file && (
          <Animated.View
            style={[
              styles.card,
              { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: cardRotate }] },
            ]}
            {...panResponder.panHandlers}
          >
            {/* Preview area */}
            <View style={styles.previewArea}>
              <View style={styles.fileIconWrap}>
                <FileTypeIcon type={file.fileType} size={52} color={COLORS.textSecondary} />
              </View>

              {/* Keep stamp — centered */}
              <Animated.View style={[styles.stampOverlay, { opacity: keepOpacity }]}>
                <View style={styles.keepStamp}>
                  <Text style={styles.keepStampText}>BEHALTEN</Text>
                </View>
              </Animated.View>

              {/* Delete stamp — centered */}
              <Animated.View style={[styles.stampOverlay, { opacity: deleteOpacity }]}>
                <View style={styles.deleteStamp}>
                  <Text style={styles.deleteStampText}>LÖSCHEN</Text>
                </View>
              </Animated.View>
            </View>

            {/* Card body */}
            <View style={styles.cardBody}>
              <Text style={styles.fileName} numberOfLines={2}>{file.name}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.providerDot, { backgroundColor: providerColor }]} />
                <Text style={styles.metaText}>
                  {PROVIDER_LABELS[file.provider]} · {formatBytes(file.sizeBytes)}
                </Text>
              </View>
              <Text style={styles.subText}>
                {CATEGORY_LABELS[file.category]} · {file.dateModified}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Stats chips */}
      <View style={styles.chipsRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{formatBytes(session.bytesFreed)} freigegeben</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{session.filesDeleted} gelöscht</Text>
        </View>
      </View>

      {/* 4-button control row */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.btnSmall, !undoEnabled && styles.btnDimmed]}
          onPress={handleUndo}
          activeOpacity={undoEnabled ? 0.75 : 1}
          disabled={!undoEnabled}
        >
          <ArrowUturnLeftIcon size={20} color={undoEnabled ? COLORS.textPrimary : COLORS.textMuted} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.btnLabelWrap}>
          <TouchableOpacity style={styles.btnDelete} onPress={handleDelete} activeOpacity={0.75}>
            <XMarkIcon size={30} color={COLORS.onPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.btnLabelDelete}>Löschen</Text>
        </View>

        <View style={styles.btnLabelWrap}>
          <TouchableOpacity style={styles.btnKeep} onPress={handleKeep} activeOpacity={0.75}>
            <CheckIcon size={30} color={COLORS.onPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.btnLabelKeep}>Behalten</Text>
        </View>

        <TouchableOpacity style={styles.btnSmall} onPress={handleSkip} activeOpacity={0.75}>
          <ForwardIcon size={20} color={COLORS.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <View style={{ height: SPACING.xl }} />
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
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
  progressWrap: {
    flex: 1,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  progressLabel: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
    minWidth: 48,
    textAlign: 'right',
  },
  streak: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.warningBg,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: `${COLORS.warning}50`,
  },
  streakText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.warning,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  card: {
    width: SCREEN_W - SPACING.lg * 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.floating,
  },
  previewArea: {
    height: 260,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIconWrap: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  stampOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepStamp: {
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  keepStampText: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.success,
    letterSpacing: 2,
  },
  deleteStamp: {
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
  deleteStampText: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.danger,
    letterSpacing: 2,
  },
  cardBody: {
    padding: SPACING.lg,
  },
  fileName: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 4,
  },
  providerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaText: {
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
  },
  subText: {
    fontSize: FONT_SIZE.caption,
    color: COLORS.textMuted,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    ...SHADOWS.card,
  },
  chipText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  btnLabelWrap: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  btnLabelDelete: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.danger,
  },
  btnLabelKeep: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.success,
  },
  btnSmall: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  btnDimmed: {
    opacity: 0.35,
  },
  btnDelete: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.floating,
  },
  btnKeep: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.floating,
  },
  finishedWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
  },
  finishedIcon: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  finishedTitle: {
    fontSize: FONT_SIZE.heading,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  finishedSub: {
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxxl,
  },
  finishedStatsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xxxl,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    minWidth: 88,
    ...SHADOWS.card,
  },
  statVal: {
    fontSize: FONT_SIZE.heading,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLbl: {
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.semibold,
    textAlign: 'center',
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxxl,
    ...SHADOWS.floating,
  },
  doneBtnText: {
    color: COLORS.onPrimary,
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
  },
});
