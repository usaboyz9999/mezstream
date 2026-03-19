// mezstream/hooks/useLayout.js

import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export function useLayout() {
  const getDims = () => {
    const { width, height } = Dimensions.get('window');
    const isLandscape = width > height;
    const isTV = Platform.isTV;
    const isBigScreen = width >= 960;
    return { width, height, isLandscape, isTV, isBigScreen };
  };

  const [layout, setLayout] = useState(getDims);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => {
      setLayout(getDims());
    });
    return () => sub?.remove();
  }, []);

  // القائمة جانبية إذا: وضع أفقي أو TV أو شاشة كبيرة
  const isSideNav = layout.isLandscape || layout.isTV || layout.isBigScreen;

  return { ...layout, isSideNav };
}