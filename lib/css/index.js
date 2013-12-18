/**
 * @name index.js<lib/css>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview css library
 */

var stylus = require('./stylus');
var sprite = require('./sprite');

/**
 * @name css
 * @namespace css
 */
module.exports = {
    /**
     * stylus library
     * @name stylus
     * @memberof css
     */
    stylus: stylus,

    /**
     * sprite library
     * @name sprite
     * @memberof css
     */
    sprite: sprite
};