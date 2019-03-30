import Component from '@ember/component';
import { guidFor } from '@ember/object/internals';

export default Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);
    this.inputId = guidFor(this);
    let type = this.type || "text";
    this.inputType = type;
  },
  actions: {
    selectValue (value) {
      let optionsContent = this.optionsContent.toArray();
      let selection = optionsContent[value];
      let model = this.model;
      let field = this.field;
      model.set(field, selection);
    }
  }
});
