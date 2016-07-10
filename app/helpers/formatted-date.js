import Ember from 'ember';

export function formattedDate(params) {
  return window.moment(params[0]).format('LL');
}

export default Ember.Helper.helper(formattedDate);
