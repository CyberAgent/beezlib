/**
 * @name checker.js<lib/fsys>
 * @author Masaki Suedaa <sueda_masaki@cyberaent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview check log
 */

var os = require('os');
var fs = require('fs');
var suns = require('suns');
var _ = require('underscore');
var logger = require('../logger');

/**
 * @name checker
 * @namespace checker
 *
 * @param {Array} files - files
 * @param {String} output - output directory
 */
var Checker = function (files, output, name) {
    this.files = files;
    this.outputfile = (output || os.tmpdir()) + (name || '.check');
    this.data = {};
};

/**
 * read log
 */
Checker.prototype.read = function () {
    logger.trace('read log file path: ', this.outputfile);
    var fsys = require('../fsys');
    var log = fsys.readJsonSync(this.outputfile);
    this.data = log;
};

/**
 * write log
 */
Checker.prototype.write = function () {
    logger.trace('write log file. path: ', this.outputfile, ', data: ', this.data);
    fs.writeFileSync(this.outputfile, JSON.stringify(this.data));
};

/**
 * save data
 *
 * @param {String} id
 */
Checker.prototype.save = function (id) {
    logger.trace('save data. id: ', id);
    this.data[id] = this.getSize(this.files);
};

/**
 * reset data
 */
Checker.prototype.reset = function () {
    logger.trace('reset data');
    this.data = {};
};

/**
 * check modified by file size
 *
 * @param {String} id
 */
Checker.prototype.isModified = function (id) {
    var size = this.getSize(this.files);
    if (!this.data[id] || (this.data[id] && parseInt(this.data[id])) !== size) {
        logger.trace('files are modified. id: ', id);
        return true;
    } else {
        logger.trace('files are not modified. id: ', id);
        return false;
    }
};

/**
 * get size
 *
 * @param {Array} files
 */
Checker.prototype.getSize = function (files) {
    return _.reduce(files, function(size, file) {
        return (size += parseInt(fs.statSync(file).size));
    }, 0);
};

Checker.extend = suns.extendThis;

module.exports = Checker;
