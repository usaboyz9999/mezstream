import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, FlatList, TextInput, Dimensions, Linking, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CONTENT, PLANS } from '../appdata/index.js';

const { width } = Dimensions.get('window');

// ─── Browse Screen ────────────────────────────────────────────────────────────
const CATS = [
  { key: 'All',            ar: 'الكل',            icon: 'apps'        },
  { key: 'Live TV',        ar: 'بث مباشر',        icon: 'radio'       },
  { key: 'Arabic Series',  ar: 'مسلسلات عربية',   icon: 'tv'          },
  { key: 'Foreign Series', ar: 'مسلسلات أجنبية',  icon: 'film'        },
  { key: 'Arabic Movies',  ar: 'أفلام عربية',     icon: 'videocam'    },
  { key: 'Foreign Movies', ar: 'أفلام أجنبية',    icon: 'play-circle' },
  { key: 'Sports',         ar: 'رياضة',           icon: 'football'    },
  { key: 'Kids',           ar: 'أطفال',           icon: 'happy'       },
];

function SmallCard({ item, onPress, colors: C }) {
  const [err, setErr] = useState(false);
  const CARD = (width - 14 * 2 - 10) / 2;
  return (
    <TouchableOpacity style={[{ width: CARD, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: C.border, backgroundColor: C.bg2, marginBottom: 10 }]} onPress={onPress} activeOpacity={0.85}>
      <View style={{ height: CARD * 1.35 }}>
        <LinearGradient colors={item.colors || ['#1a0533','#0d0b1e']} style={StyleSheet.absoluteFill} />
        {item.image && !err && <Image source={{ uri: item.image }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} resizeMode="cover" onError={() => setErr(true)} />}
        <LinearGradient colors={['transparent','rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFill} />
        {item.badge && <View style={{ position: 'absolute', top: 6, right: 6, backgroundColor: item.badgeColor || '#7c3aed', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}><Text style={{ fontSize: 8, fontWeight: '900', color: '#fff' }}>{item.badge}</Text></View>}
        {item.isLive && <View style={{ position: 'absolute', top: 6, left: 6, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ef4444', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}><View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#fff' }} /><Text style={{ fontSize: 8, fontWeight: '900', color: '#fff' }}>مباشر</Text></View>}
        {item.quality && <View style={{ position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}><Text style={{ fontSize: 8, fontWeight: '900', color: '#fbbf24' }}>{item.quality}</Text></View>}
      </View>
      <View style={{ padding: 8 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.textSub, lineHeight: 15 }} numberOfLines={2}>{item.nameAr}</Text>
        {item.rating && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 }}><Ionicons name="star" size={9} color="#fbbf24" /><Text style={{ fontSize: 9, color: C.textMuted }}>{item.rating}</Text></View>}
      </View>
    </TouchableOpacity>
  );
}

export function BrowseScreen({ navigation }) {
  const { colors: C, isRTL } = useApp();
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = CONTENT.filter(c => {
    const matchCat = activeCat === 'All' || c.cat === activeCat;
    const matchQ = c.nameAr.includes(query) || c.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Search */}
      <View style={{ padding: 14, paddingBottom: 8 }}>
        <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', backgroundColor: C.bg2, borderRadius: 14, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 10, gap: 10 }]}>
          <Ionicons name="search" size={18} color={C.textMuted} />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: C.text, textAlign: isRTL ? 'right' : 'left' }}
            placeholder="ابحث عن قنوات وأفلام ومسلسلات..."
            placeholderTextColor={C.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          {!!query && <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={18} color={C.textMuted} /></TouchableOpacity>}
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, gap: 8, paddingBottom: 10 }}>
        {CATS.map(cat => {
          const active = activeCat === cat.key;
          return (
            <TouchableOpacity key={cat.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: active ? C.primary : C.border, backgroundColor: active ? `${C.primary}22` : C.bg2 }} onPress={() => setActiveCat(cat.key)}>
              <Ionicons name={cat.icon} size={14} color={active ? C.primary2 : C.textMuted} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: active ? C.primary2 : C.textMuted }}>{cat.ar}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={i => String(i.id)}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 24 }}
        columnWrapperStyle={{ gap: 10 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <SmallCard item={item} onPress={() => navigation.navigate('Detail', { item })} colors={C} />}
        ListEmptyComponent={<View style={{ alignItems: 'center', paddingTop: 60 }}><Ionicons name="search-outline" size={50} color={C.textMuted} /><Text style={{ color: C.textMuted, fontSize: 16, fontWeight: '700', marginTop: 12 }}>لا توجد نتائج</Text></View>}
      />
    </View>
  );
}

// ─── Detail Screen ────────────────────────────────────────────────────────────
export function DetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { colors: C, isRTL, isInList, toggleList, showModal, currentUser, t } = useApp();
  const inList = isInList(item.id);
  const [imgErr, setImgErr] = useState(false);

  const handleWatch = () => {
    if (!currentUser) {
      showModal({ type: 'info', title: t('signInRequired'), message: t('signInToWatch'),
        buttons: [{ text: t('cancel'), style: 'cancel' }, { text: t('signIn'), onPress: () => navigation.navigate('Account') }] });
      return;
    }
    navigation.navigate('Player', { item });
  };

  const handleList = () => {
    if (!currentUser) {
      showModal({ type: 'info', title: t('signInRequired'), message: t('signInToWatch'),
        buttons: [{ text: t('cancel'), style: 'cancel' }, { text: t('signIn'), onPress: () => navigation.navigate('Account') }] });
      return;
    }
    const added = toggleList(item.id);
    showModal({ type: added ? 'success' : 'info', emoji: added ? '❤️' : '💔', title: added ? t('addedToList') : t('removedFromList') });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={{ height: width * 0.6, position: 'relative' }}>
        <LinearGradient colors={item.colors || ['#1a0533','#0d0b1e']} style={StyleSheet.absoluteFill} />
        {item.image && !imgErr && <Image source={{ uri: item.image }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} resizeMode="cover" onError={() => setImgErr(true)} />}
        <LinearGradient colors={['transparent', C.bg]} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' }} />
        {item.isLive && (
          <View style={{ position: 'absolute', top: 16, left: 16, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' }} />
            <Text style={{ fontSize: 12, fontWeight: '900', color: '#fff' }}>مباشر الآن</Text>
          </View>
        )}
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '900', color: C.text, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>{item.nameAr}</Text>

        {/* Meta */}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          {item.year && <View style={[bt.metaPill, { borderColor: C.border }]}><Text style={{ fontSize: 11, color: C.textMuted }}>{item.year}</Text></View>}
          {item.quality && <View style={[bt.metaPill, { borderColor: C.primary, backgroundColor: `${C.primary}22` }]}><Text style={{ fontSize: 11, color: C.primary2, fontWeight: '700' }}>{item.quality}</Text></View>}
          {item.rating && <View style={[bt.metaPill, { borderColor: '#fbbf24' }]}><Ionicons name="star" size={11} color="#fbbf24" /><Text style={{ fontSize: 11, color: '#fbbf24', fontWeight: '700' }}>{item.rating}</Text></View>}
          {item.episodes && <View style={[bt.metaPill, { borderColor: C.border }]}><Ionicons name="list" size={11} color={C.textMuted} /><Text style={{ fontSize: 11, color: C.textMuted }}>{item.episodes} حلقة</Text></View>}
          {item.duration && <View style={[bt.metaPill, { borderColor: C.border }]}><Ionicons name="time-outline" size={11} color={C.textMuted} /><Text style={{ fontSize: 11, color: C.textMuted }}>{item.duration} د</Text></View>}
          {item.genre && <View style={[bt.metaPill, { borderColor: C.border }]}><Text style={{ fontSize: 11, color: C.textMuted }}>{item.genre.ar}</Text></View>}
        </View>

        <Text style={{ fontSize: 14, color: C.textMuted, lineHeight: 22, marginBottom: 20, textAlign: isRTL ? 'right' : 'left' }}>{item.desc}</Text>

        {/* Buttons */}
        <TouchableOpacity onPress={handleWatch} activeOpacity={0.85} style={{ marginBottom: 10 }}>
          <LinearGradient colors={['#7c3aed', '#a855f7']} style={bt.watchBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name={item.isLive ? 'radio' : 'play'} size={20} color="#fff" />
            <Text style={bt.watchBtnTxt}>{item.isLive ? 'شاهد البث المباشر' : t('watchNow')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleList} activeOpacity={0.85} style={[bt.listBtn, { borderColor: C.border, backgroundColor: C.bg2 }]}>
          <Ionicons name={inList ? 'heart' : 'heart-outline'} size={18} color={inList ? '#ef4444' : C.textMuted} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: inList ? '#ef4444' : C.textMuted }}>{inList ? t('removeFromList') : t('addToList')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const bt = StyleSheet.create({
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  watchBtn: { borderRadius: 15, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  watchBtnTxt: { fontSize: 15, fontWeight: '900', color: '#fff' },
  listBtn: { borderRadius: 15, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1 },
});

// ─── Player Screen ────────────────────────────────────────────────────────────
export function PlayerScreen({ route, navigation }) {
  const { item } = route.params;
  const { colors: C, addToHistory } = useApp();

  React.useEffect(() => {
    addToHistory(item);
    // فتح الرابط في المتصفح إذا كان HLS
    if (item.streamUrl) {
      Alert.alert(
        item.isLive ? '📡 بث مباشر' : '🎬 تشغيل',
        `${item.nameAr}\n\nيتم فتح البث في المشغّل الخارجي...`,
        [
          { text: 'إلغاء', style: 'cancel', onPress: () => navigation.goBack() },
          { text: 'تشغيل', onPress: () => { Linking.openURL(item.streamUrl); navigation.goBack(); } },
        ]
      );
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
      <LinearGradient colors={item.colors || ['#1a0533','#0d0b1e']} style={StyleSheet.absoluteFill} />
      <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.3)" />
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 16 }}>{item.nameAr}</Text>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 8 }}>جاري التحميل...</Text>
      <TouchableOpacity style={{ marginTop: 30, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }} onPress={() => navigation.goBack()}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>رجوع</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── My List Screen ───────────────────────────────────────────────────────────
export function MyListScreen({ navigation }) {
  const { colors: C, isRTL, getMyListContent, currentUser, t } = useApp();
  const list = getMyListContent();

  if (!currentUser) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
      <Ionicons name="heart-outline" size={60} color={C.textMuted} />
      <Text style={{ fontSize: 18, fontWeight: '800', color: C.text, marginTop: 16, marginBottom: 8 }}>قائمتي</Text>
      <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginBottom: 24 }}>سجّل دخولك لحفظ المحتوى المفضل لديك</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Account')} activeOpacity={0.85}>
        <LinearGradient colors={[C.primary, C.primary2]} style={{ paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>تسجيل الدخول</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (!list.length) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
      <Ionicons name="heart-outline" size={60} color={C.textMuted} />
      <Text style={{ fontSize: 18, fontWeight: '800', color: C.text, marginTop: 16, marginBottom: 8 }}>قائمتك فارغة</Text>
      <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center' }}>أضف محتوى مفضل لديك من خلال زر القلب</Text>
    </View>
  );

  const CARD = (width - 14 * 2 - 10) / 2;
  return (
    <FlatList
      data={list}
      keyExtractor={i => String(i.id)}
      numColumns={2}
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 14, gap: 0 }}
      columnWrapperStyle={{ gap: 10 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={{ width: CARD, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: C.border, backgroundColor: C.bg2, marginBottom: 10 }}
          onPress={() => navigation.navigate('Detail', { item })} activeOpacity={0.85}>
          <View style={{ height: CARD * 1.35 }}>
            <LinearGradient colors={item.colors || ['#1a0533','#0d0b1e']} style={StyleSheet.absoluteFill} />
            {item.image && <Image source={{ uri: item.image }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} resizeMode="cover" />}
            <LinearGradient colors={['transparent','rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFill} />
            {item.badge && <View style={{ position: 'absolute', top: 6, right: 6, backgroundColor: item.badgeColor || '#7c3aed', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}><Text style={{ fontSize: 8, fontWeight: '900', color: '#fff' }}>{item.badge}</Text></View>}
          </View>
          <View style={{ padding: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.textSub, lineHeight: 15 }} numberOfLines={2}>{item.nameAr}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

// ─── Account Screen ───────────────────────────────────────────────────────────
export function AccountScreen({ navigation }) {
  const { colors: C, isRTL, currentUser, login, register, logout, showModal, t } = useApp();
  const [mode, setMode] = useState('login'); // login | register
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const reset = () => { setName(''); setUsername(''); setEmail(''); setPassword(''); };

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      showModal({ type: 'error', title: t('error'), message: isRTL ? 'أدخل اسم المستخدم وكلمة المرور' : 'Enter username and password' });
      return;
    }
    const result = login(username.trim(), password);
    if (result.success) { showModal({ type: 'success', emoji: '👋', title: t('welcomeBack'), message: isRTL ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully' }); reset(); }
    else showModal({ type: 'error', title: t('error'), message: result.error });
  };

  const handleRegister = () => {
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      showModal({ type: 'error', title: t('error'), message: isRTL ? 'أكمل جميع الحقول' : 'Fill all fields' });
      return;
    }
    const result = register(name.trim(), username.trim(), email.trim(), password);
    if (result.success) { showModal({ type: 'success', emoji: '🎉', title: t('accountCreated'), message: t('canSignIn') }); reset(); setMode('login'); }
    else showModal({ type: 'error', title: t('error'), message: result.error });
  };

  if (currentUser) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <LinearGradient colors={['#1a0533', '#0d0b1e']} style={{ padding: 30, alignItems: 'center' }}>
        <LinearGradient colors={[C.primary, C.primary2]} style={{ width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff' }}>{currentUser.avatar}</Text>
        </LinearGradient>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 4 }}>{currentUser.name}</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>@{currentUser.username}</Text>
        <View style={{ marginTop: 10, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: currentUser.plan === 'premium' ? '#f59e0b22' : `${C.primary}22`, borderWidth: 1, borderColor: currentUser.plan === 'premium' ? '#f59e0b' : C.primary }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: currentUser.plan === 'premium' ? '#f59e0b' : C.primary2 }}>
            {currentUser.plan === 'premium' ? '⭐ مميز' : '🆓 مجاني'}
          </Text>
        </View>
      </LinearGradient>

      <View style={{ padding: 16, gap: 10 }}>
        {/* Subscription */}
        <View style={{ backgroundColor: C.bg2, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
          <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="star" size={18} color="#f59e0b" />
            <Text style={{ fontSize: 15, fontWeight: '800', color: C.text }}>الاشتراك</Text>
          </View>
          <View style={{ padding: 14, gap: 10 }}>
            {PLANS.map(plan => (
              <TouchableOpacity key={plan.id} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: currentUser.plan === plan.id ? plan.color : C.border, backgroundColor: currentUser.plan === plan.id ? `${plan.color}18` : C.bg3 }}
                onPress={() => showModal({ type: 'info', emoji: '⭐', title: plan.name.ar, message: isRTL ? `ترقية لخطة ${plan.name.ar} بـ $${plan.price} شهرياً` : `Upgrade to ${plan.name.en} for $${plan.price}/mo` })}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: plan.color }} />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{plan.name.ar}</Text>
                  {plan.popular && <View style={{ backgroundColor: `${plan.color}33`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}><Text style={{ fontSize: 9, fontWeight: '800', color: plan.color }}>الأشهر</Text></View>}
                </View>
                <Text style={{ fontSize: 14, fontWeight: '900', color: plan.color }}>${plan.price}<Text style={{ fontSize: 10, fontWeight: '400', color: C.textMuted }}>/شهر</Text></Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        {[
          { icon: 'time-outline', label: 'سجل المشاهدة', action: () => {} },
          { icon: 'heart-outline', label: 'قائمتي', action: () => navigation.navigate('MyList') },
          { icon: 'settings-outline', label: 'الإعدادات', action: () => {} },
          { icon: 'help-circle-outline', label: 'المساعدة والدعم', action: () => {} },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.bg2, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border }}
            onPress={item.action} activeOpacity={0.85}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name={item.icon} size={20} color={C.primary2} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{item.label}</Text>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#ef444444', backgroundColor: '#ef444411' }}
          onPress={() => { logout(); showModal({ type: 'info', title: t('loggedOut'), message: isRTL ? 'تم تسجيل الخروج بنجاح' : 'Signed out successfully' }); }} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#ef4444' }}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 28 }} />
    </ScrollView>
  );

  // Login / Register Form
  const Input = ({ icon, placeholder, value, onChangeText, secure }) => (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', backgroundColor: C.bg3, borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 12, gap: 10, marginBottom: 10 }}>
      <Ionicons name={icon} size={18} color={C.textMuted} />
      <TextInput style={{ flex: 1, fontSize: 14, color: C.text, textAlign: isRTL ? 'right' : 'left' }} placeholder={placeholder} placeholderTextColor={C.textMuted} value={value} onChangeText={onChangeText} secureTextEntry={secure && !showPw} autoCapitalize="none" />
      {secure && <TouchableOpacity onPress={() => setShowPw(!showPw)}><Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.textMuted} /></TouchableOpacity>}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <LinearGradient colors={['#1a0533', '#0d0b1e']} style={{ padding: 40, alignItems: 'center' }}>
        <LinearGradient colors={[C.primary, C.primary2]} style={{ width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Text style={{ fontSize: 40, fontWeight: '900', color: '#fff' }}>M</Text>
        </LinearGradient>
        <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 }}>
          <Text style={{ color: '#c084fc' }}>Mez</Text>Stream
        </Text>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>منصة البث المباشر والترفيه</Text>
      </LinearGradient>

      <View style={{ padding: 24 }}>
        {/* Mode Toggle */}
        <View style={{ flexDirection: 'row', backgroundColor: C.bg2, borderRadius: 14, padding: 4, marginBottom: 24, borderWidth: 1, borderColor: C.border }}>
          {['login','register'].map(m => (
            <TouchableOpacity key={m} style={{ flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center', backgroundColor: mode === m ? C.primary : 'transparent' }} onPress={() => setMode(m)}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: mode === m ? '#fff' : C.textMuted }}>{m === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {mode === 'register' && <Input icon="person-outline" placeholder="الاسم الكامل" value={name} onChangeText={setName} />}
        <Input icon="at-outline" placeholder="اسم المستخدم أو البريد" value={username} onChangeText={setUsername} />
        {mode === 'register' && <Input icon="mail-outline" placeholder="البريد الإلكتروني" value={email} onChangeText={setEmail} />}
        <Input icon="lock-closed-outline" placeholder="كلمة المرور" value={password} onChangeText={setPassword} secure />

        <TouchableOpacity onPress={mode === 'login' ? handleLogin : handleRegister} activeOpacity={0.88} style={{ marginTop: 8 }}>
          <LinearGradient colors={[C.primary, C.primary2]} style={{ borderRadius: 14, padding: 16, alignItems: 'center' }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={{ fontSize: 15, fontWeight: '900', color: '#fff' }}>{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Demo hint */}
        <View style={{ marginTop: 20, padding: 14, backgroundColor: `${C.primary}11`, borderRadius: 12, borderWidth: 1, borderColor: `${C.primary}33` }}>
          <Text style={{ fontSize: 12, color: C.textMuted, textAlign: 'center', marginBottom: 4 }}>حساب تجريبي</Text>
          <Text style={{ fontSize: 12, color: C.primary2, textAlign: 'center', fontWeight: '700' }}>admin / admin123</Text>
        </View>
      </View>
    </ScrollView>
  );
}
