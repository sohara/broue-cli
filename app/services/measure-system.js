import Service from '@ember/service';

export default Service.extend({
  system: 'us',

  setSystem(system) {
    this.set('system', system);
  }
});
