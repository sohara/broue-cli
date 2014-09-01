import Ember from 'ember';
import startApp from '../helpers/start-app';
import stubs from '../helpers/pretender-stubs';

var App, server, Stubs;

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};


var nativeConfirm = window.confirm;

module('Acceptance: Notes', {
  setup: function() {
    window.confirm = function() { return true; };
    App = startApp();
    Stubs = stubs();
    localStorage.setItem('user', toS(Stubs.userJSON));

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
      this.put('/api/v1/notes/:id', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.note.id = req.params.id;
        var jsonBody = toS( bodyObject );
        return [200, headers, jsonBody];
      });
      this.post('/api/v1/notes', function(req) {
        var bodyObject = JSON.parse(req.requestBody);
        bodyObject.note.id = "302";
        bodyObject.notes = Stubs.notes;
        return [200, headers, toS(bodyObject)];
      });
      this.delete('/api/v1/notes/:id', function(req) {
        return [204, headers, ""];
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
    Ember.$('.modal').hide();
    Ember.$('.modal-backdrop').remove();
    window.confirm = nativeConfirm;
    localStorage.removeItem('user');
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test("Edit a brew's notes", function() {
  visit('/brews/1/notes');
  andThen(function() {
    click('div.panel:contains("Notes") a:contains("Edit")') ;
  });
  andThen(function() {
    fillIn("textarea", "I'm totally changing this note");
    click('button:contains("Save")');
  });
  andThen(function() {
    equal(find('li:contains("totally changing this note")').length, 1);
  });
});

test("Add a new note", function() {
  visit('/brews/1/notes');
  andThen(function() {
    click('div.panel:contains("Notes") a:contains("Add")') ;
  });
  andThen(function() {
    fillIn("textarea", "Brand, spaking new note, yo!");
    click('button:contains("Save")');
  });
  andThen(function() {
    equal(find('li:contains("Brand, spaking")').length, 1);
  });
});

test("Delete a new note", function() {
  visit('/brews/1/notes');
  andThen(function() {
    equal(find('div.panel:contains("Brew day 1: used 532g caramel 60 and")').length, 1);
    click('div.panel:contains("Notes") button:contains("Delete")') ;
  });
  andThen(function() {
    equal(find('div.panel:contains("Brew day 1: used 532g caramel 60 and")').length, 0);
  });
});
