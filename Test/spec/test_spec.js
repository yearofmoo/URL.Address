describe('Test URL.Address', function(){

  var onAddressChange = function() {};
  var onAnchorChange = function() {};

  before(function() {
    window.onAddressChange = function(url, title, state) {
      onAddressChange(url, title, state);
    };
    window.onAnchorChange = function(url) {
      onAnchorChange(url);
    };
  });

  beforeEach(function() {
    onAddressChange = function() {};
    onAnchorChange = function() {};
    window.setAddress('/');
  });

  describe('Test URL Parsing', function(){

    it("should change the URL", function(done) {
      var u = '/something';
      onAddressChange = function(url, title, state) {
        expect(url).to.equal(u);
        done();
      };

      window.setAddress(u);
    });

    it("should filter out the hashbang", function(done) {
      var u = '/other';
      onAddressChange = function(url, title, state) {
        expect(url).to.equal(u);
        done();
      };

      window.setAddress('#!' + u);
    });

    it("should set an anchor", function(done) {
      var u = '#/other';
      onAddressChange = function(url) {
        throw new Error;
      };
      onAnchorChange = function(anchor) {
        expect(anchor).to.equal(u);
        done();
      };

      window.setAnchor(u);
    });

    it("should set an anchor if the base of the URL is the same", function(done) {
      var one = '/other';
      var two = '/other#anchor';
      var counter = 0;
      onAddressChange = function(url) {
        ++counter;
        if(counter > 2) {
          throw new Error();
        }
        window.setAddress(two);
      };

      onAnchorChange = function(anchor) {
        expect(anchor).to.equal('#anchor');
        done();
      };

      window.setAddress(one);
    });

    it("should have an empty anchor when no anchor is set and the URL is the same", function(done) {
      var one = '/other#anchor';
      var two = '/other';
      onAddressChange = function(url) {
        window.setAddress(two);
        done();
      };

      onAnchorChange = function(anchor) {
        expect(anchor).to.equal('#');
        done();
      };

      window.setAddress(one);
    });

    it("should be a new URL if the base of the URL is the same even if it has an anchor", function(done) {
      var one = '/other1#one';
      var two = '/other2#two';
      onAddressChange = function(url) {
        onAddressChange = function(url) {
          expect(url).to.equal(two);
          done();
        };
        window.setAddress(two);
      };
      window.setAddress(one);
    });

  });

  //describe('Test URL Parsing', function(){

})
