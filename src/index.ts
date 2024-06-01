function getZoomLevelFallback(): number {
    return 1;
}

export function getZoomLevel(): number {
    if (typeof window !== 'undefined' && window.visualViewport) {
        return window.visualViewport.scale;
    } else if (typeof window !== 'undefined') {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const ratio = Math.round((window.outerWidth / (window.innerWidth * devicePixelRatio)) * 100) / 100;
        return ratio;
    }
    return getZoomLevelFallback();
}

if (typeof window !== 'undefined') {
    (window as any).zoomreta = { getZoomLevel };
}