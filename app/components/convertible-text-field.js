import { once } from '@ember/runloop';
import { capitalize } from '@ember/string';
import Component from '@ember/component';
import { computed, get, observer } from '@ember/object';
import Ember from 'ember';

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
  appendText: computed('suffix', function() {
    let suffix = this.get('suffix');
    let result = APPEND_TEXTS[suffix];
    if (typeof result !== 'undefined') {
      return result;
    } else {
      return this.get('suffix');
    }
  }),

  suffix: computed('measureSystem', 'type', function() {
    let type = this.get('type');
    let measureSystem = this.get('measureSystem');
    let path = `${type}.${measureSystem}`;
    let suffix = get(TYPES, path);
    return suffix;
  }),

  label: computed('convertibleProperty', function() {
    const propertyParts = this.get('convertibleProperty').split('.');
    const propertyString = propertyParts[propertyParts.length -1];
    return propertyString
      .decamelize()
      .split("_")
      .map(capitalize)
      .join(" ");
  }),

  connectBindings() {
    let suffix = this.get('suffix');
    let propName = this.get('convertibleProperty');
    let fromPath = `object.${propName}${suffix}`;
    if (typeof (this.myBinding) !== 'undefined' && this.myBinding._from !== fromPath) {
      this.myBinding.disconnect(this);
    }
    if (typeof (this.myBinding) === 'undefined' || this.myBinding._from !== fromPath) {
      this.myBinding = Ember.Binding.from(fromPath).to('valueProperty');
      this.myBinding.connect(this);
    }
  },

  propertyDidChange: observer('measureSystem', 'convertibleProperty', function() {
    once(this, this.connectBindings);
  }),

  init() {
    this._super(...arguments);
    this.connectBindings();
  }

});
