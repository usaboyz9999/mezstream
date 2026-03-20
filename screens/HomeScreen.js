import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, FlatList, Dimensions, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CONTENT } from '../appdata/index.js';

const { width } = Dimensions.get('window');
const HERO_H = width * 0.58;
const CARD_W = width * 0.38;

const CATS = [
  { key: 'All',            icon: 'apps',           ar: 'الكل'             },
  { key: 'Live TV',        icon: 'radio',          ar: 'بث مباشر'         },
  { key: 'Arabic Series',  icon: 'tv',             ar: 'مسلسلات عربية'    },
  { key: 'Foreign Series', icon: 'film',           ar: 'مسلسلات أجنبية'   },
  { key: 'Arabic Movies',  icon: 'videocam',       ar: 'أفلام عربية'      },
  { key: 'Foreign Movies', icon: 'play-circle',    ar: 'أفلام أجنبية'     },
  { key: 'Sports',         icon: 'football',       ar: 'رياضة'            },
  { key: 'Kids',           icon: 'happy',          ar: 'أطفال'            },
];

function MarqueeBanner() {
  const { isRTL } = useApp();
  const translateX = useRef(new Animated.Value(0)).current;
  const TEXT = '⚡ MezStream   ✦   بث مباشر   ✦   أفلام   ✦   مسلسلات   ✦   رياضة   ✦   أطفال   ✦   HD & 4K   ✦   ';
  const TW = TEXT.length * 8.5;

  useEffect(() => {
    let a;
    const run = () => {
      translateX.setValue(0);
      a = Animated.timing(translateX, {
        toValue: -TW,
        duration: TW * 22,
        useNativeDriver: true,
        easing: Easing.linear,
      });
      a.start(({ finished }) => { if (finished) run(); });
    };
    run();
    return () => a?.stop();
  }, []);

  return (
    <View style={s.marqueeBanner}>
      <LinearGradient colors={['#2d0b5e', '#1a0533', '#2d0b5e']} style={StyleSheet.absoluteFill} />
      <View style={s.marqueeWrap}>
        <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={s.marqueeText}>{TEXT}</Text>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

function HeroSlider({ navigation }) {
  const { isRTL, colors: C, t, showModal, currentUser } = useApp();
  const featured = CONTENT.filter(c => c.badge).slice(0, 5);
  const [active, setActive] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % featured.length;
        Animated.timing(translateX, {
          toValue: -next * width,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
        return next;
      });
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleWatch = (item) => {
    if (!currentUser) {
      showModal({ type: 'info', title: t('signInRequired'), message: t('signInToWatch'),
        buttons: [{ text: t('cancel'), style: 'cancel' }, { text: t('signIn'), onPress: () => navigation.navigate('Account') }] });
      return;
    }
    navigation.navigate('Player', { item });
  };

  return (
    <View style={{ height: HERO_H, overflow: 'hidden' }}>
      <Animated.View style={{ flexDirection: 'row', width: width * featured.length, transform: [{ translateX }] }}>
        {featured.map((item, i) => (
          <View key={item.id} style={{ width, height: HERO_H }}>
            <LinearGradient colors={item.colors || ['#1a0533', '#0d0b1e']} style={StyleSheet.absoluteFill} />
            {item.image ? (
              <Image source={{ uri: item.image }} style={s.heroImg} resizeMode="cover" />
            ) : null}
            <LinearGradient colors={['transparent', 'rgba(13,11,30,0.95)']} style={s.heroOverlay} />
            <View style={[s.heroInfo, isRTL && { alignItems: 'flex-end' }]}>
              {item.isLive && (
                <View style={s.liveBadge}>
                  <View style={s.liveDot} />
                  <Text style={s.liveTxt}>مباشر</Text>
                </View>
              )}
              <Text style={[s.heroTitle, isRTL && { textAlign: 'right' }]}>{item.nameAr}</Text>
              <Text style={[s.heroDesc, isRTL && { textAlign: 'right' }]} numberOfLines={2}>{item.desc}</Text>
              <View style={[s.heroBtns, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity onPress={() => handleWatch(item)} activeOpacity={0.85}>
                  <LinearGradient colors={['#7c3aed', '#a855f7']} style={s.heroBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Ionicons name="play" size={16} color="#fff" />
                    <Text style={s.heroBtnTxt}>{t('watchNow')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={[s.heroBtn2, { borderColor: C.border }]}
                  onPress={() => navigation.navigate('Detail', { item })} activeOpacity={0.85}>
                  <Ionicons name="information-circle-outline" size={16} color="#fff" />
                  <Text style={s.heroBtn2Txt}>التفاصيل</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </Animated.View>
      {/* Dots */}
      <View style={s.heroDots}>
        {featured.map((_, i) => (
          <View key={i} style={[s.heroDot, i === active && s.heroDotActive]} />
        ))}
      </View>
    </View>
  );
}

function ContentCard({ item, onPress }) {
  const { colors: C } = useApp();
  const [err, setErr] = useState(false);
  return (
    <TouchableOpacity style={[s.card, { backgroundColor: C.bg2, borderColor: C.border }]} onPress={onPress} activeOpacity={0.85}>
      <View style={[s.cardImgWrap, { height: CARD_W * 1.4 }]}>
        <LinearGradient colors={item.colors || ['#1a0533', '#0d0b1e']} style={StyleSheet.absoluteFill} />
        {item.image && !err && (
          <Image source={{ uri: item.image }} style={s.cardImg} resizeMode="cover" onError={() => setErr(true)} />
        )}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={StyleSheet.absoluteFill} />
        {item.badge && (
          <View style={[s.cardBadge, { backgroundColor: item.badgeColor || '#7c3aed' }]}>
            <Text style={s.cardBadgeTxt}>{item.badge}</Text>
          </View>
        )}
        {item.isLive && (
          <View style={s.cardLive}>
            <View style={s.liveDot} /><Text style={s.cardLiveTxt}>مباشر</Text>
          </View>
        )}
        {item.quality && (
          <View style={[s.cardQuality, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
            <Text style={s.cardQualityTxt}>{item.quality}</Text>
          </View>
        )}
      </View>
      <View style={s.cardInfo}>
        <Text style={[s.cardName, { color: C.textSub }]} numberOfLines={2}>{item.nameAr}</Text>
        {item.rating && (
          <View style={s.ratingRow}>
            <Ionicons name="star" size={10} color="#fbbf24" />
            <Text style={[s.ratingTxt, { color: C.textMuted }]}>{item.rating}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function Section({ title, icon, data, navigation }) {
  const { colors: C, isRTL } = useApp();
  if (!data.length) return null;
  return (
    <View style={{ marginBottom: 4 }}>
      <View style={[s.secRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[s.secLeft, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name={icon} size={16} color={C.primary2} />
          <Text style={[s.secTitle, { color: C.text }]}>{title}</Text>
        </View>
        <TouchableOpacity style={[s.seeAllBtn, { borderColor: C.accent + '44' }]}
          onPress={() => navigation.navigate('Browse')}>
          <Text style={[s.seeAllTxt, { color: C.accent }]}>عرض الكل</Text>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={12} color={C.accent} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={i => String(i.id)}
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 14, gap: 10, paddingBottom: 8 }}
        renderItem={({ item }) => (
          <ContentCard item={item} onPress={() => navigation.navigate('Detail', { item })} />
        )}
      />
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { colors: C, isRTL, t, currentUser } = useApp();
  const live    = CONTENT.filter(c => c.cat === 'Live TV');
  const arSeries= CONTENT.filter(c => c.cat === 'Arabic Series');
  const frSeries= CONTENT.filter(c => c.cat === 'Foreign Series');
  const arMov   = CONTENT.filter(c => c.cat === 'Arabic Movies');
  const frMov   = CONTENT.filter(c => c.cat === 'Foreign Movies');
  const sports  = CONTENT.filter(c => c.cat === 'Sports');
  const trending = CONTENT.filter(c => c.rating >= 8.5);

  return (
    <View style={[s.container, { backgroundColor: C.bg }]}>
      <MarqueeBanner />
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroSlider navigation={navigation} />
        {/* كتشن الإحصاءات */}
        <View style={[s.statsBar, { backgroundColor: C.bg2, borderColor: C.border }]}>
          {[
            { icon: 'radio', val: `${live.length}+`, lbl: 'قنوات مباشرة' },
            { icon: 'film',  val: `${arMov.length + frMov.length}+`, lbl: 'فيلم' },
            { icon: 'tv',    val: `${arSeries.length + frSeries.length}+`, lbl: 'مسلسل' },
            { icon: 'star',  val: '4K', lbl: 'جودة عالية' },
          ].map((item, i, arr) => (
            <View key={i} style={[s.statItem, i < arr.length - 1 && { borderRightWidth: 1, borderRightColor: C.border }]}>
              <Ionicons name={item.icon} size={16} color={C.accent} />
              <Text style={[s.statVal, { color: C.text }]}>{item.val}</Text>
              <Text style={[s.statLbl, { color: C.textMuted }]}>{item.lbl}</Text>
            </View>
          ))}
        </View>

        <Section title="الأكثر مشاهدة" icon="flame" data={trending} navigation={navigation} />
        <Section title="بث مباشر" icon="radio" data={live} navigation={navigation} />
        <Section title="مسلسلات عربية" icon="tv" data={arSeries} navigation={navigation} />
        <Section title="مسلسلات أجنبية" icon="film" data={frSeries} navigation={navigation} />
        <Section title="أفلام عربية" icon="videocam" data={arMov} navigation={navigation} />
        <Section title="أفلام أجنبية" icon="play-circle" data={frMov} navigation={navigation} />
        <Section title="رياضة" icon="football" data={sports} navigation={navigation} />
        
        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  marqueeBanner: { height: 34, overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: 'rgba(124,58,237,0.4)' },
  marqueeWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  marqueeText: { fontSize: 11, fontWeight: '700', color: '#fbbf24', letterSpacing: 0.4, paddingVertical: 9, paddingHorizontal: 5 },
  heroImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%' },
  heroInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveTxt: { fontSize: 10, fontWeight: '900', color: '#fff' },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4, letterSpacing: -0.3 },
  heroDesc: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 12, lineHeight: 18 },
  heroBtns: { flexDirection: 'row', gap: 10 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  heroBtnTxt: { fontSize: 13, fontWeight: '800', color: '#fff' },
  heroBtn2: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  heroBtn2Txt: { fontSize: 13, fontWeight: '700', color: '#fff' },
  heroDots: { position: 'absolute', bottom: 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  heroDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  heroDotActive: { width: 16, backgroundColor: '#fbbf24' },
  statsBar: { flexDirection: 'row', marginHorizontal: 14, marginTop: 14, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 3 },
  statVal: { fontSize: 13, fontWeight: '900' },
  statLbl: { fontSize: 9, fontWeight: '600', letterSpacing: 0.2 },
  secRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 20, paddingBottom: 10 },
  secLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  secTitle: { fontSize: 16, fontWeight: '900', letterSpacing: -0.3 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(251,191,36,0.08)' },
  seeAllTxt: { fontSize: 11, fontWeight: '700' },
  card: { width: CARD_W, borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  cardImgWrap: { width: '100%', overflow: 'hidden' },
  cardImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  cardBadge: { position: 'absolute', top: 6, right: 6, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, zIndex: 3 },
  cardBadgeTxt: { fontSize: 8, fontWeight: '900', color: '#fff' },
  cardLive: { position: 'absolute', top: 6, left: 6, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, zIndex: 3 },
  cardLiveTxt: { fontSize: 8, fontWeight: '900', color: '#fff' },
  cardQuality: { position: 'absolute', bottom: 6, left: 6, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5, zIndex: 3 },
  cardQualityTxt: { fontSize: 8, fontWeight: '900', color: '#fbbf24' },
  cardInfo: { padding: 8 },
  cardName: { fontSize: 11, fontWeight: '700', lineHeight: 15, marginBottom: 4, minHeight: 28 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingTxt: { fontSize: 10, fontWeight: '600' },
});
