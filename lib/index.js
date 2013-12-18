/**
 * @name index.js<lib>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @license MIT
 * @overview beez library
 */

var beezlib = {};

var colors = require('colors');

var logger = require('./logger');

var obj = require('./obj');
var fsys = require('./fsys');
var cmd = require('./cmd');
var template = require('./template');
var css = require('./css');
var image = require('./image');
var regexp = require('./regexp');
var constant = require('./constant');

/**
 * @name beezlib
 * @namespace beezlib
 */
beezlib = {
    /**
     * logger library
     * @name logger
     * @memberof beezlib
     */
    logger: logger, // custom override

    /**
     * logger.debug short-cut
     * @name debug
     * @memberof beezlib
     */
    debug: logger.debug,

    /**
     * object library
     * @name obj
     * @memberof beezlib
     */
    obj: obj,
    /**
     * file system library
     * @name fsys
     * @memberof beezlib
     */
    fsys: fsys,
    /**
     * command library
     * @name cmd
     * @memberof beezlib
     */
    cmd: cmd,
    /**
     * template
     * @name template
     * @memberof beezlib
     */
    template: template,
    /**
     * css
     * @name css
     * @memberof beezlib
     */
    css: css,
    /**
     * image
     * @name image
     * @memberof beezlib
     */
    image: image,
    /**
     * regexp
     * @name regexp
     * @memberof beezlib
     */
    regexp: regexp,
    /**
     * constant
     * @name constant
     * @memberof beezlib
     */
    constant: constant,
    /**
     * empty function
     * @name none
     * @memberof beezlib
     */
    none: function () {},

    /**
     * setup color theme
     *
     * default:
     * {
     *     silly: 'rainbow',
     *      input: 'grey',
     *      verbose: 'cyan',
     *      prompt: 'grey',
     *      info: 'green',
     *      data: 'grey',
     *      help: 'cyan',
     *      warn: 'yellow',
     *      debug: 'blue',
     *      error: 'red',
     *      err: 'red',
     *      title: 'yellow'
     * }
     *
     * @memberof color
     * @method
     * @param {Object} theme custom color theme
     *
     */
    setupColorTheme: function (theme) {
        theme = theme || constant.LOGGER_COLOR_THEME;
        this.logger.colors = true;

        return colors.setTheme(theme);
    }

};

module.exports = beezlib;
