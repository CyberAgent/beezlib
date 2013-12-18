/**
 * @name logger.js<lib>
 * @author Kei Funagayama <funagayama_kei@cyberaent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview Simple Logger module.
 */

/**
 * @name logger
 * @namespace logger
 */
module.exports = {
    /**
     * @name LEVELS
     * @memberof logger
     */
    LEVELS: {
        'TRACE': 0,
        'DEBUG': 1,
        'INFO': 2,
        'WARN': 3,
        'ERROR': 4,
        'FATAL': 5
    },

    /**
     * @name level
     * @memberof logger
     */
    level: 4, // WARN
    colors: false, // colors setup flag

    /**
     * @name output
     * @memberof logger
     * @method
     * @param {String} prefix message prefix.
     * @param {Array} messages output messages
     * @private
     */
    output: function (prefix, preout, messages) {
        if (prefix && this.LEVELS[prefix] < this.level) {
            return;
        }

        var msg = "";
        for (var i = 0; i < messages.length; i++) {
            0 < i ? msg += ' ' + messages[i]: msg += messages[i];
        }
        var out = msg;
        if (prefix) { out = preout + ' ' + msg; }
        console.log(out);
    },

    /**
     * @name trace
     * @memberof logger
     * @method
     * @param {Arguments} messages Variable argument message
     * @example
     * logger.trace('hoge', 'foo', 'bar', 10);
     *
     * > hoge foo bar 10
     */
    trace: function () {
        var prefix = 'TRACE';
        this.output(prefix, prefix.cyan, Array.prototype.slice.call(arguments));
    },
    /**
     * @name debug
     * @memberof logger
     * @method
     * @param {Arguments} messages　Variable argument message
     * @example
     * logger.debug('hoge', 'foo', 'bar', 10);
     *
     * > hoge foo bar 10
     */
    debug: function () {
        var prefix = 'DEBUG';
        this.output(prefix, prefix.blue, Array.prototype.slice.call(arguments));
    },
    /**
     * @name info
     * @memberof logger
     * @method
     * @param {Arguments} messages Variable argument message
     * @example
     * logger.info('hoge', 'foo', 'bar', 10);
     *
     * > hoge foo bar 10
     */
    info: function () {
        var prefix = 'INFO';
        this.output(prefix, prefix.green, Array.prototype.slice.call(arguments));
    },
    /**
     * plain message
     * @name message
     * @memberof logger
     * @method
     * @param {Arguments} messages Variable argument message
     * @example
     * logger.message('hoge', 'foo', 'bar', 10);
     *
     * > hoge foo bar 10
     */
    message: function () {
        this.output('', '', Array.prototype.slice.call(arguments));
    },
    /**
     * short-cut this.message
     * @name msg
     * @memberof logger
     * @method
     * @param {Arguments} messages Variable argument message
     * @example
     * logger.msg('hoge', 'foo', 'bar', 10);
     *
     * > hoge foo bar 10
     */
    msg: function () {
        this.output('', '', Array.prototype.slice.call(arguments));
    },
    /**
     * @name warn
     * @memberof logger
     * @method
     * @param {Arguments} messages Variable argument message
     * @example
     * logger.warn('hoge', 'foo', 'bar', 10);
     *
     * > hoge foo bar 10
     */
    warn: function () {
        var prefix = 'WARN';
        this.output(prefix, prefix.yellow, Array.prototype.slice.call(arguments));
    },
    /**
     * @name error
     * @memberof logger
     * @method
     * @param {Arguments} messages Variable argument message
     * @example
     * logger.error('hoge', 'foo', 'bar', 10);
     *
     * > hoge foo bar 10
     */
    error: function () {
        var prefix = 'ERROR';
        this.output(prefix, prefix.red, Array.prototype.slice.call(arguments));
    },
    /**
     * @name fatal
     * @memberof logger
     * @method
     * @param {Arguments} messages Variable argument message
     * @example
     * logger.fatal('hoge', 'foo', 'bar', 10);
     *
     * > hoge foo bar 10
     */
    fatal: function () {
        var prefix = 'FATAL';
        this.output(prefix, prefix.red, Array.prototype.slice.call(arguments));
    }
};
