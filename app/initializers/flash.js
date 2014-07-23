export default {
  name: "flash",
  initialize: function(container, application) {
    application.inject('route', 'flash', 'controller:flash');
  }
};
