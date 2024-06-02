export function getZoomLevel(): number {
    if (typeof window === 'undefined') {
      throw new Error('window is not defined');
    }
  
    if (window.visualViewport) {
      return window.visualViewport.scale * 100;
    }
  
    // Fallback in case visualViewport is not supoported
    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = document.documentElement.getBoundingClientRect();
    const zoomLevel = (rect.width * devicePixelRatio) / window.innerWidth;
    return zoomLevel * 100;
  }
  