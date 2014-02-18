/**
 * @name constant.js
 * @author Yuhei Aihara <aihara_yuhei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview constant library
 */

var constant = module.exports = {};

/**----------------------------------------
 * extension name
 */
constant.EXTENSION_JS = '.js';
constant.EXTENSION_CSS = '.css';
constant.EXTENSION_HTML = '.html';
constant.EXTENSION_STYL = '.styl';
constant.EXTENSION_HBS = '.hbs';
constant.EXTENSION_HBSP = '.hbsp';
constant.EXTENSION_HBSC_JS = '.hbsc.js';
constant.EXTENSION_HBSP_JS = '.hbsp.js';
constant.EXTENSION_HTML_HBS = '.html.hbs';
constant.EXTENSION_JS_HBS = '.js.hbs';
constant.EXTENSION_PNG = '.png';
constant.EXTENSION_JPG = '.jpg';
constant.EXTENSION_JPEG = '.jpeg';

/**----------------------------------------
 * file name
 */
// name of template.hbs2hbsc2html before.
constant.INDEX_HTML_HBS = 'index' + constant.EXTENSION_HTML_HBS;
// name of template.requirehbs2hbsc before.
constant.REQUIRE_BEEZ_JS_HBS = 'require.beez' + constant.EXTENSION_JS_HBS;


/**----------------------------------------
 * regular expression
 */
constant.REG_JS = new RegExp('\\' + constant.EXTENSION_JS + '$');
constant.REG_CSS = new RegExp('\\' + constant.EXTENSION_CSS + '$');
constant.REG_HTML = new RegExp('\\' + constant.EXTENSION_HTML + '$');
constant.REG_STYL = new RegExp('\\' + constant.EXTENSION_STYL + '$');
constant.REG_HBS = new RegExp('\\' + constant.EXTENSION_HBS + '$');
constant.REG_HBSP = new RegExp('\\' + constant.EXTENSION_HBSP + '$');
constant.REG_HTML_HBS = new RegExp('\\' + constant.EXTENSION_HTML_HBS + '$');
constant.REG_HBSC_JS = new RegExp('\\.hbsc\\.js$');
constant.REG_HBSP_JS = new RegExp('\\.hbsp\\.js$');
constant.REG_REQUIRE_BEEZ_JS = new RegExp('require\\.beez\\..+\\..+\\.js$');
constant.REG_OPTIPNG_FILE = new RegExp('\\' + constant.EXTENSION_PNG + '$');
constant.REG_JPEGOPTIM_FILE = new RegExp('(\\' + constant.EXTENSION_JPG + '|\\' + constant.EXTENSION_JPEG + ')$');
constant.REG_STYLUS2CSS_FILE = new RegExp('^[^_]+\\' + constant.EXTENSION_STYL + '$');
// name of template.requirehbs2hbsc after. example: 'require.beez.[env].[key].js'

/**----------------------------------------
 * beezlib default config
 */
// default separator
constant.DEFAULT_SEPARATOR = '-';

// default encode
constant.DEFAULT_ENCODE = 'utf-8';

// css stylus default options
constant.CSS_STYLUS_DEFAULT_OPTIONS = {
    encode: constant.DEFAULT_ENCODE,
    compress: false,
    firebug: false,
    linenos: false,
    nib: true,
    url: null,
    fn: null
};

// css sprite default options
constant.CSS_SPRITE_DEFAULT_OPTIONS = {
    ratios: [ 1 ],
    extnames: [ constant.EXTENSION_PNG ],
    heads: [ 'sprite' ],
    separator: constant.DEFAULT_SEPARATOR,
    logname: '.sprite'
};

// css sprite parameter
constant.CSS_SPRITE_PREFIX = 'sprite';
constant.CSS_SPRITE_SELECTOR_PREFIX = '.sprite' + constant.DEFAULT_SEPARATOR;
constant.CSS_SPRITE_RATIO_SUFFIX = 'x';
constant.CSS_SPRITE_RATIO_SEPARATOR = '@';

// image ratioResize default options
constant.IMAGE_RATIORESIZE_DEFAULT_OPTIONS = {
    baseRatio: 2,
    ratios: [ 1, 1.3, 1.5, 2, 3 ],
    extnames: [ constant.EXTENSION_PNG ],
    include: [ '.' ],
    exclude: [],
    separator: constant.DEFAULT_SEPARATOR
};

// image optim default options
constant.IMAGE_OPTIM_DEFAULT_OPTIONS = {
    optipng: {
        use: true
    },
    jpegoptim: {
        use: true
    }
};

// logger color default theme
constant.LOGGER_COLOR_THEME = {
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
    err: 'red',
    title: 'yellow'
};

/**----------------------------------------
 * beez command default config
 */
// beez-hbs2hbsc default options
constant.BOOTSTRAP_DEFAULT_OPTIONS = {
    html: [ constant.INDEX_HTML_HBS ],
    datamain: [ constant.REQUIRE_BEEZ_JS_HBS ]
};

// beez-deploy default options
constant.DEPLOY_DEFAULT_OPTIONS = {
    optipng: {
        use: false
    },
    jpegoptim: {
        use: false
    },
    include: [ constant.EXTENSION_JS, constant.EXTENSION_CSS, constant.REQUIRE_BEEZ_JS ],
    exclude: []
};

// beez-ignore default options
constant.IGNORE_DEFAULT_OPTIONS = {
    include: [],
    exclude: []
};
