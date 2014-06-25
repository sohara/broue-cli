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
    name: "Awesome IPA",
    created_at: "2012-09-12T11:59:04Z",
    batch_size: 120,
    boil_loss: 10,
    efficiency: 82,
    grain_temp: 20,
    target_mash_temp: 69,
    water_grain_ratio: 3,
    style_id: 1
  },
  {
    id: 2,
    name: "Summer Saison",
    created_at: "2014-06-23T21:56:31Z",
    batch_size: 120,
    boil_loss: 10,
    efficiency: 82,
    grain_temp: 20,
    target_mash_temp: 69,
    water_grain_ratio: 3,
    style_id: 18
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
    click('a:contains("New Brew")');
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
    equal(currentPath(), 'brews.brew.show');
    equal(find('h2:contains("Super stuff ale")').length, 1);
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
    equal(currentPath(), 'brews.brew.show');
    equal(find('h2:contains("Even Awesomer IPA")').length, 1);
    equal(find('li:contains("Style: 6A - Cream Ale")').length, 1);
  });
});

test('edit brew specs', function() {
  visit('/brews/1');
  andThen(function() { click('a:contains("Specs")'); });
  andThen(function() { click('a.edit-specs:contains("Edit")'); });
  andThen(function() {
    fillIn('.batch-size input', '29')
    fillIn('.boil-loss input', '6')
    click('button:contains("Save")');
    andThen(function() {
      equal(currentPath(), 'brews.brew.specs.index');
      equal(find('table tr:first td:last').text(), '29 litres');
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
      equal(currentPath(), 'brews.brew.brew_day.index');
      equal(find('table tr:first td:last').text(), '2014-06-25');
    });
  })
});
