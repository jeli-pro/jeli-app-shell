import { useEffect } from 'react';
import { useAppShellStore } from '@/store/appShell.store';

interface PageViewConfig {
    sidePaneWidth?: number;
    splitPaneWidth?: number;
}

/**
 * A hook for a page component to declaratively set its desired pane widths.
 * It sets the widths on mount and resets them to the application defaults on unmount.
 * @param {PageViewConfig} config - The desired widths for side pane and split view.
 */
export function usePageViewConfig(config: PageViewConfig) {
    const { setSidePaneWidth, setSplitPaneWidth, resetPaneWidths } = useAppShellStore.getState();

    useEffect(() => {
        if (config.sidePaneWidth !== undefined) {
            setSidePaneWidth(config.sidePaneWidth);
        }
        if (config.splitPaneWidth !== undefined) {
            setSplitPaneWidth(config.splitPaneWidth);
        }

        // Return a cleanup function to reset widths when the component unmounts
        return () => {
            resetPaneWidths();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount and cleanup on unmount
}