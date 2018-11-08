import { alias } from '@ember/object/computed';
import { capitalize } from '@ember/string';
import Component from '@ember/component';
import { defineProperty } from '@ember/object';
import { run } from '@ember/runloop';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['form-group'],
  classNameBindings: ['labelDasherized'],
  inputElementId: null,
  appendText: null,

  init () {
    this._super(...arguments);
    let property = this.property;
    defineProperty(this, 'valueProperty', alias(`model.${property}`));
  },

  valuePropertyName: computed('property', function() {
    const propertyName = this.property;
    var splitPath = propertyName.split('.');
    return splitPath[splitPath.length -1];
  }),

  // Extract the label text from property of parent view property
  // bound to 'value'
  labelText: computed('valuePropertyName', function() {
    if (typeof(this.label) !== "undefined") {
      return this.label;
    } else {
      return this.valuePropertyName
        .decamelize()
        .split("_")
        .map(capitalize)
        .join(" ");
    }

  }),

  inputName: computed('valuePropertyName', function() {
    return this.valuePropertyName + "Input";
  }),

  // For acceptance tests... apply a classname to make it easy to
  // target input with a selector
  labelDasherized: computed('labelText', function() {
    var text = this.labelText || this.valuePropertyName;
    return text
      .decamelize()
      .split(" ")
      .join("-");
  }),

  didInsertElement: function() {
    this._super();
    run.later(this, () => {
      this.set('inputElementId', this.get(this.inputName + '.elementId'));
    });
  }
});
