import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function isEqual(params) {
  return params[0] === params[1];
});
