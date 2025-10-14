import { useEffect } from 'react';
import { useAppShellStore } from '@/store/appShell.store';

export function useCommandPaletteToggle() {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const { isCommandPaletteOpen, setCommandPaletteOpen } = useAppShellStore.getState();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
}