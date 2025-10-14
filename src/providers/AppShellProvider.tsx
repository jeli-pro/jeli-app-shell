import { useEffect, type ReactNode, type ReactElement } from 'react';
import { useAppShellStore } from '@/store/appShell.store';

interface AppShellProviderProps {
  children: ReactNode;
  appName?: string;
  appLogo?: ReactElement;
  defaultSplitPaneWidth?: number;
}

export function AppShellProvider({ children, appName, appLogo, defaultSplitPaneWidth }: AppShellProviderProps) {
  const init = useAppShellStore(state => state.init);
  const setPrimaryColor = useAppShellStore(state => state.setPrimaryColor);
  const primaryColor = useAppShellStore(state => state.primaryColor);

  useEffect(() => {
    init({ appName, appLogo, defaultSplitPaneWidth });
  }, [appName, appLogo, defaultSplitPaneWidth, init]);

  // Side effect for primary color
  useEffect(() => {
    // This effect is here because the store itself can't run side-effects on init
    // before React has mounted. So we trigger it from the provider.
    setPrimaryColor(primaryColor);
  }, [primaryColor, setPrimaryColor]);

  return <>{children}</>;
}