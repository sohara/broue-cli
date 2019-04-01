import Controller, { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';
import convertedUnits from 'broue/lib/converted-units';


export default Controller.extend({
  applicationController: controller('application'),
  stylesController: controller('styles'),
  measureSystem: alias('applicationController.measureSystem'),
  styles: alias('stylesController.model'),
  batchSizeGallons: convertedUnits('batchSize', 'liquidVolume', 'US'),
  batchSizeLitres: convertedUnits('batchSize', 'liquidVolume', 'Metric'),
  boilLossGallons: convertedUnits('boilLoss', 'liquidVolume', 'US'),
  boilLossLitres: convertedUnits('boilLoss', 'liquidVolume', 'Metric'),
  waterGrainRatioUs: convertedUnits('waterGrainRatio', 'grainRatio', 'US'),
  waterGrainRatioMetric: convertedUnits('waterGrainRatio', 'grainRatio', 'Metric'),
  recordedPostBoilVolumeLitres: convertedUnits('recordedPostBoilVolume', 'liquidVolume', 'Metric'),
  recordedPostBoilVolumeGallons: convertedUnits('recordedPostBoilVolume', 'liquidVolume', 'US'),
  targetMashTempC: convertedUnits('targetMashTemp', 'temperature', 'Metric'),
  targetMashTempF: convertedUnits('targetMashTemp', 'temperature', 'US'),
  grainTempC: convertedUnits('grainTemp', 'temperature', 'Metric'),
  grainTempF: convertedUnits('grainTemp', 'temperature', 'US'),

  actions: {
    resetErrorMessage() {
      //noop
      return false;
    },
    sendSave(model) {
      this.send('save', model);
    },
    sendCancel(model) {
      this.send('cancel', model);
    }
  }

});
