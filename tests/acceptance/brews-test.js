import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;

var userJSON = {
  token: "aQXpLwsQivHhYZKZyaF2",
  email: "sohara@sohara.com",
  bio: "I like to brew. More than you."
};

var toS = JSON.stringify;
var headers = {"Content-Type":"application/json"};

var brews = [
  {
    id: 1,
    name: "Awesome IPA"
  },
  {
    id: 2,
    name: "Summer Saison"
  }
];

module('Acceptance: Brews', {
  setup: function() {
    App = startApp();
    localStorage.setItem('user', toS(userJSON));

    server = new Pretender(function() {
      this.get('/brews', function(){
        var response =  [200, headers, toS({brews: brews})];
        return response;
      });
    });
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('visiting /brews', function() {
  visit('/brews');

  andThen(function() {
    equal(currentPath(), 'brews.index');
    equal(find('td:contains("Awesome IPA")').length, 1);
  });
});
