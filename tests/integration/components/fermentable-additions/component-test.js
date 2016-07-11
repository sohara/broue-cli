import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('fermentable-additions', 'Integration | Component | fermentable additions', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{fermentable-additions}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#fermentable-additions}}
      template block text
    {{/fermentable-additions}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
