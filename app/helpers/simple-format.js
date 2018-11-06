import { helper as buildHelper } from '@ember/component/helper';
import Ember from 'ember';

export function simpleFormat(params) {
  let string = params[0];
  if (typeof string !== "undefined" && typeof string !== "object") {
    var simpleFormatRE1 = /\r\n?/g;
    var simpleFormatRE2 = /\n\n+/g;
    var simpleFormatRE3 = /([^\n]\n)(?=[^\n])/g;
    var fstr = string;
    fstr = fstr.replace(simpleFormatRE1, "\n"); // \r\n and \r -> \n
    fstr = fstr.replace(simpleFormatRE2, "</p>\n\n<p>"); // 2+ newline  -> paragraph
    fstr = fstr.replace(simpleFormatRE3, "$1<br/>"); // 1 newline   -> br
    fstr = new Ember.Handlebars.SafeString("<p>" + fstr + "</p>");
    return fstr;
  }
}

export default buildHelper(simpleFormat);
