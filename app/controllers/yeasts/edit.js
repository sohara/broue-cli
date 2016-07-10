import Ember from 'ember';
const { computed, inject } = Ember;
const { oneWay } = computed;

export default Ember.Controller.extend({
  yeastsController: inject.controller('yeasts'),

  yeasts: oneWay('yeastsController.model'),

  units: [
    "vial(s) of liquid yeast",
    "pack(s) of liquid yeast",
    "5g dry yeast pack(s)",
    "11.5g dry yeast pack(s)",
    "grams of dry yeast",
    "millilitres of slurry"
  ]

});
