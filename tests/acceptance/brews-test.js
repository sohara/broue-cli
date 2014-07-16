import Ember from 'ember';
import startApp from '../helpers/start-app';
import stubs from '../helpers/pretender-stubs';

var App, server, Stubs;

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};


var nativeConfirm = window.confirm;

module('Acceptance: Brews', {
  setup: function() {
    window.confirm = function() { return true; };
    App = startApp();
    Stubs = stubs();
    localStorage.setItem('user', toS(Stubs.userJSON));

    server = new Pretender(function() {

      this.get('/brews', function(){
        var response =  [200, headers, toS({brews: Stubs.brews,
          fermentable_additions: Stubs.fermentable_additions,
          fermentables: Stubs.fermentables,
          hop_additions: Stubs.hop_additions,
          hops: Stubs.hops,
          yeast_additions: Stubs.yeast_additions,
          yeasts: Stubs.yeasts,
          styles: Stubs.styles})];
        return response;
      });
      this.get('/styles', function(){
        var response =  [200, headers, toS({styles: Stubs.styles})];
        return response;
      });
      this.post('/brews', function(req) {
        var brewObject = JSON.parse(req.requestBody);
        brewObject.brew.id = 3;
        return [200, headers, toS(brewObject)];
      });
      this.put('/brews/:id', function(req) {
        var brewObject = Stubs.brews.findBy('id', parseInt(req.params.id));
        var requestBrew = JSON.parse(req.requestBody).brew;
        var mergedBrew = jQuery.extend(brewObject, requestBrew);
        var jsonBody = toS( {brew: brewObject});
        return [200, headers, jsonBody];
      });
      this.get('/brews/:id', function(req) {
        var brewObject = Stubs.brews.findBy('id', parseInt(req.params.id));
        var jsonBody = toS( { brew: brewObject,
          fermentable_additions: Stubs.fermentable_additions,
          fermentables: Stubs.fermentables,
          hop_additions: Stubs.hop_additions,
          hops: Stubs.hops,
          yeast_additions: Stubs.yeast_additions,
          yeasts: Stubs.yeasts,
          styles: Stubs.styles,
          notes: Stubs.notes } );
        return [200, headers, jsonBody];
      });
      this.get('/users/:id', function(req) {
        return [200, headers, toS({user: user})];
      });
    });
    server.unhandledRequest = function(verb, path, request){
      verb; // HTTP verb
      path; // path requested
      request; // xhr object

      // default behavior
      throw new Error("Pretender intercepted "+verb+" "+path+" but no handler was defined for this type of request")
    };
  },
  teardown: function() {
    window.confirm = nativeConfirm;
    localStorage.removeItem('user');
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('visiting /my-brews', function() {
  visit('/my-brews');

  andThen(function() {
    equal(currentPath(), 'brews.index');
    equal(find('td:contains("Awesome IPA")').length, 1);
  });
});

test('create a new brew', function() {
  expect(3);
  visit('/my-brews');
  andThen(function() {
    click('a:contains("New Brew")');
  });
  andThen(function() {
    fillIn("div.name input", "Super stuff ale");
    find('div.style select').val('18');
    // Need to trigger 'change' even manually in testing
    find('div.style select').trigger('change');
    equal(find('div.style select').val(), '18');
    click('button:contains("Save")');
  });
  andThen(function() {
    equal(currentPath(), 'brew.recipe.index');
    equal(find('h2:contains("Super stuff ale")').length, 1);
  });
});

test('edit an existing brew', function() {
  expect(3);
  visit('/my-brews');
  andThen(function() {
    click('a:contains("Awesome IPA")');
  });
  andThen(function() {
    click('a:contains("Edit")');
  });
  andThen(function() {
    fillIn("div.name input", "Even Awesomer IPA");
    find('div.style select').val('18');
    // Need to trigger 'change' even manually in testing
    find('div.style select').trigger('change');
    click('button:contains("Save")');
  });
  andThen(function() {
    equal(currentPath(), 'brew.recipe.index');
    equal(find('h2:contains("Even Awesomer IPA")').length, 1);
    equal(find('h2:contains("Cream Ale")').length, 1);
  });
});

test('edit brew specs', function() {
  visit('/brews/1');
  andThen(function() { click('a:contains("Specs")'); });
  andThen(function() { click('a.edit-specs:contains("Edit")'); });
  andThen(function() {
    fillIn('.batch-size-litres input', '29')
    fillIn('.boil-loss-litres input', '6')
    fillIn('.water-grain-ratio-metric input', '2.5')
    click('button:contains("Save")');
    andThen(function() {
      equal(currentPath(), 'brew.specs.index');
      equal(find('table tr:first td:last').text().trim(), '7.66 gallons');
      equal(find('div.slate-statbox:contains("Strike Water") div:contains("15.19 gallons")').length, 1);
    });
  })
});

test('edit brew day records', function() {
  visit('/brews/1');
  andThen(function() { click('a:contains("Brew Day")'); });
  andThen(function() { click('a.edit-specs:contains("Edit")'); });
  andThen(function() {
    fillIn('.brew-date input', '2014-06-25')
    fillIn('.recorded-original-gravity input', '1.048')
    click('button:contains("Save")');
    andThen(function() {
      equal(currentPath(), 'brew.brew_day.index');
      equal(find('table tr:first td:last').text(), '2014-06-25');
    });
  })
});

