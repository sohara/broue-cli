export default {
  name: "login",
  initialize: function(container, application) {
    application.inject('adapter', 'login', 'controller:login');
  }
};
