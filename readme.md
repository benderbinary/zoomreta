# Zoomreta

`Zoomreta` is npm package for detecting zoom level in a browser. It uses the `window.visualViewport` API where available with a fallback method.

## Installation

You can install `zoomreta` using npm:

```sh
npm install zoomreta
```
## Usage
###In Node.js

To use zoomreta in a Node.js environment:
```
import { getZoomLevel } from 'zoomreta';

console.log('Zoom Level:', getZoomLevel());
```
### In the Browser

To use zoomreta in a browser environment:

Include the zoomreta script in your HTML file:
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zoom Level Test</title>
</head>
<body>
  <script src="node_modules/zoomreta/dist/index.js"></script>
  <script>
    console.log('Zoom Level:', zoomreta.getZoomLevel());
  </script>
</body>
</html>
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.
## License

This project is licensed under the MIT License.