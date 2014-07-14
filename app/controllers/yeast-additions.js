import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: [ 'brew' ],
  canEdit: Ember.computed.alias('controllers.brew.canEdit')
});
