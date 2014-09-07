import BrewsEditRoute from '../brews/edit';
import AuthenticatedRoute from '../../mixins/authenticated-route';

export default BrewsEditRoute.extend(AuthenticatedRoute, {
  returnRoute: 'specs.index',

  model: function() {
    return this.modelFor('brew');
  }
});
