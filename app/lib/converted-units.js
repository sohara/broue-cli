import { computed } from '@ember/object';
const GRAIN_RATIO_CONVERSION = 0.47930570952469;
const LITRES_TO_GALLONS_CONVERSION = 3.7854118;
const OUNCE_TO_GRAMS_CONVERSTION = 28.3495231;

const litresToGallons = val =>  val * LITRES_TO_GALLONS_CONVERSION;
const gallonsToLitres = val => val / LITRES_TO_GALLONS_CONVERSION;
const usGrainToMetric = val => val / GRAIN_RATIO_CONVERSION;
const metricGrainToUs = val => val * GRAIN_RATIO_CONVERSION;
const usTempToMetric = val => ( val -32 ) * (5/9);
const metricTempToUs = val => (val * (9/5)) + 32;
const usWeightToMetric = val => val * OUNCE_TO_GRAMS_CONVERSTION;
const metricWeightToUs = val => val / OUNCE_TO_GRAMS_CONVERSTION;

const CONVERSIONS = {
  liquidVolume: {
    suffixUS: 'Gallons',
    suffixMetric: 'Litres',
    conversionFromUS: litresToGallons,
    conversionFromMetric: gallonsToLitres
  },
  grainRatio: {
    suffixUS: 'Us',
    suffixMetric: 'Metric',
    conversionFromUS: usGrainToMetric,
    conversionFromMetric: metricGrainToUs
  },
  temperature: {
    suffixUS: 'F',
    suffixMetric: 'C',
    conversionFromUS: usTempToMetric,
    conversionFromMetric: metricTempToUs
  },
  weight: {
    suffixUS: 'Oz',
    suffixMetric: 'Grams',
    conversionFromUS: usWeightToMetric,
    conversionFromMetric: metricWeightToUs
  }
};

// Computed property macro to convert units from one measure system
// to its alternate measures system, e.g. gallons -> litres
//
// baseProperty - the name of the prop without suffix indicating
// measure system (e.g. `batchSize` for `batchSizeGallons`)
// conversion - what kind of conversion to do, e.g. temperature
// measureSystem - which measure system this prop belongs to, e.g.
// Metric or US
export default function convertedUnits(baseProperty, conversion, measureSystem) {
  let dependentKeySuffix = CONVERSIONS[conversion][`suffix${measureSystem}`];
  let dependentKey = `model.${baseProperty}${dependentKeySuffix}`;
  let func = CONVERSIONS[conversion][`conversionFrom${measureSystem}`]
  let alternateSystem = measureSystem === 'US' ? 'Metric' : 'US';
  let alternateSuffix = CONVERSIONS[conversion][`suffix${alternateSystem}`];
  let alternateKey = `model.${baseProperty}${alternateSuffix}`;
  return computed(dependentKey, {
    get() {
      return roundedTo(2, this.get(dependentKey));
    },
    set(key, value) {
      this.set(dependentKey, value);
      let converted = func(value);
      this.set(alternateKey, converted);
      return value;
      }
    }
  )
}

function roundedTo(decimals, value) {
  let divisor = Math.pow(10, decimals);
  return Math.round(value * divisor) / divisor;
}
