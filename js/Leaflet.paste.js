L.Control.Paste = L.Control.extend({
    options: {
        position: 'topright',
        title: 'Paste objects',
        wkt: {
            title: 'WKT'
        },
        geojson: {
            title: 'GeoJSON'
        },
        submit: 'Add'
    },

    initialize: function (options) {
        L.Util.extend(this.options, options);
    },

    onAdd: function (map) {
        var className = 'leaflet-control-paste',
            container = L.DomUtil.create('div', className);

        this.handler = new L.Handler.Paste(map, this.options);
        this._createButton(
                this.options.title,
                className + '-button' + ' ' + this.options.position,
                container,
                this.handler.enable,
                this.handler
        );
        this.handler.on('activated deactivated', this._toggleModal, this);
        this.handler.on('error', this._displayError, this);

        this._modal = this._createForm(
                className + '-form',
                container,
                this.handler.submit,
                this.handler
        );
        this._messageBox = L.DomUtil.create('div', 'message-box', this._modal);

        return container;
    },

    _toggleModal: function () {
        if (L.DomUtil.hasClass(this._modal, 'hidden')) {
            L.DomUtil.removeClass(this._modal, 'hidden');
        }
        else {
            L.DomUtil.addClass(this._modal, 'hidden');
        }
    },

    _displayError: function (e) {
        this._messageBox.innerHTML = e.message;
    },

    _createButton: function (title, className, container, fn, context) {
        var link = L.DomUtil.create('a', className, container);
        link.href = '#';
        link.title = title;

        L.DomEvent
            .addListener(link, 'click', L.DomEvent.stopPropagation)
            .addListener(link, 'click', L.DomEvent.preventDefault)
            .addListener(link, 'click', fn, context);

        return link;
    },

    _createForm: function (className, parentContainer, fn, context) {
        var options = this.options,
            container = L.DomUtil.create('div', 'hidden', parentContainer),
            form = L.DomUtil.create('form', null, container),
            input = L.DomUtil.create('textarea', null, form),
            format = L.DomUtil.create('select', null, form),
            submit = L.DomUtil.create('input', null, form);

        if (options.wkt) {
            this._createFormatOption('wkt', options.wkt.title, format);
        }
        if (options.geojson) {
            this._createFormatOption('geojson', options.geojson.title, format);
        }

        L.DomEvent.disableClickPropagation(container);
        input.rows = 10;
        format.multiple = false;
        submit.type = 'submit';
        submit.value = this.options.submit;

        L.DomEvent.on(form, 'submit', L.DomEvent.stop);
        L.DomEvent.on(form, 'submit', fn, context);

        // Reset form.
        L.DomEvent.on(form, 'submit', function () { input.value = "" });

        return container;
    },

    _createFormatOption: function (type, title, parentElement) {
        var option = L.DomUtil.create('option', null, parentElement);
        option.value = type;
        option.text = title;
    }

});

L.Control.paste = function (options) {
    return new L.Control.Paste(options);
}

L.Map.mergeOptions({
    pasteControl: false
});

L.Map.addInitHook(function () {
    if (this.options.pasteControl) {
        this.pasteControl = L.Control.paste();
        this.addControl(this.pasteControl);
    }
});

L.Handler.Paste = L.Handler.extend({
    includes: L.Mixin.Events,

    initialize: function (map, options) {
        this._map = map;
    },

    addHooks: function () {
        if (this._map) {
            this.fire('activated');
        }
    }, 

    removeHooks: function () {
        if (this._map) {
            this.fire('deactivated');
        }
    },

    submit: function (e) {
        var value = e.target[0].value,
            type = e.target[1].value;

        try {
            this._process(value, type);
            this.disable();
        }
        catch (e) {
            // Leaflet's fire() seems to clobber Error objects.
            if (e instanceof Error) {
                e = { message: e.message };
            }
            this.fire('error', e);
        }
    },

    _process: function (value, type) {
        var layer;

        if (!value) {
            throw new Error('You must add a valid geometry.');
        }

        if (!L.Handler.Paste.hasOwnProperty(type)) {
            throw new Error('Unknown data type: %s.', type);
        }

        layer = L.Handler.Paste[type].call(this, value);
        center = layer.getBounds().getCenter();
        this._map.addLayer(layer);
        this._map.panTo(center);
    }
});

L.Util.extend(L.Handler.Paste, {
    wkt: function (data) {
        return L.wkt(data);
    },
    geojson: function (data) {
        return L.geoJSON(data);
    }
});
