import { later } from '@ember/runloop';
import Evented from '@ember/object/evented';
import Service from '@ember/service';

export default Service.extend(Evented, {
  type: 'success',
  message: "",

  render: function(message, type) {
    this.setProperties({
      message: message,
      type: type || 'success'
    });
    later(this, function() {
      this.trigger('show');
    });
  },
});
