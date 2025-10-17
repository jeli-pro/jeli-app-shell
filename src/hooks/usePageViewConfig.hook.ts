import { useEffect } from 'react';
import { useAppShellStore } from '@/store/appShell.store';

interface PageViewConfig {
    sidePaneWidth?: number;
    splitPaneWidth?: number;
}

/**
 * A hook for a page component to declaratively set its desired pane widths.
 * It sets the widths when config changes and resets them to the application defaults on unmount.
 * @param {PageViewConfig} config - The desired widths for side pane and split view.
 */
export function usePageViewConfig(config: PageViewConfig) {
    const { setSidePaneWidth, setSplitPaneWidth, resetPaneWidths } = useAppShellStore.getState();
    const { sidePaneWidth, splitPaneWidth } = config;

    useEffect(() => {
        if (sidePaneWidth !== undefined) {
            setSidePaneWidth(sidePaneWidth);
        }
        if (splitPaneWidth !== undefined) {
            setSplitPaneWidth(splitPaneWidth);
        }

        // Return a cleanup function to reset widths when the component unmounts
        return () => {
            resetPaneWidths();
        };
    }, [sidePaneWidth, splitPaneWidth, setSidePaneWidth, setSplitPaneWidth, resetPaneWidths]);
}