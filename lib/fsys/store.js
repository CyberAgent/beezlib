/**
 * @name store.js<lib/fsys>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview file system store library
 */
var path = require('path');
var fs = require('fs');

var _ = require('underscore');
var jsonminify = require('jsonminify');
var suns = require('suns');
var jsonlint = require('jsonlint');

var logger = require('../logger');

/**
 * @name JSONStore
 * @namespace JSONStore
 * @constructor
 */
var JSONStore = function(dir, encode) {
    this.encode = encode || 'utf-8';
    this.dir = dir;
    this.basename = path.basename(dir);
    this.data = {};
    this.mapping = {};
    this.reloadAll();
};

/**
 * I will re-read the one file in the store
 *
 * @name reload
 * @memberof JSONStore
 * @method
 * @param {String} abspath target file path
 */
JSONStore.prototype.reload = function (abspath) {
    logger.debug('reLoad json data file.', abspath);
    var fsys = require('../fsys');

    var json = {};
    if (/.json$/.test(abspath)) {
        json = fsys.readJsonSync(abspath, true, this.encode);
    } else if (/.js$/.test(abspath)) {
        json = fsys.readFileFnJSONSync(abspath, this.encode);
    } else {
        logger.warn('skip reLoad json data file.', abspath);
        return;
    }

    _.extend(this.data, json);

    var keys = _.keys(json);
    for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        this.mapping[key] = abspath;
    }
};

/**
 * I will re-read the files in the store
 *
 * @name reloadAll
 * @memberof JSONStore
 * @method
 */
JSONStore.prototype.reloadAll = function () {
    var fsys = require('../fsys');
    var self = this;

    fsys.walk(this.dir, function (prefix, dir, file, stats) {
        var path = dir + '/' + file;
        self.reload(path);
    });
};

/**
 * @see suns.extend
 * @name extend
 * @memberof JSONStore
 * @method
 */
JSONStore.extend = suns.extendThis;

/**
 * @name store
 * @namespace store
 */
module.exports = {
    /**
     * JSON Store
     * @name JSONStore
     * @memberof store
     */
    JSONStore: JSONStore
};
