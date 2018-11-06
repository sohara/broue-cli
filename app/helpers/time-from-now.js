import { helper as buildHelper } from '@ember/component/helper';

export function timeFromNow(params) {
  return window.moment(params[0]).fromNow();
}

export default buildHelper(timeFromNow);
