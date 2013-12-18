/**
 * @name imagemagick.js<lib/image>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview imagemagick library
 */

var path = require('path');

var Bucks = require('bucks');
var im = require('imagemagick');
var _ = require('underscore');

var logger = require('../logger');
var fsys = require('../fsys');
var constant = require('../constant');

var DEFAULT_SEPARATOR = constant.DEFAULT_SEPARATOR;

/**
 * @name imagemagick
 * @namespace imagemagick
 */
var functions = {};

_.each(im, function (val, idx) {
    functions[idx] = val;
});


/**
 * Get the size of the image
 *
 * @name getSize
 * @memberof imagemagick
 * @method
 * @param {String} file target file path
 * @param {function} callback
 * @return {Object} {width: {String}, height: {String}}
 * @example
 * beezlib.image.imagemagickgetSize('xxx.png', function(err, sizes) {
 *   console.log(size)
 * });
 * >> {width: xxx, heigth: xxx}
 *
 */
functions.getSize = function (file, callback) {
    return this.identify(['-format','%w,%h', file], function (err, res) {
        if (err) {
            return callback && callback(err, res);
        }

        var s = res.replace('\n', '').split(',');
        callback && callback(err, {
            width: s[0],
            height: s[1]
        });
    });
};

/**
 * Convert file format beez-ratio
 *
 * @name makeRatioFileNameSync
 * @memberof imagemagick
 * @method
 * @param {String} name src file name
 * @param {String} separator Separator ratio and file name
 * @param {Float} ratio example) 2.0
 * @return {String} file name
 * @example
 * var out = beezlib.image.imagemagick.makeRatioFileName('hoge.png', '-', 1.3);
 * console.log(out)
 * >> hoge_13.png
 */
functions.makeRatioFileNameSync = function (name, separator, ratio) {
    separator = separator || DEFAULT_SEPARATOR;
    var extname = path.extname(name);
    var basename = path.basename(name, extname);

    return basename + separator + (ratio * 10) + extname;
};

/**
 * File name is whether ratio format
 *
 * @name isRatioFileNameSync
 * @memberof imagemagick
 * @method
 * @param {String} filename target file name
 * @param {String} separator Separator ratio and file name
 * @return {boolean}
 * @example
 * var out = beezlib.image.imagemagickisRatioFileName('hoge-20.png', '-');
 * console.log(out)
 * >> true
 */
functions.isRatioFileNameSync = function (filename, separator) {
    separator = separator || DEFAULT_SEPARATOR;
    var extname = path.extname(filename);
    var basename = path.basename(filename, extname);
    var idx = basename.lastIndexOf(separator);
    var ratio = basename.substring(idx+1);

    if (ratio && parseInt(ratio, 10)) {
        return true;
    }
    return false;
};

/**
 * I converted to a ratio name to a different ratio format file name.
 *
 * @name changeRatioFileNameSync
 * @memberof imagemagick
 * @method
 * @param {String} filename target file name
 * @param {String} separator Separator ratio and file name
 * @param {Float} change ratio example) 2.0
 * @return {String} file name
 * @example
 * var out = beezlib.image.imagemagick.changeRatioFileName('hoge-20.png', null, 1.3);
 * console.log(out)
 * >> 'hoge-13.png'
 */
functions.changeRatioFileNameSync = function (filename, separator, change) {
    separator = separator || DEFAULT_SEPARATOR;
    var extname = path.extname(filename);
    var basename = path.basename(filename, extname);
    var idx = basename.lastIndexOf(separator);

    return basename.substring(0, idx) + separator + (change * 10) + extname;
};

/**
 * Resize ratio to the specified size, the image file. The file name format ratio
 *
 * @name ratioResize
 * @memberof imagemagick
 * @method
 * @param {Object} options imagemagick resize options.
 * @param {Float} baseRatio Base ratio of the original image resizing
 * @param {Array} outRatios Ratio you want to resize
 * @param {function} callback
 * @example
 * var baseRatio = 2.0;
 * var outRatios = [3.0, 2.0, 1.3, 1.0];
 * var options = {
 *   srcPath: './test/image/logo.png',
 *   dstPath: './test/image',
 *   //width: null,
 *   //height: null,
 *   strip: true,
 *   sharpening: 0.3
 * };
 *
 * var out = beezlib.image.imagemagick.ratioResize(options, baseRatio, outRatios, function (err, res) {});
 */
functions.ratioResize = function (options, baseRatio, outRatios, callback) {
    var self = this;
    this.getSize(options.srcPath, function(err, res) {
        if (err) {
            return callback && callback(err, res);
        }

        var width = res.width;
        var height = res.height;

        // parallel load
        var tasks = _.map(outRatios, function make(ratio) {
            var filename = path.basename(options.srcPath);

            return function task(err, res, next) {
                var dst = self.makeRatioFileNameSync(filename, null, ratio);
                var dstPath = path.join(options.dstPath, dst);

                if (ratio === baseRatio) { // base ratio
                    logger.debug('copy:', options.srcPath, '->' , dstPath);
                    fsys.cp(options.srcPath, dstPath, function (err, res) {
                        next(err, dstPath);
                    });
                } else {
                    var rw = Math.floor(width * ratio / 2);
                    var rh = Math.floor(height * ratio / 2);
                    var resizeOptions = {
                        srcPath: options.srcPath,
                        dstPath: dstPath,
                        width: rw,
                        height: rh,
                        strip: options.strip || true,
                        sharpening: options.sharpening || 0.3
                    };
                    logger.debug('resize:', resizeOptions.srcPath, '->' , dstPath);
                    self.resize(resizeOptions, function(err, res) {
                        next(err, dstPath);
                    });
                }
            };
        });

        new Bucks().parallel(tasks).then(function(result) {
            for (var i = 0; i < result.err.length; i++) {
                if (result.err[i]) {
                    return callback && callback(result.err[i]);
                }
            }
            callback && callback(null, result.res);
        }).end();
    });
};

module.exports = functions;
