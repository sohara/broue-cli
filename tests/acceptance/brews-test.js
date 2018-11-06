import { run } from '@ember/runloop';
import $ from 'jquery';
import { test } from 'qunit';
import moduleForAcceptance from 'broue/tests/helpers/module-for-acceptance';
import startApp from '../helpers/start-app';
import stubs from '../helpers/pretender-stubs';
import Pretender from 'pretender';

var App, server, Stubs;

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};


var nativeConfirm = window.confirm;

function fillSelectFromValue(selector, value) {
  let optionSelector = selector + ' option:contains("' + value + '")';
  let optionValue = $(optionSelector).val();
  fillIn(selector, optionValue);
}

moduleForAcceptance('Acceptance: Brews', {
  beforeEach() {
    window.confirm = function() { return true; };
    App = startApp();
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
  },
  afterEach() {
    $('.modal').hide();
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    window.confirm = nativeConfirm;
    window.localStorage.removeItem('user');
    run(App, 'destroy');
    server.shutdown();
  }
});

test('visiting /my-brews', function(assert) {
  visit('/my-brews');

  andThen(function() {
    assert.equal(currentPath(), 'brews.index');
    assert.equal(find('td:contains("Awesome IPA")').length, 1, "User's brew is found");
  });
});

test('create a new brew', function(assert) {
  assert.expect(2);
  visit('/my-brews');
  andThen(function() {
    click('a:contains("New Brew")');
  });
  andThen(function() {
    fillIn("div.name input", "Super stuff ale");
    fillSelectFromValue('div.style select', '6A - Cream Ale');
    click('button:contains("Save")');
  });
  andThen(function() {
    assert.equal(currentPath(), 'brew.recipe.index');
    assert.equal(find('h2:contains("Super stuff ale")').length, 1);
  });
});

test('edit an existing brew', function(assert) {
  assert.expect(3);
  visit('/my-brews');
  andThen(function() {
    click('a:contains("Awesome IPA")');
  });
  andThen(function() {
    click('a:contains("Edit")');
  });
  andThen(function() {
    fillIn("div.name input", "Even Awesomer IPA");
    fillSelectFromValue('div.style select', '6A - Cream Ale');
    click('button:contains("Save")');
  });
  andThen(function() {
    assert.equal(currentPath(), 'brew.recipe.index', 'Routes to correct path');
    assert.equal(find('h2:contains("Even Awesomer IPA")').length, 1, 'Edits to name saved');
    assert.equal(find('h2:contains("Cream Ale")').length, 1, 'Edits to style saved');
  });
});

test('edit brew specs', function(assert) {
  visit('/brews/1');
  andThen(function() { click('a:contains("Specs")'); });
  andThen(function() { click('a.edit-specs:contains("Edit")'); });
  andThen(function() {

    fillIn('.batch-size input', '5');
    fillIn('.boil-loss input', '1.5');
    fillIn('.water-grain-ratio input', '1.5');
    click('button:contains("Save")');
    andThen(function() {
      assert.equal(currentPath(), 'brew.specs.index', "Displays brew specs after save");
      assert.equal(find('table tr:first td:last').text().trim(), '5 gallons', "Brew volume correctly updated");
      assert.equal(find('div.slate-statbox:contains("Strike Water") div:contains("19.01 gallons")').length, 1, "Strike water volume correctly calculated");
    });
  });
});

test('edit brew day records', function(assert) {
  visit('/brews/1');
  andThen(function() { click('a:contains("Brew Day")'); });
  andThen(function() { click('a.edit-specs:contains("Edit")'); });
  andThen(function() {
    fillIn('.brew-date input', '2014-06-25');
    fillIn('.recorded-original-gravity input', '1.048');
    click('button:contains("Save")');
    andThen(function() {
      assert.equal(currentPath(), 'brew.brew_day.index');
      assert.equal(find('table tr:first td:last').text().trim(), '2014-06-25');
    });
  });
});

test('delete a brew', async function(assert) {
  await visit('/brews/1');
  await  click('.brew-actions button:contains("Destroy")');
  assert.equal(currentPath(), 'index', "At the correct path");
  assert.equal(find('h2:first').text(), 'Latest Brews', "Shows latest brews title");
});
