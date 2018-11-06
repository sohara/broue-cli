import Controller, { inject as controller } from '@ember/controller';
import { oneWay, alias } from '@ember/object/computed';
import WeightConversionMixin from '../../mixins/weight-conversion-mixin';

export default Controller.extend(WeightConversionMixin, {
  applicationController: controller('application'),
  hopsController: controller('hops'),

  measureSystem: alias('applicationController.measureSystem'),
  hops: oneWay('hopsController.model'),

  /* eslint ember/avoid-leaking-state-in-ember-objects: "off" */
  forms: [ "Whole", "Pellet", "Plug" ],
  uses: [ "Boil", "Mash", "First Wort", "Aroma", "Dry Hop" ],

  actions: {
    close() {
      this.send('closeModal');
    },
    saveModel(model) {
      this.send('save', model);
    }
  }

});
