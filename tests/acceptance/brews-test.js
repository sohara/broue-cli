import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;

var userJSON = {
  token: "aQXpLwsQivHhYZKZyaF2",
  email: "sohara@sohara.com",
  bio: "I like to brew. More than you."
};

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};

var brews = [
  {
    id: 1,
    name: "Awesome IPA"
  },
  {
    id: 2,
    name: "Summer Saison"
  }
];

var styles = [
  {
    id: '1',
    subcategory_id: "1A",
    subcategory_name: "Lite American Lager"
  },
  {
    id: '18',
    subcategory_id: "6A",
    subcategory_name: "Cream Ale"
  }
];

module('Acceptance: Brews', {
  setup: function() {
    App = startApp();
    localStorage.setItem('user', toS(userJSON));

    server = new Pretender(function() {
      this.get('/brews', function(){
        var response =  [200, headers, toS({brews: brews})];
        return response;
      });
      this.get('/styles', function(){
        var response =  [200, headers, toS({styles: styles})];
        return response;
      });
      this.post('/brews', function(req) {
        var brewObject = JSON.parse(req.requestBody);
        brewObject.brew.id = 3;
        return [200, headers, toS(brewObject)];
      });
      this.put('/brews/:id', function(req) {
        var brewObject = JSON.parse(req.requestBody);
        brewObject.brew.id = req.params.id;
        var jsonBody = toS( brewObject);
        return [200, headers, jsonBody];
      });
    });
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('visiting /brews', function() {
  visit('/brews');

  andThen(function() {
    equal(currentPath(), 'brews.index');
    equal(find('td:contains("Awesome IPA")').length, 1);
  });
});

test('create a new brew', function() {
  expect(3);
  visit('/brews');
  andThen(function() {
    click('a:contains("New brew")');
  });
  andThen(function() {
    fillIn("input.brew-name", "Super stuff ale");
    find('select.brew-style').val('18');
    // Need to trigger 'change' even manually in testing
    find('select.brew-style').trigger('change');
    equal(find('select.brew-style').val(), '18');
    click('button:contains("Save")');
  });
  andThen(function() {
    equal(currentPath(), 'brews.show');
    equal(find('h3:contains("Showing Brew: 3 - Super stuff ale")').length, 1);
  });
});

test('edit an existing brew', function() {
  expect(3);
  visit('/brews');
  andThen(function() {
    click('a:contains("Awesome IPA")');
  });
  andThen(function() {
    click('a:contains("Edit")');
  });
  andThen(function() {
    fillIn("input.brew-name", "Even Awesomer IPA");
    find('select.brew-style').val('18');
    // Need to trigger 'change' even manually in testing
    find('select.brew-style').trigger('change');
    click('button:contains("Save")');
  });
  andThen(function() {
    equal(currentPath(), 'brews.show');
    equal(find('h3:contains("Showing Brew: 1 - Even Awesomer IPA")').length, 1);
    equal(find('li:contains("Style: 6A - Cream Ale")').length, 1);
  });
});
