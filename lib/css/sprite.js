/**
 * @name prite<lib/css>
 * @author Yuhei Aihara <aihara_yuhei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 */
var path = require('path');
var _ = require('lodash');

var fs = require('fs');
var fsys = require('../fsys');
var logger = require('../logger');
var constant = require('../constant');

var DEFAULT_OPTIONS = constant.CSS_SPRITE_DEFAULT_OPTIONS;

module.exports = {

    /**
     * build
     * @param {String} dstPath
     * @param {String} group
     * @param {Array} images
     * @param {Object} options
     * @param {Function} callback
     * @example
     * var dstPath = './test/image/sprite';
     * var group = 'logo';
     * var images = [ './test/image/sprite/sprite-logo-hoge.png', './test/image/sprite/sprite-logo-fuga.png',,,etc ];
     * var options = {
     *     ratios: [1, 1.3, 1.5, 2]
     *     separator: '-'
     * };
     * build(dstPath, group, images, options);
     * > make file 'sprite-logo.css', 'sprite-logo@10.png', 'sprite-logo@13.png', 'sprite-logo@15x.png' and 'sprite-logo@20x.png'
     */
    build: function (dstPath, group, images, options, callback) {
        options = _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        var ratios = options.ratios;
        var separator = options.separator;
        var head = this.getHead(images[0], options);
        var name = constant.CSS_SPRITE_PREFIX + separator + group;
        var output = dstPath + path.sep + name;
        var checker = new fsys.Checker(images, options.logpath, options.logname);
        var isExist = true;
        var outputImage, builder;

        // node-spritesheet will be removed in a future version
        var Builder;
        try {
            Builder = options.sprite2 ? require('node-sprite').Builder : require('node-spritesheet').Builder;
        } catch (e) {
            logger.error(e);
            throw e;
        }

        // Make csssprite builder
        builder = new Builder({
            outputDirectory: dstPath,
            outputCss: head + separator + group + constant.EXTENSION_STYL,
            selector: constant.CSS_SPRITE_SELECTOR_PREFIX + group,
            images: images
        });

        // Add builder options
        _.each(ratios, function (ratio) {
            outputImage = name + constant.CSS_SPRITE_RATIO_SEPARATOR + (ratio * 10) + constant.CSS_SPRITE_RATIO_SUFFIX + constant.EXTENSION_PNG;

            if (!fs.existsSync(dstPath + path.sep + outputImage)) {
                isExist = false;
            }

            builder.addConfiguration(ratio + constant.CSS_SPRITE_RATIO_SUFFIX, {
                pixelRatio: ratio,
                outputImage: outputImage
            });
        });

        // Check modified
        if (options.overwrite === false && isExist) {

            checker.read();
            if (!checker.isModified(output)) {
                logger.info('Skip build sprite. id: ', output);

                callback && callback();
                return;
            }
        }

        // Build !!
        builder.build(function (err, ret) {

            if (err) {
                logger.error('Fail to build spritesheet:', err);
                return callback(err);
            }

            // save log
            if (options.overwrite === false) {
                logger.trace('Save log id: ', output);

                checker.save(output);
                checker.write();
            }

            callback && callback(err, ret);
        });
    },

    /**
     * getImages
     * @param {String} dstPath
     * @param {String} group
     * @param {Object} options
     * @returns {Array} images is files path
     * @example
     * var dstPath = './test/image/sprite';
     * var group = 'logo';
     * var options = {
     *     separator: '-',
     * };
     * var out = getImages(dstPath, group, options);
     * console.log(out);
     * > [ './test/image/sprite/sprite-logo-hoge.png', './test/image/sprite/sprite-logo-fuga.png',,,etc ]
     */
    getImages: function (dstPath, group, options) {
        _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        var separator = options.separator;
        var heads = options.heads;
        var extnames = options.extnames;
        var images = [];
        fsys.walk(dstPath, function(prefix, dir, file, stats) {
            for (var i = 0; i < heads.length; i++) {
                for (var j = 0; j < extnames.length; j++) {
                    var reg = new RegExp('^' + heads[i] + separator + group + separator +'.+\\' + extnames[j] + '$');
                    if (file.match(reg)) {
                        images.push(path.join(dir, file));
                    }
                }
            }
        });

        return images;
    },

    /**
     * getGroup
     * @param {String} srcPath
     * @param {Object} options
     * @returns {String}
     * @example
     * var srcPath = './test/image/sprite/sprite-logo@10x.png';
     * var out = getGroup(srcPath);
     * console.log(out);
     * > 'logo'
     */
    getGroup: function (srcPath, options) {
        _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        var separator = options.separator;
        var extname = path.extname(srcPath);
        var reg = new RegExp('^.+' + separator + '(.+)((' + separator + '.+)|(@\\d+x))\\' + extname + '$');
        if (extname === '.styl' || extname === '.css') {
            reg = new RegExp('^.+' + separator + '(.+)\\' + extname + '$');
        }
        var result = path.basename(srcPath).match(reg);
        return result && result[1];
    },

    /**
     * getName
     * @param {String} srcPath
     * @param {Object} options
     * @returns {String}
     * @example
     * var srcPath = './test/image/sprite/sprite-logo@10x.png';
     * var out = getHead(srcPath);
     * console.log(out);
     * > 'sprite'
     */
    getHead: function (srcPath, options) {
        _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        var separator = options.separator;
        var extname = path.extname(srcPath);
        var reg = new RegExp('^(.+)' + separator + '.+((' + separator + '.+)|(@\\d+x))\\' + extname + '$');
        if (extname === '.styl' || extname === '.css') {
            reg = new RegExp('^(.+)' + separator + '.+\\' + extname + '$');
        }
        var result = path.basename(srcPath).match(reg);
        return result && result[1];
    },

    /**
     * After building, then to get the files that are created
     * @param {String} srcPath
     * @param {Object} options
     * @returns {Array}
     * var srcPath = 'test/image/sprite/sprite-logo-hoge.png'
     * var options = {
     *     separator: '-',
     *     ratios: [ 1, 2 ]
     * };
     * var out = getCreateFile(srcPath, options):
     * console.log(out);
     * > [ 'sprite-logo.styl', 'sprite-logo@10x.png', 'sprite-logo@20x.png' ]
     */
    getCreateFile: function (srcPath, options) {
        _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        if(!this.isSpriteImage(srcPath, options)) {
            logger.error('is not SpriteImage. srcPath:' + srcPath);
            return [];
        }

        var separator = options.separator;
        var ratios = options.ratios;
        var group = this.getGroup(srcPath, options);
        var head = this.getHead(srcPath, options);
        var files = [];
        files.push(head + separator + group + '.styl');
        for (var i = 0; i < ratios.length; i++) {
            files.push('sprite' + separator + group + '@' + (ratios[i] * 10) + 'x.png');
        }

        return files;
    },

    /**
     * isSpriteImage
     * @param {String} srcPath
     * @param {Object} options
     * @returns {Boolean}
     * @example
     * var srcPath = 'test/image/sprite/sprite-logo-hoge.png';
     * var options = {
     *     extnames: [ '.png' ],
     *     separator: '-',
     *     heads: ['sprite']
     * };
     * var out = isSpriteImage(srcPath, options);
     * console.log(out);
     * > true
     */
    isSpriteImage: function (srcPath, options) {
        _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        var heads = options.heads;
        var separator = options.separator;
        var extnames = options.extnames;

        return _.some(_.map(extnames, function (extname) {
            return _.some(_.map(heads, function (head) {
                var reg = new RegExp('^' + head + separator + '.+' + separator + '.+\\' + extname + '$');
                return reg.test(path.basename(srcPath));
            }));
        }));
    },

    /**
     * isSpriteSheet
     * @param {String} srcPath
     * @param {Object} options
     * @returns {Boolean}
     * @example
     * var srcPath = 'test/image/sprite/sprite-logo@10x.png';
     * var options = {};
     * var out = isSpriteSheet(srcPath, options);
     * console.log(out);
     * > true
     */
    isSpriteSheet: function (srcPath, options) {
        _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        var separator = options.separator;

        var reg = new RegExp('^sprite' + separator + '.+@\\d+x\\.png$');
        return reg.test(path.basename(srcPath));
    },

    /**
     * isSpriteStylus
     * @param {String} srcPath
     * @param {Object} options
     * @returns {Boolean}
     * @example
     * var srcPath = 'test/image/sprite/sprite-logo.styl';
     * var options = {};
     * var out = isSpriteStylus(srcPath, options);
     * console.log(out);
     * > true
     */
    isSpriteStylus: function (srcPath, options) {
        _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        var separator = options.separator;
        var heads = options.heads;

        return _.some(_.map(heads, function (head) {
            var reg = new RegExp('^' + head + separator + '.+\\.styl$');
            return reg.test(path.basename(srcPath));
        }));
    },

    /**
     * isSpriteCss
     * @param {String} srcPath
     * @param {Object} options
     * @returns {Boolean}
     * @example
     * var srcPath = 'test/image/sprite/sprite-logo.css';
     * var options = {};
     * var out = isSpriteStylus(srcPath, options);
     * console.log(out);
     * > true
     */
    isSpriteCss: function (srcPath, options) {
        _.defaults(options || (options = {}), DEFAULT_OPTIONS);
        var separator = options.separator;
        var heads = options.heads;

        return _.some(_.map(heads, function (head) {
            var reg = new RegExp('^' + head + separator + '.+\\.css$');
            return reg.test(path.basename(srcPath));
        }));
    }
};
