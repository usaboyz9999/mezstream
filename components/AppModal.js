// ─── AppModal.js — مكوّن النوافذ المخصصة ────────────────────────────────────
import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  StyleSheet, Animated, Easing, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// أيقونة لكل نوع
const ICONS = {
  success:  { name: 'checkmark-circle', color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  error:    { name: 'close-circle',     color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  warning:  { name: 'warning',          color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  info:     { name: 'information-circle',color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  confirm:  { name: 'help-circle',      color: '#a855f7', bg: 'rgba(168,85,247,0.12)'  },
  cart:     { name: 'cart',             color: '#a855f7', bg: 'rgba(168,85,247,0.12)'  },
  points:   { name: 'star',             color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  ticket:   { name: 'ticket',           color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  lock:     { name: 'lock-closed',      color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  card:     { name: 'card',             color: '#a855f7', bg: 'rgba(168,85,247,0.12)'  },
};

export default function AppModal({ visible, config, onClose, colors: C, isRTL }) {
  const scaleAnim   = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 120, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim,   { toValue: 0.88, duration: 160, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0,    duration: 160, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!config) return null;

  const {
    type = 'info',
    icon,
    title = '',
    message = '',
    buttons = [{ text: 'OK' }],
    emoji,
  } = config;

  const iconCfg = ICONS[icon || type] || ICONS.info;

  const handleBtn = (btn) => {
    onClose();
    if (btn.onPress) setTimeout(() => btn.onPress(), 180);
  };

  // تحديد ألوان الأزرار
  const getBtnStyle = (btn, idx, total) => {
    if (btn.style === 'destructive') return ['#ef4444', '#dc2626'];
    if (btn.style === 'cancel')      return [C.bg3 || '#1e1a2e', C.bg3 || '#1e1a2e'];
    if (total === 1)                 return [C.primary || '#7c3aed', C.primary2 || '#a855f7'];
    if (idx === total - 1)           return [C.primary || '#7c3aed', C.primary2 || '#a855f7'];
    return [C.bg3 || '#1e1a2e', C.bg3 || '#1e1a2e'];
  };

  const getBtnTextColor = (btn, idx, total) => {
    if (btn.style === 'cancel') return C.textMuted || '#9ca3af';
    return '#fff';
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {/* خلفية شفافة */}
      <TouchableOpacity
        style={ms.overlay}
        activeOpacity={1}
        onPress={() => {
          const hasCancel = config.buttons?.some(b => b.style === 'cancel');
          if (!hasCancel || config.buttons?.length === 1) onClose();
        }}
      >
        <Animated.View
          style={[ms.card, { backgroundColor: C.bg2 || '#1a1530', borderColor: C.border || '#2d2a4a', transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}
          onStartShouldSetResponder={() => true}
        >
          {/* أيقونة */}
          <View style={[ms.iconWrap, { backgroundColor: iconCfg.bg }]}>
            {emoji
              ? <Text style={{ fontSize: 34 }}>{emoji}</Text>
              : <Ionicons name={iconCfg.name} size={36} color={iconCfg.color} />}
          </View>

          {/* العنوان */}
          {!!title && (
            <Text style={[ms.title, { color: C.text || '#fff' }, isRTL && ms.rtl]}>
              {title}
            </Text>
          )}

          {/* الرسالة */}
          {!!message && (
            <Text style={[ms.message, { color: C.textMuted || '#9ca3af' }, isRTL && ms.rtl]}>
              {message}
            </Text>
          )}

          {/* الأزرار */}
          <View style={[ms.btns, buttons.length > 1 && { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {buttons.map((btn, idx) => {
              const colors = getBtnStyle(btn, idx, buttons.length);
              const isFlat = btn.style === 'cancel';
              return (
                <TouchableOpacity
                  key={idx}
                  style={[ms.btnWrap, buttons.length > 1 && { flex: 1 }]}
                  onPress={() => handleBtn(btn)}
                  activeOpacity={0.8}
                >
                  {isFlat ? (
                    <View style={[ms.btn, ms.btnFlat, { borderColor: C.border || '#2d2a4a' }]}>
                      <Text style={[ms.btnTxt, { color: C.textMuted || '#9ca3af' }]}>{btn.text}</Text>
                    </View>
                  ) : (
                    <LinearGradient colors={colors} style={ms.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      <Text style={[ms.btnTxt, { color: getBtnTextColor(btn, idx, buttons.length) }]}>{btn.text}</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const ms = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  btns: {
    width: '100%',
    gap: 10,
  },
  btnWrap: {},
  btn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFlat: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  rtl: { textAlign: 'right' },
});
