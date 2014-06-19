import startApp from '../helpers/start-app';
//import Pretender from 'vendor/pretender/pretender';

var App, server;

module('Integration - Authentication', {
  setup: function() {
    App = startApp();

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

    var userJSON = {
      token: "aQXpLwsQivHhYZKZyaF2",
      email: "sohara@sohara.com",
      bio: "I like to brew. More than you."
    }

    server = new Pretender(function() {
      this.get('/brews', function(){
        console.log(JSON.stringify({brews: brews}));
        return [200, headers, JSON.stringify({brews: brews})];
      });
      this.post('/users/sign_in', function(req) {
        var credentials = JSON.parse(req.requestBody);
        if (credentials.password !== 'password') {
          console.log("In error branch");
          return [401, headers, toS({message: "Your password was incorrect"})];
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
