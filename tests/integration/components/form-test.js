import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | form', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.toString = () => { return 'broue@controller:thing/blah/blah'}

    // Template block usage:
    await render(hbs`
      <Form @model={{this}} as |F|>
        <F.TextField @field="blah" />
      </Form>
    `);

    assert.equal(this.element.textContent.trim(), 'Blah');
  });
});
