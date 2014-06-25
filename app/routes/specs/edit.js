import BrewsEditRoute from '../brews/edit';

export default BrewsEditRoute.extend({
  returnRoute: 'specs.index',

  model: function() {
    return this.modelFor('brew');
  }
});
