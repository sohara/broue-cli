import { once } from '@ember/runloop';
import { capitalize } from '@ember/string';
import Component from '@ember/component';
import Ember from 'ember';

export default Component.extend({

  types: {
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
  },

  appendTexts: {
    Us: 'quarts/lbs',
    Metric: 'litres/kg',
    C: '°C',
    F: '°F'
  },

  appendText: function() {
    let suffix = this.get('suffix');
    let result = this.get('appendTexts')[suffix];
    if (typeof result !== 'undefined') {
      return result;
    } else {
      return this.get('suffix');
    }
  }.property('suffix'),

  suffix: function() {
    let type = this.get('type');
    let measureSystem = this.get('measureSystem');
    let path = `types.${type}.${measureSystem}`;
    let suffix = this.get(path);
    return suffix;
  }.property('measureSystem', 'type'),

  label: function() {
    const propertyParts = this.get('convertibleProperty').split('.');
    const propertyString = propertyParts[propertyParts.length -1];
    return propertyString
      .decamelize()
      .split("_")
      .map(capitalize)
      .join(" ");
  }.property('convertibleProperty'),

  propertyDidChange: function() {
    once(this, function() {
      let suffix = this.get('suffix');
      let propName = this.get('convertibleProperty');
      let fromPath = `object.${propName}${suffix}`;
      if (typeof(this.myBinding) !== 'undefined' &&  this.myBinding._from !== fromPath ) {
        this.myBinding.disconnect(this);
      }
      if (typeof(this.myBinding) === 'undefined' ||  this.myBinding._from !== fromPath ) {
        this.myBinding = Ember.Binding.from(fromPath).to('valueProperty');
        this.myBinding.connect(this);
      }
    });
  }.observes('measureSystem', 'convertibleProperty').on('init'),

});
