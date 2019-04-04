import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { getRootElement, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modal-editor', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('noOp', () => {});

    // Template block usage:
    await render(hbs`
      <ModalEditor
        @title="Edit Fermentable"
        @onClose={{action this.noOp}}
        @save={{action this.noOp}}
      >
        template block text
      </ModalEditor>
    `);

    assert.ok(getRootElement().textContent.trim().includes('template block text'));
  });
});
