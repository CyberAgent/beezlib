/**
 * @name index.js<lib/template>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview template library
 */

var hbs = require('./hbs');


/**
 * @name template
 * @namespace template
 */
module.exports = {
    hbs2hbscjs: hbs.hbs2hbscjs,
    hbsp2hbspjs: hbs.hbsp2hbspjs,
    requirehbs2hbsc: hbs.requirehbs2hbsc,
    hbs2hbsc2html: hbs.hbs2hbsc2html,
};