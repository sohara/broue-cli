import Ember from 'ember';
const { get, isEmpty} = Ember;

export default Ember.Helper.helper(function (params) {
  var source = params[0];
  var key = params[1];
  return isEmpty(key) ? source : get(source, key);
});
