/**
 * @name index.js<lib/cmd>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview command library
 */
var exec = require('child_process').exec;

/**
 * @name cmd
 * @namespace cmd
 */
module.exports = {

    /**
     * which command (man which)
     *
     * @memberof cmd
     * @method
     * @param {String} cmd command name
     * @param {Object} options child_process#exec options
     * @param {function} callback
     */
    which: function which(cmd, options, callback) {
        var child = exec('which ' + cmd, options || {}, function (err, stdout, stderr) {
            if (stdout) {
                stdout = stdout.replace(/(\r|\n)/, '');
            }
            return callback && callback(err, stdout, stderr);
        });
    }
};
