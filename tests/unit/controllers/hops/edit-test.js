import { test, moduleFor } from 'ember-qunit';
import Ember from 'ember';

moduleFor('controller:hops/edit', 'hopAdditionController', {
  // Specify the other units that are required for this test.
  needs: ['controller:hops', 'controller:application', 'controller:login']
});

test('it updates weightOz when weightGrams is changed', function(assert) {
  var controller = this.subject();
  var model = Ember.Object.create({weightGrams: 0, weightOz: 0});
  Ember.run(function() {
    controller.set('measureSystem', 'metric');
    controller.set('model', model);
    controller.set('model.weightGrams', 20);
    assert.equal(controller.get('model.weightGrams'), 20);
  });
  assert.equal(controller.get('model.weightOz').toFixed(2), 0.71);
});

test('it updates weightGrams when weightOz is changed', function(assert) {
  var controller = this.subject();
  var model = Ember.Object.create({weightGrams: 0, weightOz: 0});
  Ember.run(function() {
    controller.set('measureSystem', 'us');
    controller.set('model', model);
    controller.set('model.weightOz', 20);
    assert.equal(controller.get('model.weightOz'), 20);
  });
  assert.equal(controller.get('model.weightGrams').toFixed(2), 566.99);
});
