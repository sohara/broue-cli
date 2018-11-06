import { alias } from '@ember/object/computed';
import { capitalize } from '@ember/string';
import Component from '@ember/component';
import { defineProperty } from '@ember/object';
import { run } from '@ember/runloop';

export default Component.extend({
  classNames: ['form-group'],
  classNameBindings: ['labelDasherized'],
  inputElementId: null,
  appendText: null,

  init () {
    this._super(...arguments);
    let property = this.get('property');
    defineProperty(this, 'valueProperty', alias(`model.${property}`));
  },

  valuePropertyName: function() {
    const propertyName = this.get('property');
    var splitPath = propertyName.split('.');
    return splitPath[splitPath.length -1];
  }.property('property'),

  // Extract the label text from property of parent view property
  // bound to 'value'
  labelText: function() {
    if (typeof(this.get('label')) !== "undefined") {
      return this.get('label');
    } else {
      return this.get('valuePropertyName')
        .decamelize()
        .split("_")
        .map(capitalize)
        .join(" ");
    }
  }.property('valuePropertyName'),

  inputName: function() {
    return this.get('valuePropertyName') + "Input";
  }.property('valuePropertyName'),

  // For acceptance tests... apply a classname to make it easy to
  // target input with a selector
  labelDasherized: function() {
    var text = this.get('labelText') || this.get('valuePropertyName');
    return text
      .decamelize()
      .split(" ")
      .join("-");
  }.property('labelText'),

  didInsertElement: function() {
    this._super();
    run.later(this, () => {
      this.set('inputElementId', this.get(this.get('inputName') + '.elementId'));
    });
  }
});
