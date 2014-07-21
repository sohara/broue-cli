/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  fingerprint: {
    prepend: 'https://dbwwdwzhcqlk3.cloudfront.net/'
  },
  minifyCSS: {
    enabled: true,
    options: {}
  }
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.
if (app.env !== 'production') {
  app.import('vendor/route-recognizer/dist/route-recognizer.js');
  app.import('vendor/FakeXMLHttpRequest/fake_xml_http_request.js');
  app.import('vendor/pretender/pretender.js');
}

app.import('vendor/bootstrap/dist/js/bootstrap.js');
app.import('vendor/bootstrap/dist/css/bootstrap.css');
app.import('vendor/fontawesome/less/font-awesome.less');

app.import('vendor/moment/moment.js');

var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var boostrapFonts = pickFiles('vendor/bootstrap/dist/fonts',{
    srcDir: '/',
    files: ['**/*'],
    destDir: '/fonts'
});
var faFonts = pickFiles('vendor/fontawesome/fonts',{
    srcDir: '/',
    files: ['**/*'],
    destDir: '/fonts'
});

module.exports = mergeTrees([app.toTree(), boostrapFonts, faFonts]);
