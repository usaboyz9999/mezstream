import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
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
import { BrowseScreen, DetailScreen, PlayerScreen, MyListScreen, AccountScreen } from './screens/OtherScreens';
import ChannelsScreen from './screens/ChannelsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ─── Header Logo ──────────────────────────────────────────────────────────────
function StreamLogo({ size = 34 }) {
  return (
    <LinearGradient
      colors={['#a855f7', '#7c3aed', '#5b21b6']}
      style={{ width: size, height: size, borderRadius: size * 0.28, alignItems: 'center', justifyContent: 'center', elevation: 8 }}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
      <Text style={{ fontSize: size * 0.6, fontWeight: '900', color: '#fff', includeFontPadding: false }}>M</Text>
    </LinearGradient>
  );
}

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }) {
  const { colors: C, isRTL, t } = useApp();
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'Home',     icon: 'home-outline',         iconActive: 'home',          label: 'الرئيسية' },
    { name: 'Browse',   icon: 'apps-outline',          iconActive: 'apps',          label: 'تصفح'     },
    { name: 'Channels', icon: 'tv-outline',            iconActive: 'tv',            label: 'القنوات'  },
    { name: 'MyList',   icon: 'heart-outline',         iconActive: 'heart',         label: 'قائمتي'   },
    { name: 'Account',  icon: 'person-outline',        iconActive: 'person',        label: 'حسابي'    },
  ];

  return (
    <View style={{ backgroundColor: C.bg2, borderTopWidth: 1, borderTopColor: C.border, paddingBottom: insets.bottom, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      {tabs.map((tab, i) => {
        const focused = state.index === i;
        return (
          <TouchableOpacity
            key={tab.name}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={focused ? tab.iconActive : tab.icon}
              size={22}
              color={focused ? C.primary2 : C.textMuted}
            />
            <Text style={{ fontSize: 10, fontWeight: focused ? '800' : '500', color: focused ? C.primary2 : C.textMuted, marginTop: 3 }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Stack Navigator ──────────────────────────────────────────────────────────
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
    <Stack.Navigator screenOptions={{ headerStyle, headerTintColor: C.accent, cardStyle: { backgroundColor: C.bg } }}>
      <Stack.Screen name="HomeMain" component={HomeScreen}
        options={{ headerLeft: () => <View style={{ paddingLeft: 14 }}><StreamLogo /></View>, title: '' }} />
      <Stack.Screen name="Detail" component={DetailScreen}
        options={({ route }) => ({ title: route.params?.item?.nameAr || '' })} />
      <Stack.Screen name="Player" component={PlayerScreen}
        options={{ title: 'مشغّل', headerShown: false }} />
    </Stack.Navigator>
  );
}

function BrowseStack() {
  const { colors: C } = useApp();
  const headerStyle = { backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border, elevation: 0, shadowOpacity: 0 };
  return (
    <Stack.Navigator screenOptions={{ headerStyle, headerTintColor: C.accent, cardStyle: { backgroundColor: C.bg } }}>
      <Stack.Screen name="BrowseMain" component={BrowseScreen} options={{ title: 'تصفح' }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={({ route }) => ({ title: route.params?.item?.nameAr || '' })} />
      <Stack.Screen name="Player" component={PlayerScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function ChannelsStack() {
  const { colors: C } = useApp();
  const headerStyle = { backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border, elevation: 0, shadowOpacity: 0 };
  return (
    <Stack.Navigator screenOptions={{ headerStyle, headerTintColor: C.accent, cardStyle: { backgroundColor: C.bg } }}>
      <Stack.Screen name="ChannelsMain" component={ChannelsScreen} options={{ title: 'القنوات' }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={({ route }) => ({ title: route.params?.item?.nameAr || '' })} />
      <Stack.Screen name="Player" component={PlayerScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MyListStack() {
  const { colors: C } = useApp();
  const headerStyle = { backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border, elevation: 0, shadowOpacity: 0 };
  return (
    <Stack.Navigator screenOptions={{ headerStyle, headerTintColor: C.accent, cardStyle: { backgroundColor: C.bg } }}>
      <Stack.Screen name="MyListMain" component={MyListScreen} options={{ title: 'قائمتي' }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={({ route }) => ({ title: route.params?.item?.nameAr || '' })} />
      <Stack.Screen name="Player" component={PlayerScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  const { colors: C } = useApp();
  const headerStyle = { backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border, elevation: 0, shadowOpacity: 0 };
  return (
    <Stack.Navigator screenOptions={{ headerStyle, headerTintColor: C.accent, cardStyle: { backgroundColor: C.bg } }}>
      <Stack.Screen name="AccountMain" component={AccountScreen} options={{ title: 'حسابي' }} />
      <Stack.Screen name="MyList" component={MyListScreen} options={{ title: 'قائمتي' }} />
    </Stack.Navigator>
  );
}

// ─── App Modal Root ───────────────────────────────────────────────────────────
function AppModalRoot() {
  const { modalVisible, modalConfig, hideModal, colors: C, isRTL } = useApp();
  return <AppModal visible={modalVisible} config={modalConfig} onClose={hideModal} colors={C} isRTL={isRTL} />;
}

// ─── App Content ──────────────────────────────────────────────────────────────
function AppContent() {
  const [splashDone, setSplashDone] = useState(false);
  const { isDark, colors: C } = useApp();
  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

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
        <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home"     component={HomeStack} />
          <Tab.Screen name="Browse"   component={BrowseStack} />
          <Tab.Screen name="Channels" component={ChannelsStack} />
          <Tab.Screen name="MyList"   component={MyListStack} />
          <Tab.Screen name="Account"  component={AccountStack} />
        </Tab.Navigator>
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