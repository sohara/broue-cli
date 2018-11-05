import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'broue/tests/helpers/module-for-acceptance';
import Pretender from 'pretender';
import startApp from '../helpers/start-app';
import stubs from '../helpers/pretender-stubs';
import { fillSelectFromValue } from '../helpers/acceptance-helpers';

var App, server, Stubs;

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};


var nativeConfirm = window.confirm;

moduleForAcceptance('Acceptance: Recipes', {
  beforeEach() {
    window.confirm = function() { return true; };
    App = startApp();
    Stubs = stubs();
    window.localStorage.setItem('user', toS(Stubs.userJSON));

    server = new Pretender(function() {
      this.get('/api/v1/brews/:id', function(req) {
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
      this.get('/api/v1/fermentables', function() {
        var response =  [200, headers, toS({fermentables: Stubs.fermentables})];
        return response;
      });
      this.put('/api/v1/fermentable_additions/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.fermentable_addition.id = req.params.id;
        bodyObject.fermentables = Stubs.fermentables;
        var jsonBody = toS( bodyObject );
        return [200, headers, jsonBody];
      });
      this.post('/api/v1/fermentable_additions', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.fermentable_addition.id = "30";
        bodyObject.fermentables = Stubs.fermentables;
        return [200, headers, toS(bodyObject)];
      });
      this.post('/api/v1/hop_additions', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.hop_addition.id = 30;
        bodyObject.hops = Stubs.hops;
        return [200, headers, toS(bodyObject)];
      });
      this.get('/api/v1/yeasts', function() {
        var response =  [200, headers, toS({yeasts: Stubs.yeasts})];
        return response;
      });
      this.put('/api/v1/yeast_additions/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.yeast_addition.id = req.params.id;
        bodyObject.yeasts = Stubs.yeasts;
        var jsonBody = toS( bodyObject );
        return [200, headers, jsonBody];
      });
      this.post('/api/v1/yeast_additions', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.yeast_addition.id = "302";
        bodyObject.yeasts = Stubs.yeasts;
        return [200, headers, toS(bodyObject)];
      });
      this.put('/api/v1/hop_additions/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.hop_addition.id = req.params.id;
        bodyObject.hops = Stubs.hops;
        var jsonBody = toS( bodyObject );
        return [200, headers, jsonBody];
      });
      this.get('/api/v1/hops', function() {
        var response =  [200, headers, toS({hops: Stubs.hops})];
        return response;
      });
      this.put('/api/v1/fermentables/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.fermentable_addition.id = req.params.id;
        var jsonBody = toS( bodyObject );
        return [200, headers, jsonBody];
      });
      this.get('/api/v1/users/:id', function() {
        return [200, headers, toS({user: Stubs.user})];
      });
      this.delete('/api/v1/fermentable_additions/:id', function() {
        return [204, headers ];
      });
      this.delete('/api/v1/hop_additions/:id', function() {
        return [204, headers ];
      });
      this.delete('/api/v1/yeast_additions/:id', function() {
        return [204, headers ];
      });
    });
  },
  afterEach() {
    Ember.$('.modal').hide();
    Ember.$('.modal-backdrop').remove();
    Ember.$('body').removeClass('modal-open');
    window.confirm = nativeConfirm;
    window.localStorage.removeItem('user');
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test("edit a brew's fermentable additions", function(assert) {
  visit('/brews/1');
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.049")').length, 1,
      "Starting O.G. is found");
    click('tr:contains("Superior Pale Ale") a[title="Edit"]') ;
  });
  andThen(function() {
    fillIn('div:contains("Weight") input', "48.5");
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.046")').length, 1,
      "Ending O.G. is found");
  });
});

test("add a new fermentable addition", function(assert) {
  visit('/brews/1');
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.049")').length, 1);
    click('a:contains("Add Fermentable")');
  });
  andThen(function() {
    fillIn('div:contains("Weight") input', "48.5");
    fillSelectFromValue('.fermentable select', 'Superior Pale Ale');
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    click("a:contains('Specs')");
  });
  andThen(function() {
    click("a:contains('Recipe')");
  });
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.095")').length, 1);
  });
});


test("edit a brew's hop additions", function(assert) {
  visit('/brews/1');
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Bitterness") div:contains("30.6")').length, 1);
    click('tr:contains("Warrior") a[title="Edit"]') ;
  });
  andThen(function() {
    fillIn('div.weight input', "4.5");
    fillIn('div.alpha-acids input', "16.2");
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Bitterness") div:contains("41.9")').length, 1);
  });
});

test("add a new hop addition", function(assert) {
  visit('/brews/1');
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Bitterness") div:contains("30.6")').length, 1);
    click('a:contains("Add Hop")');
  });
  andThen(function() {
    fillIn('.alpha-acids input', "15.2");
    fillIn('.boil-time input', "30");
    fillIn('div.weight input', "2");
    fillSelectFromValue('.hop select', 'Warrior');
    fillSelectFromValue('.form-group.form select', 'Whole');
    fillSelectFromValue('.form-group.use select', 'Boil');
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    click('a:contains("Specs")');
  });
  andThen(function() {
    click('a:contains("Recipe")');
  });
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Bitterness") div:contains("43.9")').length, 1);
  });
});

test("edit a brew's yeast additions", function(assert) {
  visit('/brews/1');
  andThen(function() {
    click('tr:contains("Belgian Saison") a[title="Edit"]') ;
  });
  andThen(function() {
    fillIn('div.amount input', "75");
    fillSelectFromValue('.unit select','vial(s) of liquid yeast');
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    assert.equal(find('tr:contains("vial(s) of liquid yeast") td:contains("75")').length, 1);
  });
});

test("add yeast additions", function(assert) {
  visit('/brews/1');
  andThen(function() {
    click('tr:contains("Belgian Saison II") button[title="Delete"]') ;
  });
  andThen(function() {
    click('a:contains("Add Yeast")') ;
  });
  andThen(function() {
    fillIn('div.amount input', "1");
    fillSelectFromValue('.unit select','vial(s) of liquid yeast');
    fillSelectFromValue('.yeast select', 'Belgian Saison');
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    assert.equal(find('tr:contains("vial(s) of liquid yeast") td:contains("1")').length, 1);
    assert.equal(find('tr:contains("Belgian Saison") td:contains("1")').length, 1);
  });
});

test("delete a brew's fermentable addition", function(assert) {
  visit('/brews/1');
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.049")').length, 1);
    click('tr:contains("Superior Pale Ale") button[title="Delete"]') ;
  });
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.000")').length, 1);
  });
});

test("delete a brew's hop addition", function(assert) {
  visit('/brews/1');
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Bitterness") div:contains("30.6 IBU")').length, 1);
    click('tr:contains("Warrior") button[title="Delete"]') ;
  });
  andThen(function() {
    assert.equal(find('div.slate-statbox:contains("Bitterness") div:contains("0 IBU")').length, 1);
  });
});

test("delete a brew's yeast addition", function(assert) {
  visit('/brews/1');
  andThen(function() {
    click('tr:contains("Belgian Saison II") button[title="Delete"]') ;
  });
  andThen(function() {
    assert.equal(find('tr:contains("Belgian Saison II")').length, 0);
  });
});
