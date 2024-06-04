# Zoomreta

`Zoomreta` is an npm package for detecting zoom level in a browser. It uses the `window.visualViewport` API where available with a fallback method.

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

console.log('Zoom Level:', getZoomLevel());
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

### Parameters

<ul>
  <li>
    <b>callback</b> (function): The function to execute when zoom level changes are detected.
  </li>
  <li>
    <b>interval</b> (number): The interval in milliseconds at which to check for changes (default: 500).
  </li>
  <li>
    <b>options</b> (object): Options to customize the behavior:
    <ul>
      <li>
        <b>oncePerStateChange</b> (boolean): If true, the callback is executed only once per zoom state change (e.g., once when zooming in, once when zooming out).
      </li>
      <li>
        <b>useAlternativeZoomCalculation</b> (boolean): If true, an alternative zoom calculation is used (this might be less accurate in some cases).
      </li>
      <li>
        <b>includeRetina</b> (boolean): If true, includes the `isRetina` property (whether the display is a high-DPI Retina display) in the returned zoom level information.
      </li>
      <li>
        <b>includeZoomViaWindow</b> (boolean): If true, includes the `zoomViaWindowDevicePixelRatio` property (zoom level based on window device pixel ratio) in the returned zoom level information.
      </li>
    </ul>
  </li>
</ul>

## Contributing

Contributions are more than welcome!
Please open an issue or submit a pull request for any changes you would like to see.

## License

This project is licensed under the ISC License.
