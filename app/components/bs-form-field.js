import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['form-group'],
  classNameBindings: ['labelDasherized'],
  inputElementId: null,
  appendText: null,

  valuePropertyName: function() {
    var fromPath = this.get('valuePropertyBinding._from').split('.');
    return fromPath[fromPath.length -1];
  }.property('valuePropertyBinding'),

  // Extract the label text from property of parent view property
  // bound to 'value'
  labelText: function() {
    if (typeof(this.get('label')) !== "undefined") {
      return this.get('label')
    } else {
      return this.get('valuePropertyName')
        .decamelize()
        .split("_")
        .map(Ember.String.capitalize)
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
    this.set('inputElementId', this.get(this.get('inputName') + '.elementId'));
  }
});
