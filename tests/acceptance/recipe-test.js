import Ember from 'ember';
import startApp from '../helpers/start-app';
import stubs from '../helpers/pretender-stubs';

var App, server, Stubs;

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};


var nativeConfirm = window.confirm;

module('Acceptance: Recipes', {
  setup: function() {
    window.confirm = function() { return true; };
    App = startApp();
    Stubs = stubs();
    localStorage.setItem('user', toS(Stubs.userJSON));

    server = new Pretender(function() {
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
      this.get('fermentables', function(req) {
        var response =  [200, headers, toS({fermentables: Stubs.fermentables})];
        return response;
      });
      this.put('/fermentable_additions/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.fermentable_addition.id = req.params.id;
        bodyObject.fermentables = Stubs.fermentables;
        var jsonBody = toS( bodyObject );
        return [200, headers, jsonBody];
      });
      this.post('/fermentable_additions', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.fermentable_addition.id = "30";
        bodyObject.fermentables = Stubs.fermentables;
        return [200, headers, toS(bodyObject)];
      });
      this.get('yeasts', function(req) {
        var response =  [200, headers, toS({yeasts: Stubs.yeasts})];
        return response;
      });
      this.put('/yeast_additions/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.yeast_addition.id = req.params.id;
        bodyObject.yeasts = Stubs.yeasts;
        var jsonBody = toS( bodyObject );
        return [200, headers, jsonBody];
      });
      this.post('/yeast_additions', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.yeast_addition.id = "302";
        bodyObject.yeasts = Stubs.yeasts;
        return [200, headers, toS(bodyObject)];
      });
      this.put('/hop_additions/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.hop_addition.id = req.params.id;
        bodyObject.hops = Stubs.hops;
        var jsonBody = toS( bodyObject );
        return [200, headers, jsonBody];
      });
      this.get('hops', function(req) {
        var response =  [200, headers, toS({hops: Stubs.hops})];
        return response;
      });
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
    window.confirm = nativeConfirm;
    localStorage.removeItem('user');
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test("edit a brew's fermentable additions", function() {
  visit('/brews/1');
  andThen(function() {
    equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.049")').length, 1,
      "Starting O.G. is found");
    click('tr:contains("Superior Pale Ale") a[title="Edit"]') ;
  });
  andThen(function() {
    fillIn('div:contains("Weight") input', "776");
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.046")').length, 1,
      "Ending O.G. is found");
  });
});

test("add a new fermentable addition", function() {
  visit('/brews/1');
  andThen(function() {
    equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.049")').length, 1);
    click('a:contains("Add Fermentable")');
  });
  andThen(function() {
    fillIn('div:contains("Weight") input', "776");
    find('.fermentable select').val('45');
    // Need to trigger 'change' even manually in testing
    find('.fermentable select').trigger('change');
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    click("a:contains('Specs')");
  });
  andThen(function() {
    click("a:contains('Recipe')");
  });
  andThen(function() {
    equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.095")').length, 1);
  });
});


test("edit a brew's hop additions", function() {
  visit('/brews/1');
  andThen(function() {
    equal(find('div.slate-statbox:contains("Bitterness") div:contains("30.6")').length, 1);
    click('tr:contains("Warrior") a[title="Edit"]') ;
  });
  andThen(function() {
    fillIn('div.weight input', "4.5");
    fillIn('div.alpha-acids input', "16.2");
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    equal(find('div.slate-statbox:contains("Bitterness") div:contains("41.9")').length, 1);
  });
});

// This test isn't registering the change on the weight input for some
// reason. Pending for now. Same with adding a yeast addition
// test("add a new hop addition", function() {
//   visit('/brews/1');
//   andThen(function() {
//     equal(find('div.slate-statbox:contains("Bitterness") div:contains("30.6")').length, 1);
//     click('a:contains("Add Hop")');
//   });
//   andThen(function() {
//     fillIn('.alpha-acids input', "15.2");
//     fillIn('.boil-time input', "30");
//     fillIn('div.weight input', "125");
//     find('.hop select').val('45');
//     // Need to trigger 'change' even manually in testing
//     find('.hop select').trigger('change');
//     find('.form-group.form select').val('Whole');
//     // Need to trigger 'change' even manually in testing
//     find('.form-group.form select').trigger('change');
//     find('.form-group.use select').val('Boil');
//     // Need to trigger 'change' even manually in testing
//     find('.form-group.use select').trigger('change');
//     click('button:contains("Save Changes")');
//   });
//   andThen(function() {
//     click('a:contains("Specs")')
//   });
//   andThen(function() {
//     click('a:contains("Recipe")')
//   });
//   andThen(function() {
//     debugger;
//     equal(find('div.slate-statbox:contains("Bitterness") div:contains("60")').length, 1);
//   });
// });

test("edit a brew's yeast additions", function() {
  visit('/brews/1');
  andThen(function() {
    click('tr:contains("Belgian Saison") a[title="Edit"]') ;
  });
  andThen(function() {
    fillIn('div.amount input', "75");
    find('.unit select').val('vial(s) of liquid yeast');
    // Need to trigger 'change' even manually in testing
    find('.unit select').trigger('change');
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    equal(find('tr:contains("vial(s) of liquid yeast") td:contains("75")').length, 1);
  });
});

test("add yeast additions", function() {
  visit('/brews/1');
  andThen(function() {
    click('tr:contains("Belgian Saison II") button[title="Delete"]') ;
  });
  andThen(function() {
    click('a:contains("Add Yeast")') ;
  });
  andThen(function() {
    fillIn('div.amount input', "1");
    find('.unit select').val('vial(s) of liquid yeast');
    find('.unit select').trigger('change');
    find('.yeast select').val('40');
    find('.yeast select').trigger('change');
    click('button:contains("Save Changes")');
  });
  andThen(function() {
    equal(find('tr:contains("vial(s) of liquid yeast") td:contains("1")').length, 1);
    equal(find('tr:contains("Belgian Saison") td:contains("1")').length, 1);
  });
});

test("delete a brew's fermentable addition", function() {
  visit('/brews/1');
  andThen(function() {
    equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.049")').length, 1);
    click('tr:contains("Superior Pale Ale") button[title="Delete"]') ;
  });
  andThen(function() {
    equal(find('div.slate-statbox:contains("Original Gravity") div:contains("1.000")').length, 1);
  });
});

test("delete a brew's hop addition", function() {
  visit('/brews/1');
  andThen(function() {
    equal(find('div.slate-statbox:contains("Bitterness") div:contains("30.6 IBU")').length, 1);
    click('tr:contains("Warrior") button[title="Delete"]') ;
  });
  andThen(function() {
    equal(find('div.slate-statbox:contains("Bitterness") div:contains("0 IBU")').length, 1);
  });
});

test("delete a brew's yeast addition", function() {
  visit('/brews/1');
  andThen(function() {
    click('tr:contains("Belgian Saison II") button[title="Delete"]') ;
  });
  andThen(function() {
    equal(find('tr:contains("Belgian Saison II")').length, 0);
  });
});
