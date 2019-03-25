import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);
    let type = this.type || "button";
    this.buttonType = type;
  },
});
