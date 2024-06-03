export function getZoomLevel(): {
    zoomLevelPercentage: number;
    visualViewportScale: number;
    zoomViaWindowDevicePixelRatio: number;
    viewportZoomLevel: number;
} {
    if (typeof window === "undefined") {
        throw new Error("window is not defined");
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = document.documentElement.getBoundingClientRect();
    const zoomLevel = (rect.width * devicePixelRatio) / window.innerWidth;
    const zoomLevelPercentage = Math.round(zoomLevel * 100);

    const visualViewportScale = Math.round(
        (window.outerWidth / window.innerWidth) * 100
    );
    const zoomViaWindowDevicePixelRatio = 1 / devicePixelRatio;

    let viewportZoomLevel = 0;
    if (window.visualViewport) {
        viewportZoomLevel = window.visualViewport.scale;
    }

    return {
        zoomLevelPercentage,
        visualViewportScale,
        zoomViaWindowDevicePixelRatio,
        viewportZoomLevel,
    };
}
