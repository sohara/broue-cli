import Ember from 'ember';
import startApp from '../helpers/start-app';
import stubs from '../helpers/pretender-stubs';

var App, server, Stubs;

module('Acceptance - Authentication', {
  setup: function() {
    App = startApp();
    Stubs = stubs();

    localStorage.removeItem('user');

    var toS = JSON.stringify;
    var headers = {"Content-Type":"application/json"};

    server = new Pretender(function() {
      this.get('/api/v1/brews', function(){
        return [200, headers, JSON.stringify({brews: Stubs.brews})];
      });
      this.post('/users/sign_in.json', function(req) {
        var credentials = JSON.parse(req.requestBody);
        if (credentials.password !== 'password') {
          return [401, headers, toS({message: "Your email or password was incorrect."})];
        }
        return [200, headers, toS(Stubs.userJSON)];
      });
      this.post('/users.json', function(req) {
        var credentials = JSON.parse(req.requestBody);
        if (credentials.password !== 'password') {
          return [401, headers, toS({message: "Your email or password was incorrect."})];
        }
        return [200, headers, toS(Stubs.userJSON)];
      });
      this.get('/api/v1/users/:id', function(req) {
        return [200, headers, toS({user: Stubs.user})];
      });
      this.put('/api/v1/users/:id', function(req) {
        var requestObject = JSON.parse(req.requestBody);
        requestObject.user.id = req.params.id;
        var jsonBody = toS(requestObject);
        return [200, headers, jsonBody];
      });
    });
  },
  teardown: function() {
    Ember.$('.modal').hide();
    Ember.$('.modal-backdrop').remove();
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('Allows a guest to sign in', function() {
  expect(3);
  visit('/').then(function() {
    click("a:contains('Login')").then(function() {
      equal(find('h3').text(), 'Sign in', "The Sign in header is found");
      fillIn("input#email", "jack@example.com");
      fillIn("input#password", "password");
      click("button[type='submit']");
    });

    andThen(function() {
      equal(currentURL(), "/my-brews", "Successful login redirects to /brews");
      equal(find('h2').text(), 'My Brews', "The brews heading is found");
    });
  });
});

test('Allows a guest to sign up for an account', function() {
  expect(3);
  visit('/').then(function() {
    equal(find('h2:first').text(), 'Latest Brews', "The latest brews header is found");
    click("a:contains('Sign Up')").then(function() {
      fillIn("input#email", "jack@example.com");
      fillIn("input#password", "password");
      fillIn("input#passwordConfirmation", "password");
      fillIn("input#username", "sohara");
      click("button[type='submit']");
    }).then(function() {
      equal(currentURL(), "/my-brews", "Successful login redirects to /brews");
      equal(find('h2').text(), 'My Brews', "The brews heading is found");
    });
  });
});

test('Allows a user to view their profile', function() {
  expect(2);
  Ember.run(function() {
    localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
  });
  visit('/');
  App.testHelpers.wait();
  andThen(function() {
    click('a:contains("View Profile")');
  });
  andThen(function() {
    equal(find('p:contains("I like to brew. More than you.")').length, 1, "Finds the user's bio");
    equal(find('h3:contains("Awesome IPA")').length, 1, "Finds user's recent brews listed");
  });
});

test('A user can edit their profile', function() {
  expect(3);
  Ember.run(function() {
    localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
  });
  visit('/profile');
  andThen(function() {
    click('a:contains("Edit Profile")');
  });
  andThen(function() {
    fillIn(".email input", "different@example.com");
    fillIn(".username input", "notsohara");
    fillIn(".about-me textarea", "It's a new bio");
    click("button[type='submit']").then(function() {
    equal(find('h1:contains("notsohara")').length, 1, "Finds the user's username");
    equal(find('p:contains("It\'s a new bio")').length, 1, "Finds the user's bio");
    equal(find('h3:contains("Awesome IPA")').length, 1, "Finds user's recent brews listed");
    });
  });
});

test('Allows a logged in user to log out', function() {
  expect(1);
  Ember.run(function() {
    localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
  });
  visit('/');
  andThen(function() {
    click('a:contains("Logout")');
  });
  andThen(function() {
    equal(find('li a:contains("Login")').length, 1, "Login link found");
  });
});

test('Displays login error when logging in with bad credentials', function() {
  expect(2);
  visit('/login').then(function() {
    fillIn("input#email", "jack@example.com");
    fillIn("input#password", "notpassword");
    click("button[type='submit']");

    andThen(function() {
      equal(currentURL(), "/login", "Remains on login page");
      equal(find('p.alert-danger').text(), 'Your email or password was incorrect.', "Login error message displayed");
    });
  });
});

