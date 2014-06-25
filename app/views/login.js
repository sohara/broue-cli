import Ember from 'ember';

export default Ember.View.extend({
  input: function() {
    this.get('controller').send('resetErrorMessage');
  }
});
