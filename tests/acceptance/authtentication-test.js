import { run } from '@ember/runloop';
import $ from 'jquery';
import { test } from 'qunit';
import moduleForAcceptance from 'broue/tests/helpers/module-for-acceptance';
import startApp from 'broue/tests/helpers/start-app';
import stubs from '../helpers/pretender-stubs';
import Pretender from 'pretender';

var application, server, Stubs;

moduleForAcceptance('Acceptance | Authentication', {
  beforeEach() {
    application = startApp();
    Stubs = stubs();

    window.localStorage.removeItem('user');

    var toS = JSON.stringify;
    var headers = {"Content-Type": "application/json"};

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
      this.get('/api/v1/users/:id', function() {
        return [200, headers, toS({user: Stubs.user})];
      });
      this.put('/api/v1/users/:id', function(req) {
        var requestObject = JSON.parse(req.requestBody);
        requestObject.user.id = req.params.id;
        var jsonBody = toS(requestObject);
        return [200, headers, jsonBody];
      });
      this.get('/api/v1/users', function(){
        var response =  [200, headers, toS({users: [Stubs.user]})];
        return response;
      });
      this.get('/api/v1/styles', function(){
        var response =  [200, headers, toS({styles: Stubs.styles})];
        return response;
      });
    });
  },
  afterEach() {
    $('.modal').hide();
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    server.shutdown();
    run(application, 'destroy');
  }
});

test('Allows a guest to sign in', function(assert) {
  assert.expect(3);
  visit('/').then(function() {
    click("a:contains('Login')").then(function() {
      assert.equal(find('h3').text(), 'Sign in', "The Sign in header is found");
      fillIn("input#email", "jack@example.com");
      fillIn("input#password", "password");
      click("button[type='submit']");
    });

    andThen(function() {
      assert.equal(currentURL(), "/my-brews", "Successful login redirects to /brews");
      assert.equal(find('h2').text(), 'My Brews', "The brews heading is found");
    });
  });
});

test('Allows a guest to sign up for an account', function(assert) {
  assert.expect(3);
  visit('/').then(function() {
    assert.equal(find('h2:first').text(), 'Latest Brews', "The latest brews header is found");
    click("a:contains('Sign Up')").then(function() {
      fillIn("input#email", "jack@example.com");
      fillIn("input#password", "password");
      fillIn("input#passwordConfirmation", "password");
      fillIn("input#username", "sohara");
      click("button[type='submit']");
    }).then(function() {
      assert.equal(currentURL(), "/my-brews", "Successful login redirects to /brews");
      assert.equal(find('h2').text(), 'My Brews', "The brews heading is found");
    });
  });
});

test('Allows a user to view their profile', function(assert) {
  assert.expect(2);
  run(function() {
    window.localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
  });
  visit('/');
  // App.testHelpers.wait();
  andThen(function() {
    click('a:contains("View Profile")');
  });
  andThen(function() {
    assert.equal(find('p:contains("I like to brew. More than you.")').length, 1, "Finds the user's bio");
    assert.equal(find('h3:contains("Awesome IPA")').length, 1, "Finds user's recent brews listed");
  });
});

test('A user can edit their profile', function(assert) {
  assert.expect(3);
  run(function() {
    window.localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
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
    assert.equal(find('h1:contains("notsohara")').length, 1, "Finds the user's username");
    assert.equal(find('p:contains("It\'s a new bio")').length, 1, "Finds the user's bio");
    assert.equal(find('h3:contains("Awesome IPA")').length, 1, "Finds user's recent brews listed");
    });
  });
});

test('Allows a logged in user to log out', function(assert) {
  assert.expect(2);
  run(function() {
    window.localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
  });
  visit('/');
  andThen(function() {
    click('a:contains("Logout")');
  });
  andThen(function() {
    assert.equal(find('li a:contains("Login")').length, 1, "Login link found");
    assert.equal(find('.alert-success:contains("Successfully logged out")').length, 1, "Success flash rendered");
  });
});

test('Displays login error when logging in with bad credentials', function(assert) {
  assert.expect(2);
  visit('/login').then(function() {
    fillIn("input#email", "jack@example.com");
    fillIn("input#password", "notpassword");
    click("button[type='submit']");

    andThen(function() {
      assert.equal(currentURL(), "/login", "Remains on login page");
      assert.equal(find('p.alert-danger').text(), 'Your email or password was incorrect.', "Login error message displayed");
    });
  });
});
