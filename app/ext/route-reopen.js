import Ember from 'ember';

export default Ember.Route.reopen({
  enter: function() {
    this._super.apply(this, arguments);
    this.flash.send('hide');
  },
});
