L.WKT = L.GeoJSON.extend({
    initialize: function (geojson, options) {
        L.GeoJSON.prototype.initialize.call(this, geojson, options);
    },

    addData: function (wkt) {
        var options = this.options,
            wicket = new Wkt.Wkt(wkt);

        if (options.filter && !options.filter(wicket.components)) { return; }

        var layer = wicket.toObject(this.options);
        layer.wkt = wicket;

        this.resetStyle(layer);

        return this.addLayer(layer);
    }

});

L.wkt = function (wkt, options) {
    return new L.WKT(wkt, options);
};
