import Controller, { inject as controller } from '@ember/controller';
import { oneWay } from '@ember/object/computed';

export default Controller.extend({
  yeastsController: controller('yeasts'),

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
