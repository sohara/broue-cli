import BrewsEditRoute from '../brews/edit';
import AuthenticatedRoute from '../../mixins/authenticated-route';

export default BrewsEditRoute.extend(AuthenticatedRoute, {
  returnRoute: 'brew_day.index',

  model: function() {
    return this.modelFor('brew');
  }
});
