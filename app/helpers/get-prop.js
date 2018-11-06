import { helper as buildHelper } from '@ember/component/helper';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default buildHelper(function (params) {
  var source = params[0];
  var key = params[1];
  return isEmpty(key) ? source : get(source, key);
});
