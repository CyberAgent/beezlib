/**
 * @name obj.js<lib>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview object library
 */

var _ = require('lodash');

/**
 * @name obj
 * @namespace obj
 */
module.exports = {

    /**
     *
     * @memberof obj
     * @method
     */
    copy: function (extend, original) {
        var _original = _.cloneDeep(original);
        var _extend = _.cloneDeep(extend);
        var out = _.merge(_original, _extend);

        return out;
    }
};
