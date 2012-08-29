URL.Address
-----------

URL.Address is a fully fledged JavaScript wrapper to combine the functionality of **HTML5 History (pushstate and popstate)** and **onhashchange hashbangs**.

There are other plugins out there that are similar, but URL.Address provides more than meets the eye ;)

### Vanilla JavaScript

100% framework-independent and can be used with **MooTools**, **JQuery**, **Dojo**, **YUI**, **Prototype**, **Ext.js**, etc...

### Provides full support for Anchor tags

Other frameworks simply override the onhashchange method and prevent existing anchor tags from working. URL.Address combines both HTML5 history and onhashchange while also providing support for events for anchor changes.


## Usage

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

## Browser Support


## More Info + Demo

http://yearofmoo.com/code/URL.Address.html
