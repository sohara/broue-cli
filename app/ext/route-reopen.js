import Route from '@ember/routing/route';

export default Route.reopen({
  // TODO: Either get this to work as required or remove
  // deactivate: function() {
  //   this._super.apply(this, arguments);
  //   this.get('flash').trigger('hide');
  // }
});
