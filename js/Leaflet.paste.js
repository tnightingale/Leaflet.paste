L.Control.Paste = L.Control.extend({
    options: {
        position: 'topright',
        title: 'Paste objects'
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

        this._modal = this._createForm(
                className + '-form',
                container,
                this.handler.process,
                this.handler
        );

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
        var container = L.DomUtil.create('div', 'hidden', parentContainer),
            form = L.DomUtil.create('form', null, container),
            input = L.DomUtil.create('textarea', null, form),
            submit = L.DomUtil.create('input', null, form);

        L.DomEvent.disableClickPropagation(container);
        input.rows = 10;
        submit.type = 'submit';

        L.DomEvent.on(form, 'submit', L.DomEvent.stop);
        L.DomEvent.on(form, 'submit', fn, context);
        L.DomEvent.on(form, 'submit', this.handler.disable, this.handler);

        // Reset form.
        L.DomEvent.on(form, 'submit', function () { input.value = "" });

        return container;
    }

});

L.Control.paste = function (options) {
    return new L.Control.Paste();
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

    enable: function () {
        this.fire('activated');
        L.Handler.prototype.enable.call(this);
    },

    disable: function () {
        this.fire('deactivated');
        L.Handler.prototype.disable.call(this);
    },

    addHooks: function () {
        if (this._map) {
            console.log('enabled');
            console.log(this);
        }
    }, 

    removeHooks: function () {
        if (this._map) {
            console.log('disabled');
            console.log(this);
        }
    },

    submit: function (e) {
        var type,
            value = e.target[0].value;

        this._process(value, type);
    }
});
