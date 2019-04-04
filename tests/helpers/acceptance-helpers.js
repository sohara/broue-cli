import { fillIn, find, findAll } from '@ember/test-helpers';

export function fillSelect(identifier, content) {
  let selectSelector = testSelector(identifier);
  let selectElement = find(selectSelector);
  let options = [...selectElement.options];
  let option = options.find(opt => opt.textContent.includes(content));
  fillIn(selectElement, option.value);
}

export function findByText(selector, text, subselector) {
  let els = findAll(selector);
  let element = els.find(el => el.textContent.includes(text));
  if (subselector) {
    return element.querySelector(subselector);
  }
  return element;
}

export function testSelector(identifier) {
  return `[data-test-selector="${identifier}"]`;
}
