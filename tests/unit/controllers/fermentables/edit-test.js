import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('FermentableEditController', function(hooks) {
  setupTest(hooks);

  test('it updates weightOz when weightGrams is changed', function(assert) {
    var controller = this.owner.lookup('controller:fermentables/edit');
    var model = EmberObject.create({weightGrams: 0, weightOz: 0});
    run(function() {
      controller.set('measureSystem', 'metric');
      controller.set('model', model);
      controller.set('weightGrams', 20);
      assert.equal(controller.get('model.weightGrams'), 20);
    });
    assert.equal(controller.get('model.weightOz').toFixed(2), 0.71);
  });

  test('it updates weightGrams when weightOz is changed', function(assert) {
    var controller = this.owner.lookup('controller:fermentables/edit');
    var model = EmberObject.create({weightGrams: 0, weightOz: 0});
    run(function() {
      controller.set('measureSystem', 'us');
      controller.set('model', model);
      controller.set('weightOz', 20);
      assert.equal(controller.get('model.weightOz'), 20);
    });
    assert.equal(controller.get('model.weightGrams').toFixed(2), 566.99);
  });

  test('it returns undefined for weightLbs when weightOz is undefined', function(assert) {
    var controller = this.owner.lookup('controller:fermentables/edit');
    var model = EmberObject.create();
    run(function() {
      controller.set('model', model);
      assert.equal(controller.get('model.weightLbs'), undefined);
    });
  });

  test('it returns undefined for weightKg when weightGrams is undefined', function(assert) {
    var controller = this.owner.lookup('controller:fermentables/edit');
    var model = EmberObject.create();
    run(function() {
      controller.set('model', model);
      assert.equal(controller.get('weightKg'), undefined);
    });
  });

  test('it does not reset weightLbs when when setting weightLbs with 3 or more decimals', function(assert) {
    var controller = this.owner.lookup('controller:fermentables/edit');
    var model = EmberObject.create();
    run(function() {
      controller.set('model', model);
      controller.set('weightLbs', '0.3456');
      var weightLbs = controller.get('weightLbs');
      assert.equal(weightLbs, '0.3456');
    });
  });
});
