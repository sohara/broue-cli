import Component from '@ember/component';

export default Component.extend({
  classNames: ["slate-statbox"],
  classNameBindings: ['colorClass', 'gridClass'],

  gridClass: 'col-md-3',
  faIcon: 'fa-flask'
});
