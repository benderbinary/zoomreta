# Zoomreta - Precise Browser Zoom Detection

Zoomreta is a lightweight JavaScript/TypeScript library that provides accurate and reliable browser zoom level detection. It's designed to help you create responsive web applications that adapt seamlessly to users' zoom preferences, optimize for various screen densities, and ensure accessibility.

## Features

- **Accurate Zoom Detection:** Leverages the `visualViewport` API where available for precise zoom level measurement, with a fallback method for older browsers.
- **Multiple Zoom Level Properties:** Provides detailed information about the zoom level, including:
  - `zoomLevelPercentage`: Zoom level as a percentage (e.g., 100, 110, 125).
  - `zoomViaWindowDevicePixelRatio`: Zoom level calculated using `1 / devicePixelRatio`.
  - `viewportZoomLevel`: Zoom level of the visual viewport (if available).
  - `effectiveZoomLevel`: Combined zoom level considering both viewport and system zoom.
  - `isRetina`: Indicates if the display is a high-DPI Retina display.
  - `initialDevicePixelRatio`: The device's original device pixel ratio (DPR) before any zoom is applied.
- **Display Switch Detection:** Accurately detects changes in zoom levels that occur when switching between displays or changing display settings.
- **Retina Display Detection:** Accurately identifies Retina (high-DPI) displays, even with system and browser zoom adjustments.
- **Zoom Event Handling:** Subscribe to zoom events (`zoomStart`, `zoomEnd`, `zoomChange`) for more flexible zoom management.
- **Threshold-Based Callbacks:**  Optimize performance by only triggering callbacks when zoom level changes exceed a specified threshold.
- **Zoom Level History:**  Maintain a history of recent zoom levels for analysis and debugging.
- **Customizable:**  Configure the library to return only the zoom properties you need and choose between zoom calculation methods.
- **Node.js and Browser Support:** Works seamlessly in both Node.js and browser environments.

## Installation

```bash
npm install zoomreta
```

## Usage

### Get Zoom Level

```
import { getAdjustedZoomLevel } from 'zoomreta';

const zoomLevels = getAdjustedZoomLevel();
console.log(zoomLevels.zoomLevelPercentage); // Get zoom level percentage
console.log(zoomLevels.effectiveZoomLevel); // Get combined viewport and system zoom
```

### Event-Based Zoom Handling

```
import { on, off, ZoomLevelProperties } from 'zoomreta';

on('zoomChange', (zoomLevels: Partial<ZoomLevelProperties>) => {
  console.log('Zoom level changed:', zoomLevels);
});
```

### Monitor Zoom Changes (with Options)

```
import { checkForChanges } from 'zoomreta';

checkForChanges((zoomLevels) => {
    console.log('Zoom level changed:', zoomLevels);
  }, 500, { oncePerStateChange: true, threshold: 5 });
```

## API Reference

### Functions

| Function                            | Description                                                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `getAdjustedZoomLevel(options?)`   | Retrieves the current zoom level properties. See `ZoomLevelProperties` below for details.                   |
| `on(eventType, callback)`          | Subscribes to a zoom event (`'zoomStart'`, `'zoomEnd'`, `'zoomChange'`).                                    |
| `off(eventType, callback)`         | Unsubscribes from a zoom event.                                                                              |
| `checkForChanges(callback, interval?, options?)` | Monitors zoom changes and calls the `callback` function when changes occur. See `CheckForChangesOptions` below. |

### Types

| Type                        | Description                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| `ZoomLevelProperties`      | An object containing various zoom level properties (see below).                                |
| `ZoomEventType`            | A type union representing the possible zoom events: `'zoomStart'`, `'zoomEnd'`, or `'zoomChange'`. |
| `ZoomEventCallback`        | A function type that is called when a zoom event occurs.                                        |
| `CheckForChangesOptions`   | An object containing options for customizing `checkForChanges` (see below).                     |

### ZoomLevelProperties

| Property                             | Type    | Description                                                                                                   |
| ------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------- |
| `zoomLevelPercentage`                | `number` | Zoom level as a percentage (e.g., 100, 110, 125).                                                          |
| `zoomViaWindowDevicePixelRatio`       | `number` | Zoom level calculated using `1 / devicePixelRatio`.                                                      |
| `viewportZoomLevel`                  | `number` | Zoom level of the visual viewport (if available).                                                           |
| `effectiveZoomLevel`                 | `number` | Combined zoom level considering both viewport and system zoom.                                               |
| `isRetina`                         | `boolean` | Indicates if the display is a high-DPI Retina display.                                                   |
| `initialDevicePixelRatio`            | `number` | The device's original device pixel ratio (DPR) before any zoom is applied (only present if not zoomed).  |

### CheckForChangesOptions

| Option                         | Type      | Description                                                                                                                                                                                                 | Default Value |
| ------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `oncePerStateChange`          | `boolean`  | If `true`, the callback is executed only once per zoom state change (e.g., once when zooming in, once when zooming out).                                                                                      | `false`       |
| `useAlternativeZoomCalculation` | `boolean`  | If `true`, an alternative (potentially less accurate) zoom calculation is used.                                                                                                                          | `false`       |
| `includeRetina`                | `boolean`  | If `true`, includes the `isRetina` property in the zoom level information object returned by `getAdjustedZoomLevel`.                                                                                  | `false`       |
| `includeZoomViaWindow`          | `boolean`  | If `true`, includes the `zoomViaWindowDevicePixelRatio` property in the zoom level information object returned by `getAdjustedZoomLevel`.                                                            | `false`       |
| `threshold`                    | `number`   | The minimum zoom level change (in percentage points) required to trigger the `zoomChange` event. If not set, the `zoomChange` event will be triggered for any change in the zoom level, no matter how small. | 0             |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

ISC License
