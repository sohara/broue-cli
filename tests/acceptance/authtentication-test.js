import { click, fillIn, currentURL, find, visit } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import stubs from '../helpers/pretender-stubs';
import { findByText } from '../helpers/acceptance-helpers';
import Pretender from 'pretender';

var server, Stubs;

module('Acceptance | Authentication', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
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
  });

  test('Allows a guest to sign in', async function(assert) {
    assert.expect(3);
    await visit('/');
    await click(findByText('a', 'Login'));
    assert.dom('h3').hasText('Sign in', "The Sign in header is found");
    await fillIn("input#email", "jack@example.com");
    await fillIn("input#password", "password");
    await click("button[type='submit']");

    assert.equal(currentURL(), "/my-brews", "Successful login redirects to /brews");
    assert.dom('h2').hasText('My Brews', "The brews heading is found");
  });

  test('Allows a guest to sign up for an account', async function(assert) {
    assert.expect(3);
    await visit('/');
    assert.dom(find('h2')).hasText('Latest Brews', "The latest brews header is found");
    await click(findByText('a', 'Sign Up'));
    await fillIn("input#email", "jack@example.com");
    await fillIn("input#password", "password");
    await fillIn("input#passwordConfirmation", "password");
    await fillIn("input#username", "sohara");
    await click("button[type='submit']");
    assert.equal(currentURL(), "/my-brews", "Successful login redirects to /brews");
    assert.dom('h2').hasText('My Brews', "The brews heading is found");
  });

  test('Allows a user to view their profile', async function(assert) {
    assert.expect(2);
    run(function() {
      window.localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
    });
    await visit('/');
    await click(findByText('a', 'View Profile'));
    assert.ok(findByText('p', 'I like to brew. More than you.'), "Finds the user's bio");
    assert.ok(findByText('h3', 'Awesome IPA'), "Finds user's recent brews listed");
  });

  test('A user can edit their profile', async function(assert) {
    assert.expect(3);
    run(function() {
      window.localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
    });
    await visit('/profile');
    await click(findByText('a', 'Edit Profile'));
    await fillIn(".email input", "different@example.com");
    await fillIn(".username input", "notsohara");
    await fillIn(".about-me textarea", "It's a new bio");
    await click("button[type='submit']");
    assert.ok(findByText('h1', 'notsohara'), "Finds the user's username");
    assert.ok(findByText('p', "It's a new bio"), "Finds the user's bio");
    assert.ok(findByText('h3', 'Awesome IPA'), "Finds user's recent brews listed");
  });

  test('Allows a logged in user to log out', async function(assert) {
    assert.expect(2);
    run(function() {
      window.localStorage.setItem('user', JSON.stringify(Stubs.userJSON));
    });
    await visit('/');
    await click(findByText('a', 'Logout'));
    assert.ok(findByText('li a', 'Login'), "Login link found");
    assert.ok(findByText('.alert-success', 'Successfully logged out'), "Success flash rendered");
  });

  test('Displays login error when logging in with bad credentials', async function(assert) {
    assert.expect(2);
    await visit('/login');
    await fillIn("input#email", "jack@example.com");
    await fillIn("input#password", "notpassword");
    await click("button[type='submit']");

    assert.equal(currentURL(), "/login", "Remains on login page");
    assert.dom('p.alert-danger').hasText('Your email or password was incorrect.', "Login error message displayed");
  });
});
