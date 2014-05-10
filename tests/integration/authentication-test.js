import startApp from '../helpers/start-app';

var App;

module('Integration - Landing Page', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('Allows a guest to sign up', function() {
  visit('/').then(function() {
    equal(find('h2#title').text(), 'Broue.io');
  });
});
