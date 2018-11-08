import $ from 'jquery';
import { fillIn, findAll } from '@ember/test-helpers';

export function fillSelectFromValue(selector, value) {
  let optionSelector = selector + ' option:contains("' + value + '")';
  let optionValue = $(optionSelector).val();
  if (!optionValue) {
    throw new Error("Option value not found");
  }
  fillIn(selector, optionValue);
}

export function findByText(selector, text, subselector) {
  let els = findAll(selector);
  let element = els.find(el => el.textContent.includes(text));
  if (subselector) {
    return element.querySelector(subselector);
  }
  return element;
}
