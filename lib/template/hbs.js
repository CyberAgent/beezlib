/**
 * @name hbsjs<lib/template>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview handlebars template library
 */

var path = require('path');
var fs = require('fs');

var _ = require('lodash');
var handlebars = require('handlebars');

var logger = require('../logger');
var obj = require('../obj');
var constant = require('../constant');
var common = require('../common');

var DEFAULT_ENCODE = constant.DEFAULT_ENCODE;

/**
 * @name hbs
 * @namespace hbs
 */
module.exports = {
    /**
     * If you have a hbs, I generated. hbsc.js what was handlebars.precompile.
     * Warnning: JS that is generated, become Handlebars.templates.
     *
     * @name hbs2hbscjs
     * @memberof hbs
     * @method
     * @param {String} hbsdir src/dst dir path
     * @param {String} hbsfile src hbs file name
     * @param {String} encode read file encode.
     * @return {String} Output file path.
     */
    hbs2hbscjs: function (hbsdir, hbsfile, encode) {
        encode = encode || DEFAULT_ENCODE;

        var reg_hbs =  /.hbs$/;
        var hbspath = path.normalize(hbsdir + '/' + hbsfile);
        var hbscjsfile = hbsfile.replace(reg_hbs, '.hbsc.js');
        var dstpath = path.normalize(hbsdir + '/' + hbscjsfile);

        var out = [];

        // beez custom
        out.push('define([\'beez\'], function(beez) {\n');
        out.push('  var Handlebars = beez.vendor.Handlebars;\n');
        out.push('  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};\n');

        var data = fs.readFileSync(hbspath, encode);
        var template = path.basename(hbspath);
        template = template.replace(reg_hbs, '');

        logger.debug('precompile file:', hbspath);
        out.push('templates[\''+template+'\'] = template(' + handlebars.precompile(data)+');\n');

        // end
        out.push('    return templates[\''+template+'\'];');
        out.push('});');
        out = out.join('');

        fs.writeFileSync(dstpath, out, encode);

        return dstpath;

    },
    /**
     * If there is a hbsp, I generate the. hbsp.js what was handlebars.precompile.
     * Warnning: JS that is generated, become Handlebars.partials.
     *
     * @name hbsp2hbspjs
     * @memberof hbs
     * @method
     * @param {String} hbspdir src/dst dir path
     * @param {String} hbspfile src hbsp file name
     * @param {String} encode read file encode.
     * @return {String} Output file path.
     */
    hbsp2hbspjs: function (hbspdir, hbspfile, encode) {
        encode = encode || DEFAULT_ENCODE;

        var reg_hbsp = /\.hbsp$/;
        var hbsppath = path.normalize(hbspdir + '/' + hbspfile);
        var hbspjsfile = hbspfile.replace(reg_hbsp, '.hbsp.js');
        var dstpath = path.normalize(hbspdir + '/' + hbspjsfile);

        var out = [];

        out.push('define([\'beez\'], function(beez) {\n');
        out.push('  var Handlebars = beez.vendor.Handlebars;\n');
        out.push('  var template = Handlebars.template, partials = Handlebars.partials = Handlebars.partials || {};\n');

        var data = fs.readFileSync(hbsppath, encode);
        var template = path.basename(hbsppath);
        template = template.replace(reg_hbsp, '');

        out.push('partials[\''+template+'\'] = template('+handlebars.precompile(data)+');\n');
        out.push('return partials[\''+template+'\'];');
        out.push('});');
        out = out.join('');
        fs.writeFileSync(dstpath, out, encode);
        return dstpath;

    },

    /**
     * If you have a "require.beez.js.hbs", I generated "require.beez.[env].js".
     * "require.beez.[env].js" what was handlebars.precompile.
     * Warnning: JS that is generated, become Handlebars.templates.
     *
     * @name require2hbscjs
     * @param {String} dstpath absolute path of "require.beez.[env].[key].js"
     * @param {String} hbsfile src hbs file name
     * @param {Object} store bootstrap store.
     * @param {String} encode read file encode.
     * @param {Object} headers http request headers.
     * @return {String} Output file path.
     */
    requirehbs2hbsc: function(dstpath, hbsfile, store, encode, headers) {
        encode = encode || DEFAULT_ENCODE;

        var dstfile = path.basename(dstpath);

        var s = Array.prototype.slice.call(dstfile.split('.'));
        var extname = s.pop();
        var key= s.pop();
        var env = s.pop();
        var prefix = s.join('.');

        var hbspath = path.normalize(path.join(path.dirname(dstpath), hbsfile));
        var data = fs.readFileSync(hbspath, encode);
        var template = handlebars.compile(data);


        var entrypoint = 'index';
        var clientconf = {};
        if (store.stat.mapping.hasOwnProperty(key)) {
            var conffile = store.stat.mapping[key];
            store.stat.reload(conffile);
            clientconf = store.stat.data[key];
        }
        if (clientconf.hasOwnProperty('entrypoint')) {
            entrypoint = clientconf.entrypoint;
        }

        var out = obj.copy(clientconf.requirejs, {});
        if (clientconf.hasOwnProperty('extend') && headers && common.isUAOverride(clientconf, headers) && clientconf.extend.hasOwnProperty('content')) {
            out = obj.copy(clientconf.extend.content, out);
            logger.debug('Override requirehbs2hbsc out:', out);
        }

        var context = {
            config: new handlebars.SafeString(JSON.stringify(out, null, '    ')),
            entrypoint: entrypoint,
            name: env,
            key: key
        };

        var html = template(context);

        ///
        fs.writeFileSync(dstpath, html, encode);

        return dstpath;
    },

    /**
     * If you have a "index.html.hbs", I generated "[env].html".
     *
     * @name hbs2hbsc2html
     * @param {String} dstpath absolute path of "[env].html"
     * @param {String} hbsfile src hbs file name
     * @param {Object} store bootstrap store.
     * @param {String} encode read file encode.
     * @param {Object} headers http request headers
     * @return {String} Output file path.
     */
    hbs2hbsc2html: function(dstpath, hbsfile, store, encode, headers) {
        encode = encode || DEFAULT_ENCODE;

        var dstfile = path.basename(dstpath);

        var s = Array.prototype.slice.call(dstfile.split('.'));
        var extname = s.pop();
        var key= s.pop();
        var env = s.pop();
        var prefix = s.join('.');

        var hbspath = path.normalize(path.join(path.dirname(dstpath), hbsfile));
        var data = fs.readFileSync(hbspath, encode);
        var template = handlebars.compile(data);

        var locals = {};
        if (store.stat.data.hasOwnProperty(key)) {
            locals = obj.copy( store.stat.data[key], {});

            if (locals.hasOwnProperty('extend') && headers && common.isUAOverride(locals, headers) && locals.extend.hasOwnProperty('content')) {
                locals.requirejs = obj.copy(locals.extend.content, locals.requirejs);
                logger.debug('Override hbs2hbsc2html requirejs:', locals.requirejs);
            }

            for (var k in locals.requirejs.config) {
                var newkey = k.replace('.', '_'); // data.requirejs.config key copy . -> _
                locals.requirejs.config[newkey] = locals.requirejs.config[k];
            }

            locals.name = env; // enviroment
            locals.key = key;
        }

        var output = template(locals);

        ///
        fs.writeFileSync(dstpath, output, encode);

        return dstpath;
    }

};
