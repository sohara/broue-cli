var LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin,
    { authenticatorFactory: "authenticator:devise" }
);

export default LoginController;
