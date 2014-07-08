import NotesEditRoute from './edit';

export default NotesEditRoute.extend({

  model: function() {
    var brew = this.modelFor('brew');
    var note = this.store.createRecord('note');
    brew.get('notes').pushObject(note);
    return note;
  },

  renderTemplate: function() {
    this.render('notes/edit', {
      controller: 'notes/edit'
    });
  },

  setupController: function(controller, model) {
    this.controllerFor('notes/edit').set('model', model);
  }
});
