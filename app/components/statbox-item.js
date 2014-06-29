import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["slate-statbox"],
  classNameBindings: ['colorClass', 'gridClass'],

  gridClass: 'col-md-3',
  faIcon: 'fa-flask'
});
