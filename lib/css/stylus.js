/**
 * @name stylus<lib/css>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview stylus library
 */

var path = require('path');
var fs = require('fs');

var stylus = require('stylus');
var nib = require('nib');
var _ = require('underscore');

var logger = require('../logger');
var fsys = require('../fsys');
var obj = require('../obj');
var constant = require('../constant');
var common = require('../common');

var DEFAULT_OPTIONS = constant.CSS_STYLUS_DEFAULT_OPTIONS;

/**
 * @name stylus
 * @namespace stylus
 */
module.exports = {

    /**
     * Compile the stylus file, and save it to a file.
     *
     * @name write
     * @memberof stylus
     * @method
     * @param {String} src Stylus target file(formt: stylus)
     * @param {String} dst CSS file to be saved
     * @param {Object} options stylus options
     * @param {function} callback
     * @example
     * beezlib.css.stylus.write('./test.styl', './test.css', {
     *   options: {
     *     compress: true,
     *     firebug: false,
     *     linenos: false,
     *     nib: true,
     *     fn : function (styl) {
     *       styl.define('body-padding', function (data) {
     *         var rate  = data.val || 1;
     *         var base = 10;
     *         return (rate * base) + 'px';
     *       });
     *     }
     *   },
     *   {
     *     extend: {
     *       "condition": {
     *         "ua": [ "android", "ios" ]
     *       },
     *       "content": {
     *         "options": {
     *           "fn": {
     *             "STAT_URL": "http://stat.example.com"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }, function (err, css) {
     *   if (err) {
     *     throw err;
     *   }
     *   console.log(css)
     * });
     *
     */
    write: function (src, dst, config, headers, callback) {

        if (_.isFunction(headers)) {
            callback = headers;
            headers = undefined;
        }

        var options = config.options;

        if (!fsys.isFileSync(src)) {
            return callback(new Error('source file not found. path:', src));
        }

        _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        var encode = options.encode;
        var compress = options.compress;
        var firebug = options.firebug;
        var linenos = options.linenos;
        var urlopt = options.url;


        var raw = fs.readFileSync(src, encode);

        var styl = stylus(raw)
                .set('filename', dst)
                .set('compress', compress)
                .set('firebug', firebug)
                .set('linenos', linenos)
                .define('b64', stylus.url(urlopt))
        ;

        if (options.nib) { // use nib library
            styl.use(nib());
        }

        // extend options
        if (config.hasOwnProperty('extend') && headers && common.isUAOverride(config, headers) && config.extend.hasOwnProperty('content')) {
            options = obj.copy(config.extend.content, config).options;
            logger.debug('Override stylus options:', options);
        }

        // define functions and constant values
        if (options.fn && Object.keys(options.fn).length) {
            styl.use(function (styl) {
                _.each(options.fn, function (fn, name) {
                    if (_.isFunction(fn)) {
                        styl.define(name, function (data) {
                            return fn(data && data.val);
                        });
                    } else {
                        styl.define(name, function () {
                            return fn;
                        });
                    }
                });
            });
        }

        styl.render(function (err, css) {
            err && callback(err, css);

            fs.writeFileSync(dst, css, encode);
            callback(null, css);
        });
    }
};
