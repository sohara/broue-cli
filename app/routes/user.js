import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    var recentBrews = this.store.find('brew', {user_id: model.get('id')});
    controller.set('recentBrews', recentBrews);
  },
});
