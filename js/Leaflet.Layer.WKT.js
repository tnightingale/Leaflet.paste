L.WKT = L.GeoJSON.extend({
    initialize: function (geojson, options) {
        L.GeoJSON.prototype.initialize.call(this, geojson, options);
    },

    addData: function (wkt) {
        var options = this.options,
            wkt = new Wkt.Wkt(wkt);

        if (options.filter && !options.filter(wkt.components)) { return; }

        var layer = wkt.toObject(this.options);
        layer.wkt = wkt;

        this.resetStyle(layer);

        return this.addLayer(layer);
    }

});

L.wkt = function (wkt, options) {
    return new L.WKT(wkt, options);
};
