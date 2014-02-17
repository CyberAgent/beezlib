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
        var extend2 = _.cloneDeep(extend);
        var out = _.defaults(extend2, original);
        return out;
    }
};
