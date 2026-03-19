import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const logoScale    = useRef(new Animated.Value(0)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const textY        = useRef(new Animated.Value(20)).current;
  const tagOpacity   = useRef(new Animated.Value(0)).current;
  const tagY         = useRef(new Animated.Value(12)).current;
  const loaderOpacity= useRef(new Animated.Value(0)).current;
  const screenOpacity= useRef(new Animated.Value(1)).current;
  const dot1         = useRef(new Animated.Value(1)).current;
  const dot2         = useRef(new Animated.Value(1)).current;
  const dot3         = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // نقاط التحميل — بدون loop لتجنب crash
    const dotAnim = Animated.loop(
      Animated.sequence([
        Animated.stagger(150, [
          Animated.sequence([
            Animated.timing(dot1, { toValue: 1.5, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(dot1, { toValue: 1,   duration: 300, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(dot2, { toValue: 1.5, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(dot2, { toValue: 1,   duration: 300, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(dot3, { toValue: 1.5, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(dot3, { toValue: 1,   duration: 300, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
          ]),
        ]),
        Animated.delay(400),
      ])
    );

    // تسلسل الظهور الرئيسي
    Animated.sequence([
      // 1. الشعار
      Animated.parallel([
        Animated.spring(logoScale,   { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // 2. الاسم
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(textY,       { toValue: 0, duration: 350, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
      // 3. الوصف
      Animated.parallel([
        Animated.timing(tagOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(tagY,       { toValue: 0, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
      // 4. نقاط التحميل
      Animated.timing(loaderOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(1500),
      // 5. اختفاء
      Animated.timing(screenOpacity, { toValue: 0, duration: 400, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]).start(() => onFinish());

    dotAnim.start();

    return () => dotAnim.stop();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* خلفية */}
      <LinearGradient
        colors={['#0d0a1e', '#160730', '#1e0a45', '#0d0a1e']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* الشعار */}
      <Animated.View style={{
        opacity: logoOpacity,
        transform: [{ scale: logoScale }],
        alignItems: 'center',
      }}>
        <LinearGradient
          colors={['#a855f7', '#7c3aed', '#5b21b6']}
          style={styles.logoBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.logoLetter}>M</Text>
        </LinearGradient>
      </Animated.View>

      {/* الاسم */}
      <Animated.View style={{
        opacity: textOpacity,
        transform: [{ translateY: textY }],
        alignItems: 'center',
        marginTop: 24,
      }}>
        <Text style={styles.appName}>
          <Text style={styles.appNameMez}>Mez</Text>
          <Text style={styles.appNameCards}>Cards</Text>
        </Text>
      </Animated.View>

      {/* الوصف */}
      <Animated.View style={{
        opacity: tagOpacity,
        transform: [{ translateY: tagY }],
        alignItems: 'center',
        marginTop: 10,
      }}>
        <View style={styles.taglinePill}>
          <Text style={styles.taglineAr}>منتجات رقمية · بطاقات هدايا</Text>
        </View>
      </Animated.View>

      {/* نقاط التحميل */}
      <Animated.View style={[styles.loader, { opacity: loaderOpacity }]}>
        {[
          { dot: dot1, color: '#7c3aed' },
          { dot: dot2, color: '#a855f7' },
          { dot: dot3, color: '#c084fc' },
        ].map(({ dot, color }, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { backgroundColor: color, transform: [{ scale: dot }] }]}
          />
        ))}
      </Animated.View>

      {/* زر تخطي */}
      <TouchableOpacity style={styles.skipBtn} onPress={onFinish} activeOpacity={0.7}>
        <Text style={styles.skipText}>تخطي ›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 110,
    height: 110,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
  },
  logoLetter: {
    fontSize: 68,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -3,
    includeFontPadding: false,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  appNameMez: {
    color: '#c084fc',
  },
  appNameCards: {
    color: '#ffffff',
  },
  taglinePill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.35)',
    backgroundColor: 'rgba(124,58,237,0.12)',
  },
  taglineAr: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  loader: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 52,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  skipBtn: {
    position: 'absolute',
    bottom: 44,
    right: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  skipText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    fontWeight: '600',
  },
});
