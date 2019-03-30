import { helper } from '@ember/component/helper';
import { capitalize } from '@ember/string';

export function labelText([field]/*, hash*/) {
  return field
    .decamelize()
    .split("_")
    .map(capitalize)
    .join(" ");
}

export default helper(labelText);
