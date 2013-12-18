/**
 * @name obj.js<lib>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview object library
 */

var _ = require('underscore');

/**
 * @name obj
 * @namespace obj
 */
module.exports = {

    /**
     * for each props in src
     * Warnning: !! destructive !!
     *
     * @memberof obj
     * @method
     * @param {Object} dst destination
     * @param {Object} src source
     * @return {Object}
     */
    copyr: function copyr(dst, src) {
        var dstProp, srcProp;

        for (var k in src) {
            // avoid unnecessary traversing prototype
            if (src.hasOwnProperty(k)) {
                dstProp = dst[k];
                srcProp = src[k];
                if (_.isObject(dstProp) && !_.isArray(srcProp)){
                    copyr(dst[k], src[k]); // cp recursively
                } else {
                    dst[k] = src[k]; // override/add property 'k'
                }
            }
        }
        return dst;
    }
};
