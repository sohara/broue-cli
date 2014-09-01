import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import Route from './ext/route-reopen';

Ember.MODEL_FACTORY_INJECTIONS = true;
Ember.Route = Route;

var App = Ember.Application.extend({
  modulePrefix: 'broue-cli', // TODO: loaded via config
  Resolver: Resolver
});

loadInitializers(App, 'broue-cli');

export default App;
