import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, BackHandler, ActivityIndicator,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { useLayout } from '../hooks/useLayout';

export default function PlayerScreen({ route, navigation }) {
  const { item } = route.params || {};
  const { addToHistory } = useApp();
  const insets = useSafeAreaInsets();
  const { isLandscape, isTV } = useLayout();

  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying]       = useState(true);
  const [isMuted, setIsMuted]           = useState(false);
  const [isBuffering, setIsBuffering]   = useState(true);
  const [hasError, setHasError]         = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');
  const hideTimer = useRef(null);

  useEffect(() => {
    if (item) addToHistory(item);
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => sub.remove();
  }, []);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 4000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimer.current);
  }, []);

  const player = useVideoPlayer(
    item?.streamUrl ? { uri: item.streamUrl } : null,
    (p) => {
      p.loop = false;
      p.muted = false;
      p.play();
    }
  );

  useEffect(() => {
    if (!player) return;

    const statusSub = player.addListener('statusChange', ({ status }) => {
      if (status === 'readyToPlay') {
        setIsBuffering(false);
        setHasError(false);
      }
      if (status === 'loading') {
        setIsBuffering(true);
      }
      if (status === 'error') {
        setIsBuffering(false);
        setHasError(true);
        setErrorMsg('تعذّر تشغيل البث — تحقق من الرابط أو اتصال الإنترنت');
      }
    });

    const playingSub = player.addListener('playingChange', ({ isPlaying: playing }) => {
      setIsPlaying(playing);
    });

    return () => {
      statusSub?.remove();
      playingSub?.remove();
    };
  }, [player]);

  const togglePlay = () => {
    if (!player) return;
    if (player.playing) player.pause();
    else player.play();
    resetHideTimer();
  };

  const toggleMute = () => {
    if (!player) return;
    player.muted = !isMuted;
    setIsMuted(m => !m);
    resetHideTimer();
  };

  const handleRetry = () => {
    setHasError(false);
    setIsBuffering(true);
    player?.play();
  };

  // ── لا يوجد محتوى ──
  if (!item) {
    return (
      <View style={s.root}>
        <StatusBar hidden />
        <TouchableOpacity
          style={[s.backFloating, { top: insets.top + 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="warning-outline" size={60} color="#ef4444" />
        <Text style={s.errBigTitle}>خطأ: لا يوجد محتوى</Text>
      </View>
    );
  }

  // ── لا يوجد رابط ──
  if (!item.streamUrl) {
    return (
      <View style={s.root}>
        <StatusBar hidden />
        <LinearGradient
          colors={item.colors || ['#1a0533', '#0d0b1e']}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity
          style={[s.backFloating, { top: insets.top + 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={s.noUrlBox}>
          <Ionicons name="link-outline" size={48} color="#ef4444" />
          <Text style={s.noUrlTitle}>{item.nameAr || item.name}</Text>
          <Text style={s.noUrlSub}>لا يوجد رابط بث لهذه القناة</Text>
        </View>
        <TouchableOpacity
          style={[s.bottomBackBtn, { bottom: insets.bottom + 20 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={s.bottomBackTxt}>رجوع</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── المشغّل الرئيسي ──
  return (
    <View style={s.root}>
      <StatusBar hidden />

      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit={isTV || isLandscape ? 'contain' : 'cover'}
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />

      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={resetHideTimer}
      >
        {/* ── Buffering ── */}
        {isBuffering && !hasError && (
          <View style={s.bufferLayer}>
            <ActivityIndicator size="large" color="#a855f7" />
            <Text style={s.bufferTxt}>جاري التحميل...</Text>
          </View>
        )}

        {/* ── Error ── */}
        {hasError && (
          <View style={s.errorLayer}>
            <Ionicons name="warning" size={52} color="#ef4444" />
            <Text style={s.errTitle}>تعذّر التشغيل</Text>
            <Text style={s.errSub}>{errorMsg}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={handleRetry}>
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={s.retryTxt}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Controls ── */}
        {showControls && (
          <View style={StyleSheet.absoluteFill}>

            {/* شريط علوي */}
            <LinearGradient
              colors={['rgba(0,0,0,0.85)', 'transparent']}
              style={[
                s.topBar,
                { paddingTop: insets.top + (isTV ? 20 : 10) },
              ]}
            >
              {/* زر رجوع */}
              <TouchableOpacity
                style={[s.ctrlBtn, isTV && s.ctrlBtnTV]}
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  name="chevron-back"
                  size={isTV ? 32 : 26}
                  color="#fff"
                />
              </TouchableOpacity>

              {/* اسم القناة */}
              <View style={s.titleArea}>
                <Text
                  style={[s.channelName, isTV && { fontSize: 22 }]}
                  numberOfLines={1}
                >
                  {item.nameAr || item.name}
                </Text>
                {item.isLive && (
                  <View style={s.livePill}>
                    <View style={s.liveDot} />
                    <Text style={[s.liveTxt, isTV && { fontSize: 14 }]}>
                      مباشر
                    </Text>
                  </View>
                )}
              </View>

              {/* كتم الصوت */}
              <TouchableOpacity
                style={[s.ctrlBtn, isTV && s.ctrlBtnTV]}
                onPress={toggleMute}
              >
                <Ionicons
                  name={isMuted ? 'volume-mute' : 'volume-high'}
                  size={isTV ? 28 : 22}
                  color="#fff"
                />
              </TouchableOpacity>
            </LinearGradient>

            {/* زر تشغيل / إيقاف في المنتصف */}
            {!isBuffering && !hasError && (
              <View style={s.centerArea}>
                <TouchableOpacity
                  style={[s.centerPlayCircle, isTV && s.centerPlayCircleTV]}
                  onPress={togglePlay}
                >
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={isTV ? 56 : 40}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* شريط سفلي */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              style={[
                s.bottomBar,
                { paddingBottom: insets.bottom + (isTV ? 24 : 14) },
              ]}
            >
              {/* جودة */}
              <Text style={[s.qualityBadge, isTV && { fontSize: 16 }]}>
                {item.quality || 'HD'}
              </Text>

              {/* في وضع TV أو أفقي: نضيف اسم القناة في الأسفل */}
              {(isTV || isLandscape) && (
                <Text style={s.bottomTitle} numberOfLines={1}>
                  {item.nameAr || item.name}
                </Text>
              )}
            </LinearGradient>

          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  // ── Buffering ──
  bufferLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    gap: 14,
  },
  bufferTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Error ──
  errorLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    gap: 12,
    paddingHorizontal: 40,
  },
  errTitle: {
    color: '#ef4444',
    fontSize: 20,
    fontWeight: '900',
  },
  errSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  retryTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Top Bar ──
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 36,
    gap: 12,
  },
  ctrlBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlBtnTV: {
    width: 58,
    height: 58,
    borderRadius: 16,
  },
  titleArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  channelName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    flex: 1,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveTxt: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },

  // ── Center Play ──
  centerArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlayCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlayCircleTV: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  // ── Bottom Bar ──
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingTop: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qualityBadge: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '900',
  },
  bottomTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },

  // ── No URL Screen ──
  backFloating: {
    position: 'absolute',
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  noUrlBox: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 30,
  },
  noUrlTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  noUrlSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomBackBtn: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bottomBackTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // ── No Item Screen ──
  errBigTitle: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 14,
  },
});