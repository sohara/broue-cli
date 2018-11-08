import Mixin from '@ember/object/mixin';

export default Mixin.create({
  beforeModel: function(transition) {
    this.controllerFor('login').verify(transition);
  },
});
