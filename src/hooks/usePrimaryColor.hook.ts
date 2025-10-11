import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

export function usePrimaryColor() {
  const primaryColor = useAppStore((state) => state.primaryColor);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-hsl', primaryColor);
  }, [primaryColor]);
}