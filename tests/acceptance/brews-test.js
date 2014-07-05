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
    style_id: 1,
    fermentable_addition_ids: [139],
    hop_addition_ids: [202],
    yeast_addition_ids: [14]
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

var fermentable_additions = [
  {
    brew_id: 1,
    fermentable_id: 45,
    id: 139,
    weight: 23000
  }
];

var fermentables = [
  {
    coarse_fine_difference: 1,
    color: 2.7,
    fermentable_type: "Grain",
    id: 45,
    moisture: 4.1,
    name: "Superior Pale Ale",
    supplier: "Canada Malting",
    total_yield: 80
  }
];

var hop_additions = [
  {
    alpha_acids: 15.1,
    boil_time: 62,
    brew_id: 1,
    form: "Pellet",
    hop_id: 45,
    id: 202,
    use: "First Wort",
    weight: 100
  }
];

var hops = [
  {
    alpha_acids: 16,
    id: 45,
    name: "Warrior"
  }
];

var yeast_additions = [
  {id:14, amount:50, yeast_id:40, brew_id:1, unit:null}
];

var yeasts = [
  {
    attenuation_high: 85,
    attenuation_low: 78,
    flocculation: "Medium",
    form: "Liquid",
    id: 40,
    name: "Belgian Saison II Yeast",
    notes: "Saison strain with more fruity ester production than with WLP565. Moderately phenolic, with a clove-like characteristic in finished beer flavor and aroma. Ferments faster than WLP565.",
    product_id: "WLP566",
    supplier: "White Labs",
    temperature_high: 26,
    temperature_low: 20
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
        var response =  [200, headers, toS({brews: brews,
          fermentable_additions: fermentable_additions,
          fermentables: fermentables,
          hop_additions: hop_additions,
          hops: hops,
          yeast_additions: yeast_additions,
          yeasts: yeasts,
          styles: styles})];
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
      this.get('/brews/:id', function(req) {
        var brewObject = brews.findBy('id', parseInt(req.params.id));
        var jsonBody = toS( { brew: brewObject,
          fermentable_additions: fermentable_additions,
          fermentables: fermentables,
          hop_additions: hop_additions,
          hops: hops,
          yeast_additions: yeast_additions,
          yeasts: yeasts,
          styles: styles} );
        return [200, headers, jsonBody];
      });
      this.put('/fermentable_additions/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.fermentable_addition.id = req.params.id;
        bodyObject.fermentables = fermentables;
        var jsonBody = toS( bodyObject );
        return [200, headers, body];
      });
      this.put('/hop_additions/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.hop_addition.id = req.params.id;
        bodyObject.hops = hops;
        var jsonBody = toS( bodyObject );
        return [200, headers, body];
      });
      // this.get('fermentables', function(req) {
      //   var response =  [200, headers, toS({fermentables: fermentables})];
      //   return response;
      // });
      this.put('/fermentables/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.fermentable_addition.id = req.params.id;
        var jsonBody = toS( bodyObject );
        return [200, headers, jsonBody];
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
    equal(currentPath(), 'brews.brew.recipe.index');
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
    equal(currentPath(), 'brews.brew.recipe.index');
    equal(find('h2:contains("Even Awesomer IPA")').length, 1);
    equal(find('h2:contains("Cream Ale")').length, 1);
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

test("edit a brew's fermentable additions", function() {
  visit('/brews/1');
  andThen(function() {
    equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.049")').length, 1);
    click('tr:contains("Superior Pale Ale") a[title="Edit"]') ;
  });
  andThen(function() {
    fillIn('div:contains("Weight") input', "22000");
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.046")').length, 1);
  });
});

test("edit a brew's hop additions", function() {
  visit('/brews/1');
  andThen(function() {
    equal(find('div.slate-statbox:contains("Bitterness") div:contains("30.6")').length, 1);
    click('tr:contains("Warrior") a[title="Edit"]') ;
  });
  andThen(function() {
    fillIn('div.weight input', "125");
    fillIn('div.alpha-acids input', "16.2");
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    equal(find('div.slate-statbox:contains("Bitterness") div:contains("41")').length, 1);
  });
});

test("edit a brew's yeast additions", function() {
  visit('/brews/1');
  andThen(function() {
    click('tr:contains("Belgian Saison") a[title="Edit"]') ;
  });
  andThen(function() {
    fillIn('div.amount input', "75");
    find('select.yeast-unit').val('vial(s) of liquid yeast');
    // Need to trigger 'change' even manually in testing
    find('select.yeast-unit').trigger('change');
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    equal(find('tr:contains("vial(s) of liquid yeast") td:contains("75")').length, 1);
  });
});
