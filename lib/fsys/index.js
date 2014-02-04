/**
 * @name index.js<lib/fsys>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview fsys library
 */

var fs = require('fs');
var path = require('path');
var util = require('util');

var _  =  require('underscore');
var mkdirp = require('mkdirp');
var jsonminify = require('jsonminify');
var jsonlint = require('jsonlint');

var store = require('./store');
var Checker = require('./checker');

/**
 * @name fsys
 * @namespace fsys
 */
module.exports = {

    /**
     * store library
     * @name store
     * @memberof fsys
     */
    store: store,

    /**
     * checker library
     * @name checker
     * @memberof fsys
     */
    Checker: Checker,

    /**
     * file type
     * @name TYPE
     * @memberof fsys
     */
    TYPE: {
        FILE: 'file',
        DIRECTORY: 'directory',
        BLOCK_DEVICE: 'block',
        CHARACTER_DEVICE: 'character',
        SYMLINK: 'symlink',
        FIFO: 'fifo',
        SOCKET: 'socket'
    },

    /**
     * @name isFileSync
     * @memberof fsys
     * @method
     * @param {String} p target file path
     * @return {boolean}
     */
    isFileSync: function (p) {
        if (!fs.existsSync(p)) {
            return false;
        }
        var stats = fs.statSync(p);
        return stats.isFile();
    },

    /**
     * @name isDirectorySync
     * @memberof fsys
     * @method
     * @param {String} p target directory path
     * @return {boolean}
     */
    isDirectorySync: function (p) {
        if (!fs.existsSync(p)) {
            return false;
        }
        var stats = fs.statSync(p);
        return stats.isDirectory();
    },

    /**
     * @name typeSync
     * @memberof fsys
     * @method
     * @param {String} p target path
     * @return {String} this.TYPES
     */
    typeSync: function (p) {
        if (!fs.existsSync(p)) {
            return undefined;
        }
        var TYPE = this.TYPE;
        var stats = fs.statSync(p);

        if (stats.isDirectory()) {
            return TYPE.DIRECTORY;
        } else if (stats.isFile()) {
            return TYPE.FILE;
        } else if (stats.isBlockDevice()) {
            return TYPE.BLOCK_DEVICE;
        } else if (stats.isCharacterDevice()) {
            return TYPE.CHARACTER_DEVICE;
        } else if (stats.isSymbolicLink()) {
            return TYPE.SYMLINK;
        } else if (stats.isFIFO()) {
            return TYPE.FIFO;
        } else if (stats.isSocket()) {
            return TYPE.SOCKET;
        } else {
            return undefined;
        }
    },

    /**
     * bash: $ rm -rf <path>
     *
     * @name typeSync
     * @param {String} p delete path
     * @param {String} f path.resolve#from
     * @memberof fsys
     * @method
     */
    rmrfSync: function (p, f) {
        var self = this;
        f = f || '';
        p = path.resolve(f, path.normalize(p));
        if (this.typeSync(p) === this.TYPE.DIRECTORY) {
            _.each(fs.readdirSync(p), function(f) {
                self.rmrfSync(path.join(p, f));
            });
            return fs.rmdirSync(p);
        }
        return fs.unlinkSync(p);
    },

    /**
     * bash: $ mkdir -p <path> (async)
     *
     * @name mkdirp
     * @memberof fsys
     * @method
     * @see https://npmjs.org/package/mkdirp
     */
    mkdirp: mkdirp,
    /**
     * bash: $ mkdir -p <path> (sync)
     *
     * @name mkdirpSync
     * @memberof fsys
     * @method
     * @see https://npmjs.org/package/mkdirp
     */
    mkdirpSync: mkdirp.sync,

    /**
     * file system walk function
     *
     * @name walk
     * @memberof fsys
     * @method
     * @param {String} basedir base path
     * @param {function} filefn Function to be executed when the file is found
     * @param {function} dirfnFunction to be executed when the directory is found
     *
     */
    walk: function (basedir, filefn, dirfn) {
        filefn = filefn || function() {};
        dirfn = dirfn || function() {};

        var readdirSync = function(dir) {
            var files = fs.readdirSync(dir);

            for (var i = 0; i < files.length; i++) {
                var file = dir+'/'+files[i];
                //debug('before fs.statsSync:', file);
                var stats = fs.statSync(file);

                if (stats.isFile()) {
                var prefix = dir.replace(basedir, '');
                    filefn(prefix, dir, files[i], stats);

                } else if (stats.isDirectory()) {
                    var prefix = file.replace(basedir, '');
                    dirfn(prefix, stats);
                    readdirSync(file);

                } else {
                    console.error('error:'.error, 'It is a file type that is not assumed. file:', file);
                    return;
                }
            }
        };
        readdirSync(basedir);
    },

    /**
     * Read file Sync(json format)
     *
     * @name readJsonSync
     * @memberof fsys
     * @method
     * @param {String} path read file path
     * @param {boolean} minify use jsonminify
     * @param {String} encode file read encode
     */
    readJsonSync: function (path, minify, encode) {
        minify = minify || false;
        encode = encode || 'utf-8';

        if (this.isFileSync(path)) {
            var raw = fs.readFileSync(path, encode);
            if (minify) {
                raw = jsonminify(raw);
            }

            try {
                return JSON.parse(raw);
            } catch (e1) {
                try {
                    jsonlint.parse(raw);
                } catch (e2) {
                    throw e2;
                }
            }
        }
        return {};
    },

    /**
     * JS設定ファイルからJSONデータを読み込む
     *
     * @name readFileFnJSONSync
     * @memberof fsys
     * @method
     * @param {String} path load file path
     * @param {String} encode file encode
     * @return {Object} load json data
     */
    readFileFnJSONSync: function (path, encode) {
        encode = encode || 'utf-8';

        if (this.isFileSync(path)) {
            var raw = fs.readFileSync(path, encode);

            try {
                var fn = new Function ('process', 'require', '__filename', '__dirname', 'module', 'exports', "return " + raw);
                return fn(process, require, __filename, __dirname, module, exports);
            } catch (e) {
                throw e;
            }
        }
        return {};
    },

    /**
     * change file modes or Access Control Lists
     * bash: $ chmod {mode} {path} ...
     *
     * @name chmodfilesSync
     * @memberof fsys
     * @method
     * @param {Array} list target files
     * @param {int} mode change file mode
     */
    chmodfilesSync: function(list, mode) {
        list = list || [];
        mode = mode || 0755;
        _.find(list, function (p) {
            fs.chmodSync(p, mode);
        });
    },

    /**
     * ファイルをコピーする
     *
     * @name cp
     * @memberof fsys
     * @method
     * @param {String} src コピー元のファイルパス
     * @param {String} dst コピー先のファイルパス
     * @param {function} callback コールバック
     */
    cp: function (src, dst, callback) {
        var srcstream = fs.createReadStream(src);
        var dststream = fs.createWriteStream(dst);

        srcstream.on('error', callback);
        dststream.on('error', callback);
        dststream.on('close', function() {
            return callback && callback();
        });
        srcstream.pipe(dststream);
    },

    /**
     * '~'付きのファイルパスから絶対パスを返却する
     *
     * @name resolveTilde
     * @memberof fsys
     * @method
     * @param {String} str 相対パス
     * @return {String} file path
     */
    resolveTilde: function (str) {
        if (!str) {
            return str;
        }
        if (str.substr(0,1) === '~') {
            str = process.env.HOME + str.substr(1);
        }
        return path.resolve(str);
    },

    /**
     * '~'付きのファイルパスの'~'をパスに置き換えて返却する
     *
     * @name resolveTilde
     * @memberof fsys
     * @method
     * @param {String} str 相対パス
     * @return {String} file path
     */
    pathTilde: function (str) {
        if (str && str.substr(0,1) === '~') {
            return process.env.HOME + str.substr(1);
        }
        return str;
    },

    /**
     * 拡張子が.jsはjavascript で、.jsonはJSON.parseでファイルをロードして返却します。
     *
     * @name readFileMultiConfigureSync
     * @memberof fsys
     * @method
     * @param {String} path read file path
     * @param {String} encode file read encode
     */
    readFileMultiConfigureSync: function (path, encode) {
        if (/.json$/.test(path)) {
            return this.readJsonSync(path, true, this.encode);
        } else if (/.js$/.test(path)) {
            return this.readFileFnJSONSync(path, this.encode);
        } else {
            throw new Error('Extension, please specify the ".json" or ".js".');
        }
    }

};
