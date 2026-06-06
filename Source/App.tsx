import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import DashboardScreen from './src/screens/DashboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ScanCategoriesScreen from './src/screens/ScanCategoriesScreen';
import DetailScreen from './src/screens/DetailScreen';
import SwipeModeScreen from './src/screens/SwipeModeScreen';
import RecycleBinScreen from './src/screens/RecycleBinScreen';
import { RootStackParamList, TabParamList } from './src/types';
import { COLORS, FONT_SIZES } from './src/theme';
import { Text, StyleSheet } from 'react-native';
import { AppProvider } from './src/context/AppContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="MainTabs"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.background },
            }}
          >
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="ScanCategories"
              component={ScanCategoriesScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Detail"
              component={DetailScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="SwipeMode"
              component={SwipeModeScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="RecycleBin"
              component={RecycleBinScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tabIcon: {
    fontSize: 22,
  },
});

export default App;
