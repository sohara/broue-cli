import ModalEditRoute from './modal-edit';

export default ModalEditRoute.extend({
  parentResource: null,
  controllerName: null,

  model: function() {
    let brew = this.modelFor('brew');
    let parentResource = this.parentResource;
    let belongsTo = `${parentResource}Additions`;
    var child = this.store.createRecord(`${parentResource}Addition`);
    brew.get(belongsTo).pushObject(child);
    return child;
  },

  renderTemplate: function() {
    let parentResource = this.parentResource;
    this.render(`${parentResource}s/edit`, {
      into: 'application',
      outlet: 'modal'
    });
  },

});
