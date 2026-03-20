import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DARK_COLORS, LIGHT_COLORS, DEMO_USERS, CONTENT, PLANS } from '../appdata/index.js';

const AppContext = createContext({});

const STORAGE_KEYS = {
  LANGUAGE:      '@mez_lang',
  DARK_MODE:     '@mez_dark',
  CURRENT_USER:  '@mez_user',
  USERS:         '@mez_users',
  MY_LIST:       '@mez_list',
  WATCH_HISTORY: '@mez_history',
};

const TRANSLATIONS = {
  ar: {
    home: 'الرئيسية', browse: 'تصفح', search: 'بحث', myList: 'قائمتي',
    account: 'حسابي', settings: 'الإعدادات', login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج', register: 'إنشاء حساب', subscribe: 'اشترك الآن',
    watchNow: 'شاهد الآن', addToList: 'أضف للقائمة', removeFromList: 'حذف من القائمة',
    liveTV: 'بث مباشر', series: 'مسلسلات', movies: 'أفلام', sports: 'رياضة',
    kids: 'أطفال', arabicSeries: 'مسلسلات عربية', foreignSeries: 'مسلسلات أجنبية',
    arabicMovies: 'أفلام عربية', foreignMovies: 'أفلام أجنبية',
    all: 'الكل', featured: 'مميز', trending: 'الأكثر مشاهدة',
    newContent: 'جديد', continueWatching: 'أكمل المشاهدة',
    episodes: 'حلقات', episode: 'حلقة', season: 'موسم',
    duration: 'المدة', year: 'السنة', quality: 'الجودة', rating: 'التقييم',
    genre: 'التصنيف', language: 'اللغة', live: 'مباشر',
    signInRequired: 'يجب تسجيل الدخول', signInToWatch: 'سجّل دخولك لمشاهدة المحتوى',
    subscribeToWatch: 'اشترك لمشاهدة المحتوى المميز',
    signIn: 'تسجيل الدخول', cancel: 'إلغاء', ok: 'حسناً',
    username: 'اسم المستخدم', password: 'كلمة المرور', email: 'البريد الإلكتروني',
    name: 'الاسم', confirmPassword: 'تأكيد كلمة المرور',
    accountCreated: 'تم إنشاء الحساب', canSignIn: 'يمكنك تسجيل الدخول الآن',
    loggedOut: 'تم تسجيل الخروج', welcomeBack: 'مرحباً بعودتك',
    myPlan: 'اشتراكي', free: 'مجاني', premium: 'مميز',
    upgradeNow: 'ترقية الاشتراك', manageSubscription: 'إدارة الاشتراك',
    watchHistory: 'سجل المشاهدة', downloads: 'التحميلات',
    notifications: 'الإشعارات', darkMode: 'الوضع الداكن',
    language2: 'اللغة', arabic: 'عربي', english: 'إنجليزي',
    seeAll: 'عرض الكل', categories: 'التصنيفات',
    search2: 'ابحث عن قنوات وأفلام ومسلسلات...',
    noResults: 'لا توجد نتائج', tryDifferent: 'جرب كلمة بحث مختلفة',
    addedToList: 'تمت الإضافة للقائمة', removedFromList: 'تم الحذف من القائمة',
    error: 'خطأ', success: 'نجاح',
  },
  en: {
    home: 'Home', browse: 'Browse', search: 'Search', myList: 'My List',
    account: 'Account', settings: 'Settings', login: 'Sign In',
    logout: 'Sign Out', register: 'Create Account', subscribe: 'Subscribe Now',
    watchNow: 'Watch Now', addToList: 'Add to List', removeFromList: 'Remove from List',
    liveTV: 'Live TV', series: 'Series', movies: 'Movies', sports: 'Sports',
    kids: 'Kids', arabicSeries: 'Arabic Series', foreignSeries: 'Foreign Series',
    arabicMovies: 'Arabic Movies', foreignMovies: 'Foreign Movies',
    all: 'All', featured: 'Featured', trending: 'Trending',
    newContent: 'New', continueWatching: 'Continue Watching',
    episodes: 'Episodes', episode: 'Episode', season: 'Season',
    duration: 'Duration', year: 'Year', quality: 'Quality', rating: 'Rating',
    genre: 'Genre', language: 'Language', live: 'Live',
    signInRequired: 'Sign In Required', signInToWatch: 'Sign in to watch content',
    subscribeToWatch: 'Subscribe to watch premium content',
    signIn: 'Sign In', cancel: 'Cancel', ok: 'OK',
    username: 'Username', password: 'Password', email: 'Email',
    name: 'Name', confirmPassword: 'Confirm Password',
    accountCreated: 'Account Created', canSignIn: 'You can now sign in',
    loggedOut: 'Signed Out', welcomeBack: 'Welcome Back',
    myPlan: 'My Plan', free: 'Free', premium: 'Premium',
    upgradeNow: 'Upgrade Now', manageSubscription: 'Manage Subscription',
    watchHistory: 'Watch History', downloads: 'Downloads',
    notifications: 'Notifications', darkMode: 'Dark Mode',
    language2: 'Language', arabic: 'Arabic', english: 'English',
    seeAll: 'See All', categories: 'Categories',
    search2: 'Search channels, movies, series...',
    noResults: 'No Results', tryDifferent: 'Try a different search term',
    addedToList: 'Added to List', removedFromList: 'Removed from List',
    error: 'Error', success: 'Success',
  },
};

const save = async (key, value) => {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
};
const load = async (key, fallback = null) => {
  try {
    const v = await AsyncStorage.getItem(key);
    return v != null ? JSON.parse(v) : fallback;
  } catch (_) { return fallback; }
};

export function AppProvider({ children }) {
  const [language,     setLanguage]     = useState('ar');
  const [isDark,       setIsDark]       = useState(true);
  const [currentUser,  setCurrentUser]  = useState(null);
  const [users,        setUsers]        = useState(DEMO_USERS);
  const [myList,       setMyList]       = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig,  setModalConfig]  = useState(null);
  const [hydrated,     setHydrated]     = useState(false);

  useEffect(() => {
    (async () => {
      const [lang, dark, user, savedUsers, list, history] = await Promise.all([
        load(STORAGE_KEYS.LANGUAGE,      'ar'),
        load(STORAGE_KEYS.DARK_MODE,     true),
        load(STORAGE_KEYS.CURRENT_USER,  null),
        load(STORAGE_KEYS.USERS,         DEMO_USERS),
        load(STORAGE_KEYS.MY_LIST,       []),
        load(STORAGE_KEYS.WATCH_HISTORY, []),
      ]);
      setLanguage(lang);
      setIsDark(dark);
      setCurrentUser(user);
      setUsers(savedUsers);
      setMyList(list);
      setWatchHistory(history);
      setHydrated(true);
    })();
  }, []);

  const isRTL = language === 'ar';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  const t = useCallback((key) => TRANSLATIONS[language][key] || key, [language]);

  const toggleLanguage = () => {
    const next = language === 'ar' ? 'en' : 'ar';
    setLanguage(next);
    save(STORAGE_KEYS.LANGUAGE, next);
  };

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    save(STORAGE_KEYS.DARK_MODE, next);
  };

  const showModal = (config) => { setModalConfig(config); setModalVisible(true); };
  const hideModal = () => setModalVisible(false);

  const login = (usernameOrEmail, password) => {
    const user = users.find(u =>
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      save(STORAGE_KEYS.CURRENT_USER, user);
      return { success: true };
    }
    return { success: false, error: isRTL ? 'بيانات خاطئة' : 'Invalid credentials' };
  };

  const register = (name, username, email, password) => {
    if (users.find(u => u.username === username))
      return { success: false, error: isRTL ? 'اسم المستخدم مستخدم' : 'Username taken' };
    if (users.find(u => u.email === email))
      return { success: false, error: isRTL ? 'البريد مستخدم' : 'Email taken' };
    const newUser = { id: Date.now(), name, username, email, password, avatar: name.slice(0,2).toUpperCase(), plan: 'free', wallet: 0 };
    const updated = [...users, newUser];
    setUsers(updated);
    save(STORAGE_KEYS.USERS, updated);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    save(STORAGE_KEYS.CURRENT_USER, null);
  };

  const isInList = (id) => myList.includes(id);

  const toggleList = (id) => {
    const next = myList.includes(id)
      ? myList.filter(i => i !== id)
      : [...myList, id];
    setMyList(next);
    save(STORAGE_KEYS.MY_LIST, next);
    return !myList.includes(id);
  };

  const getMyListContent = () => CONTENT.filter(c => myList.includes(c.id));

  const addToHistory = (item) => {
    setWatchHistory(prev => {
      const next = [item, ...prev.filter(h => h.id !== item.id)].slice(0, 30);
      save(STORAGE_KEYS.WATCH_HISTORY, next);
      return next;
    });
  };

  const clearHistory = () => {
    setWatchHistory([]);
    save(STORAGE_KEYS.WATCH_HISTORY, []);
  };

  const canWatch = (item) => {
    if (!currentUser) return false;
    if (currentUser.plan === 'premium') return true;
    if (item.quality === '4K' && currentUser.plan !== 'premium') return false;
    return true;
  };

  return (
    <AppContext.Provider value={{
      language, isRTL, t, toggleLanguage,
      isDark, toggleDarkMode, colors,
      currentUser, login, register, logout,
      myList, isInList, toggleList, getMyListContent,
      watchHistory, addToHistory, clearHistory,
      canWatch, PLANS, CONTENT,
      showModal, hideModal, modalVisible, modalConfig,
      hydrated,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
