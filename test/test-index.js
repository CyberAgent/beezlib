var path = require('path');

var should = require('should');

var index = require('../lib');

describe('beezlib', function () {
    it('Reference', function () {
        index.logger.should.be.ok;
        index.debug.should.be.ok;
        index.obj.should.be.ok;
        index.fsys.should.be.ok;
        index.setupColorTheme.should.be.ok;
        index.none.should.be.ok;
        index.template.should.be.ok;
    });
    it('setupColorTheme', function () {
        var color = index.setupColorTheme();
        console.log('color test message.'.info);
        index.logger.colors.should.be.ok;
    });
    it('logger', function () {
        index.logger.level = index.logger.LEVELS.INFO;
        index.logger.level.should.equal(2);

        index.logger.trace("message trace");
        index.logger.debug("message debug");
        index.logger.info("message info");
        index.logger.warn("message warn");
        index.logger.error("message error");
        index.logger.fatal("message fatal");
        index.logger.message("message message");
        index.logger.msg("message msg");


    });
    it('obj copyr', function () {
        var obj0 = {
            a: 0,
            c: "c",
        };

        var obj1 = {
            b: 1,
            d: [0,"",[0, 1], {
                a: 0,
                b: 1,
                c: "",
                d: []
            }],
            e: {
                a: 0,
                b: 1,
                c: "",
                d: []
            }

        };

        var extend = index.obj.copyr(obj0, obj1);
        JSON.stringify(obj0).should.equal(JSON.stringify(extend)).be.ok;
    }),
    it('fsys mkdirp', function (done) {
        var dirpath = '/tmp/hoge/foo/bar/spam';
        index.fsys.mkdirp(dirpath, 0755,  function (err, result) {
            if (err) {
                should.fail('fsys mkdir_p');
            } else if (result === null) {
                should.ok('I already exists.');
            } else {
                result.should.equal('/tmp/hoge').be.ok;
            }
            done();
        });
    });
    it('fsys rmrfSync', function () {
        var dirpath = '/tmp/hoge';
        index.fsys.rmrfSync(dirpath);
    });
    it('fsys isFile', function () {
        var dirpath = '/tmp';
        var dirpath1 = '/tmp/hoge';

        index.fsys.isDirectorySync(dirpath).should.be.ok;
        index.fsys.isDirectorySync(dirpath1).should.not.be.ok;

        index.fsys.isFileSync(dirpath).should.not.be.ok;
    });
    it('fsys readFileFnJSONSync', function () {
        var json = index.fsys.readFileFnJSONSync('test/json/json.js');
        json.hoge.should.equal('foo').be.ok;
    });
    it('fsys readFileMultiConfigureSync', function () {
        var json = index.fsys.readFileMultiConfigureSync('test/json/json.js');
        json.hoge.should.equal('foo').be.ok;
        json = index.fsys.readFileMultiConfigureSync('test/json/item.json');
        json.item.fruit.should.equal('Orange').be.ok;
    });
    it('fsys/store', function() {
        var dir = 'test/json';
        var store = new index.fsys.store.JSONStore(dir);
        store.basename.should.equal('json').be.ok;
        store.data.item.should.be.ok;
        store.mapping.item.should.equal('test/json/item.json');
        store.mapping.hoge.should.equal('test/json/json.js');
    });
    it('fsys/readJsonSync',function() {
        var file = 'test/json/user.json';
        var res = index.fsys.readJsonSync(file, true);
        res.user.name.should.equal('fkei').be.ok;
    });
    it('fsys/chmodfilesSync', function() {
        var files = ['test/json/user.json', 'test/json/item.json'];
        index.fsys.chmodfilesSync(files, 0755);
    });
    it('fsys/cp', function(done) {
        var src = 'test/json/user.json';
        var dst = 'test/json/user.copy.json';

        index.fsys.cp(src, dst, function (err, res) {
            index.fsys.isFileSync(dst).should.be.ok;
            done();
        });
    });

    it('fsys resolveTilde', function() {
        var str = index.fsys.resolveTilde('~/Desktop');
        str.substr(0,1).should.equal('/').be.ok;
        //console.log(str);
    });

    it('fsys pathTilde', function() {
        var str = index.fsys.pathTilde('~/Desktop');
        str.substr(0,1).should.equal('/').be.ok;
        //console.log(str);
    });

    it('template/hbs2hbsc', function() {
        var dstpath = index.template.hbs2hbscjs('test/hbs/', 'test.hbs');
        //console.log(dstpath);
        dstpath.should.equal('test/hbs/test.hbsc.js');
    });
    it('template/hbsp2hbspjs', function() {
        var dstpath = index.template.hbsp2hbspjs('test/hbs/', 'test.hbsp');
        //console.log(dstpath);
        dstpath.should.equal('test/hbs/test.hbsp.js');
    });
    it('template/requirehbs2hbsc', function() {
        var store = {
            stat: new index.fsys.store.JSONStore('test/store')
        };
        var dstpath = index.template.requirehbs2hbsc('test/hbs/require.beez.local.develop.js', 'require.beez.js.hbs', store);
        //console.log(dstpath);
        dstpath.should.equal('test/hbs/require.beez.local.develop.js');
    });
    it('template/hbs2hbsc2html', function() {
        var store = {
            stat: new index.fsys.store.JSONStore('test/store')
        };
        debugger;
        var dstpath = index.template.hbs2hbsc2html('test/hbs/local.develop.html', 'index.html.hbs', store);
        dstpath.should.equal('test/hbs/local.develop.html');
    });
    it('css/stylus#write', function(done) {
        index.css.stylus.write('./test/stylus/test.styl', './test/stylus/test.css', {
            compress: true,
            firebug: false,
            linenos: false,
            nib: true,
            fn : function (styl) {
                styl.define('body-padding', function (data) {
                    var rate  = data.val || 1;
                    var base = 10;

                    return (rate * base) + 'px';
                });
            }
        }, function (err, css) {
            if (err) {
                console.log(err);
                should.fail();
            }
            css.should.be.ok;
            //console.log(css);
            done();
        });
    });

    it('css/sprite#build', function (done) {
        var options = { extnames: ['.png', '.jpg'], ratios: [1, 2] };
        var images = index.css.sprite.getImages('test/image/sprite', 'logo', options);
        index.css.sprite.build('test/image/sprite', 'logo', images, options, done);
    });
    it('css/sprite#getImages', function (done) {
        var options = { extnames: ['.png', '.jpg'] };
        var images = index.css.sprite.getImages('test/image/sprite', 'logo', options);
        images.should.have.include('test/image/sprite/sprite-logo-hoge.png');
        images.should.have.include('test/image/sprite/sprite-logo-fuga.jpg');
        images.should.have.include('test/image/sprite/sprite-logo-foo.png');
        done();
    });
    it('css/sprite#getGroup', function (done) {
        index.css.sprite.getGroup('sprite-logo@10x.png').should.be.equal('logo');
        index.css.sprite.getGroup('sprite-logo-hoge.png').should.be.equal('logo');
        index.css.sprite.getGroup('_sprite-logo-fuga.jpg').should.be.equal('logo');
        index.css.sprite.getGroup('sprite-logo.styl').should.be.equal('logo');
        index.css.sprite.getGroup('sprite-logo.css').should.be.equal('logo');
        done();
    });
    it('css/sprite#getHead', function (done) {
        index.css.sprite.getHead('sprite-logo@10x.png').should.be.equal('sprite');
        index.css.sprite.getHead('sprite-logo-10.png').should.be.equal('sprite');
        index.css.sprite.getHead('_sprite-logo-10.jpg').should.be.equal('_sprite');
        index.css.sprite.getHead('sprite-logo.styl').should.be.equal('sprite');
        index.css.sprite.getHead('sprite-logo.css').should.be.equal('sprite');
        done();
    });
    it('css/sprite#getCreateFile', function (done) {
        var options = { ratios: [1, 2] };
        var files = index.css.sprite.getCreateFile('sprite-logo-hoge.png', options);
        files.should.have.length(3);
        files.should.have.include('sprite-logo.styl');
        files.should.have.include('sprite-logo@10x.png');
        files.should.have.include('sprite-logo@20x.png');
        done();
    });
    it('css/sprite#isSpriteImage', function (done) {
        var options = { heads: ['sprite', '_sprite'], extnames: ['.png', '.jpg'] };
        index.css.sprite.isSpriteImage('sprite-logo-10.png', options).should.be.true;
        index.css.sprite.isSpriteImage('sprite-logo-10.jpg', options).should.be.true;
        index.css.sprite.isSpriteImage('sprite-logo@10x.png', options).should.be.false;
        index.css.sprite.isSpriteImage('sprite-logo.png', options).should.be.false;
        index.css.sprite.isSpriteImage('_sprite-logo-10.png', options).should.be.true;
        index.css.sprite.isSpriteImage('_sprite-logo-10.jpg', options).should.be.true;
        done();
    });
    it('css/sprite#isSpriteSheet', function (done) {
        var options = { heads: ['sprite', '_sprite'] };
        index.css.sprite.isSpriteSheet('sprite-logo@10x.png', options).should.be.true;
        index.css.sprite.isSpriteSheet('sprite-logo-10.png', options).should.be.false;
        index.css.sprite.isSpriteSheet('sprite-logo.png', options).should.be.false;
        done();
    });
    it('css/sprite#isSpriteStylus', function (done) {
        var options = { heads: ['sprite', '_sprite'] };
        index.css.sprite.isSpriteStylus('sprite-logo.styl', options).should.be.true;
        index.css.sprite.isSpriteStylus('sprite-logo.png', options).should.be.false;
        index.css.sprite.isSpriteStylus('_sprite-logo.styl', options).should.be.true;
        done();
    });
    it('css/sprite#isSpriteCss', function (done) {
        var options = { heads: ['sprite', '_sprite'] };
        index.css.sprite.isSpriteCss('sprite-logo.css', options).should.be.true;
        index.css.sprite.isSpriteCss('sprite-logo.png', options).should.be.false;
        index.css.sprite.isSpriteCss('_sprite-logo.css', options).should.be.true;
        done();
    });

    it('image# getSize/resize', function (done) {
        var src = 'test/image/logo.png';
        var dstdir = 'test/image';

        index.image.imagemagick.getSize(src, function(err, res) {
            err && should.fail('error index.image.getSize', err, res);

            var width = res.width;
            var height = res.height;
            var ratio = 3.0;

            var rw = Math.floor(width * ratio / 2);
            var rh = Math.floor(height * ratio / 2);

            var dst = path.join(dstdir, '/logo-' + rw + 'x' + rh + '.png');
            index.image.imagemagick.resize({
                srcPath: src,
                dstPath: dst,
                width: rw,
                height: rh,
                strip: true,
                sharpening: 0.3
            });
            done();

        });
    });
    it('image# makeRatioFileNameSync', function () {
        index.image.imagemagick.makeRatioFileNameSync('logo.png', null, 1.3).should.equal('logo-13.png').be.ok;
        index.image.imagemagick.makeRatioFileNameSync('logo.png', null, 1.3).should.equal('logo-13.png').be.ok;
        index.image.imagemagick.makeRatioFileNameSync('logo.png', null, 2).should.equal('logo-20.png').be.ok;
        index.image.imagemagick.makeRatioFileNameSync('logo.jpg', null, 1.3).should.equal('logo-13.jpg').be.ok;
    });
    it('image# isRatioFileNameSync', function () {
        index.image.imagemagick.isRatioFileNameSync('logo-20.png', null).should.be.ok;
        index.image.imagemagick.isRatioFileNameSync('logo.png', null).should.not.be.ok;
    });

    it('image# changeRatioFileNameSync', function () {
        index.image.imagemagick.changeRatioFileNameSync('logo-20.png', null, 1.3).should.equal('logo-13.png').be.ok;
        index.image.imagemagick.changeRatioFileNameSync('logo-hoge-20.png', null, 1.3).should.equal('logo-hoge-13.png').be.ok;
        index.image.imagemagick.changeRatioFileNameSync('logo-hoge-120.png', null, 1.3).should.equal('logo-hoge-13.png').be.ok;

    });

    it('image# ratioResize', function (done) {
        var baseRatio = 2.0;
        var outRatios = [3.0, 2.0, 1.3, 1.0];
        var options = {
            srcPath: 'test/image/logo.png',
            dstPath: 'test/image',
            //width: null,
            //height: null,
            strip: true,
            sharpening: 0.3
        };
        index.image.imagemagick.ratioResize(options, baseRatio, outRatios, function (err, res) {
            setTimeout(function () {
                done();
            }, 200);
        });
    });
    it('image# imagemagick.identify logo-10.png', function (done) {
        var options = ['-format', '%wx%h', 'test/image/logo-10.png'];
        var identify = index.image.imagemagick.identify(options, function(err, res) {
            err && should.fail(err);
            res = res.replace('\n', '').split('x');
            res[0].should.equal('200').be.ok;
            res[1].should.equal('200').be.ok;
            done();
        });
    });
    it('image# imagemagick.identify logo-13.png', function (done) {
        var options = ['-format', '%wx%h', 'test/image/logo-13.png'];
        var identify = index.image.imagemagick.identify(options, function(err, res) {
            err && should.fail(err);
            res = res.replace('\n', '').split('x');
            res[0].should.equal('260').be.ok;
            res[1].should.equal('260').be.ok;
            done();
        });
    });
    it('image# imagemagick.identify logo-30.png', function (done) {
        var options = ['-format', '%wx%h', 'test/image/logo-30.png'];
        var identify = index.image.imagemagick.identify(options, function(err, res) {
            err && should.fail(err);
            res = res.replace('\n', '').split('x');
            res[0].should.equal('600').be.ok;
            res[1].should.equal('600').be.ok;
            done();
        });
    });
    it('image# imagemagick.identify logo-600x600.png', function (done) {
        var options = ['-format', '%wx%h', 'test/image/logo-600x600.png'];
        var identify = index.image.imagemagick.identify(options, function(err, res) {
            err && should.fail(err);
            res = res.replace('\n', '').split('x');
            res[0].should.equal('600').be.ok;
            res[1].should.equal('600').be.ok;
            done();
        });
    });

    it('image# optipng logo.png', function(done) {
        index.image.optipng('test/image/logo.png', function(err) {
            should.not.exist(err);
            done();
        });
    });

    it('image# jpegoptim logo.jpg', function(done) {
        index.image.jpegoptim('test/image/logo.jpg', function(err) {
            should.not.exist(err);
            done();
        });
    });

    it('cmd/which', function(done) {
        var cmd = 'ls';

        index.cmd.which(cmd, null, function (err, stdout, stderr) {
            stdout.should.equal('/bin/ls').be.ok;
            done();
        });
    });

});
