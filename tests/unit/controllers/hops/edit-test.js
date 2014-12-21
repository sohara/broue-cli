import { test, moduleFor } from 'ember-qunit';
import startApp from '../../../helpers/start-app';
import Ember from 'ember';

moduleFor('controller:hops/edit', 'hopAdditionController', {
  // Specify the other units that are required for this test.
  needs: ['controller:hops', 'controller:application', 'controller:login', 'controller:flash']
});

test('it updates weightOz when weightGrams is changed', function() {
  var controller = this.subject();
  var model = Ember.Object.create({weightGrams: 0, weightOz: 0});
  Ember.run(function() {
    controller.set('measureSystem', 'metric');
    controller.set('model', model);
    controller.set('weightGrams', 20);
    equal(controller.get('weightGrams'), 20);
  });
  equal(controller.get('weightOz').toFixed(2), 0.71);
});

test('it updates weightGrams when weightOz is changed', function() {
  var controller = this.subject();
  var model = Ember.Object.create({weightGrams: 0, weightOz: 0});
  Ember.run(function() {
    controller.set('measureSystem', 'us');
    controller.set('model', model);
    controller.set('weightOz', 20);
    equal(controller.get('weightOz'), 20);
  });
  equal(controller.get('weightGrams').toFixed(2), 566.99);
});
