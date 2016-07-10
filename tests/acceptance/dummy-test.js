import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'broue/tests/helpers/start-app';

var application;

module('Acceptance | dummy', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /dummy', function(assert) {
  visit('/dummy');

  andThen(function() {
    assert.equal(currentURL(), '/dummy');
  });
});
