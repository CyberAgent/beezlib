/**
 * @name index.js<lib/regexp>
 * @author Yuhei Aihara <aihara_yuhei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview regexp library
 */

/**
 * @name regexp
 * @namespace regexp
 */
module.exports = {
    /**
     * Wild card path to string of regular expression for
     * @param str {String} wild card path
     * @example
     * var str = '/a/aa/*.js';
     * console.log(wildcardPath2regexp(str));
     * >> '(/a/aa/[^\\/]*\\.js)$'
     * @returns {String}
     */
    wildcardPath2regexp: function (str) {
        str = str.replace(/\./g, '\\.');
        str = str.replace(/^\*|([^\\])\*/g, '$1[^\\/]*');
        str = str.replace(/^\?|([^\\])\?/g, '$1[^\\/]');
        if(str.length) {
            str = '(' + str + ')$';
        }
        return str;
    },
    /**
     * Wild card path in the array to regular expression
     * @param arr {Array}
     * @example
     * var arr = [ '/a/aa/*.js', '/b/bb/*.css' ];
     * console.log(array2regexp(arr));
     * >> /(/a/aa/[^\/]*\.js|/b/bb/[^\/]*\.css)$/
     * console.log(array2regexp([]));
     * >> /(:)/
     * @returns {RegExp}
     */
    array2regexp: function (arr) {
        var str = arr.join('|');
        return new RegExp(this.wildcardPath2regexp(str) || '(:)');
    }
};