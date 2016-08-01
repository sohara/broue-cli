import FlashService from '../services/flash';
export default {
  name: "flash",
  initialize: function(application) {
    application.register('service:flash', FlashService, {
      singleton: true
    });
    application.inject('route', 'flash', 'service:flash');
    application.inject('controller', 'flash', 'service:flash');
  }
};
