import { click, fillIn, findAll, currentURL, find, visit } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
// import startApp from 'broue/tests/helpers/start-app';
import stubs from '../helpers/pretender-stubs';
import Pretender from 'pretender';

var server, Stubs;

module('Acceptance | Authentication', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    // application = startApp();
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
  });

  hooks.afterEach(function() {
    $('.modal').hide();
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    server.shutdown();
    // run(application, 'destroy');
  });

  test('Allows a guest to sign in', function(assert) {
    assert.expect(3);
    visit('/').then(function() {
      click("a:contains('Login')").then(async function() {
        assert.equal(find('h3').textContent, 'Sign in', "The Sign in header is found");
        await fillIn("input#email", "jack@example.com");
        await fillIn("input#password", "password");
        await click("button[type='submit']");
      });

      assert.equal(currentURL(), "/my-brews", "Successful login redirects to /brews");
      assert.equal(find('h2').textContent, 'My Brews', "The brews heading is found");
    });
  });

  test('Allows a guest to sign up for an account', function(assert) {
    assert.expect(3);
    visit('/').then(function() {
      assert.equal(find('h2:first').textContent, 'Latest Brews', "The latest brews header is found");
      click("a:contains('Sign Up')").then(async function() {
        await fillIn("input#email", "jack@example.com");
        await fillIn("input#password", "password");
        await fillIn("input#passwordConfirmation", "password");
        await fillIn("input#username", "sohara");
        await click("button[type='submit']");
      }).then(function() {
        assert.equal(currentURL(), "/my-brews", "Successful login redirects to /brews");
        assert.equal(find('h2').textContent, 'My Brews', "The brews heading is found");
      });
    });
  });

  test('Allows a user to view their profile', async function(assert) {
    assert.expect(2);
    run(function() {
      window.localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
    });
    await visit('/');
    await click('a:contains("View Profile")');
    assert.equal(findAll('p:contains("I like to brew. More than you.")').length, 1, "Finds the user's bio");
    assert.equal(findAll('h3:contains("Awesome IPA")').length, 1, "Finds user's recent brews listed");
  });

  test('A user can edit their profile', async function(assert) {
    assert.expect(3);
    run(function() {
      window.localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
    });
    await visit('/profile');
    await click('a:contains("Edit Profile")');
    await fillIn(".email input", "different@example.com");
    await fillIn(".username input", "notsohara");
    await fillIn(".about-me textarea", "It's a new bio");
    click("button[type='submit']").then(function() {
    assert.equal(findAll('h1:contains("notsohara")').length, 1, "Finds the user's username");
    assert.equal(findAll('p:contains("It\'s a new bio")').length, 1, "Finds the user's bio");
    assert.equal(findAll('h3:contains("Awesome IPA")').length, 1, "Finds user's recent brews listed");
    });
  });

  test('Allows a logged in user to log out', async function(assert) {
    assert.expect(2);
    run(function() {
      window.localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
    });
    await visit('/');
    await click('a:contains("Logout")');
    assert.equal(findAll('li a:contains("Login")').length, 1, "Login link found");
    assert.equal(findAll('.alert-success:contains("Successfully logged out")').length, 1, "Success flash rendered");
  });

  test('Displays login error when logging in with bad credentials', function(assert) {
    assert.expect(2);
    visit('/login').then(async function() {
      await fillIn("input#email", "jack@example.com");
      await fillIn("input#password", "notpassword");
      await click("button[type='submit']");

      assert.equal(currentURL(), "/login", "Remains on login page");
      assert.equal(find('p.alert-danger').textContent, 'Your email or password was incorrect.', "Login error message displayed");
    });
  });
});
