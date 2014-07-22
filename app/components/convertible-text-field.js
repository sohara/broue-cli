import Ember from 'ember';

export default Ember.Component.extend({

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
    var result = this.get('appendTexts.%@1'.fmt(this.get('suffix')));
    if (typeof result !== 'undefined') {
      return result;
    } else {
      return this.get('suffix');
    }
  }.property('suffix'),

  suffix: function() {
    //var suffix = (this.get('measureSystem') === "us") ? 'Gallons' : 'Litres';
    var suffix = this.get('types.%@1.%@2'.fmt(this.get('type'), this.get('measureSystem')));
    return suffix;
  }.property('measureSystem'),

  label: function() {
    return this.get('convertibleProperty')
      .decamelize()
      .split("_")
      .map(Ember.String.capitalize)
      .join(" ");
  }.property('convertibleProperty'),

  propertyDidChange: function() {
    Ember.run.once(this, function() {
      var suffix = this.get('suffix');
      var propName = this.get('convertibleProperty');
      var fromPath = 'object.%@1%@2'.fmt(propName, suffix)
      if (typeof(this.myBinding) !== 'undefined' &&  this.myBinding._from !== fromPath ) {
        this.myBinding.disconnect(this);
      }
      if (typeof(this.myBinding) === 'undefined' ||  this.myBinding._from !== fromPath ) {
        this.myBinding = Ember.Binding.from(fromPath).to('valueProperty');
        this.myBinding.connect(this);
      }
    });
  }.observes('measureSystem', 'convertibleProperty'),

});
