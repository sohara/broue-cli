import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['yeasts'],

  yeasts: function() {
    return this.get('controllers.yeasts');
  }.property('controllers.yeasts'),


  units: [
    "vial(s) of liquid yeast",
    "pack(s) of liquid yeast",
    "5g dry yeast pack(s)",
    "11.5g dry yeast pack(s)",
    "grams of dry yeast",
    "millilitres of slurry"
  ]

});
