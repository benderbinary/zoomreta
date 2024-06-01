function getZoomLevelFallback() {
    return 1;
}
function getZoomLevel() {
    if (typeof window !== 'undefined' && window.visualViewport) {
        return window.visualViewport.scale;
    }
    else if (typeof window !== 'undefined') {
        var devicePixelRatio_1 = window.devicePixelRatio || 1;
        var ratio = Math.round((window.outerWidth / (window.innerWidth * devicePixelRatio_1)) * 100) / 100;
        return ratio;
    }
    return getZoomLevelFallback();
}
if (typeof window !== 'undefined') {
    window.zoomreta = { getZoomLevel: getZoomLevel };
}

exports.getZoomLevel = getZoomLevel;
//# sourceMappingURL=index.js.map
