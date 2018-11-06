import { click, fillIn, findAll, visit } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import $ from 'jquery';
import { module, test } from 'qunit';
// import startApp from 'broue/tests/helpers/start-app';
import stubs from '../helpers/pretender-stubs';
import Pretender from 'pretender';

var application, server, Stubs;

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};


var nativeConfirm = window.confirm;

module('Acceptance: Notes', function(hooks) {
  hooks.beforeEach(function() {
    window.confirm = function() { return true; };
    application = startApp();
    Stubs = stubs();
    window.localStorage.setItem('user', toS(Stubs.userJSON));

    server = new Pretender(function() {
      this.get('/api/v1/users/:id', function() {
        return [200, headers, toS({user: Stubs.user})];
      });
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
      this.delete('/api/v1/notes/:id', function() {
        return [204, headers, ""];
      });
    });
  });

  hooks.afterEach(function() {
    $('.modal').hide();
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    window.confirm = nativeConfirm;
    window.localStorage.removeItem('user');
    run(application, 'destroy');
    server.shutdown();
  });

  test("Edit a brew's notes", async function(assert) {
    await visit('/brews/1/notes');
    await click('div.panel:contains("Notes") a:contains("Edit")');
    await fillIn("textarea", "I'm totally changing this note");
    await click('button:contains("Save")');
    assert.equal(findAll('li:contains("totally changing this note")').length, 1);
  });

  test("Add a new note", async function(assert) {
    await visit('/brews/1/notes');
    await click('div.panel:contains("Notes") a:contains("Add")') ;
    await fillIn("textarea", "Brand, spaking new note, yo!");
    await click('button:contains("Save")');
    assert.equal(findAll('li:contains("Brand, spaking")').length, 1);
  });

  test("Delete a new note", async function(assert) {
    await visit('/brews/1/notes');
    assert.equal(findAll('div.panel:contains("Brew day 1: used 532g caramel 60 and")').length, 1);
    await click('div.panel:contains("Notes") button:contains("Delete")') ;
    assert.equal(findAll('div.panel:contains("Brew day 1: used 532g caramel 60 and")').length, 0);
  });
});
