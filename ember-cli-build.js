'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');


module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      prepend: 'https://dbwwdwzhcqlk3.cloudfront.net/'
    },
    minifyCSS: {
      enabled: true,
      options: {}
    },
    "ember-cli-babel": {
      includePolyfill: true
    }
  });

  app.import('bower_components/fontawesome/less/font-awesome.less');
  app.import('bower_components/moment/moment.js');

  if (app.env !== 'production') {
    app.import('bower_components/route-recognizer/dist/route-recognizer.js');
    app.import('bower_components/FakeXMLHttpRequest/fake_xml_http_request.js');
    app.import('bower_components/pretender/pretender.js');
  }

  var faFonts = new Funnel('bower_components/fontawesome/fonts',{
      srcDir: '/',
      // files: ['*|)}>#*'],
      include: ["*.*"],
      destDir: '/fonts'
  });

  var fontAssets = mergeTrees([faFonts]);

  return app.toTree(fontAssets);
};
