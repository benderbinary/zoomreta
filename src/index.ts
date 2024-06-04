type ZoomLevelProperties = {
    zoomLevelPercentage: number;
    zoomViaWindowDevicePixelRatio: number;
    viewportZoomLevel: number;
    effectiveZoomLevel: number;
    isRetina: boolean;
};

export function getAdjustedZoomLevel(options?: { includeRetina?: boolean, includeZoomViaWindow?: boolean }): Partial<ZoomLevelProperties> {
    if (typeof window === 'undefined') {
        throw new Error('window is not defined');
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    const screenWidth = screen.width * devicePixelRatio;
    const rect = document.documentElement.getBoundingClientRect();
    const zoomLevel = (rect.width * devicePixelRatio) / window.innerWidth;
    const systemScale = (window.innerWidth / screenWidth) * devicePixelRatio;
    const zoomLevelPercentage = Math.round(zoomLevel * 100 * systemScale);
    const zoomViaWindowDevicePixelRatio = 1 / devicePixelRatio;
    const viewportZoomLevel = window.visualViewport?.scale || 1;
    const systemZoomLevel = window.devicePixelRatio;
    const effectiveZoomLevel = viewportZoomLevel * systemZoomLevel;
    const isRetina = isRetinaDisplay();

    const zoomLevelProps: Partial<ZoomLevelProperties> = {
        zoomLevelPercentage,
        viewportZoomLevel,
        effectiveZoomLevel
    };

    if (options?.includeZoomViaWindow) {
        zoomLevelProps.zoomViaWindowDevicePixelRatio = zoomViaWindowDevicePixelRatio;
    }

    if (options?.includeRetina) {
        zoomLevelProps.isRetina = isRetina;
    }

    return zoomLevelProps;
}

function isRetinaDisplay(): boolean {
    const dpr = window.devicePixelRatio || 1;
    const isHighRes = (screen.width * dpr) > 2560 || (screen.height * dpr) > 1600;
    const supportsHighResMediaQuery = window.matchMedia('(min-resolution: 2dppx)').matches;
    const adjustedInnerWidth = window.innerWidth * dpr;
    const adjustedOuterWidth = window.outerWidth * dpr;
    const isZoomed = adjustedInnerWidth < adjustedOuterWidth;

    return dpr > 1 && (isHighRes || supportsHighResMediaQuery) && !isZoomed;
}

export function checkForChanges(
    callback: (zoomLevels: Partial<ZoomLevelProperties>) => void,
    interval: number = 500,
    options?: {
        oncePerStateChange?: boolean;
        useAlternativeZoomCalculation?: boolean;
        includeRetina?: boolean;
        includeZoomViaWindow?: boolean;
    }
) {
    let lastZoomLevels = getAdjustedZoomLevel(options);
    let lastScreenWidth = screen.width;
    let lastScreenHeight = screen.height;
    let lastDevicePixelRatio = window.devicePixelRatio;
    let mediaQueryList: MediaQueryList | null = null;
    let lastZoomState: boolean | null = null;

    if (window.matchMedia) {
        mediaQueryList = window.matchMedia("(resolution: 1dppx), (resolution: 2dppx)");
        mediaQueryList.addEventListener("change", detectChanges);
    }

    function detectChanges() {
        const currentZoomLevels = getAdjustedZoomLevel(options);
        const currentScreenWidth = screen.width;
        const currentScreenHeight = screen.height;
        const currentDevicePixelRatio = window.devicePixelRatio;

        if (options?.useAlternativeZoomCalculation) {
            const rect = document.documentElement.getBoundingClientRect();
            currentZoomLevels.zoomLevelPercentage = Math.round((rect.width / window.innerWidth) * 100);
        }

        const hasScreenChanged = (
            lastScreenWidth !== currentScreenWidth ||
            lastScreenHeight !== currentScreenHeight ||
            lastDevicePixelRatio !== currentDevicePixelRatio
        );

        const currentZoomState = currentZoomLevels.effectiveZoomLevel !== 1;
        const hasZoomStateChanged = lastZoomState !== currentZoomState;

        if (
            lastZoomLevels.zoomLevelPercentage !== currentZoomLevels.zoomLevelPercentage ||
            lastZoomLevels.zoomViaWindowDevicePixelRatio !==
            currentZoomLevels.zoomViaWindowDevicePixelRatio ||
            lastZoomLevels.viewportZoomLevel !== currentZoomLevels.viewportZoomLevel ||
            lastZoomLevels.effectiveZoomLevel !== currentZoomLevels.effectiveZoomLevel ||
            hasScreenChanged
        ) {
            // call the callback if oncePerStateChange is false or the zoom state has changed
            if (!options?.oncePerStateChange || hasZoomStateChanged) {
                lastZoomLevels = currentZoomLevels;
                lastScreenWidth = currentScreenWidth;
                lastScreenHeight = currentScreenHeight;
                lastDevicePixelRatio = currentDevicePixelRatio;
                lastZoomState = currentZoomState;
                callback(currentZoomLevels);
            }
        }

        if (hasScreenChanged && options?.oncePerStateChange) {
            callback(currentZoomLevels);
        }
    }

    const intervalId = setInterval(detectChanges, interval);

    window.addEventListener('unload', () => {
        clearInterval(intervalId);
        if (mediaQueryList) {
            mediaQueryList.removeEventListener("change", detectChanges);
        }
    });
}
