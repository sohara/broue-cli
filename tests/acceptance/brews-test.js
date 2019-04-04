import { click, fillIn, currentRouteName, find, visit } from '@ember/test-helpers';
import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { findByText, testSelector, fillSelect } from '../helpers/acceptance-helpers';
import stubs from '../helpers/pretender-stubs';
import Pretender from 'pretender';

var server, Stubs;

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};


var nativeConfirm = window.confirm;

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
    assert.ok(findByText('td', 'Awesome IPA'), "User's brew is found");
  });

  test('create a new brew', async function(assert) {
    assert.expect(2);
    await visit('/my-brews');
    await click('a[href="/my-brews/new"]');
    await fillIn(testSelector("brew-name"), "Super stuff ale");
    await fillIn(testSelector('brew-style'), '6A - Cream Ale');
    await click('button.btn-primary');
    assert.equal(currentRouteName(), 'recipe.index');
    assert.dom('h2').includesText('Super stuff ale');
  });

  test('edit an existing brew', async function(assert) {
    assert.expect(3);
    await visit('/my-brews');
    await click('a[title="Awesome IPA"]');
    await click('.brew-actions a');
    await fillIn(testSelector("brew-name"), "Even Awesomer IPA");
    await fillSelect('brew-style', '6A - Cream Ale');
    await click('button.btn-primary');
    assert.equal(currentRouteName(), 'recipe.index', 'Routes to correct path');
    assert.dom('h2').includesText('Even Awesomer IPA');
    assert.dom('h2').includesText('Cream Ale', 'Edits to style saved');
  });

  test('edit brew specs', async function(assert) {
    await visit('/brews/1');
    await click(findByText('a', 'Specs'));
    await click('a[title="Edit Specs"]');
    await fillIn(testSelector('brews/edit-batchSizeGallons'), '5');
    await fillIn(testSelector('brews/edit-boilLossGallons'), '1.5');
    await fillIn(testSelector('brews/edit-waterGrainRatioUs'), '1.5');
    await click('button[type="submit"]');
    assert.equal(currentRouteName(), 'specs.index', "Displays brew specs after save");
    assert.dom('table').includesText('Batch Size 5 gallons', 'Brew volume correctly updated');
    assert.dom('.statbox-group').includesText('19.01 gallons Strike Water');
  });

  test('edit brew day records', async function(assert) {
    await visit('/brews/1');
    await click(findByText('a', 'Brew Day'));
    await click('a[title="Edit Brew Day"]');
    await fillIn(testSelector('brew-brewDate'), '2014-06-25');
    await fillIn(testSelector('brew-recordedOriginalGravity'), '1.048');
    await click('button[type="submit"]');
    assert.equal(currentRouteName(), 'brew_day.index');
    assert.dom(find('table')).includesText('2014-06-25');
  });

  test('delete a brew', async function(assert) {
    await visit('/brews/1');
    await click('.brew-actions button[title="Destroy"]');
    assert.equal(currentRouteName(), 'index', "At the correct path");
    assert.dom(find('h2')).hasText('Latest Brews', "Shows latest brews title");
  });
});
