import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useApp } from './context/AppContext';
import AppModal from './components/AppModal';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import { BrowseScreen, DetailScreen, MyListScreen, AccountScreen } from './screens/OtherScreens';
import PlayerScreen from './screens/PlayerScreen';
import ChannelsScreen from './screens/ChannelsScreen';
import { useLayout } from './hooks/useLayout';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

// ─── Logo ─────────────────────────────────────────────────────────────────────
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

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
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

// ─── Side Nav Bar ─────────────────────────────────────────────────────────────
function SideNavBar({ state, navigation, isTV }) {
  const { colors: C } = useApp();
  const insets = useSafeAreaInsets();

  const TABS = [
    { name: 'Home',     iconOff: 'home-outline',   iconOn: 'home',   label: 'الرئيسية' },
    { name: 'Browse',   iconOff: 'apps-outline',   iconOn: 'apps',   label: 'تصفح'     },
    { name: 'Channels', iconOff: 'tv-outline',     iconOn: 'tv',     label: 'القنوات'  },
    { name: 'MyList',   iconOff: 'heart-outline',  iconOn: 'heart',  label: 'قائمتي'   },
    { name: 'Account',  iconOff: 'person-outline', iconOn: 'person', label: 'حسابي'    },
  ];

  const navWidth = isTV ? 200 : 70;

  return (
    <View style={{
      width: navWidth,
      backgroundColor: C.bg2,
      borderLeftWidth: 1,
      borderLeftColor: C.border,
      paddingTop: insets.top + 12,
      paddingBottom: insets.bottom + 12,
      alignItems: 'center',
      gap: 4,
    }}>
      {/* لوغو */}
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        gap: 8,
      }}>
        <LinearGradient
          colors={['#a855f7', '#7c3aed']}
          style={{
            width: isTV ? 48 : 38,
            height: isTV ? 48 : 38,
            borderRadius: isTV ? 14 : 11,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: isTV ? 26 : 20 }}>M</Text>
        </LinearGradient>
        {isTV && (
          <Text style={{ color: C.text, fontWeight: '900', fontSize: 14 }}>MezStream</Text>
        )}
      </View>

      <View style={{ width: '80%', height: 1, backgroundColor: C.border, marginBottom: 8 }} />

      {/* عناصر القائمة */}
      {TABS.map((tab, i) => {
        const focused = state.index === i;
        return (
          <TouchableOpacity
            key={tab.name}
            style={{
              width: navWidth - 8,
              flexDirection: isTV ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: isTV ? 'flex-start' : 'center',
              paddingVertical: isTV ? 14 : 12,
              paddingHorizontal: isTV ? 16 : 4,
              borderRadius: 12,
              gap: isTV ? 14 : 4,
              backgroundColor: focused ? `${C.primary}22` : 'transparent',
              borderRightWidth: focused ? 3 : 0,
              borderRightColor: C.primary2,
            }}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={focused ? tab.iconOn : tab.iconOff}
              size={isTV ? 24 : 22}
              color={focused ? C.primary2 : C.textMuted}
            />
            <Text style={{
              fontSize: isTV ? 14 : 9,
              fontWeight: focused ? '800' : '500',
              color: focused ? C.primary2 : C.textMuted,
              textAlign: 'center',
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Adaptive Navigator ───────────────────────────────────────────────────────
function AdaptiveTabNavigator() {
  const { isSideNav, isTV } = useLayout();

  const tabBar = (props) => {
    if (isSideNav) {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            {props.children}
          </View>
          <SideNavBar {...props} isTV={isTV} />
        </View>
      );
    }
    return <BottomTabBar {...props} />;
  };

  return (
    <Tab.Navigator
      tabBar={tabBar}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"     component={HomeStack} />
      <Tab.Screen name="Browse"   component={BrowseStack} />
      <Tab.Screen name="Channels" component={ChannelsStack} />
      <Tab.Screen name="MyList"   component={MyListStack} />
      <Tab.Screen name="Account"  component={AccountStack} />
    </Tab.Navigator>
  );
}

// ─── Stack Navigators ─────────────────────────────────────────────────────────
function HomeStack() {
  const { colors: C } = useApp();
  const headerStyle = {
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    elevation: 0,
    shadowOpacity: 0,
  };
  return (
    <Stack.Navigator screenOptions={{
      headerStyle,
      headerTintColor: C.accent,
      cardStyle: { backgroundColor: C.bg },
    }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerLeft: () => (
            <View style={{ paddingLeft: 14 }}>
              <StreamLogo />
            </View>
          ),
          title: '',
        }}
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
}

function BrowseStack() {
  const { colors: C } = useApp();
  const headerStyle = {
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    elevation: 0,
    shadowOpacity: 0,
  };
  return (
    <Stack.Navigator screenOptions={{
      headerStyle,
      headerTintColor: C.accent,
      cardStyle: { backgroundColor: C.bg },
    }}>
      <Stack.Screen name="BrowseMain" component={BrowseScreen} options={{ title: 'تصفح' }} />
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
}

function ChannelsStack() {
  const { colors: C } = useApp();
  const headerStyle = {
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    elevation: 0,
    shadowOpacity: 0,
  };
  return (
    <Stack.Navigator screenOptions={{
      headerStyle,
      headerTintColor: C.accent,
      cardStyle: { backgroundColor: C.bg },
    }}>
      <Stack.Screen
        name="ChannelsMain"
        component={ChannelsScreen}
        options={{ title: 'القنوات' }}
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
}

function MyListStack() {
  const { colors: C } = useApp();
  const headerStyle = {
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    elevation: 0,
    shadowOpacity: 0,
  };
  return (
    <Stack.Navigator screenOptions={{
      headerStyle,
      headerTintColor: C.accent,
      cardStyle: { backgroundColor: C.bg },
    }}>
      <Stack.Screen
        name="MyListMain"
        component={MyListScreen}
        options={{ title: 'قائمتي' }}
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
}

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
    <Stack.Navigator screenOptions={{
      headerStyle,
      headerTintColor: C.accent,
      cardStyle: { backgroundColor: C.bg },
    }}>
      <Stack.Screen
        name="AccountMain"
        component={AccountScreen}
        options={{ title: 'حسابي' }}
      />
      <Stack.Screen
        name="MyList"
        component={MyListScreen}
        options={{ title: 'قائمتي' }}
      />
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
      <View style={{
        flex: 1,
        backgroundColor: '#0d0b1e',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
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
