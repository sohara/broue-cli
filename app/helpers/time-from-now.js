import Ember from 'ember';

export function timeFromNow(params) {
  return window.moment(params[0]).fromNow();
}

export default Ember.Helper.helper(timeFromNow);
