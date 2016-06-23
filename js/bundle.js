/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  function Body() {
	    this.bodyUsed = false

	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }

	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return
	      }

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(3);

	var base_url = 'https://digipass-api.herokuapp.com/api';
	var organisation_id = '576b90806013e1995016f345';
	var organisation_token = 'lol456';

	var user_id = void 0;

	var user_preferences = {};
	var user_active_filters = [];

	var refresh_switch = true;

	var available_filters = {
	  "meal_type": [{
	    "id": "1",
	    "label": "Voorgerecht",
	    "key": "entree",
	    "classes": "active",
	    "type": "meal_type"
	  }, {
	    "id": "2",
	    "label": "Hoofdgerecht",
	    "key": "main_course",
	    "classes": "active",
	    "type": "meal_type"
	  }, {
	    "id": "3",
	    "label": "Nagerecht",
	    "key": "dessert",
	    "classes": "active",
	    "type": "meal_type"
	  }],
	  "made_without": [{
	    "id": "4",
	    "label": "Gluten",
	    "key": "57669e2ed0bf105540f743d1",
	    "classes": "",
	    "type": "made_without"
	  }, {
	    "id": "5",
	    "label": "Noten",
	    "key": "57669e2ed0bf105540f743d2",
	    "classes": "",
	    "type": "made_without"
	  }, {
	    "id": "6",
	    "label": "Zuivel",
	    "key": "57669e2ed0bf105540f743c8",
	    "classes": "",
	    "type": "made_without"
	  }],
	  "dish_info": [{
	    "id": "7",
	    "label": "Vegetarisch",
	    "key": "vegetarian",
	    "classes": "",
	    "type": "dish_info"
	  }, {
	    "id": "8",
	    "label": "Veganistisch",
	    "key": "vegan",
	    "classes": "",
	    "type": "dish_info"
	  }, {
	    "id": "9",
	    "label": "Halal",
	    "key": "halal",
	    "classes": "",
	    "type": "dish_info"
	  }]
	};

	var active_filters = [];

	document.addEventListener('DOMContentLoaded', init);

	function init() {
	  document.querySelector('#users-container').addEventListener('click', select_user);
	  document.querySelector('#filters-container').addEventListener('click', toggle_filter);
	  document.querySelector('#dishes-container').addEventListener('click', flip_card);
	  document.querySelector('#show-inner-filters').addEventListener('click', toggle_inner_filters);
	  document.querySelector('#toggle-users-sidebar').addEventListener('click', toggle_user_sidebar);
	  print_filters();
	  print_dishes();
	  setInterval(fetch_users, 1000);
	  setInterval(fetch_user_preferences, 1000);
	}

	function toggle_refresh_switch() {}

	function toggle_user_sidebar(e) {
	  var button = get_parent_by_class('button', e.target);
	  if (button) {
	    document.querySelector('body').classList.toggle('users-sidebar-visible');
	    button.classList.toggle('active');
	  }
	}

	function fetch_users() {
	  console.log(base_url + '/organisations/' + organisation_id + '/users');
	  fetch(base_url + '/organisations/' + organisation_id + '/users', get_organisation_request()).then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    print_users(data);
	  });
	}

	function print_users(users) {
	  var users_container = document.querySelector('#users-container');
	  var users_html = users.map(format_user);
	  users_container.innerHTML = '<h2>Gebruikers in dit restaurant</h2><ul id="users-container-inner">' + users_html.join('') + '</ul>';
	}

	function format_user(user) {
	  user = user.user;
	  return '<li><button class="button user-button" data-id="' + user._id + '">' + user.name.first + ' ' + user.name.last + '</button></li>';
	}

	function select_user(e) {
	  var user_button = get_parent_by_class('user-button', e.target);
	  if (user_button) {
	    user_id = user_button.getAttribute('data-id');
	    var current_user_button = document.querySelector('.user-button.active');
	    if (current_user_button) {
	      current_user_button.classList.remove('active');
	    }
	    user_button.classList.add('active');
	    document.querySelector('body').classList.remove('users-sidebar-visible');
	    document.querySelector('#toggle-users-sidebar').classList.remove('active');
	    fetch_user_preferences();
	  }
	}

	function fetch_user_preferences() {
	  if (user_id && user_id != '') {
	    fetch(base_url + '/users/' + user_id + '/preferences', get_organisation_request()).then(function (response) {
	      return response.json();
	    }).then(function (data) {
	      process_user_preferences(data);
	    });
	  }
	}

	function process_user_preferences(preferences) {
	  if (preferences && preferences.length && JSON.stringify(user_preferences) != JSON.stringify(preferences)) {
	    (function () {
	      var new_active_filter_buttons = [];
	      preferences.forEach(function (preference) {
	        switch (preference.title) {
	          case 'Allergieen':
	            preference.values.forEach(function (value) {
	              available_filters.made_without.forEach(function (filter) {
	                if (value.value == "true" && filter.key == value._id) {
	                  var filter_button = document.querySelector('[data-key="' + filter.key + '"]');
	                  user_active_filters.push(get_active_filter_object(filter_button));
	                  new_active_filter_buttons.push(filter_button);
	                } else {
	                  document.querySelector('[data-key="' + filter.key + '"]').classList.remove('active');
	                }
	              });
	            });
	            break;
	          case 'Vegetarisch':
	            if (preference.values[0].value == "true") {
	              var filter_button = document.querySelector('[data-key="vegetarian"]');
	              user_active_filters.push(get_active_filter_object(filter_button));
	              new_active_filter_buttons.push(filter_button);
	            } else {
	              document.querySelector('[data-key="vegetarian"]').classList.remove('active');
	            }
	            break;
	          case 'Veganistisch':
	            if (preference.values[0].value == "true") {
	              var _filter_button = document.querySelector('[data-key="vegan"]');
	              user_active_filters.push(get_active_filter_object(_filter_button));
	              new_active_filter_buttons.push(_filter_button);
	            } else {
	              document.querySelector('[data-key="vegan"]').classList.remove('active');
	            }
	            break;
	        }
	      });
	      if (user_active_filters.length) {
	        // if (confirm("Er zijn nieuwe voorkeuren voor jou binnen gekomen. Menukaart aanpassen?")) {
	        new_active_filter_buttons.forEach(function (filter) {
	          filter.classList.add('active');
	        });
	        active_filters = active_filters.concat(user_active_filters);
	        print_dishes();
	        // }
	      }
	    })();
	  }
	  user_preferences = preferences;
	}

	function print_filters() {
	  var container = document.querySelector('#filters-container');
	  var inner_filters = container.querySelector('#inner-filters');

	  var meal_type_filters = available_filters.meal_type.map(format_filter_button);
	  var dish_info_filters = available_filters.dish_info.map(format_filter_button);
	  var made_without_filters = available_filters.made_without.map(format_filter_button);
	  inner_filters.insertAdjacentHTML('beforebegin', '<ul class="filters-container" id="meal-type-filters">' + meal_type_filters.join('') + '</ul>');
	  inner_filters.insertAdjacentHTML('beforeend', '<h2 class="filter-heading">Filters</h2><ul class="filters-container" id="dish-info-filters">' + dish_info_filters.join('') + '</ul>');
	  inner_filters.insertAdjacentHTML('beforeend', '<h2 class="filter-heading">Toon gerechten zonder</h2><ul class="filters-container" id="made-without-filters">' + made_without_filters.join('') + '</ul>');
	  init_active_filters();
	}

	function toggle_inner_filters(e) {
	  var button = get_parent_by_class('button', e.target);
	  if (button) {
	    var filters_container = document.querySelector('#filters-container');
	    filters_container.classList.toggle('inner-filters-visible');
	    button.classList.toggle('active');
	  }
	}

	function init_active_filters() {
	  active_filters = Array.prototype.slice.call(document.querySelectorAll('.filter.active')).map(get_active_filter_object);
	}

	function format_filter_button(filter) {
	  return '<li class="filter-wrapper">' + ('<button class="button filter filter-button ' + filter.classes + '" data-key="' + filter.key + '" data-value="' + (filter.value ? filter.value : '') + '" data-filter="' + filter.type + '" data-id="' + filter.id + '">' + filter.label + '</button>') + '</li>';
	}

	function toggle_filter(e) {
	  var filter = get_parent_by_class('filter', e.target);
	  if (filter) {
	    if (filter.classList.contains('active')) {
	      active_filters = active_filters.filter(function (active_filter) {
	        return active_filter.id != filter.getAttribute('data-id');
	      });
	    } else {
	      active_filters.push(get_active_filter_object(filter));
	    }
	    filter.classList.toggle('active');
	    print_dishes();
	  }
	}

	function get_active_filter_object(filter) {
	  return {
	    "id": filter.getAttribute('data-id'),
	    "type": filter.getAttribute('data-filter'),
	    "value": filter.getAttribute('data-value'),
	    "key": filter.getAttribute('data-key')
	  };
	}

	function filter_dish(item) {
	  var keep_dish = true;
	  var temp_keep_dish = false;
	  var break_loop = false;
	  active_filters.forEach(function (active_filter) {
	    if (break_loop) return;
	    switch (active_filter.type) {
	      case 'meal_type':
	        temp_keep_dish = !temp_keep_dish ? item.meal_type == active_filter.key : true;
	        break;
	      case 'made_without':
	        item.allergens.forEach(function (allergen) {
	          if (allergen.key == active_filter.key) {
	            keep_dish = false;
	            break_loop = true;
	          }
	        });
	        break;
	      case 'dish_info':
	        item.filters.forEach(function (filter) {
	          if (filter.key == active_filter.key && !filter.value) {
	            keep_dish = false;
	            break_loop = true;
	          }
	        });
	        break;
	    }
	  });
	  return keep_dish ? temp_keep_dish : keep_dish;
	}

	function print_dishes() {
	  fetch('menu.json').then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    document.querySelector('#dishes-container').innerHTML = data.filter(filter_dish).map(format_card).join('');
	  });
	}

	function format_card(item) {
	  return '<div class="card">' + '<div class="front">' + ('<img src="' + item.image + '">') + '<div class ="bar">' + ('<h4>' + item.course + '</h4>') + '</div>' + ('<h3>' + item.name + '</h3>') + '</div>' + '<div class="back">' + '<div class="bar">' + '<h4>Ingredients</h4>' + '</div>' + ('<p>' + item.ingredients.join(" - ") + '</p>') + '<div class ="bar">' + '<h4>Origin</h4>' + '</div>' + ('' + format_dish_origins(item.origin)) + '</div>' + '</div>';
	}

	function format_dish_origins(origins) {
	  var origins_html = origins.map(format_origin);
	  return '<ul>' + origins_html.join('') + '</ul>';
	}

	function format_origin(origin) {
	  return '<li>' + origin.title + ' - ' + origin.origin + '</li>';
	}

	function flip_card(e) {
	  var card = get_parent_by_class('card', e.target);
	  if (card) {
	    card.classList.toggle('flip');
	  }
	}

	function get_parent_by_class(parentClass, child) {
	  var node = child;
	  while (node != null) {
	    if (node.className && node.classList.contains(parentClass)) {
	      return node;
	    }
	    node = node.parentNode;
	  }
	  return false;
	}

	function get_organisation_request() {
	  var headers = new Headers({
	    "Authorization": "Bearer " + organisation_token
	  });
	  return {
	    headers: headers
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "body {\n  margin: 0;\n  background-color: #282828;\n  transition: left 0.2s ease-in-out;\n  left: 0;\n  width: 100%;\n  position: absolute; }\n  body.users-sidebar-visible {\n    left: 400px; }\n\n#dishes-container {\n  margin: 0 auto;\n  width: 80%;\n  overflow: visible;\n  display: flex;\n  display: -webkit-flex;\n  -webkit-flex-wrap: wrap;\n  /* Safari 6.1+ */\n  flex-wrap: wrap;\n  -webkit-transform: translateZ(0);\n  -moz-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  -o-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-font-smoothing: antialiased;\n  justify-content: center; }\n\nh1 {\n  color: white;\n  text-align: center;\n  font-family: 'Signika', sans-serif; }\n\nh2 {\n  text-align: center;\n  color: #fff;\n  font-family: 'Signika', sans-serif;\n  margin: 16px 8px; }\n\n.card {\n  flex: 1 0 0px;\n  -webkit-flex: 1 0 0;\n  perspective: 900px;\n  min-width: 350px;\n  max-width: 350px;\n  margin: 0 8px 40px 8px;\n  position: relative;\n  transform-style: preserve-3d;\n  -webkit-transform-style: preserve-3d;\n  height: 500px;\n  cursor: pointer;\n  backface-visibility: hidden;\n  -webkit-backface-visibility: hidden; }\n  .card img {\n    width: 100%;\n    display: block; }\n  .card.flip .front {\n    transform: rotateY(180deg); }\n  .card.flip .back {\n    transform: rotateY(0deg); }\n  .card .front, .card .back {\n    height: 100%;\n    background-color: white;\n    width: 100%;\n    position: absolute;\n    backface-visibility: hidden;\n    -webkit-backface-visibility: hidden;\n    transform-style: preserve-3d;\n    -webkit-transform-style: preserve-3d;\n    transition: transform .5s ease-in-out; }\n    .card .front *, .card .back * {\n      -webkit-transform: translate3d(0, 0, 0); }\n  .card .front {\n    transform: rotateY(0deg);\n    z-index: 2; }\n  .card .back {\n    transform: rotateY(-180deg); }\n  .card h3 {\n    color: black;\n    font-style: italic;\n    padding-left: 20px;\n    font-size: 16px;\n    font-family: 'PT Serif Caption', serif; }\n  .card .bar {\n    color: white;\n    background-color: #898989;\n    font-family: 'Hind', sans-serif; }\n    .card .bar h4 {\n      padding-left: 20px;\n      padding-top: 12px;\n      padding-bottom: 6px;\n      margin-top: 0;\n      font-size: 18px; }\n  .card p {\n    font-family: 'Hind', sans-serif;\n    margin-top: -20px;\n    padding-bottom: 10px;\n    padding-left: 20px; }\n\n#users-container {\n  position: fixed;\n  top: 0;\n  left: -400px;\n  width: 400px;\n  height: 100%;\n  transition: left 0.2s ease-in-out; }\n  #users-container ul {\n    padding-left: 0; }\n  #users-container li {\n    list-style: none;\n    text-align: center; }\n  .users-sidebar-visible #users-container {\n    left: 0; }\n\n#toggle-users-sidebar {\n  position: fixed;\n  top: 16px;\n  left: 16px;\n  transition: left 0.2s ease-in-out; }\n  #toggle-users-sidebar span {\n    padding-right: 8px; }\n  #toggle-users-sidebar .user-icon {\n    position: absolute;\n    margin-top: -4px; }\n  .users-sidebar-visible #toggle-users-sidebar {\n    left: 416px; }\n\n#filters-container {\n  min-width: 350px;\n  max-width: 850px;\n  width: 80%;\n  margin: 0 auto 24px; }\n\n.filters-container {\n  display: flex;\n  padding-left: 0;\n  justify-content: center;\n  flex-wrap: wrap;\n  margin-top: 0; }\n\n.filter-wrapper {\n  list-style: none; }\n\n#inner-filters {\n  overflow: hidden;\n  max-height: 0;\n  transition: all 0.2s ease-in-out; }\n  .inner-filters-visible #inner-filters {\n    max-height: 625px; }\n    @media (min-width: 768px) {\n      .inner-filters-visible #inner-filters {\n        max-height: 460px; } }\n    @media (min-width: 980px) {\n      .inner-filters-visible #inner-filters {\n        max-height: 310px; } }\n\n#show-inner-filters span {\n  padding-right: 8px; }\n\n#show-inner-filters .arrow-down {\n  transition: transform 0.2s ease-in-out;\n  position: absolute;\n  margin-top: -4px; }\n\n#show-inner-filters.active .arrow-down {\n  transform: rotate(180deg); }\n\n.button {\n  min-width: 150px;\n  max-width: 350px;\n  width: 245px;\n  margin: 1em;\n  padding: 1em 2em;\n  background: none;\n  vertical-align: middle;\n  position: relative;\n  z-index: 1;\n  -webkit-backface-visibility: hidden;\n  -moz-osx-font-smoothing: grayscale;\n  color: #A5D6E7;\n  font-size: 14px;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  cursor: pointer;\n  overflow: hidden;\n  transition: border-color 0.3s, color 0.3s;\n  transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);\n  border: 3px solid #37474F;\n  flex: 1; }\n  .button::before {\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 150%;\n    height: 100%;\n    background: #37474f;\n    z-index: -1;\n    transform: rotate3d(0, 0, 1, -45deg) translate3d(0, -3em, 0);\n    transform-origin: 0% 100%;\n    transition: transform 0.3s, opacity 0.3s, background-color 0.3s; }\n  .button:hover {\n    color: #fff;\n    border-color: #3f51b5; }\n  .button:hover::before {\n    opacity: 1;\n    background-color: #3f51b5;\n    transform: rotate3d(0, 0, 1, 0deg);\n    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1); }\n  .button.active {\n    color: #fff;\n    border-color: #3f51b5; }\n    .button.active:before {\n      opacity: 1;\n      background-color: #3f51b5;\n      transform: rotate3d(0, 0, 1, 0deg);\n      transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1); }\n    .button.active:hover:before {\n      transform: rotate3d(0, 0, 1, -45deg) translate3d(0, -3em, 0); }\n", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);