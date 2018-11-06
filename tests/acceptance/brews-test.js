import { click, fillIn, findAll, currentRouteName, find, visit } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import stubs from '../helpers/pretender-stubs';
import Pretender from 'pretender';

var App, server, Stubs;

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};


var nativeConfirm = window.confirm;

async function fillSelectFromValue(selector, value) {
  let optionSelector = selector + ' option:contains("' + value + '")';
  let optionValue = $(optionSelector).val();
  await fillIn(selector, optionValue);
}

module('Acceptance: Brews', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    window.confirm = function() { return true; };
    Stubs = stubs();
    window.localStorage.setItem('user', toS(Stubs.userJSON));

    server = new Pretender(function() {

      this.get('/api/v1/brews', function(){
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
      this.get('/api/v1/styles', function(){
        var response =  [200, headers, toS({styles: Stubs.styles})];
        return response;
      });
      this.post('/api/v1/brews', function(req) {
        var brewObject = JSON.parse(req.requestBody);
        brewObject.brew.id = 3;
        return [200, headers, toS(brewObject)];
      });
      this.put('/api/v1/brews/:id', function(req) {
        var brewObject = Stubs.brews.findBy('id', parseInt(req.params.id));
        let requestBrew = JSON.parse(req.requestBody).brew;
        let updatedBrew = Object.assign({}, brewObject, requestBrew);
        var jsonBody = toS( {brew: updatedBrew});
        return [200, headers, jsonBody];
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
      this.get('/api/v1/users/:id', function() {
        return [200, headers, toS({user: Stubs.user})];
      });
      this.delete('/api/v1/brews/:id', function() {
        return [204, headers ];
      });
      this.get('/api/v1/users', function(){
        var response =  [200, headers, toS({users: [Stubs.user]})];
        return response;
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

  test('visiting /my-brews', async function(assert) {
    await visit('/my-brews');

    assert.equal(currentRouteName(), 'brews.index');
    assert.equal(findAll('td:contains("Awesome IPA")').length, 1, "User's brew is found");
  });

  test('create a new brew', async function(assert) {
    assert.expect(2);
    await visit('/my-brews');
    await click('a:contains("New Brew")');
    await fillIn("div.name input", "Super stuff ale");
    fillSelectFromValue('div.style select', '6A - Cream Ale');
    await click('button:contains("Save")');
    assert.equal(currentPath(), 'brew.recipe.index');
    assert.equal(findAll('h2:contains("Super stuff ale")').length, 1);
  });

  test('edit an existing brew', async function(assert) {
    assert.expect(3);
    await visit('/my-brews');
    await click('a:contains("Awesome IPA")');
    await click('a:contains("Edit")');
    await fillIn("div.name input", "Even Awesomer IPA");
    fillSelectFromValue('div.style select', '6A - Cream Ale');
    await click('button:contains("Save")');
    assert.equal(currentPath(), 'brew.recipe.index', 'Routes to correct path');
    assert.equal(findAll('h2:contains("Even Awesomer IPA")').length, 1, 'Edits to name saved');
    assert.equal(findAll('h2:contains("Cream Ale")').length, 1, 'Edits to style saved');
  });

  test('edit brew specs', async function(assert) {
    await visit('/brews/1');
    await click('a:contains("Specs")');await click('a.edit-specs:contains("Edit")');

    await fillIn('.batch-size input', '5');
    await fillIn('.boil-loss input', '1.5');
    await fillIn('.water-grain-ratio input', '1.5');
    await click('button:contains("Save")');
    assert.equal(currentPath(), 'brew.specs.index', "Displays brew specs after save");
    assert.equal(find('table tr:first td:last').textContent.trim(), '5 gallons', "Brew volume correctly updated");
    assert.equal(findAll('div.slate-statbox:contains("Strike Water") div:contains("19.01 gallons")').length, 1, "Strike water volume correctly calculated");
  });

  test('edit brew day records', async function(assert) {
    await visit('/brews/1');
    await click('a:contains("Brew Day")');await click('a.edit-specs:contains("Edit")');
    await fillIn('.brew-date input', '2014-06-25');
    await fillIn('.recorded-original-gravity input', '1.048');
    await click('button:contains("Save")');
    assert.equal(currentPath(), 'brew.brew_day.index');
    assert.equal(find('table tr:first td:last').textContent.trim(), '2014-06-25');
  });

  test('delete a brew', async function(assert) {
    await visit('/brews/1');
    await  click('.brew-actions button:contains("Destroy")');
    assert.equal(currentPath(), 'index', "At the correct path");
    assert.equal(find('h2:first').textContent, 'Latest Brews', "Shows latest brews title");
  });
});
