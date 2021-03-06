"use strict";

/**
 * Sets and retrieves Storage data, supports String, Number, Object, Array,
 * Boolean and Function.
 * 
 * @param  {String}  key   The storage name.
 * @param  {Any}     value The storage data, if an `undefined` is passed, 
                           remove the previous data.
 * @param  {Boolean} local Use localStorage to store data, default: `false`.
 * 
 * @return {Any}           If `key` is passed, returns the corresponding 
 *                         value it represents; if both `key` and `value` are 
 *                         passed, always returns `value`; if no argument is 
 *                         passed, returns all the data in a Storage Object.
 */
function storage(key = "", value = "", local = false) {
    if (key === true || key === 1) {
        local = key;
        key = null;
    }
    var Storage = function() {}, //Create a Storage Type
        storage = Object.create(Storage.prototype, {
            length: {
                value: 0,
                writable: true
            }
        }),
        _storage = local ? localStorage : sessionStorage,
        //This variable stores the type information of value.
        __typeInfo__ = JSON.parse(_storage.getItem('__typeInfo__')) || {},
        types = ['object', 'number', "boolean"];
    for (var k in _storage) {
        if (_storage.hasOwnProperty(k) && k !== '__typeInfo__') {
            var v = _storage[k];
            if (!__typeInfo__[k] || types.includes(__typeInfo__[k])) {
                try { //Try to parse the value as a JSON.
                    v = JSON.parse(v);
                } catch (e) {}
            } else if (__typeInfo__[k] === "function") {
                try { //Try to retrieve functions.
                    v = eval(v);
                } catch (e) {};
            }
            storage[k] = v;
        }
    }
    storage.length = Object.keys(storage).length;
    if (!key) { //If no argument is provided, then return all data.
        return storage;
    } else if (key === 'length') {
        //If key is 'length', which cannot be set, then return value 
        //immediately.
        return storage[key];
    } else if (arguments.length === 1) {
        //If only key is provided, then return its value.
        return storage[key];
    } else if (value === undefined) {
        //If value is undefined, then remove the data.
        _storage.removeItem(key);
    } else {
        var type = typeof value,
            _value = "";

        if (type == 'function') //Handle function.
            _value = value.toString();
        else if (type !== 'string') //Handle types other than string.
            _value = JSON.stringify(value);
        else
            _value = value;

        __typeInfo__[key] = type;
        //Store data.
        _storage.setItem(key, _value);
        //Store type information.
        _storage.setItem('__typeInfo__', JSON.stringify(__typeInfo__));
    }
    return value;
};

/**
 * Sets and retrieves Cookie data, supports String, Number, Object, Array,
 * Boolean and Function.
 * 
 * @param  {String} key     The cookie name.
 * @param  {Any}    value   The cookie data, if an `undefined` is passed, 
                            remove the previous data.
 * @param  {Any}    options It may include one or several options of these：
 *
 *                          - `expires` A timeout to expire, it could be a 
 *                          time string or a number.
 *                          - `path` The scope path, default: `/`.
 *                          - `domain` The scope domain.
 *                          - `secure` Secure storage, default: `false`.
 * 
 *                          Alternatively, you can pass this argument a `true` 
 *                          to store data one year long.
 * 
 * @return {Any}            If `key` is passed, returns the corresponding 
 *                          value it represents; if both `key` and `value` are 
 *                          passed, always returns `value`; if no argument is 
 *                          passed, returns all the data in a Cookie Object.
 */
function cookie(key = "", value = "", options = {}) {
    var aYear = 1000 * 60 * 60 * 24 * 365;
    if (options === true || options === 1)
        options = { expires: aYear };
    options = Object.assign({
        expires: 0,
        path: '/',
        domain: '',
        secure: false,
    }, options);

    var Cookie = function() {}, //Create a Cookie Type.
        cookie = Object.create(Cookie.prototype, {
            length: {
                value: 0,
                writable: true
            }
        }),
        _cookie = document.cookie ? document.cookie.split('; ') : [],
        __cookie = {},
        __typeInfo__ = {}, //This variable stores the type information.
        types = ['object', 'number', "boolean"];

    //Get all cookie pairs.
    for (var i in _cookie) {
        if (_cookie.hasOwnProperty(i)) {
            var pos = _cookie[i].indexOf('='),
                //Get key.
                k = decodeURIComponent(_cookie[i].substring(0, pos)),
                //Get value.
                v = decodeURIComponent(_cookie[i].substring(pos + 1));
            if (k === '__typeInfo__') {
                __typeInfo__ = JSON.parse(v);
            } else {
                __cookie[k] = v;
            }
        }
    }
    //Get and parse cookies.
    for (var k in __cookie) {
        var v = __cookie[k];
        if (!__typeInfo__[k] || types.includes(__typeInfo__[k])) {
            try { //Try to parse the value as a JSON.
                v = JSON.parse(v);
            } catch (e) {}
        } else if (__typeInfo__[k] === "function") {
            try { //Try to retrieve functions.
                v = eval(v);
            } catch (e) {};
        }
        cookie[k] = v;
    }
    cookie.length = Object.keys(cookie).length;
    if (!key) { //If no argument is provided, then return all data.
        return cookie;
    } else if (key === 'length') {
        //If key is 'length', which cannot be set, then return value 
        //immediately.
        return cookie[key];
    } else if (arguments.length === 1) {
        //If only key is provided, then return its value.
        return cookie[key];
    } else {
        if (value === undefined) {
            //If value is undefined, then remove the data.
            options.expires = -1000; //Make the data expired.
        }

        var type = typeof value,
            _value = "";

        if (type == 'function') //Handle function.
            _value = value.toString();
        else if (type !== 'string') //Handle types other than string.
            _value = JSON.stringify(value);
        else
            _value = value;

        __typeInfo__[key] = type;
        //Generate an expire time.
        var getExpires = function(timeout) {
            var date = new Date();
            date.setTime(date.getTime() + timeout);
            return date.toUTCString();
        };
        //Cookie setter.
        var store = function(key, value, options) {
            document.cookie = [
                encodeURIComponent(key) + '=' + encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : '',
            ].join('');
        };
        //Generate an expire time.
        if (typeof options.expires === 'number' && options.expires) {
            options.expires = getExpires(options.expires);
        }
        store(key, _value, options); //Store cookie.
        store('__typeInfo__', JSON.stringify(__typeInfo__), {
            expires: getExpires(aYear),
            path: '/',
            secure: true,
        }); //Store type information.
    }
    return value;
};

storage.storage = storage;
storage.cookie = cookie;
storage.session = function(key = "", value = "") {
    if (arguments.length === 0)
        return storage();
    else if (arguments.length === 1)
        return storage()[key];
    else
        return storage(key, value);
};
storage.local = function(key = "", value = "") {
    if (arguments.length === 0)
        return storage(true);
    else if (arguments.length === 1)
        return storage(true)[key];
    else
        return storage(key, value, true);
};

if (typeof module === 'object' && module.exports) { //NodeJs/CommonJS
    module.exports = storage;
} else if (typeof define === 'function') { //AMD
    define((require, exports, module) => {
        module.exports = storage;
    });
}