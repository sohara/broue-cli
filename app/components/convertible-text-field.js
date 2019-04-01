import { capitalize } from '@ember/string';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

const TYPES = {
  volume: {
    us: 'Gallons',
    metric: 'Litres'
  },
  weight: {
    us: 'Oz',
    metric: 'Grams'
  },
  weightScaled: {
    us: "Lbs",
    metric: "Kg"
  },
  ratio: {
    us: 'Us',
    metric: 'Metric'
  },
  temp: {
    us: 'F',
    metric: 'C'
  }
};

const APPEND_TEXTS = {
  Us: 'quarts/lbs',
  Metric: 'litres/kg',
  C: '°C',
  F: '°F'
};

export default Component.extend({
  measureSystemService: service('measureSystem'),
  measureSystem: reads('measureSystemService.system'),
  appendText: computed('suffix', function() {
    let suffix = this.suffix;
    let result = APPEND_TEXTS[suffix];
    if (typeof result !== 'undefined') {
      return result;
    } else {
      return this.suffix;
    }
  }),

  suffix: computed('measureSystem', 'type', function() {
    let type = this.type;
    let measureSystem = this.measureSystem;
    let path = `${type}.${measureSystem}`;
    let suffix = get(TYPES, path);
    return suffix;
  }),

  label: computed('convertibleProperty', function() {
    const propertyParts = this.field.split('.');
    const propertyString = propertyParts[propertyParts.length -1];
    return propertyString
      .decamelize()
      .split("_")
      .map(capitalize)
      .join(" ");
  })

});
