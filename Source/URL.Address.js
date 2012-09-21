(function() {

  var $getConfig = function(key, def) {
    var value = window[key];
    if(value == null) {
      value = def;
      $setConfig(key, value);
    }
    return value;
  };

  var $collapseHash = function(url) {
    if(url && url.length > 0) {
      if(url.charAt(0) == '#') url = url.substr(1);
      if(url.charAt(0) == '!') url = url.substr(1);
      return url;
    }
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

  window.getAnchor = function(anchor) {
    var hash = window.location.hash;
    var index = hash.lastIndexOf('#');
    if(index >= 0) {
      if(hash[index+1] == '!') {
        hash = null;
      }
      else {
        hash = hash.substr(index);
      }
    }
    return hash;
  };

  window.setAnchor = function(anchor) {
    anchor = $collapseHash(anchor);
    var current = window.location.hash;
    anchor = '#' + anchor;
    var hash = anchor;
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
    return hash;
  };

  window.setHash = function(path) {
    path = $collapseHash(path);
    if(path.charAt(0) == '/') path = path.substr(1);
    var hash = '#!/' + path;
    window.location.hash = hash;
    return hash;
  };

  window.setLocation = function(url) {
    window.location.href = url;
  };

  window.getLocation = function(url) {
    return new String(window.location.href);
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
    url = $collapseHash(url);
    $fireEvent(window, 'onAddressChange', [url, prev, state, title]);
  };

  var getURLMatchState = function(a,b) {
    if(a == null || a.length == 0 || b == null || b.length == 0) return 0;

    var cA = a.charAt(0);
    var cB = b.charAt(0);

    if(cA != '#' && cA != '/') {
      a = getPath(a);
    }
    else if(cA == '#' && a.charAt(1) == '!') {
      a = $collapseHash(a);
    }

    if(cB != '#' && cB != '/') {
      b = getPath(b);
    }
    else if(cB == '#' && b.charAt(1) == '!') {
      b = $collapseHash(b);
    }

    var splitA = a.split('#');
    var splitB = b.split('#');

    var state = 0;
    if(a.charAt(0) == '#') {
      ++state;
    }

    var aHash = splitA[1] || '';
    var bHash = splitB[1] || '';
    if(aHash.length == 0 && bHash.length > 0) {
      --state;
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
  var _onChange     = function() { };
  var skipFirst     = $getConfig('URL.Address.skipFirst'      , true);
  var useHistory    = $getConfig('URL.Address.useHTML5History', true);
  var collapseHash  = $getConfig('URL.Address.collapseHashbang', true);
  var _previousURL = getPath();

  //
  //HTML5 History
  //
  if(useHistory && window.history && 'pushState' in window.history) {
    if(skipFirst && _previousURL) {
      if(_previousURL.indexOf('#!')>=0) {
        skipFirst = false;
      }
    }; 

    _onChange = function(path, state, title, force) {
      var s = 0;
      path = path || getPath();

      if(path.charAt(0) == '#' && path.charAt(1) == '!') {
        path = $collapseHash(path);
      }

      if(_previousURL != path) {
        s = getURLMatchState(path, _previousURL);
      }
      else if(path.indexOf('#') >= 0) {
        s = 1;
      }
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

    if(collapseHash) {
      var u = window.location.hash || '';
      if(u.indexOf('#!') >= 0) {
        skipFirst = true;
        window.onload = function() {
          window.setAddress(u); 
        };
      }
    }

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
      if(url.charAt(0) == '#' && url.charAt(1) == '!') {
        url = $collapseHash(url);
      }
      window.history.pushState(state || {},title,url);
      _onChange(url,state,title);
    };

    window.replaceAddress = function(url,state,title) {
      if(url.charAt(0) == '#' && url.charAt(1) == '!') {
        url = $collapseHash(url);
      }
      window.history.replaceState(state || {},title,url);
      _onChange(url,state,title);
    };

  }
  else if('onhashchange' in window || 'onhashchange' in document) { //onhashchange

    var isFirst = true;

    _previousURL = getHash(_previousURL);
    _previousURL = $collapseHash(_previousURL);

    _onChange = function() {
      var path = getCurrentHash();
      var s = 0;

      if(path.charAt(0) == '#' && path.charAt(1) != '!') {
        s = 1;
      }
      else if(isFirst == false) {
        path = $collapseHash(path);
        if(path != _previousURL) {
          s = getURLMatchState(path, _previousURL);
        }
        else if(path.indexOf('#') >= 0) {
          s = 1; //anchor change
        }
      }

      isFirst = false;

      if(s >= 1) {
        _onAnchorChange(path);
      }
      else {
        path = $collapseHash(path);
        _onAddressChange(path);
        _onHashChange(path);
      }
      _previousURL = path;
    };

    ('onhashchange' in window ? window : document).onhashchange = _onChange;

    window.setAddress = function(path) {
      if(path.charAt(0) == '#' && path.charAt(1) != '!') {
        var current = window.getAnchor();
        var anchor = window.setAnchor(path);
        if(current == anchor) {
          _onChange();
        }
      }
      else {
        var current = window.location.hash;
        var hash = window.setHash(path);
        if(current == hash) {
          _onChange();
        }
      }
    }

    if(!skipFirst) {
      window.onload = _onChange;
    }
    else if(collapseHash) {
      var u = window.location.hash;
      if(u && u.indexOf('#!') >= 0) {
        window.onload = function() {
          _onChange(); 
        };
      }
    }
  }
  else {
    window.setAddress = window.setHash = window.replaceAddress = window.setLocation;
  }

})();
