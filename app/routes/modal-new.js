import ModalEditRoute from './modal-edit';

export default ModalEditRoute.extend({
  parentResource: null,
  controllerName: null,

  model: function() {
    var brew = this.modelFor('brew');
    var belongsTo = '%@1Additions'.fmt(this.parentResource);
    var child = this.store.createRecord('%@1Addition'.fmt(this.parentResource));
    brew.get(belongsTo).pushObject(child);
    return child;
  },

  renderTemplate: function() {
    this.render('%@1s/edit'.fmt(this.parentResource), {
      into: 'application',
      outlet: 'modal'
    });
  },

});
