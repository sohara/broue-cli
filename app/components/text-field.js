import Component from '@ember/component';
import { guidFor } from '@ember/object/internals';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);
    this.inputId = guidFor(this);
    let type = this.type || "text";
    this.inputType = type;
  },

  label: computed('field', function() {
    let field = this.field || '';
    return field.capitalize();
  })
});
