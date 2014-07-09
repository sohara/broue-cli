import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;

var user = {
    id: 1,
    bio: "I like to brew. More than you.",
    username: "sohara",
    email: "sohara@sohara.com"
  };

var userJSON = {
  token: "aQXpLwsQivHhYZKZyaF2",
  email: "sohara@sohara.com",
  user_id: 1,
  user: user
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
      this.post('/users/sign_in.json', function(req) {
        var credentials = JSON.parse(req.requestBody);
        if (credentials.password !== 'password') {
          return [401, headers, toS({message: "Your email or password was incorrect."})];
        }
        return [200, headers, toS(userJSON)];
      });
      this.post('/users.json', function(req) {
        var credentials = JSON.parse(req.requestBody);
        if (credentials.password !== 'password') {
          return [401, headers, toS({message: "Your email or password was incorrect."})];
        }
        return [200, headers, toS(userJSON)];
      });
      this.get('/users/:id', function(req) {
        return [200, headers, toS({user: user})];
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
    equal(find('h3').text(), 'Sign in', "The Sign in header is found");
    fillIn("input#email", "jack@example.com");
    fillIn("input#password", "password");
    click("button[type='submit']");

    andThen(function() {
      equal(currentURL(), "/brews", "Successful login redirects to /brews");
      equal(find('h2').text(), 'Brews', "The brews heading is found");
    });
  });
});

test('Allows a guest to sign up for an account', function() {
  expect(3);
  visit('/').then(function() {
    equal(find('h3').text(), 'Sign in', "The Sign in header is found");
    click("a:contains('Sign up')").then(function() {
      fillIn("input#email", "jack@example.com");
      fillIn("input#password", "password");
      fillIn("input#passwordConfirmation", "password");
      fillIn("input#username", "sohara");
      click("button[type='submit']");
    }).then(function() {
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
  expect(2);
  visit('/').then(function() {
    fillIn("input#email", "jack@example.com");
    fillIn("input#password", "notpassword");
    click("button[type='submit']");

    andThen(function() {
      equal(currentURL(), "/login", "Remains on login page");
      equal(find('p.alert-danger').text(), 'Your email or password was incorrect.', "Login error message displayed");
    });
  });
});
