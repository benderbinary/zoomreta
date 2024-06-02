export function getZoomLevel(): { zoomLevel: number, visualViewportScale: number } {
    if (typeof window === 'undefined') {
        throw new Error('window is not defined');
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = document.documentElement.getBoundingClientRect();
    const zoomLevel = (rect.width * devicePixelRatio) / window.innerWidth;
    const zoomLevelPercentage = Math.round(zoomLevel * 100);

    let visualViewportScale = Math.round((window.outerWidth / window.innerWidth) * 100);

    return {
        zoomLevel: zoomLevelPercentage,
        visualViewportScale: visualViewportScale
    };
}
