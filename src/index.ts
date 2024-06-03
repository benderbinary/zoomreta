type ZoomLevelProperties = {
    zoomLevelPercentage: number;
    zoomViaWindowDevicePixelRatio: number;
    viewportZoomLevel: number;
    isRetina: boolean;
};

export function getAdjustedZoomLevel(): ZoomLevelProperties {
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

    let viewportZoomLevel = 1;
    if (window.visualViewport) {
        viewportZoomLevel = window.visualViewport.scale;
    }

    const isRetina = isRetinaDisplay();

    return {
        zoomLevelPercentage,
        zoomViaWindowDevicePixelRatio,
        viewportZoomLevel,
        isRetina
    };
}

function isRetinaDisplay(): boolean {
    const dpr = window.devicePixelRatio || 1;
    const isHighRes = screen.width > 2560 || screen.height > 1600;
    const supportsHighResMediaQuery = window.matchMedia('(min-resolution: 2dppx)').matches;

    const isZoomed = dpr > 1 && window.innerWidth < screen.width;

    return dpr > 1 && (isHighRes || supportsHighResMediaQuery) && !isZoomed;
}

export function checkForChanges(
    callback: (zoomLevels: ZoomLevelProperties) => void,
    interval: number = 500,
    options?: { isSingleRetina?: boolean; isSingle?: boolean }
) {
    let lastZoomLevels = getAdjustedZoomLevel();
    let lastScreenWidth = screen.width;
    let lastScreenHeight = screen.height;
    let lastDevicePixelRatio = window.devicePixelRatio;

    function detectChanges() {
        const currentZoomLevels = getAdjustedZoomLevel();
        const currentScreenWidth = screen.width;
        const currentScreenHeight = screen.height;
        const currentDevicePixelRatio = window.devicePixelRatio;

        const hasScreenChanged = (
            lastScreenWidth !== currentScreenWidth ||
            lastScreenHeight !== currentScreenHeight ||
            lastDevicePixelRatio !== currentDevicePixelRatio
        );

        if (
            lastZoomLevels.zoomLevelPercentage !== currentZoomLevels.zoomLevelPercentage ||
            lastZoomLevels.zoomViaWindowDevicePixelRatio !== currentZoomLevels.zoomViaWindowDevicePixelRatio ||
            lastZoomLevels.viewportZoomLevel !== currentZoomLevels.viewportZoomLevel ||
            hasScreenChanged
        ) {
            lastZoomLevels = currentZoomLevels;
            lastScreenWidth = currentScreenWidth;
            lastScreenHeight = currentScreenHeight;
            lastDevicePixelRatio = currentDevicePixelRatio;
            callback(currentZoomLevels);
        }

        if (hasScreenChanged && options?.isSingleRetina) {
            callback(currentZoomLevels);
        }
    }

    setInterval(detectChanges, interval);
}
