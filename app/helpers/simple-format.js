import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(string) {
  if (typeof string !== "undefined") {
    var simpleFormatRE1 = /\r\n?/g;
    var simpleFormatRE2 = /\n\n+/g;
    var simpleFormatRE3 = /([^\n]\n)(?=[^\n])/g;
    var fstr = string;
    fstr = fstr.replace(simpleFormatRE1, "\n"); // \r\n and \r -> \n
    fstr = fstr.replace(simpleFormatRE2, "</p>\n\n<p>"); // 2+ newline  -> paragraph
    fstr = fstr.replace(simpleFormatRE3, "$1<br/>"); // 1 newline   -> br
    fstr = new Handlebars.SafeString("<p>" + fstr + "</p>");
    return fstr;
  }
});