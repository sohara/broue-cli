import BrewsEditRoute from '../brews/edit';

export default BrewsEditRoute.extend({
  returnRoute: 'brew_day.index',

  model: function() {
    return this.modelFor('brew');
  }
});
