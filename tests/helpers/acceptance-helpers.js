import Ember from 'ember';

export function fillSelectFromValue(selector, value) {
  let optionSelector = selector + ' option:contains("' + value + '")';
  let optionValue = Ember.$(optionSelector).val();
  if (!optionValue) {
    throw new Error("Option value not found");
  }
  fillIn(selector, optionValue);
}
