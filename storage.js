/**
 * Sets and retrieves Cookie data, supports Object and Array.
 * @param  {String} key     The cookie name.
 * @param  {Any}    value   The cookie value.
 * @param  {Any}    options It may inlcude one or several optioins of these：
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
 *                          passed, alway returns `value`; if no argument is 
 *                          passed, returns all the data in a Cookie Object.
 */
function cookie(key, value, options){
	if(options === true || options === 1)
		options = {expires: 1000*60*60*24*365};
	options = Object.assign({
		expires: 0,
		path: '/',
		domain: '',
		secure: false,
	}, options);
	
	var Cookie = function(){}, //Create a Cookie Type.
		cookie = Object.create(Cookie.prototype, {length: {value: 0, writable: true}}),
		_cookie = document.cookie ? document.cookie.split('; ') : [];
	for(var i in _cookie){
		if(_cookie.hasOwnProperty(i)){
			var pos = _cookie[i].indexOf('='),
				k = decodeURIComponent(_cookie[i].substring(0, pos)), //Get key.
				v = decodeURIComponent(_cookie[i].substring(pos+1)); //Get vlaue.
			try{ //Try to parse the value as a JSON
				v = JSON.parse(v);
			}catch(e){}
			cookie[k] = v;
		}
	}
	cookie.length = Object.keys(cookie).length;
	if(!key){
		return cookie;
	}else if(key == 'length'){
		return value;
	}else if(value === undefined){
		return cookie[key];
	}else if(value === null){
		options.expires = -1000; //Make the data expired.
	}

	if(typeof options.expires === 'number' && options.expires){
		var date = new Date();
		date.setTime(date.getTime() + options.expires);
		options.expires = date.toUTCString();
	}
	var _value = typeof value !== 'string' ? JSON.stringify(value) : value;
	//Set cookie.
	document.cookie = [
		encodeURIComponent(key)+'='+encodeURIComponent(String(_value)),
		options.expires ? '; expires='+options.expires : '',
		options.path ? '; path='+options.path : '',
		options.domain ? '; domain='+options.domain : '',
		options.secure ? '; secure' : '',
	].join('');
	return value;
};

/**
 * Sets and retrieves Storage data, supports Object and Array.
 * @param  {String}  key   The storage name.
 * @param  {Any}     value The storage value.
 * @param  {Boolean} local Use localStorage to store data, default: `false`.
 * 
 * @return {Any}           If `key` is passed, returns the corresponding 
 *                         value it represents; if both `key` and `value` are 
 *                         passed, alway returns `value`; if no argument is 
 *                         passed, returns all the data in a Storage Object.
 */
function storage(key, value, local){
	if(key === true || key === 1){
		local = key;
		key = null;
	}
	var Storage = function(){}, //Create a Storage Type
		storage = Object.create(Storage.prototype, {length: {value: 0, writable: true}}),
		_storage = local ? localStorage : sessionStorage;
	for(var k in _storage){
		if(_storage.hasOwnProperty(k)){
			var v = _storage[k];
			try{ //Try to parse the value as a JSON
				v = JSON.parse(v);
			}catch(e){}
			storage[k] = v;
		}
	}
	storage.length = Object.keys(storage).length;
	if(!key){
		return storage;
	}else if(key == 'length'){
		return value;
	}else if(value === undefined){
		return storage[key];
	}else if(value === null){
		_storage.removeItem(key);
	}else{
		var _value = typeof value !== 'string' ? JSON.stringify(value) : value;
		_storage.setItem(key, _value);
	}
	return value;
};

if(typeof module === 'object' && module.exports){ //Nodejs/CommonJS
	module.exports = {
		cookie: cookie,
		storage: storage,
	};
}else if(typeof define === 'function' && define.amd){ //AMD
	define("cookie", [], cookie);
	define("storage", [], storage);
}