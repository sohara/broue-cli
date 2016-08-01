export default {
  name: "login",
  initialize: function( application) {
    application.inject('adapter', 'login', 'controller:login');
  }
};
