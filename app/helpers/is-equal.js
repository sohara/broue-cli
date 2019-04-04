import { helper as buildHelper } from '@ember/component/helper';

// Sadly need work around Ember Data relationships
// (e.g. belongTo) returning a Proxy from the `get`
// helper
function conentFromParam(param) {
  if (param) {
    if (typeof param.content === 'undefined') {
      return param;
    }
    return param.content;
  }
}

export default buildHelper(function isEqual(params) {
  let first = conentFromParam(params[0]);
  let second = conentFromParam(params[1]);
  return first === second;
});
