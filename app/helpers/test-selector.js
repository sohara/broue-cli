import { helper } from '@ember/component/helper';
import Ember from 'ember';

function nameFromContainerItem(containerItem) {
  const identifier = containerItem.toString().split('@')[1];
  const name = identifier.split(':')[1];
  return name;
}

export function testSelector([containerItem, field]/*, hash*/) {
  if (!Ember.testing) { return; }
  return `${nameFromContainerItem(containerItem)}-${field}`;
}

export default helper(testSelector);
