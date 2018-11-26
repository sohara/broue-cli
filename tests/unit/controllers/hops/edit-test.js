import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('hopAdditionController', function(hooks) {
  setupTest(hooks);

  test('it updates weightOz when weightGrams is changed', function(assert) {
    var controller = this.owner.lookup('controller:hops/edit');
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
    var controller = this.owner.lookup('controller:hops/edit');
    var model = EmberObject.create({weightGrams: 0, weightOz: 0});
    run(function() {
      controller.set('measureSystem', 'us');
      controller.set('model', model);
      controller.set('weightOz', 20);
      assert.equal(controller.get('model.weightOz'), 20);
    });
    assert.equal(controller.get('model.weightGrams').toFixed(2), 566.99);
  });
});
