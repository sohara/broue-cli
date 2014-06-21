import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;

var userJSON = {
  token: "aQXpLwsQivHhYZKZyaF2",
  email: "sohara@sohara.com",
  bio: "I like to brew. More than you."
};

module('Integration - Authentication', {
  setup: function() {
    App = startApp();

    localStorage.removeItem('user');

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

    server = new Pretender(function() {
      this.get('/brews', function(){
        return [200, headers, JSON.stringify({brews: brews})];
      });
      this.post('/users/sign_in', function(req) {
        var credentials = JSON.parse(req.requestBody);
        if (credentials.password !== 'password') {
          return [401, headers, toS({message: "Your email or password was incorrect."})];
        }
        return [200, headers, toS(userJSON)];
      });
    });
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('Allows a guest to sign in', function() {
  expect(3);
  visit('/').then(function() {
    equal(find('h1').text(), 'Broue.io', "The Broue.io header is found");
    fillIn("input#email", "jack@example.com");
    fillIn("input#password", "password");
    click("button[type='submit']");

    andThen(function() {
      equal(currentURL(), "/brews", "Successful login redirects to /brews");
      equal(find('h2').text(), 'Brews', "The brews heading is found");
    });
  });
});

test('Allows a logged in user to log out', function() {
  expect(1);
  Ember.run(function() {
    localStorage.setItem('user', JSON.stringify(userJSON));
  });
  visit('/');
  andThen(function() {
    click('a:contains("Logout")');
  });
  andThen(function() {
    equal(find('h3:contains("Sign in")').length, 1);
  });
});

test('Displays login error when logging in with bad credentials', function() {
  expect(3);
  visit('/').then(function() {
    equal(find('h1').text(), 'Broue.io', "The Broue.io header is found");
    fillIn("input#email", "jack@example.com");
    fillIn("input#password", "notpassword");
    click("button[type='submit']");

    andThen(function() {
      equal(currentURL(), "/login", "Remains on login page");
      equal(find('p.alert-danger').text(), 'Your email or password was incorrect.', "Login error message displayed");
    });
  });
});
