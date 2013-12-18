/**
 * @name index.js<lib/image>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview image library
 */

var path = require('path');
var spawn = require('child_process').spawn;

var _ = require('underscore');

var logger = require('../logger');
var constant = require('../constant');

var imagemagick = require('./imagemagick');

var DEFAULT_OPTIONS = constant.IMAGE_RATIORESIZE_DEFAULT_OPTIONS;

/**
 * @name image
 * @namespace image
 */
module.exports = {

    /**
     * imagemagick library
     * @name imagemagick
     * @memberof image
     */
    imagemagick: imagemagick,

    /**
     * optipng
     *
     * @name optipng
     * @memberof imagemagick
     * @method
     * @param {String} filepath PING file path.
     * @param {Number} level optimization level.
     * @param {function} callback
     * @example
     * var filepath = './test/image/logo.png';
     */
    optipng: function (filepath, level, callback) {
        if (typeof level === 'function') {
            callback = level;
            level = undefined;
        }

        var options = level ? '-o' + level : '';
        var proc = spawn('optipng', [options, filepath]);

        proc.stdout.on('data', function (data) {
            logger.message(data.toString());
        });

        proc.stderr.on('data', function (data) {
            logger.message(data.toString());
        });

        proc.addListener('exit', function (e) {
            if (e) {
                return callback(e);
            }
            callback();
        });
    },

    /**
     * jpegoptim
     *
     * @name jpegoptim
     * @memberof imagemagick
     * @method
     * @param {String} filepath JPEG file path.
     * @param {String} options jpegoptim options.
     * @param {function} callback
     * @example
     * var filepath = './test/image/logo.jpg';
     */
    jpegoptim: function (filepath, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = undefined;
        }

        options = options || '--strip-all';
        var proc = spawn('jpegoptim', [options, filepath]);
        var err = '';
        proc.stdin.pause();

        proc.stdout.on('data', function (data) {
            logger.message(data.toString());
        });

        proc.stderr.on('data', function (data) {
            err += data;
            logger.error(data.toString());
        });

        proc.addListener('exit', function (e) {
            proc.stdin.resume();
            if (e || err) {
                return callback(e || err);
            }
            callback();
        });
    },

    /**
     *
     * @param {String} filepath Image file path.
     * @param {Object} options
     * @example
     * var filepath = './test/image/xxx.png'
     * var options = { extnames: ['png', 'jpg'], include: ['test/image'], exclude: [] }
     * var out = beezlib.image.isResizeImage(filepath, options)
     * console.log(out)
     * >> true
     * @returns {Boolean}
     */
    isResizeImage: function (filepath, options) {
        _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        var extnames = options.extnames;
        var include = options.include;
        var exclude = options.exclude;
        var separator = options.separator;
        var extname = path.extname(filepath);
        var reg = new RegExp(separator + '\\d+\\' + extname + '$');
        if (!~extnames.indexOf(extname) || reg.test(filepath) || /^sprite/.test(path.basename(filepath))) {
            return false;
        }

        for (var i = 0; i < exclude.length; i++) {
            if (~filepath.indexOf(exclude[i])) {
                return false;
            }
        }

        return _.some(_.map(include, function (inc) {
            return ~filepath.indexOf(inc);
        }));
    }
};