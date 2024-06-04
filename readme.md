# Zoomreta

`Zoomreta` is an npm package for detecting zoom level in a browser. It uses the `window.visualViewport` API where available with a fallback method.
Features:

<ul>
    <li><strong>Accurate Zoom Detection:</strong> Leverages the `visualViewport` API where available for precise zoom level measurement, with a fallback method for older browsers.</li>
    <li><strong>Multiple Zoom Level Properties:</strong> Provides detailed information about the zoom level, including:
        <ul>
            <li>Percentage</li>
            <li>Device pixel ratio</li>
            <li>Viewport scale</li>
            <li>Effective zoom (combined viewport and system zoom)</li>
        </ul>
    </li>
    <li><strong>Display switch detection:</strong> Detect changes in zoom level if display switched (considering )</li>
    <li><strong>Retina Display Detection:</strong> Accurately identifies Retina (high-DPI) displays, even when system and browser zoom adjustments are applied.</li>
    <li><strong>Change Monitoring:</strong> Allows you to monitor zoom level changes and react dynamically using a callback function.</li>
    <li><strong>Customizable:</strong> Offers options to tailor zoom level detection to your specific needs:
        <ul>
            <li>Alternative zoom calculation</li>
            <li>Selection of specific zoom properties to return</li>
        </ul>
    </li>
  
</ul>

## Installation

You can install `zoomreta` using npm:

```sh
npm install zoomreta
```

## Usage

### In Node.js

To use zoomreta in a Node.js environment:

```
import { getZoomLevel } from 'zoomreta';

const zoomLevels = getAdjustedZoomLevel();
console.log(zoomLevels.zoomLevelPercentage); // 100 (default zoom level percentage), 125, 150, etc.
console.log(zoomLevels.effectiveZoomLevel); // Combined viewport and system zoom
```

### In the Browser

To use zoomreta in a browser environment:

Include the zoomreta script in your HTML file (example):

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zoom Level Test</title>
</head>
<body>
  <script src="node_modules/zoomreta/dist/bundle.js"></script>
  <script>
    console.log('Zoom Level:', zoomreta.getZoomLevel());
  </script>
</body>
</html>
```

Or try in combination with test project:

## API

## `getAdjustedZoomLevel`

Retrieves the current zoom level properties.
Properties examples:

### 1. Get default zoom properties

```
const zoomLevels = getAdjustedZoomLevel();
console.log(zoomLevels);
```

### 2. Get zoom level and `isRetina`

```
const zoomLevels = getAdjustedZoomLevel({ includeRetina: true });
console.log(zoomLevels);
```

### 3. Get zoom level and `zoomViaWindowDevicePixelRatio`

```
const zoomLevels = getAdjustedZoomLevel({ includeZoomViaWindow: true });
console.log(zoomLevels);
```

### 4. All properties

```
const zoomLevels = getAdjustedZoomLevel({ includeRetina: true, includeZoomViaWindow: true });
console.log(zoomLevels);
```

## `checkForChanges`

Monitors for changes in zoom level and executes a callback when changes are detected.

<ul>
  <li>
    <b>callback</b> (function): The function to execute when zoom level changes are detected.
  </li>
  <li>
    <b>interval</b> (number): The interval in milliseconds (default: 500).
  </li>
  <li>
    <b>options</b> (object):
    <ul>
      <li>
        <b>oncePerStateChange</b> (boolean):
        <ul>
            <li>If `false` (default), the callback fires on <i>every</i> zoom level change within the interval.</li>
            <li>If `true`, the callback fires <i>only once</i> when transitioning between zoomed and not zoomed states.</li>
        </ul>
      </li>
      <li>
        <b>useAlternativeZoomCalculation</b> (boolean): If `true`, an alternative (probably less accurate) zoom calculation is used.
      </li>
      <li>
        <b>includeRetina</b> (boolean): Return information is retina display
      </li>
      <li>
        <b>includeZoomViaWindow</b> (boolean): If `true`, includes the `zoomViaWindowDevicePixelRatio` property (zoom level based on window device pixel ratio) in the returned zoom level information.
      </li>
    </ul>
  </li>
</ul>

## Contributing

Contributions are more than welcome!
Please open an issue or submit a pull request for any changes you would like to see.

## License

This project is licensed under the ISC License.
