import { helper as buildHelper } from '@ember/component/helper';

export function formattedDate(params) {
  return window.moment(params[0]).format('LL');
}

export default buildHelper(formattedDate);
