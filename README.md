# URL.Address

URL.Address is a fully fledged JavaScript wrapper to combine the functionality of **HTML5 History (pushstate and popstate)** and **onhashchange hashbangs**.

There are other plugins out there that are similar, but URL.Address provides more than meets the eye ;)

## Features

### 1. Vanilla JavaScript

100% framework-independent and can be used with **MooTools**, **JQuery**, **Dojo**, **YUI**, **Prototype**, **Ext.js**, etc...

### 2. Combines HTML5 History and Hashbangs

This tool uses HTML5 History and delegates down to hashbangs if the browser doesn't support it. No configuration or work is required to make this work. HTML History can also be overridden to make way for full hashbang support

### 3. Provides full support for Anchor tags

Other frameworks simply override the onhashchange method and prevent existing anchor tags from working. URL.Address combines both HTML5 history and onhashchange while also providing support for events for anchor changes.

### 4. optional onLoad event

HTML5 History usually fires an early pushState event when started while onhashchange doesn't. URL.Address can be configured to include an onload event or it can skip the onload event. This is useful for full JavaScript applications.


## Usage

First include the script into your webpage:

```html
<script type="text/javascript" src="/path/to/URL.Address.js"></script>
```

And then setup your JavaScript:

```javascript
//will fire for http://website.com/#!/page (onhashchange hashbangs)
//will fire for http://website.com/page    (HTML5 history)
window.onAddressChange = function(url) {
  alert(url);
};

//will fire for http://website.com/#!/page#anchor
//will fire for http://website.com/page/#anchor
window.onAnchorChange = function(url) {
  alert('anchor=' + url);
};

//Setting the adress manually
window.setAddress(url);
```

## Special Methods

```javascript
window.setAddress(path) //sets either the HTML5 history or hashbang

window.replaceAddress(path) //replaces the path (in HTML5 history) or sets the hashbang (onhashchange)

window.getAddress(path) //returns the path (in HTML5 history) or gets the path after the hashbang (onhashchange)

window.setAnchor(path) //sets the anchor

window.setHash(path) //sets the hashbang URL

window.setLocation(path) //sets the window.location.href property
```

## Browser Support

Works

## More Info + Demo

http://yearofmoo.com/code/URL.Address.html
