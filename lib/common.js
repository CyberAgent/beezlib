/**
 * @name common.js
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview common library
 */

var _ = require('underscore');
var ua = require('beez-ua');

var common = module.exports = {
    /**
     * Override judgment of UserAgent.
     *
     * @param {Object} config
     * @param {Object} headers
     * @return {boolean}
     * @name isUAOverride
     * @memberof common
     */
    isUAOverride: function (config, headers) {
        if (!config.extend.hasOwnProperty('condition') ||
            !config.extend.condition.hasOwnProperty('ua')) {
            return false;
        }

        // Get OS information from UserAgent
        ua.setup(headers['user-agent'] || '-');

        return _.some(config.extend.condition.ua, function(os) {
            return !!ua.os[os];
        });
    }

};
