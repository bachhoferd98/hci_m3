import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { COLORS, PROVIDER_LABELS } from '../theme';
import { RootStackParamList, TabParamList, CloudProvider } from '../types';
import {
  getScanResult,
  formatBytes,
  formatPercent,
} from '../data/mockData';
import { useAppContext } from '../context/AppContext';

import {
  MagnifyingGlassIcon,
  ArrowsRightLeftIcon,
  TrashIcon,
  Cog6ToothIcon,
} from 'react-native-heroicons/outline';

type DashboardNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Dashboard'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: DashboardNavProp;
}

const PROVIDER_COLORS: Record<CloudProvider, string> = {
  google_drive: COLORS.googleDrive,
  dropbox: COLORS.dropbox,
  icloud: COLORS.icloud,
  onedrive: COLORS.onedrive,
};

const PROVIDER_LOGOS: Record<CloudProvider, any> = {
  google_drive: require('../assets/images/google-drive-logo.png'),
  dropbox: require('../assets/images/dropbox-logo.png'),
  icloud: require('../assets/images/icloud-logo.png'),
  onedrive: require('../assets/images/onedrive-logo.png'),
};

export default function DashboardScreen({ navigation }: Props) {
  const { accounts: allAccounts } = useAppContext();
  const accounts = useMemo(
    () => allAccounts.filter(account => account.connected),
    [allAccounts],
  );

  const scanResult = getScanResult();

  const totalUsed = accounts.reduce(
    (sum, account) => sum + account.usedBytes,
    0,
  );
  const totalStorage = accounts.reduce(
    (sum, account) => sum + account.totalBytes,
    0,
  );
  const totalFree = Math.max(totalStorage - totalUsed, 0);
  const totalPercent = Math.min(formatPercent(totalUsed, totalStorage), 100);
  const recoverablePercent = Math.min(formatPercent(scanResult.totalRecoverableBytes, totalStorage), totalPercent);
  const actuallyUsedPercent = Math.max(totalPercent - recoverablePercent, 0);

  const actionCards = [
    {
      title: 'Scan starten',
      subtitle: `${scanResult.totalFileCount} Dateien prüfen`,
      icon: <MagnifyingGlassIcon size={30} color="#0A66FF" strokeWidth={2.4} />,
      backgroundColor: '#EAF3FF',
      onPress: () => navigation.navigate('ScanCategories'),
    },
    {
      title: 'Swipe-Modus',
      subtitle: 'Dateien schnell bewerten',
      icon: <ArrowsRightLeftIcon size={30} color="#19A974" strokeWidth={2.4} />,
      backgroundColor: '#EAFBF3',
      onPress: () => navigation.navigate('SwipeMode'),
    },
  ];

  const trashAction = {
    title: 'Papierkorb',
    subtitle: 'Gelöschte Dateien ansehen',
    icon: <TrashIcon size={30} color="#E74C3C" strokeWidth={2.4} />,
    backgroundColor: '#FFF0F2',
    onPress: () => navigation.navigate('RecycleBin'),
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3FAFF" />
      <Pressable
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Cog6ToothIcon size={26} color="#0A66FF" strokeWidth={2.3} />
      </Pressable>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.logoCard}>
          <Image
            source={require('../assets/images/cloud-declut-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <View style={styles.storageTitleBlock}>
              <Text style={styles.cardTitle}>Speicherübersicht</Text>
              <Text style={styles.cardSubtitle}>
                {accounts.length} verbundene Clouds
              </Text>
            </View>

            <View style={styles.percentBlock}>
              <Text style={styles.bigPercent}>{totalPercent}%</Text>
              <Text style={styles.percentLabel}>belegt</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${totalPercent}%` }]} />
            <View style={[styles.progressFillGreen, {
              position: 'absolute',
              left: `${actuallyUsedPercent}%`,
              width: `${recoverablePercent}%`,
              top: 0,
              bottom: 0,
            }]} />
          </View>

          <View style={styles.storageStats}>
            <View style={styles.statItem}>
              <View style={styles.blueDot} />
              <View style={styles.statTextBlock}>
                <Text style={styles.statValue}>{formatBytes(totalUsed)}</Text>
                <Text style={styles.statSubtext}>verwendet</Text>
              </View>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statItem}>
              <View style={styles.lightDot} />
              <View style={styles.statTextBlock}>
                <Text style={styles.statValue}>{formatBytes(totalFree)}</Text>
                <Text style={styles.statSubtext}>frei</Text>
              </View>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statItem}>
              <View style={styles.greenDot} />
              <View style={styles.statTextBlock}>
                <Text style={styles.statValue}>
                  {formatBytes(scanResult.totalRecoverableBytes)}
                </Text>
                <Text style={styles.statSubtext}>potenziell frei</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aufräumfunktionen</Text>
        </View>

        <View style={styles.actionGrid}>
          <View style={styles.topActionRow}>
            {actionCards.map(action => (
              <Pressable
                key={action.title}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <View
                  style={[
                    styles.actionIconBox,
                    { backgroundColor: action.backgroundColor },
                  ]}
                >
                  {action.icon}
                </View>

                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.actionCard, styles.trashActionCard]}
            onPress={trashAction.onPress}
          >
            <View
              style={[
                styles.actionIconBox,
                styles.trashActionIconBox,
                { backgroundColor: trashAction.backgroundColor },
              ]}
            >
              {trashAction.icon}
            </View>

            <View style={styles.trashTextBlock}>
              <Text style={styles.actionTitle}>{trashAction.title}</Text>
              <Text style={styles.actionSubtitle}>{trashAction.subtitle}</Text>
            </View>

            <Text style={styles.trashArrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.savedCard}>
          <View style={styles.savedBadge}>
            <Text style={styles.savedBadgeIcon}>★</Text>
          </View>

          <View style={styles.savedTextBlock}>
            <Text style={styles.savedLabel}>Möglicher Speichergewinn</Text>
            <Text style={styles.savedAmount}>
              {formatBytes(scanResult.totalRecoverableBytes)}
            </Text>
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Verbundene Clouds</Text>
        </View>

        <View style={styles.cloudGrid}>
          {accounts.map(account => {
            const percent = Math.min(
              formatPercent(account.usedBytes, account.totalBytes),
              100,
            );
            const providerColor = PROVIDER_COLORS[account.provider];

            return (
              <View key={account.id} style={styles.cloudCard}>
                <View
                  style={[
                    styles.cloudIconCircle,
                    { backgroundColor: `${providerColor}18` },
                  ]}
                >
                  <Image
                    source={PROVIDER_LOGOS[account.provider]}
                    style={styles.providerLogo}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.cloudTextBlock}>
                  <Text style={styles.cloudName}>
                    {PROVIDER_LABELS[account.provider]}
                  </Text>
                  <Text style={styles.cloudEmail} numberOfLines={1}>
                    {account.email}
                  </Text>
                </View>

                <Text style={styles.cloudStorage}>
                  {formatBytes(account.usedBytes)}
                </Text>

                <View style={styles.smallProgressTrack}>
                  <View
                    style={[
                      styles.smallProgressFill,
                      {
                        width: `${percent}%`,
                        backgroundColor: providerColor,
                      },
                    ]}
                  />
                </View>

                <Text style={[styles.cloudPercent, { color: providerColor }]}>
                  {percent}% belegt
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3FAFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 65,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B3954',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  logoCard: {
    marginTop: 3,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 350,
    height: 175,
  },
  storageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#0B3954',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -5,
  },
  storageTitleBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#071B4D',
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#627491',
  },
  percentBlock: {
    alignItems: 'flex-end',
  },
  bigPercent: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0A66FF',
    marginTop: -10,
  },
  percentLabel: {
    fontSize: 13,
    color: '#627491',
    marginTop: -5,
  },
  progressTrack: {
    height: 13,
    borderRadius: 20,
    backgroundColor: '#E3ECF8',
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0A66FF',
  },
  progressFillGreen: {
    height: '100%',
    backgroundColor: '#19A974',
  },
  storageStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -5,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextBlock: {
    alignItems: 'flex-start',
  },
  statSubtext: {
    fontSize: 12,
    color: '#627491',
    marginTop: -2,
    textAlign: 'left',
  },
  blueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0A66FF',
    marginRight: 10,
  },
  lightDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E3ECF8',
    marginRight: 10,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#19A974',
    marginRight: 10,
    marginLeft: 10,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#071B4D',
    textAlign: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E3ECF8',
    marginHorizontal: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#071B4D',
    marginBottom: -3,
  },
  cloudGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  cloudCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    shadowColor: '#0B3954',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cloudIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  providerLogo: {
    width: 35,
    height: 35,
  },
  cloudTextBlock: {
    minHeight: 30,
  },
  cloudName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#071B4D',
  },
  cloudEmail: {
    fontSize: 11,
    color: '#627491',
    marginTop: 2,
  },
  cloudStorage: {
    fontSize: 19,
    fontWeight: '900',
    color: '#071B4D',
    marginTop: 5,
  },
  smallProgressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 8,
    backgroundColor: '#E3ECF8',
    overflow: 'hidden',
    marginTop: 5,
  },
  smallProgressFill: {
    height: '100%',
    borderRadius: 8,
  },
  cloudPercent: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 5,
  },
  actionGrid: {
    marginBottom: 22,
  },
  topActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  actionCard: {
    width: '48%',
    minHeight: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#0B3954',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  trashActionCard: {
    width: '100%',
    minHeight: 85,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -8,
  },
  trashActionIconBox: {
    marginBottom: 0,
    marginRight: 19,
  },
  trashTextBlock: {
    flex: 1,
    alignItems: 'flex-start',
  },
  trashArrow: {
    color: '#E74C3C',
    marginLeft: 12,
    marginRight: 3,
    fontSize: 38,
    lineHeight: 38,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  actionIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#071B4D',
    marginBottom: 0,
  },
  actionSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#627491',
  },
  savedCard: {
    backgroundColor: '#EAFBF3',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#bfeade',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  savedBadge: {
    width: 55,
    height: 55,
    borderRadius: 29,
    backgroundColor: '#19A974',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  savedBadgeIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '900',
    marginTop: -3,
  },
  savedTextBlock: {
    flex: 1,
  },
  savedLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#071B4D',
  },
  savedAmount: {
    fontSize: 27,
    fontWeight: '900',
    color: '#19A974',
    marginTop: -2,
  },
  bottomSpacer: {
    height: 10,
  },
});
