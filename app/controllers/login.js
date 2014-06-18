import Ember from 'ember';

 export default Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin,
    { authenticatorFactory: "authenticator:devise" }
);
