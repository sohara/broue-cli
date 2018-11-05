import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Ember from 'ember';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

/* eslint no-console: "off" */
Ember.onerror = function (error) {
  console.log(error);
  throw error;
};

loadInitializers(App, config.modulePrefix);

export default App;
