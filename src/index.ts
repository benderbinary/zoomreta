type ZoomLevelProperties = {
    zoomLevelPercentage: number; // Zoom percentage (e.g. 100, 110, 120...)
    zoomViaWindowDevicePixelRatio: number; // Zoom level calculated using 1/devicePixelRatio 
    viewportZoomLevel: number; // Zoom level of visual viewport (if possible)
    effectiveZoomLevel: number; // Combination of viewport and system
    isRetina: boolean; // Attempt to determine is Retina display 
    initialDevicePixelRatio: number; // Initial Device Pixel Ratio if not zoomed 
};

export function getAdjustedZoomLevel(options?: { includeRetina?: boolean, includeZoomViaWindow?: boolean }): Partial<ZoomLevelProperties> {
    if (typeof window === 'undefined') {
        throw new Error('window is not defined');
    }

    // Device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Screen width calculation based on device pixel ratio
    const screenWidth = screen.width * devicePixelRatio;

    // Bounding client rectangle of document
    const rect = document.documentElement.getBoundingClientRect();

    // Zoom level calculated using rectangle width, device pixel ratio and inner width
    const zoomLevel = (rect.width * devicePixelRatio) / window.innerWidth;
    const systemScale = (window.innerWidth / screenWidth) * devicePixelRatio;
    const zoomLevelPercentage = Math.round(zoomLevel * 100 * systemScale);
    const zoomViaWindowDevicePixelRatio = 1 / devicePixelRatio;

    // CHeck if the browser supports the Visual Viewport API
    const viewportZoomLevel = window.visualViewport?.scale || 1;

    // System zoom level (e.g. Scale in Windows)
    const systemZoomLevel = window.devicePixelRatio;

    // Effective zoom level - combination of viewport and system zoom 
    const effectiveZoomLevel = viewportZoomLevel * systemZoomLevel;

    const isRetina = isRetinaDisplay();

    const zoomLevelProps: Partial<ZoomLevelProperties> = {
        zoomLevelPercentage,
        viewportZoomLevel,
        effectiveZoomLevel
    };

    // Set initial device pixel ratio if not zoomed
    if (effectiveZoomLevel === 1) {
        zoomLevelProps.initialDevicePixelRatio = devicePixelRatio;
    }

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
    const isHighRes = Math.max(screen.width, screen.height) * dpr > 2560;;
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

    // For tracking resolution changes (if supported)
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

        // Use alternative zoom calculation 
        if (options?.useAlternativeZoomCalculation) {
            const rect = document.documentElement.getBoundingClientRect();
            currentZoomLevels.zoomLevelPercentage = Math.round((rect.width / window.innerWidth) * 100);
        }

        // Check if screen dimension or device pixel ratio has changed
        const hasScreenChanged = (
            lastScreenWidth !== currentScreenWidth ||
            lastScreenHeight !== currentScreenHeight ||
            lastDevicePixelRatio !== currentDevicePixelRatio
        );

        const currentZoomState = currentZoomLevels.effectiveZoomLevel !== 1;
        const hasZoomStateChanged = lastZoomState !== currentZoomState;

        // Check if any relevant zoom property has changed or if the screen has changed
        if (
            lastZoomLevels.zoomLevelPercentage !== currentZoomLevels.zoomLevelPercentage ||
            lastZoomLevels.zoomViaWindowDevicePixelRatio !== currentZoomLevels.zoomViaWindowDevicePixelRatio ||
            lastZoomLevels.viewportZoomLevel !== currentZoomLevels.viewportZoomLevel ||
            lastZoomLevels.effectiveZoomLevel !== currentZoomLevels.effectiveZoomLevel ||
            hasScreenChanged
        ) {
            // Call the callback if oncePerStateChange is false or if the zoom state has changed.
            if (!options?.oncePerStateChange || hasZoomStateChanged) {
                lastZoomLevels = currentZoomLevels;
                lastScreenWidth = currentScreenWidth;
                lastScreenHeight = currentScreenHeight;
                lastDevicePixelRatio = currentDevicePixelRatio;
                lastZoomState = currentZoomState;
                callback(currentZoomLevels);
            }
        }
    }

    // Check for changes periodically
    const intervalId = setInterval(detectChanges, interval);

    // Clean up after 
    window.addEventListener('unload', () => {
        clearInterval(intervalId);
        if (mediaQueryList) {
            mediaQueryList.removeEventListener("change", detectChanges);
        }
    });
}
