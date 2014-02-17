var path = require('path');
var should = require('should');
var beezlib = require('../lib');

describe('beezlib.css', function () {

    it('stylus write not extend', function(done) {
        beezlib.css.stylus.write('./test/stylus/test.styl', './test/stylus/test.css', {
            options: {
                compress: true,
                firebug: false,
                linenos: false,
                nib: true,
                fn : {
                    color: '#FFFFFF',
                    'body-padding': function (value) {
                        value.should.equal(3);
                        return value + 'px';
                    }
                }
            }
        }, function (err, css) {
            var ans = "body{padding:'3px';font:14px \"Lucida Grande\",Helvetica,Arial,sans-serif;'#FFFFFF'}\n";
            if (err) {
                console.log(err);
                should.fail();
            } else {
                var flag = (css === ans);
                flag.should.be.ok;
            }
            done();
        });
    });

    it('stylus write extend', function(done) {
        var config = {
            options: {
                compress: true,
                firebug: false,
                linenos: false,
                nib: true,
                fn : {
                    color: '#000000',
                    'body-padding': function (value) {
                        should.fail();
                    }
                }
            },
            extend: {
                condition: {
                    ua: [ "android", "ios" ]
                },
                content: {
                    options: {
                        fn: {
                            color: '#111111',
                            'body-padding': function (value) {
                                value.should.equal(3);
                                return value + 'px';
                            }
                        }
                    }
                }
            }
        };
        var headers = {
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OSX) AppleWebKit/546.10 (KHTML, like Gecko) Version/6.0 Mobile/7E18WD'
        };

        beezlib.css.stylus.write(
            './test/stylus/test.styl',
            './test/stylus/test.css',
            config,
            headers,
            function (err, css) {
                var ans = "body{padding:'3px';font:14px \"Lucida Grande\",Helvetica,Arial,sans-serif;'#111111'}\n";
                if (err) {
                    console.log(err);
                    should.fail();
                } else {
                    var flag = (css === ans);
                    flag.should.be.ok;
                }
                done();
            }
        );
    });

    it(' sprite build', function (done) {
        var options = { extnames: ['.png', '.jpg'], ratios: [1, 2] };
        var images = beezlib.css.sprite.getImages('test/image/sprite', 'logo', options);
        beezlib.css.sprite.build('test/image/sprite', 'logo', images, options, done);
    });
    it('sprite build overwrite: false', function (done) {
        var options = { extnames: ['.png', '.jpg'], ratios: [1, 2], overwrite: false};
        var images = beezlib.css.sprite.getImages('test/image/sprite', 'logo', options);
        beezlib.css.sprite.build('test/image/sprite', 'logo', images, options, done);
    });
    it('sprite getImages', function (done) {
        var options = { extnames: ['.png', '.jpg'] };
        var images = beezlib.css.sprite.getImages('test/image/sprite', 'logo', options);
        images.should.have.include('test/image/sprite/sprite-logo-hoge.png');
        images.should.have.include('test/image/sprite/sprite-logo-fuga.jpg');
        images.should.have.include('test/image/sprite/sprite-logo-foo.png');
        done();
    });
    it('sprite getGroup', function (done) {
        beezlib.css.sprite.getGroup('sprite-logo@10x.png').should.be.equal('logo');
        beezlib.css.sprite.getGroup('sprite-logo-hoge.png').should.be.equal('logo');
        beezlib.css.sprite.getGroup('_sprite-logo-fuga.jpg').should.be.equal('logo');
        beezlib.css.sprite.getGroup('sprite-logo.styl').should.be.equal('logo');
        beezlib.css.sprite.getGroup('sprite-logo.css').should.be.equal('logo');
        done();
    });
    it('sprite getHead', function (done) {
        beezlib.css.sprite.getHead('sprite-logo@10x.png').should.be.equal('sprite');
        beezlib.css.sprite.getHead('sprite-logo-10.png').should.be.equal('sprite');
        beezlib.css.sprite.getHead('_sprite-logo-10.jpg').should.be.equal('_sprite');
        beezlib.css.sprite.getHead('sprite-logo.styl').should.be.equal('sprite');
        beezlib.css.sprite.getHead('sprite-logo.css').should.be.equal('sprite');
        done();
    });
    it('sprite getCreateFile', function (done) {
        var options = { ratios: [1, 2] };
        var files = beezlib.css.sprite.getCreateFile('sprite-logo-hoge.png', options);
        files.should.have.length(3);
        files.should.have.include('sprite-logo.styl');
        files.should.have.include('sprite-logo@10x.png');
        files.should.have.include('sprite-logo@20x.png');
        done();
    });
    it('sprite isSpriteImage', function (done) {
        var options = { heads: ['sprite', '_sprite'], extnames: ['.png', '.jpg'] };
        beezlib.css.sprite.isSpriteImage('sprite-logo-10.png', options).should.be.true;
        beezlib.css.sprite.isSpriteImage('sprite-logo-10.jpg', options).should.be.true;
        beezlib.css.sprite.isSpriteImage('sprite-logo@10x.png', options).should.be.false;
        beezlib.css.sprite.isSpriteImage('sprite-logo.png', options).should.be.false;
        beezlib.css.sprite.isSpriteImage('_sprite-logo-10.png', options).should.be.true;
        beezlib.css.sprite.isSpriteImage('_sprite-logo-10.jpg', options).should.be.true;
        done();
    });
    it('sprite isSpriteSheet', function (done) {
        var options = { heads: ['sprite', '_sprite'] };
        beezlib.css.sprite.isSpriteSheet('sprite-logo@10x.png', options).should.be.true;
        beezlib.css.sprite.isSpriteSheet('sprite-logo-10.png', options).should.be.false;
        beezlib.css.sprite.isSpriteSheet('sprite-logo.png', options).should.be.false;
        done();
    });
    it('sprite isSpriteStylus', function (done) {
        var options = { heads: ['sprite', '_sprite'] };
        beezlib.css.sprite.isSpriteStylus('sprite-logo.styl', options).should.be.true;
        beezlib.css.sprite.isSpriteStylus('sprite-logo.png', options).should.be.false;
        beezlib.css.sprite.isSpriteStylus('_sprite-logo.styl', options).should.be.true;
        done();
    });
    it('sprite isSpriteCss', function (done) {
        var options = { heads: ['sprite', '_sprite'] };
        beezlib.css.sprite.isSpriteCss('sprite-logo.css', options).should.be.true;
        beezlib.css.sprite.isSpriteCss('sprite-logo.png', options).should.be.false;
        beezlib.css.sprite.isSpriteCss('_sprite-logo.css', options).should.be.true;
        done();
    });

});
