import { click, fillIn, visit } from '@ember/test-helpers';
import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import Pretender from 'pretender';
import stubs from '../helpers/pretender-stubs';
import { fillSelectFromValue, findByText } from '../helpers/acceptance-helpers';

var server, Stubs;

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};


var nativeConfirm = window.confirm;

module('Acceptance: Recipes', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    window.confirm = function() { return true; };
    // App = startApp();
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
  });

  hooks.afterEach(function() {
    $('.modal').hide();
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    window.confirm = nativeConfirm;
    window.localStorage.removeItem('user');
    server.shutdown();
  });


  test("edit a brew's fermentable additions", async function(assert) {
    await visit('/brews/1');
    assert.dom(findByText('div.slate-statbox', "Original Gravity"))
      .includesText('1.049', 'Starting O.G. is found');
    await click(findByText('tr', 'Superior Pale Ale', 'a[title="Edit"]'));
    await fillIn(findByText('div', 'Weight', 'input'), '48.5');
    await click(findByText('button', 'Save Changes'));
    assert.dom(findByText('div.slate-statbox', "Original Gravity"))
      .includesText('1.046', 'Ending O.G. is found');
  });

  test("add a new fermentable addition", async function(assert) {
    await visit('/brews/1');
    assert.dom(findByText('div.slate-statbox', "Original Gravity"))
      .includesText('1.049', 'Starting O.G. is found');
    await click(findByText('a', 'Add Fermentable'));
    await fillIn(findByText('div', 'Weight', 'input'), "48.5");
    fillSelectFromValue('.fermentable select', 'Superior Pale Ale');
    await click(findByText('button', 'Save Changes'));
    await click(findByText('a', 'Specs'));
    await click(findByText('a', 'Recipe'));
    assert.dom(findByText('div.slate-statbox', "Original Gravity"))
      .includesText('1.095', 'Ending O.G. is found');
  });


  test("edit a brew's hop additions", async function(assert) {
    await visit('/brews/1');
    assert.dom(findByText('div.slate-statbox', "Bitterness"))
      .includesText('30.6', 'Starting IBU is found');
    await click(findByText('tr', 'Warrior', 'a[title="Edit"]'));
    await fillIn('div.weight input', "4.5");
    await fillIn('div.alpha-acids input', "16.2");
    await click(findByText('button', 'Save Changes'));
    assert.dom(findByText('div.slate-statbox', "Bitterness"))
      .includesText('41.9', 'Starting IBU is found');
  });

  test("add a new hop addition", async function(assert) {
    await visit('/brews/1');
    assert.dom(findByText('div.slate-statbox', "Bitterness"))
      .includesText('30.6', 'Starting IBU is found');
    await click(findByText('a', 'Add Hop'));
    await fillIn('.alpha-acids input', "15.2");
    await fillIn('.boil-time input', "30");
    await fillIn('div.weight input', "2");
    fillSelectFromValue('.hop select', 'Warrior');
    fillSelectFromValue('.form-group.form select', 'Whole');
    fillSelectFromValue('.form-group.use select', 'Boil');
    await click(findByText('button', 'Save Changes'));
    await click(findByText('a', 'Specs'));
    await click(findByText('a', 'Recipe'));
    assert.dom(findByText('div.slate-statbox', "Bitterness"))
      .includesText('43.9', 'Ending IBU is found');
  });

  test("edit a brew's yeast additions", async function(assert) {
    await visit('/brews/1');
    await click(findByText('tr', 'Belgian Saison', 'a[title="Edit"]'));
    await fillIn('div.amount input', "75");
    fillSelectFromValue('.unit select','vial(s) of liquid yeast');
    await click(findByText('button', 'Save Changes'));
    assert.dom(findByText('tr', 'vial(s) of liquid yeast')).includesText('75');
  });

  test("add yeast additions", async function(assert) {
    await visit('/brews/1');
    await click(findByText('tr', 'Belgian Saison II', 'button[title="Delete"]'));
    await click(findByText('a', 'Add Yeast'));
    await fillIn('div.amount input', "1");
    fillSelectFromValue('.unit select','vial(s) of liquid yeast');
    fillSelectFromValue('.yeast select', 'Belgian Saison');
    await click(findByText('button', 'Save Changes'));
    assert.dom(findByText('tr', 'vial(s) of liquid yeast')).includesText('1');
    assert.dom(findByText('tr', 'Belgian Saison')).includesText('1');
  });

  test("delete a brew's fermentable addition", async function(assert) {
    await visit('/brews/1');
    assert.dom(findByText('div.slate-statbox', "Original Gravity"))
      .includesText('1.049', 'Starting O.G. is found');
    await click(findByText('tr', 'Superior Pale Ale', 'button[title="Delete"]'));
    assert.dom(findByText('div.slate-statbox', "Original Gravity"))
      .includesText('1.000', 'Ending O.G. is found');
  });

  test("delete a brew's hop addition", async function(assert) {
    await visit('/brews/1');
    assert.dom(findByText('div.slate-statbox', "Bitterness"))
      .includesText('30.6', 'Starting IBU is found');
    await click(findByText('tr', 'Warrior', 'button[title="Delete"]'));
    assert.dom(findByText('div.slate-statbox', "Bitterness"))
      .includesText('0', 'Ending IBU is found');
  });

  test("delete a brew's yeast addition", async function(assert) {
    await visit('/brews/1');
    await click(findByText('tr', 'Belgian Saison II', 'button[title="Delete"]'));
    assert.notOk(findByText('tr', 'Belgian Saison II'), 'Yeast successfully deleted');
  });
});
