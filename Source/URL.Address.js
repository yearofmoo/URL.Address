(function() {

  var $getConfig = function(key, def) {
    var value = window[key];
    if(value == null) {
      value = def;
      $setConfig(key, value);
    }
    return value;
  };

  var $setConfig = function(key, value) {
    window[key] = value;
  };

  var $fireEvent = function(object, event, args) {
    if(window[event]) {
      window[event].apply(window, args);
    }
  };

  var _previousURL;

  var getPath = function(path) {
    path = path || window.location.href.toString();
    return (path.match(/^.+?\/\/[^\/]+(\/.*)?$/) || [null,null])[1];
  };

  var getHash = function(url) {
    var pos = url.indexOf('#');
    return pos >= 0 ? url.substr(pos) : null;
  };

  var getCurrentHash = function() {
    return window.location.hash;
  };

  window.getAddress = function() {
    var path = getPath();
    var index = path.indexOf('#!');
    if(index > 0) {
      path = path.substr(index + 2);
    }
    return path;
  };

  window.setAnchor = function(anchor) {
    if(anchor.charAt(0) == '#') anchor = anchor.substr(1);
    if(anchor.charAt(0) == '!') anchor = anchor.substr(1);
    var current = window.location.hash;
    anchor = '#' + anchor;
    var index = current.indexOf('#!');
    if(current.length > 0 && index >= 0) {
      var remainder = current.substr(index + 2);
      var max = remainder.indexOf('#');
      if(max > 0) {
        current = '#!' + remainder.substr(0, max);
      }
      anchor = current + anchor;
    }
    window.location.hash = anchor;
  };

  window.setHash = function(path) {
    if(path.charAt(0) == '#') path = path.substr(1);
    if(path.charAt(0) == '!') path = path.substr(1);
    if(path.charAt(0) == '/') path = path.substr(1);
    window.location.hash = '#!/' + path;
  };

  window.setLocation = function(url) {
    window.location.href = url;
  };

  var _onAnchorChange = function(url) {
    var prev;
    if(_previousURL != url) {
      prev = _previousURL;
    }
    var index = url.indexOf('#');
    if(index > 0) {
      url = url.substr(index);
    }
    else if(index == -1) {
      url = '#';
    }
    $fireEvent(window, 'onAnchorChange', [url, prev]);
  };

  var _onHashChange = function(url) {
    $fireEvent(window, 'onHashChange', [url]);
  };

  var _onAddressChange = function(url, state, title) {
    var prev;
    if(_previousURL != url) {
      prev = _previousURL;
    }
    $fireEvent(window, 'onAddressChange', [url, prev, state, title]);
  };

  var getURLMatchState = function(a,b) {
    if(a == null || a.length == 0 || b == null || b.length == 0) return 0;

    var cA = a.charAt(0);
    var cB = b.charAt(0);

    if(cA != '#' && cA != '/') a = getPath(a);
    if(cB != '#' && cB != '/') b = getPath(b);

    var splitA = a.split('#');
    var splitB = b.split('#');

    var state = 0;
    if(a.charAt(0) == '#') {
      ++state;
    }

    if(splitA[0] == splitB[0]) {
      ++state;
    }

    if(state > 0 && splitA.length > 1 && splitA[1] == splitB[1]) {
      ++state;
    }

    return state;
  };


  //
  // Config Values
  //
  var skipFirst   = $getConfig('URL.Address.skipFirst'      , true);
  var useHistory  = $getConfig('URL.Address.useHTML5History', true);
  var _previousURL = getPath();

  //
  //HTML5 History
  //
  if(useHistory && window.history && 'pushState' in window.history) {

    var _onChange = function(path, state, title, force) {
      var s = getURLMatchState(path, _previousURL);
      _previousURL = path;
      if(force) {
        s = 0;
      }

      if(s >= 1) {
        _onAnchorChange(path);
      }
      else {
        _onAddressChange(path, state, title);
      }

    };

    var _counter = 0;
    window.onpopstate = function(e) {
      var isFirst = _counter++ == 0;
      if(!skipFirst || (skipFirst && isFirst == false)) {
        var title;
        var state = e ? e.state : window.history.state;
        var path = getPath();
        _onChange(path, state, title, isFirst);
      }
    };

    window.setAddress = function(url,state,title) {
      if(url.substr(0,2) == '#!') {
        url = url.substr(2);
      }
      window.history.pushState(state || {},title,url);
      _onChange(url,state,title);
    }

    window.replaceAddress = function(url,state,title) {
      if(url.substr(0,2) == '#!') {
        url = url.substr(2);
      }
      window.history.replaceState(state || {},title,url);
      _onChange(url,state,title);
    }

  }
  else if('onhashchange' in window || 'onhashchange' in document) { //onhashchange

    _previousURL = getHash(_previousURL);

    var _onChange = function() {
      var path = getCurrentHash();
      var s = 0;

      if(path.charAt(0) == '#' && path.charAt(1) != '!') {
        s = 1;
      }
      else {
        if(path.charAt(0) == '#') path = path.substr(1);
        if(path.charAt(0) == '!') path = path.substr(1);
        s = getURLMatchState(path, _previousURL);
      }

      if(s >= 1) {
        _onAnchorChange(path);
      }
      else {
        _onAddressChange(path);
        _onHashChange(path);
      }
      _previousURL = path;
    };

    ('onhashchange' in window ? window : document).onhashchange = _onChange;

    window.setAddress = function(path) {
      if(path.charAt(0) == '#' && path.charAt(1) != '!') {
        window.setAnchor(path);
      }
      else {
        window.setHash(path);
      }
    }

    if(!skipFirst) {
      window.onload = _onChange;
    }
  }
  else {
    window.setAddress = window.setHash = window.replaceAddress = window.setLocation;
  }

})();
