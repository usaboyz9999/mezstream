// mezstream/App.js

import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useApp } from './context/AppContext';
import AppModal from './components/AppModal';
import SideNav from './components/SideNav';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import { BrowseScreen, DetailScreen, MyListScreen, AccountScreen } from './screens/OtherScreens';
import PlayerScreen from './screens/PlayerScreen';
import ChannelsScreen from './screens/ChannelsScreen';
import { useLayout } from './hooks/useLayout';

const Tab    = createBottomTabNavigator();
const Stack  = createStackNavigator();

// ─── Logo ────────────────────────────────────────────────────────────────────
function StreamLogo({ size = 34 }) {
  return (
    <LinearGradient
      colors={['#a855f7', '#7c3aed', '#5b21b6']}
      style={{
        width: size, height: size,
        borderRadius: size * 0.28,
        alignItems: 'center', justifyContent: 'center',
        elevation: 8,
      }}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
      <Text style={{ fontSize: size * 0.6, fontWeight: '900', color: '#fff' }}>M</Text>
    </LinearGradient>
  );
}

// ─── Bottom Tab Bar (وضع عمودي) ──────────────────────────────────────────────
function BottomTabBar({ state, navigation }) {
  const { colors: C } = useApp();
  const insets = useSafeAreaInsets();

  const TABS = [
    { name: 'Home',     iconOff: 'home-outline',   iconOn: 'home',   label: 'الرئيسية' },
    { name: 'Browse',   iconOff: 'apps-outline',   iconOn: 'apps',   label: 'تصفح'     },
    { name: 'Channels', iconOff: 'tv-outline',     iconOn: 'tv',     label: 'القنوات'  },
    { name: 'MyList',   iconOff: 'heart-outline',  iconOn: 'heart',  label: 'قائمتي'   },
    { name: 'Account',  iconOff: 'person-outline', iconOn: 'person', label: 'حسابي'    },
  ];

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: C.bg2,
      borderTopWidth: 1,
      borderTopColor: C.border,
      paddingBottom: insets.bottom,
    }}>
      {TABS.map((tab, i) => {
        const focused = state.index === i;
        return (
          <TouchableOpacity
            key={tab.name}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={focused ? tab.iconOn : tab.iconOff}
              size={22}
              color={focused ? C.primary2 : C.textMuted}
            />
            <Text style={{
              fontSize: 10,
              fontWeight: focused ? '800' : '500',
              color: focused ? C.primary2 : C.textMuted,
              marginTop: 3,
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Custom Tab Navigator يتحول حسب الاتجاه ──────────────────────────────────
function AdaptiveTabNavigator() {
  const { isSideNav, isTV } = useLayout();
  const { colors: C } = useApp();

  // الشاشات المشتركة
  const screens = (
    <>
      <Tab.Screen name="Home"     component={HomeStack} />
      <Tab.Screen name="Browse"   component={BrowseStack} />
      <Tab.Screen name="Channels" component={ChannelsStack} />
      <Tab.Screen name="MyList"   component={MyListStack} />
      <Tab.Screen name="Account"  component={AccountStack} />
    </>
  );

  if (isSideNav) {
    // وضع أفقي أو TV — شريط جانبي على اليمين
    return (
      <Tab.Navigator
        tabBar={(props) => (
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 1 }}>{props.children}</View>
            <SideNav {...props} isTV={isTV} />
          </View>
        )}
        screenOptions={{ headerShown: false }}
      >
        {screens}
      </Tab.Navigator>
    );
  }

  // وضع عمودي — شريط سفلي
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {screens}
    </Tab.Navigator>
  );
}

// ─── Stack Navigators ─────────────────────────────────────────────────────────
function makeStack(MainScreen, title = '') {
  return function StackNav() {
    const { colors: C } = useApp();
    const headerStyle = {
      backgroundColor: C.bg,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
      elevation: 0,
      shadowOpacity: 0,
    };
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle,
          headerTintColor: C.accent,
          cardStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={
            title
              ? { title }
              : {
                  headerLeft: () => (
                    <View style={{ paddingLeft: 14 }}>
                      <StreamLogo />
                    </View>
                  ),
                  title: '',
                }
          }
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: route.params?.item?.nameAr || '' })}
        />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  };
}

const HomeStack     = makeStack(HomeScreen);
const BrowseStack   = makeStack(BrowseScreen, 'تصفح');
const ChannelsStack = makeStack(ChannelsScreen, 'القنوات');
const MyListStack   = makeStack(MyListScreen, 'قائمتي');

function AccountStack() {
  const { colors: C } = useApp();
  const headerStyle = {
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    elevation: 0,
    shadowOpacity: 0,
  };
  return (
    <Stack.Navigator
      screenOptions={{ headerStyle, headerTintColor: C.accent, cardStyle: { backgroundColor: C.bg } }}
    >
      <Stack.Screen name="Main"   component={AccountScreen} options={{ title: 'حسابي' }} />
      <Stack.Screen name="MyList" component={MyListScreen}  options={{ title: 'قائمتي' }} />
    </Stack.Navigator>
  );
}

// ─── Modal Root ───────────────────────────────────────────────────────────────
function AppModalRoot() {
  const { modalVisible, modalConfig, hideModal, colors: C, isRTL } = useApp();
  return (
    <AppModal
      visible={modalVisible}
      config={modalConfig}
      onClose={hideModal}
      colors={C}
      isRTL={isRTL}
    />
  );
}

// ─── App Content ──────────────────────────────────────────────────────────────
function AppContent() {
  const [splashDone, setSplashDone] = useState(false);
  const { isDark, colors: C, hydrated } = useApp();
  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0d0b1e', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  if (!splashDone) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <SplashScreen onFinish={handleSplashFinish} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <AdaptiveTabNavigator />
      </NavigationContainer>
      <AppModalRoot />
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}