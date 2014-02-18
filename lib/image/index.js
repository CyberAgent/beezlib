/**
 * @name index.js<lib/image>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview image library
 */

var path = require('path');
var spawn = require('child_process').spawn;

var _ = require('lodash');

var Bucks = require('bucks');

var logger = require('../logger');
var constant = require('../constant');
var fsys = require('../fsys');

var imagemagick = require('./imagemagick');

var RESIZE_DEFAULT_OPTIONS = constant.IMAGE_RATIORESIZE_DEFAULT_OPTIONS;
var OPTIM_DEFAULT_OPTIONS = constant.IMAGE_OPTIM_DEFAULT_OPTIONS;
var REG_OPTIPNG_FILE = constant.REG_OPTIPNG_FILE;
var REG_JPEGOPTIM_FILE = constant.REG_JPEGOPTIM_FILE;


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
     * @memberof image
     * @method
     * @param {String} filepath PING file path.
     * @param {String} options optipng options.
     * @param {function} callback
     * @example
     * var filepath = './test/image/logo.png';
     */
    optipng: function (filepath, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = undefined;
        }

        options = options || '';
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
     * @memberof image
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
        _.defaults(options || (options = {}), RESIZE_DEFAULT_OPTIONS);
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
    },

    /**
     * run the optipng and jpegoptim
     *
     * @name optim
     * @memberof image
     * @method
     * @param {String} path JPEG|PNG file path.
     * @param {String} options options.
     * @param {function} callback
     * @example
     * var filepath = './test/image/logo.jpg';
     * var options = {
     *     optipng:   { use: true, options: "-o 2"},
     *     jpegoptim: { use: true, options: "--strip-all"}
     * }
     */
    optim: function (path, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = undefined;
        }

        _.defaults(options || (options = {}), OPTIM_DEFAULT_OPTIONS);

        if (REG_OPTIPNG_FILE.test(path) && options.optipng.use) { // optipng

            this.optipng(path, options.optipng.options, function(err) {

                if (err) {
                    logger.error('optipng error.', err);
                    callback && callback(err);
                    return;
                }

                logger.message('optipng:', path);
                callback && callback(null, path);

            });
        } else if (REG_JPEGOPTIM_FILE.test(path) && options.jpegoptim) { // jpegoptim

            this.jpegoptim(path, options.jpegoptim.options, function(err) {

                if (err) {
                    logger.error('jpegoptim error.', err);
                    callback && callback(err);
                    return;
                }

                logger.message('jpegoptim:', path);
                callback && callback(null, path);

            });
        } else {
            logger.info('no match extension. path: ' + path);

            callback && callback(null, path);
        }

    },

    /**
     * run the recursive directory of  optipng and jpegoptim
     *
     * @name optimdir
     * @memberof image
     * @method
     * @param {String} dirpath directory root path
     * @param {String} options options.
     * @param {function} callback
     * @example
     * var filepath = './test/image/logo.jpg';
     * var options = {
     *     optipng:   { use: true, options: "-o 2"},
     *     jpegoptim: { use: true, options: "--strip-all"}
     * }
     */
    optimdir: function (dirpath, options, callback) {
        var self = this;

        if (typeof options === 'function') {
            callback = options;
            options = undefined;
        }

        if (!fsys.isDirectorySync(dirpath)) {
            logger.error('not a directory. path:', dirpath);
            callback && callback(new Error('not a directory. path: ' + dirpath));
            return;
        }

        var bucks = new Bucks();
        bucks.empty();
        var tasks = [];

        fsys.walk(dirpath, function filefn(prefix, dir, file, stats) {
            var src = path.join(dir, file);
            tasks.push(function (err, res, next) {
                self.optim(src, options, next);
            });

        });

        bucks.parallel(tasks);
        bucks.end(function(err, ress) {
            callback && callback(err, ress);
        });


    }
};
