// mezstream/components/SideNav.js

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const TABS = [
  { name: 'Home',     iconOff: 'home-outline',   iconOn: 'home',   labelAr: 'الرئيسية' },
  { name: 'Browse',   iconOff: 'apps-outline',   iconOn: 'apps',   labelAr: 'تصفح'     },
  { name: 'Channels', iconOff: 'tv-outline',     iconOn: 'tv',     labelAr: 'القنوات'  },
  { name: 'MyList',   iconOff: 'heart-outline',  iconOn: 'heart',  labelAr: 'قائمتي'   },
  { name: 'Account',  iconOff: 'person-outline', iconOn: 'person', labelAr: 'حسابي'    },
];

export default function SideNav({ state, navigation, isTV }) {
  const { colors: C } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      s.container,
      {
        backgroundColor: C.bg2,
        borderRightWidth: 0,
        borderLeftWidth: 1,
        borderLeftColor: C.border,
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 8,
        width: isTV ? 220 : 72,
      }
    ]}>
      {/* لوغو */}
      <View style={[s.logoWrap, { width: isTV ? 220 : 72 }]}>
        <LinearGradient
          colors={['#a855f7', '#7c3aed']}
          style={[s.logo, { width: isTV ? 48 : 38, height: isTV ? 48 : 38, borderRadius: isTV ? 14 : 11 }]}
        >
          <Text style={[s.logoTxt, { fontSize: isTV ? 26 : 20 }]}>M</Text>
        </LinearGradient>
        {isTV && <Text style={[s.appName, { color: C.text }]}>MezStream</Text>}
      </View>

      <View style={s.divider} />

      {/* عناصر القائمة */}
      {TABS.map((tab, i) => {
        const focused = state.index === i;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[
              s.item,
              {
                width: isTV ? 220 : 72,
                backgroundColor: focused ? `${C.primary}22` : 'transparent',
                borderRightWidth: focused ? 3 : 0,
                borderRightColor: C.primary2,
                paddingHorizontal: isTV ? 20 : 0,
              }
            ]}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={focused ? tab.iconOn : tab.iconOff}
              size={isTV ? 26 : 22}
              color={focused ? C.primary2 : C.textMuted}
            />
            {isTV && (
              <Text style={[
                s.label,
                { color: focused ? C.primary2 : C.textMuted, fontSize: isTV ? 15 : 11 }
              ]}>
                {tab.labelAr}
              </Text>
            )}
            {!isTV && focused && (
              <View style={[s.activeDot, { backgroundColor: C.primary2 }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTxt: {
    color: '#fff',
    fontWeight: '900',
  },
  appName: {
    fontSize: 18,
    fontWeight: '900',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 14,
    position: 'relative',
  },
  label: {
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  activeDot: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});