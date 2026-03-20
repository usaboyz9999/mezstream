import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, FlatList, Dimensions, TextInput,
  Animated, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
// ══════════════════════════════════════════════════════════════════════
// استيراد ملف القنوات — يجب أن يكون موجوداً في appdata/playlist.js
// ══════════════════════════════════════════════════════════════════════
import M3U_CONTENT from '../appdata/playlist.js';
import M3U_CONTENT2 from '../appdata/playlist2.js';
// ══════════════════════════════════════════════════════════════════════
// لإضافة ملفات M3U إضافية:
// 1. أضف الملف في appdata/ مثلاً: appdata/playlist2.js
// 2. أضفه في القائمة أدناه باسم مخصص
// ══════════════════════════════════════════════════════════════════════
const M3U_PLAYLISTS = [
  // { name: 'اسم القائمة', content: M3U_CONTENT },
  // { name: 'قائمة رياضة', content: M3U_SPORTS },
  // { name: 'قائمة أفلام', content: M3U_MOVIES },
  { name: 'قائمتي', content: M3U_CONTENT },
  { name: 'جديد', content: M3U_CONTENT2 },
];
// ══════════════════════════════════════════════════════════════════════

const { width } = Dimensions.get('window');
const GROUP_W = (width - 14 * 2 - 10) / 2;
const CH_W    = (width - 14 * 2 - 10 * 3) / 4;

// ─── ألوان المجموعات التلقائية ──────────────────────────────────────
const GROUP_STYLES = [
  { keys:['mbc'],         color:'#e63946', colors:['#1a1a2e','#e63946'], icon:'tv'            },
  { keys:['rotana'],      color:'#d4af37', colors:['#0f0f0f','#d4af37'], icon:'musical-notes' },
  { keys:['bein','بي إن'],color:'#e63946', colors:['#0d1b2a','#e63946'], icon:'football'      },
  { keys:['osn'],         color:'#7c3aed', colors:['#1a1a2e','#7c3aed'], icon:'film'          },
  { keys:['ssc'],         color:'#1565c0', colors:['#0d1b2a','#1565c0'], icon:'trophy'        },
  { keys:['jazeera','جزيرة'], color:'#d4a017', colors:['#0a1628','#d4a017'], icon:'globe'    },
  { keys:['abu dhabi','أبوظبي'], color:'#006400', colors:['#1a1a1a','#006400'], icon:'business'},
  { keys:['dubai','دبي'], color:'#c9a84c', colors:['#1a1a1a','#c9a84c'], icon:'business'      },
  { keys:['news','أخبار','نيوز'], color:'#3b82f6', colors:['#0d1b2a','#3b82f6'], icon:'newspaper'},
  { keys:['saudi','سعود'], color:'#006400', colors:['#006400','#1a1a1a'], icon:'flag'         },
  { keys:['religious','ديني','مكة','مدينة','islam','quran','قرآن'], color:'#10b981', colors:['#006400','#d4af37'], icon:'moon'},
  { keys:['kids','أطفال','children','طيور'], color:'#ff6b6b', colors:['#ff6b6b','#ffd93d'], icon:'happy'},
  { keys:['egypt','مصر','nile','نيل'],       color:'#c8a84b', colors:['#0a5c36','#c8a84b'], icon:'tv'  },
  { keys:['sport','رياضة','كأس','كرة'],      color:'#e63946', colors:['#0d1b2a','#e63946'], icon:'football'},
  { keys:['music','موسيقى','clip','كليب'],   color:'#ff69b4', colors:['#1a1a1a','#ff69b4'], icon:'musical-notes'},
  { keys:['movie','أفلام','cinema','سينما'], color:'#d4af37', colors:['#0f0f0f','#d4af37'], icon:'film'},
  { keys:['doc','وثائق','وثائقي'],           color:'#2ecc71', colors:['#1a1a1a','#2ecc71'], icon:'book'},
  { keys:['gulf','خليج','kuwait','كويت'],    color:'#d4af37', colors:['#1a1a1a','#d4af37'], icon:'flag'},
  { keys:['leb','لبنان','lebanese'],         color:'#e63946', colors:['#1a1a1a','#e63946'], icon:'tv'  },
  { keys:['syria','سوريا','سورية'],          color:'#c8a84b', colors:['#1a1a1a','#c8a84b'], icon:'tv'  },
  { keys:['iraq','عراق'],                    color:'#d4af37', colors:['#1a1a1a','#d4af37'], icon:'tv'  },
  { keys:['morocco','مغرب','maghreb'],       color:'#e63946', colors:['#006400','#e63946'], icon:'tv'  },
  { keys:['turkey','تركي','turkish'],        color:'#e63946', colors:['#e63946','#ffffff'], icon:'tv'  },
  { keys:['indian','هندي','bollywood'],      color:'#ff6600', colors:['#ff6b6b','#ffd93d'], icon:'film'},
  { keys:['france','فرانس','fr24'],          color:'#003087', colors:['#003087','#e63946'], icon:'globe'},
  { keys:['rt ','russia'],                   color:'#8b0000', colors:['#8b0000','#1a1a1a'], icon:'globe'},
  { keys:['bbc'],                            color:'#8b0000', colors:['#8b0000','#1a1a1a'], icon:'globe'},
  { keys:['dw ','deutsche'],                 color:'#003087', colors:['#003087','#1a1a1a'], icon:'globe'},
];

const FALLBACK_COLORS = [
  {color:'#7c3aed',colors:['#1a0533','#7c3aed'],icon:'tv'},
  {color:'#0891b2',colors:['#0a1628','#0891b2'],icon:'tv'},
  {color:'#059669',colors:['#0a1f14','#059669'],icon:'tv'},
  {color:'#dc2626',colors:['#1a0a0a','#dc2626'],icon:'tv'},
  {color:'#d97706',colors:['#1a1200','#d97706'],icon:'tv'},
  {color:'#7c3aed',colors:['#1a0a3b','#a855f7'],icon:'tv'},
];

function getGroupStyle(name) {
  const lower = (name || '').toLowerCase();
  for (const s of GROUP_STYLES) {
    if (s.keys.some(k => lower.includes(k))) return s;
  }
  let hash = 0;
  for (const c of lower) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

// ─── محلل M3U ───────────────────────────────────────────────────────
function parseM3U(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const result = [];
  let meta = null;

  for (const line of lines) {
    if (line.startsWith('#EXTINF:')) {
      meta = {
        name:  (line.match(/,(.+)$/)              ?.[1] || '').trim(),
        logo:   line.match(/tvg-logo="([^"]*)"/)  ?.[1] || '',
        group:  line.match(/group-title="([^"]*)"/) ?.[1] || 'Other',
        id:     line.match(/tvg-id="([^"]*)"/)    ?.[1] || '',
      };
    } else if ((line.startsWith('http') || line.startsWith('rtmp') || line.startsWith('rtsp')) && meta) {
      result.push({ ...meta, streamUrl: line.trim() });
      meta = null;
    }
  }
  return result;
}

// ─── بناء المجموعات الفرعية داخل القائمة ────────────────────────────
function buildSubGroups(channels) {
  const map = {};
  for (const ch of channels) {
    const g = ch.group || 'Other';
    if (!map[g]) map[g] = [];
    map[g].push(ch);
  }
  return Object.entries(map)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([name, chs], idx) => {
      const style = getGroupStyle(name);
      const cover = chs.find(c => c.logo)?.logo || '';
      return {
        id:       `sub_${idx}`,
        nameAr:   name,
        icon:     style.icon,
        color:    style.color,
        colors:   style.colors,
        image:    cover,
        channels: chs.map((c, i) => ({
          id:        `${idx}_${i}`,
          name:      c.name || 'قناة',
          image:     c.logo || '',
          colors:    style.colors,
          streamUrl: c.streamUrl,
        })),
      };
    });
}

// ─── بناء جميع القوائم ───────────────────────────────────────────────
function buildAllPlaylists() {
  return M3U_PLAYLISTS
    .filter(p => p.content && p.content.includes('#EXTINF'))
    .map((p, idx) => {
      const channels  = parseM3U(p.content);
      const subGroups = buildSubGroups(channels);
      const cover     = channels.find(c => c.logo)?.logo || '';
      // لون مختلف لكل قائمة
      const palettes  = [
        { color:'#7c3aed', colors:['#1a0533','#7c3aed'] },
        { color:'#e63946', colors:['#1a0a0a','#e63946'] },
        { color:'#0891b2', colors:['#0a1628','#0891b2'] },
        { color:'#059669', colors:['#0a1f14','#059669'] },
        { color:'#d97706', colors:['#1a1200','#d97706'] },
        { color:'#db2777', colors:['#1a0a14','#db2777'] },
      ];
      const palette = palettes[idx % palettes.length];
      return {
        id:        `playlist_${idx}`,
        nameAr:    p.name,
        icon:      'list',
        color:     palette.color,
        colors:    palette.colors,
        image:     cover,
        totalCh:   channels.length,
        subGroups,
        channels:  channels.map((c, i) => ({
          id:        `${idx}_${i}`,
          name:      c.name || 'قناة',
          image:     c.logo || '',
          colors:    getGroupStyle(c.group).colors,
          streamUrl: c.streamUrl,
          group:     c.group,
        })),
      };
    });
}

// ─── بطاقة مجموعة ───────────────────────────────────────────────────
function GroupCard({ group, onPress, C }) {
  const [err, setErr] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ transform:[{scale}], width: GROUP_W }}>
      <TouchableOpacity activeOpacity={1} onPress={onPress}
        onPressIn={()=>Animated.spring(scale,{toValue:0.95,useNativeDriver:true}).start()}
        onPressOut={()=>Animated.spring(scale,{toValue:1,useNativeDriver:true}).start()}
        style={[st.groupCard,{borderColor:`${group.color}55`}]}>
        <View style={st.groupImgWrap}>
          <LinearGradient colors={group.colors} style={StyleSheet.absoluteFill}/>
          {!!group.image && !err &&
            <Image source={{uri:group.image}} style={st.fillImg} resizeMode="cover" onError={()=>setErr(true)}/>}
          <LinearGradient colors={['transparent','rgba(0,0,0,0.9)']} style={StyleSheet.absoluteFill}/>
          <View style={[st.iconBadge,{backgroundColor:`${group.color}cc`}]}>
            <Ionicons name={group.icon} size={15} color="#fff"/>
          </View>
          <View style={st.countBadge}>
            <Text style={st.countNum}>{group.channels.length}</Text>
            <Text style={st.countLbl}>قناة</Text>
          </View>
        </View>
        <LinearGradient colors={[`${group.color}33`,'transparent']}
          style={st.groupFooter} start={{x:0,y:0}} end={{x:1,y:0}}>
          <Text style={st.groupName} numberOfLines={2}>{group.nameAr}</Text>
          <Ionicons name="chevron-forward" size={13} color={group.color}/>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── بطاقة قناة ─────────────────────────────────────────────────────
function ChannelCard({ channel, onPress, C }) {
  const [err, setErr] = useState(false);
  return (
    <TouchableOpacity style={[st.chCard,{backgroundColor:C.bg2,borderColor:C.border}]}
      onPress={onPress} activeOpacity={0.8}>
      <View style={st.chImgWrap}>
        <LinearGradient colors={channel.colors||['#1a1a2e','#7c3aed']} style={StyleSheet.absoluteFill}/>
        {!!channel.image && !err &&
          <Image source={{uri:channel.image}} style={st.fillImg} resizeMode="cover" onError={()=>setErr(true)}/>}
        <LinearGradient colors={['transparent','rgba(0,0,0,0.55)']} style={StyleSheet.absoluteFill}/>
        {channel.streamUrl
          ? <View style={st.liveDot}><View style={st.liveDotInner}/></View>
          : null}
      </View>
      <View style={{padding:5}}>
        <Text style={[st.chName,{color:C.textSub}]} numberOfLines={2}>{channel.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── بطاقة مجموعة فرعية ─────────────────────────────────────────────
function SubGroupCard({ group, onPress, C }) {
  const [err, setErr] = useState(false);
  return (
    <TouchableOpacity
      style={[st.subCard, {borderColor:`${group.color}44`, backgroundColor:C.bg2}]}
      onPress={onPress} activeOpacity={0.85}
    >
      <View style={st.subImgWrap}>
        <LinearGradient colors={group.colors} style={StyleSheet.absoluteFill}/>
        {!!group.image && !err &&
          <Image source={{uri:group.image}} style={st.fillImg} resizeMode="cover" onError={()=>setErr(true)}/>}
        <LinearGradient colors={['transparent','rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill}/>
        <View style={[st.subIconBadge,{backgroundColor:`${group.color}cc`}]}>
          <Ionicons name={group.icon} size={12} color="#fff"/>
        </View>
      </View>
      <View style={st.subFooter}>
        <Text style={[st.subName,{color:C.textSub}]} numberOfLines={2}>{group.nameAr}</Text>
        <Text style={[st.subCount,{color:group.color}]}>{group.channels.length} قناة</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── شاشة قنوات مجموعة فرعية ────────────────────────────────────────
function SubGroupView({ group, onBack, navigation, C }) {
  const [q, setQ] = useState('');
  const list = q
    ? group.channels.filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
    : group.channels;

  const play = ch => navigation.navigate('Player', {
    item: { id:ch.id, nameAr:ch.name, name:ch.name, image:ch.image, colors:ch.colors, streamUrl:ch.streamUrl, isLive:true, desc:`قناة ${ch.name} المباشرة` }
  });

  return (
    <View style={{flex:1}}>
      <LinearGradient colors={[group.colors[0],`${group.colors[1]}99`]} style={st.innerHeader}>
        <TouchableOpacity onPress={onBack} style={st.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff"/>
        </TouchableOpacity>
        <View style={{flex:1,marginHorizontal:12}}>
          <Text style={st.innerTitle}>{group.nameAr}</Text>
          <Text style={st.innerSub}>{group.channels.length} قناة</Text>
        </View>
        <View style={[st.innerIcon,{backgroundColor:`${group.color}cc`}]}>
          <Ionicons name={group.icon} size={20} color="#fff"/>
        </View>
      </LinearGradient>
      <View style={[st.innerSearch,{backgroundColor:C.bg2,borderColor:C.border}]}>
        <Ionicons name="search" size={15} color={C.textMuted}/>
        <TextInput style={{flex:1,color:C.text,fontSize:13,textAlign:'right',marginHorizontal:8}}
          placeholder={`ابحث في ${group.nameAr}...`} placeholderTextColor={C.textMuted}
          value={q} onChangeText={setQ}/>
        {!!q && <TouchableOpacity onPress={()=>setQ('')}><Ionicons name="close-circle" size={15} color={C.textMuted}/></TouchableOpacity>}
      </View>
      <FlatList data={list} keyExtractor={c=>c.id} numColumns={4}
        contentContainerStyle={{padding:14,paddingBottom:32}}
        columnWrapperStyle={{gap:10,marginBottom:10}}
        showsVerticalScrollIndicator={false}
        renderItem={({item})=><ChannelCard channel={item} onPress={()=>play(item)} C={C}/>}/>
    </View>
  );
}

// ─── شاشة القائمة الرئيسية (المجموعات الفرعية) ──────────────────────
function GroupView({ group, onBack, navigation, C }) {
  const [q, setQ]               = useState('');
  const [activeSub, setActiveSub] = useState(null);

  // فتح مجموعة فرعية
  if (activeSub) return (
    <SubGroupView group={activeSub} onBack={()=>setActiveSub(null)} navigation={navigation} C={C}/>
  );

  const subGroups = group.subGroups || [];
  const filtered  = q
    ? subGroups.filter(sg =>
        sg.nameAr.toLowerCase().includes(q.toLowerCase()) ||
        sg.channels.some(c => c.name.toLowerCase().includes(q.toLowerCase()))
      )
    : subGroups;

  const play = ch => navigation.navigate('Player', {
    item: { id:ch.id, nameAr:ch.name, name:ch.name, image:ch.image, colors:ch.colors, streamUrl:ch.streamUrl, isLive:true, desc:`قناة ${ch.name} المباشرة` }
  });

  return (
    <View style={{flex:1}}>
      {/* هيدر القائمة */}
      <LinearGradient colors={['#1a0533','#2d0b5e']} style={st.innerHeader}>
        <TouchableOpacity onPress={onBack} style={st.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff"/>
        </TouchableOpacity>
        <View style={{flex:1,marginHorizontal:12}}>
          <Text style={st.innerTitle}>{group.nameAr}</Text>
          <Text style={st.innerSub}>
            {subGroups.length} مجموعة · {group.totalCh} قناة
          </Text>
        </View>
        <LinearGradient colors={['#7c3aed','#a855f7']} style={st.innerIcon}>
          <Ionicons name="list" size={20} color="#fff"/>
        </LinearGradient>
      </LinearGradient>

      {/* بحث */}
      <View style={[st.innerSearch,{backgroundColor:C.bg2,borderColor:C.border}]}>
        <Ionicons name="search" size={15} color={C.textMuted}/>
        <TextInput style={{flex:1,color:C.text,fontSize:13,textAlign:'right',marginHorizontal:8}}
          placeholder="ابحث عن مجموعة أو قناة..."
          placeholderTextColor={C.textMuted} value={q} onChangeText={setQ}/>
        {!!q && <TouchableOpacity onPress={()=>setQ('')}><Ionicons name="close-circle" size={15} color={C.textMuted}/></TouchableOpacity>}
      </View>

      {/* شبكة المجموعات الفرعية */}
      <FlatList
        data={filtered}
        keyExtractor={g => g.id}
        numColumns={3}
        contentContainerStyle={{padding:12,paddingBottom:32}}
        columnWrapperStyle={{gap:9,marginBottom:9}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          // إذا بحث وما فيه مجموعات — عرض قنوات مباشرة
          q ? (
            <FlatList
              data={group.channels.filter(c=>c.name.toLowerCase().includes(q.toLowerCase()))}
              keyExtractor={c=>c.id} numColumns={4}
              contentContainerStyle={{padding:14,paddingBottom:32}}
              columnWrapperStyle={{gap:10,marginBottom:10}}
              renderItem={({item})=><ChannelCard channel={item} onPress={()=>play(item)} C={C}/>}/>
          ) : (
            <View style={{alignItems:'center',paddingTop:40}}>
              <Text style={{color:C.textMuted}}>لا توجد نتائج</Text>
            </View>
          )
        }
        renderItem={({item}) => (
          <SubGroupCard group={item} onPress={()=>setActiveSub(item)} C={C}/>
        )}
      />
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════════════════
export default function ChannelsScreen({ navigation }) {
  const { colors: C } = useApp();
  const [groups,      setGroups]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    try {
      const playlists = buildAllPlaylists();
      if (playlists.length === 0) {
        setError('لم يتم العثور على قنوات — تأكد من ملفات appdata/playlist.js');
      } else {
        setGroups(playlists);
      }
    } catch (e) {
      setError('خطأ في قراءة الملف: ' + e.message);
    }
    setLoading(false);
  }, []);

  const totalCh = groups.reduce((s,g)=>s+g.channels.length, 0);

  // فتح مجموعة
  if (activeGroup) return (
    <View style={[st.root,{backgroundColor:C.bg}]}>
      <GroupView group={activeGroup} onBack={()=>setActiveGroup(null)} navigation={navigation} C={C}/>
    </View>
  );

  const filtered = search.trim()
    ? groups.filter(g =>
        g.nameAr.toLowerCase().includes(search.toLowerCase()) ||
        g.channels.some(c => c.name.toLowerCase().includes(search.toLowerCase()))
      )
    : groups;

  return (
    <View style={[st.root,{backgroundColor:C.bg}]}>
      {/* ── Header ── */}
      <LinearGradient colors={['#1a0533','#0d0b1e']} style={st.header}>
        <View style={st.statsRow}>
          {[
            {icon:'layers', val: loading ? '...' : String(groups.length), lbl:'مجموعة'},
            {icon:'tv',     val: loading ? '...' : String(totalCh),       lbl:'قناة'},
            {icon:'radio',  val:'مباشر',                                   lbl:'بث حي'},
          ].map((s,i) => (
            <View key={i} style={st.statItem}>
              <LinearGradient colors={['#7c3aed','#a855f7']} style={st.statIcon}>
                <Ionicons name={s.icon} size={14} color="#fff"/>
              </LinearGradient>
              <Text style={st.statVal}>{s.val}</Text>
              <Text style={st.statLbl}>{s.lbl}</Text>
            </View>
          ))}
        </View>

        <View style={[st.searchBar,{backgroundColor:'rgba(255,255,255,0.08)',borderColor:'rgba(255,255,255,0.15)'}]}>
          <Ionicons name="search" size={16} color="rgba(255,255,255,0.5)"/>
          <TextInput style={{flex:1,color:'#fff',fontSize:13,textAlign:'right',marginHorizontal:8}}
            placeholder="ابحث عن مجموعة أو قناة..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={search} onChangeText={setSearch}/>
          {!!search && <TouchableOpacity onPress={()=>setSearch('')}>
            <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.5)"/>
          </TouchableOpacity>}
        </View>
      </LinearGradient>

      {/* ── Loading ── */}
      {loading && (
        <View style={st.center}>
          <ActivityIndicator size="large" color="#a855f7"/>
          <Text style={{color:'#a855f7',marginTop:14,fontSize:14,fontWeight:'700'}}>
            جاري تحميل القنوات...
          </Text>
        </View>
      )}

      {/* ── Error ── */}
      {!loading && !!error && (
        <View style={st.center}>
          <Ionicons name="document-outline" size={60} color="#ef4444"/>
          <Text style={{color:'#ef4444',marginTop:14,fontSize:15,fontWeight:'700',textAlign:'center'}}>
            لم يتم العثور على ملف القنوات
          </Text>
          <View style={[st.instructBox,{backgroundColor:'#ffffff11',borderColor:'#ffffff22'}]}>
            <Text style={{color:'#fff',fontSize:13,fontWeight:'800',marginBottom:8,textAlign:'center'}}>
              📋 كيفية الإضافة:
            </Text>
            <Text style={{color:'rgba(255,255,255,0.75)',fontSize:12,lineHeight:20,textAlign:'right'}}>
              {'1. أنشئ مجلد assets في المشروع\n'}
              {'2. ارفع ملف M3U باسم playlist.m3u\n'}
              {'3. أعد تشغيل التطبيق'}
            </Text>
          </View>
        </View>
      )}

      {/* ── شبكة المجموعات ── */}
      {!loading && !error && (
        <FlatList
          data={filtered}
          keyExtractor={g => g.id}
          numColumns={2}
          contentContainerStyle={st.grid}
          columnWrapperStyle={{gap:10,marginBottom:10}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={st.center}>
              <Ionicons name="search-outline" size={48} color={C.textMuted}/>
              <Text style={{color:C.textMuted,marginTop:12,fontSize:14}}>لا توجد نتائج</Text>
            </View>
          }
          renderItem={({item}) => (
            <GroupCard group={item} onPress={()=>setActiveGroup(item)} C={C}/>
          )}
        />
      )}
    </View>
  );
}

const st = StyleSheet.create({
  root:         {flex:1},
  header:       {padding:16,paddingTop:18,paddingBottom:14,gap:10},
  statsRow:     {flexDirection:'row',justifyContent:'space-around'},
  statItem:     {alignItems:'center',gap:4},
  statIcon:     {width:32,height:32,borderRadius:10,alignItems:'center',justifyContent:'center'},
  statVal:      {fontSize:14,fontWeight:'900',color:'#fff'},
  statLbl:      {fontSize:9,color:'rgba(255,255,255,0.5)',fontWeight:'600'},
  searchBar:    {flexDirection:'row',alignItems:'center',borderRadius:12,borderWidth:1,paddingHorizontal:12,paddingVertical:9,gap:6},
  center:       {flex:1,alignItems:'center',justifyContent:'center',padding:30},
  instructBox:  {marginTop:20,padding:16,borderRadius:14,borderWidth:1,width:'100%'},
  grid:         {padding:14,paddingBottom:32},
  groupCard:    {borderRadius:18,overflow:'hidden',borderWidth:1.5,width:GROUP_W},
  groupImgWrap: {height:130,position:'relative'},
  fillImg:      {position:'absolute',top:0,left:0,right:0,bottom:0,width:'100%',height:'100%'},
  iconBadge:    {position:'absolute',top:10,left:10,width:30,height:30,borderRadius:9,alignItems:'center',justifyContent:'center'},
  countBadge:   {position:'absolute',top:8,right:8,backgroundColor:'rgba(0,0,0,0.72)',paddingHorizontal:7,paddingVertical:3,borderRadius:8,alignItems:'center'},
  countNum:     {fontSize:13,fontWeight:'900',color:'#fbbf24'},
  countLbl:     {fontSize:8,color:'rgba(255,255,255,0.6)'},
  groupFooter:  {flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:10,paddingTop:9,paddingBottom:11},
  groupName:    {fontSize:12,fontWeight:'800',color:'#fff',flex:1,textAlign:'right',marginLeft:4},
  innerHeader:  {flexDirection:'row',alignItems:'center',padding:14,paddingTop:16,paddingBottom:14},
  backBtn:      {width:38,height:38,borderRadius:12,backgroundColor:'rgba(255,255,255,0.15)',alignItems:'center',justifyContent:'center'},
  innerTitle:   {fontSize:17,fontWeight:'900',color:'#fff',textAlign:'right'},
  innerSub:     {fontSize:11,color:'rgba(255,255,255,0.6)',textAlign:'right',marginTop:2},
  innerIcon:    {width:44,height:44,borderRadius:13,alignItems:'center',justifyContent:'center'},
  innerSearch:  {margin:12,marginTop:4,flexDirection:'row',alignItems:'center',borderRadius:12,borderWidth:1,paddingHorizontal:12,paddingVertical:9,gap:8},
  chCard:       {width:CH_W,borderRadius:12,overflow:'hidden',borderWidth:1},
  chImgWrap:    {height:CH_W,position:'relative'},
  liveDot:      {position:'absolute',top:5,right:5},
  liveDotInner: {width:7,height:7,borderRadius:4,backgroundColor:'#ef4444'},
  chName:       {fontSize:9,fontWeight:'700',textAlign:'center',lineHeight:13},
  // مجموعات فرعية
  subCard:      {width:(width-12*2-9*2)/3,borderRadius:14,overflow:'hidden',borderWidth:1},
  subImgWrap:   {height:80,position:'relative'},
  subIconBadge: {position:'absolute',top:6,left:6,width:24,height:24,borderRadius:7,alignItems:'center',justifyContent:'center'},
  subFooter:    {padding:7},
  subName:      {fontSize:10,fontWeight:'700',lineHeight:14,marginBottom:2},
  subCount:     {fontSize:9,fontWeight:'800'},
});