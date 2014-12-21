import { test, moduleFor } from 'ember-qunit';
import startApp from '../../../helpers/start-app';
import Ember from 'ember';

moduleFor('controller:fermentables/edit', 'FermentableEditController', {
  // Specify the other units that are required for this test.
  needs: ['controller:fermentables', 'controller:application', 'controller:login', 'controller:flash']
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

test('it returns undefined for weightLbs when weightOz is undefined', function() {
  var controller = this.subject();
  var model = Ember.Object.create();
  Ember.run(function() {
    controller.set('model', model);
    equal(controller.get('weightLbs'), undefined);
  });
});

test('it returns undefined for weightKg when weightGrams is undefined', function() {
  var controller = this.subject();
  var model = Ember.Object.create();
  Ember.run(function() {
    controller.set('model', model);
    equal(controller.get('weightKg'), undefined);
  });
});

test('it does not reset weightLbs when when setting weightLbs with 3 or more decimals', function() {
  var controller = this.subject();
  var model = Ember.Object.create();
  Ember.run(function() {
    controller.set('model', model);
    controller.set('weightLbs', '0.3456');
    var weightOz = controller.get('weightOz');
    var weightLbs = controller.get('weightLbs');
    equal(weightLbs, '0.3456');
  });
});
