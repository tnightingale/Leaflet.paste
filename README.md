# Leaflet.paste

Provides a Leaflet control for copy & pasting serialized vector data (WKT or
GeoJSON) into a map. Upon submission of the control, the data is parsed and 
converted into vector layers on the map.

[Check out the demo.](http://tnightingale.github.com/Leaflet.paste/demo.html)

## Usage

To use with default settings, just set ```pasteControl = true``` in your Leaflet map's options.

If you would like to specify which data formats to accept, add the control manually.

E.g:

```
var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    map = L.map('map', { layers: [layer] }),
    pasteControl = L.Control.paste({
      geojson: false
    });

map.addControl(pasteControl);

map.on('paste:layer-created', function (e) {
    map.addLayer(e.layer);
});
```

See [example/Leaflet.paste.html](https://github.com/tnightingale/Leaflet.paste/blob/master/example/Leaflet.paste.html) for a working example.


## Includes

Leaflet.paste includes [Wicket], a library for parsing WKT.

[Wicket]: https://github.com/arthur-e/Wicket
