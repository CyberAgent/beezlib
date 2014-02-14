var path = require('path');
var should = require('should');
var beezlib = require('../lib');

describe('beezlib.image', function () {

    it('getSize/resize', function (done) {
        var src = 'test/image/logo.png';
        var dstdir = 'test/image';

        beezlib.image.imagemagick.getSize(src, function(err, res) {
            err && should.fail('error beezlib.image.getSize', err, res);

            var width = res.width;
            var height = res.height;
            var ratio = 3.0;

            var rw = Math.floor(width * ratio / 2);
            var rh = Math.floor(height * ratio / 2);

            var dst = path.join(dstdir, '/logo-' + rw + 'x' + rh + '.png');
            beezlib.image.imagemagick.resize({
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
    it('makeRatioFileNameSync', function () {
        beezlib.image.imagemagick.makeRatioFileNameSync('logo.png', null, 1.3).should.equal('logo-13.png').be.ok;
        beezlib.image.imagemagick.makeRatioFileNameSync('logo.png', null, 1.3).should.equal('logo-13.png').be.ok;
        beezlib.image.imagemagick.makeRatioFileNameSync('logo.png', null, 2).should.equal('logo-20.png').be.ok;
        beezlib.image.imagemagick.makeRatioFileNameSync('logo.jpg', null, 1.3).should.equal('logo-13.jpg').be.ok;
    });
    it('isRatioFileNameSync', function () {
        beezlib.image.imagemagick.isRatioFileNameSync('logo-20.png', null).should.be.ok;
        beezlib.image.imagemagick.isRatioFileNameSync('logo.png', null).should.not.be.ok;
    });

    it('changeRatioFileNameSync', function () {
        beezlib.image.imagemagick.changeRatioFileNameSync('logo-20.png', null, 1.3).should.equal('logo-13.png').be.ok;
        beezlib.image.imagemagick.changeRatioFileNameSync('logo-hoge-20.png', null, 1.3).should.equal('logo-hoge-13.png').be.ok;
        beezlib.image.imagemagick.changeRatioFileNameSync('logo-hoge-120.png', null, 1.3).should.equal('logo-hoge-13.png').be.ok;

    });

    it('ratioResize', function (done) {
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
        beezlib.image.imagemagick.ratioResize(options, baseRatio, outRatios, function (err, res) {
            setTimeout(function () {
                done();
            }, 200);
        });
    });
    it('imagemagick.identify logo-10.png', function (done) {
        var options = ['-format', '%wx%h', 'test/image/logo-10.png'];
        var identify = beezlib.image.imagemagick.identify(options, function(err, res) {
            err && should.fail(err);
            res = res.replace('\n', '').split('x');
            res[0].should.equal('200').be.ok;
            res[1].should.equal('200').be.ok;
            done();
        });
    });
    it('imagemagick.identify logo-13.png', function (done) {
        var options = ['-format', '%wx%h', 'test/image/logo-13.png'];
        var identify = beezlib.image.imagemagick.identify(options, function(err, res) {
            err && should.fail(err);
            res = res.replace('\n', '').split('x');
            res[0].should.equal('260').be.ok;
            res[1].should.equal('260').be.ok;
            done();
        });
    });
    it('imagemagick.identify logo-30.png', function (done) {
        var options = ['-format', '%wx%h', 'test/image/logo-30.png'];
        var identify = beezlib.image.imagemagick.identify(options, function(err, res) {
            err && should.fail(err);
            res = res.replace('\n', '').split('x');
            res[0].should.equal('600').be.ok;
            res[1].should.equal('600').be.ok;
            done();
        });
    });
    it('imagemagick.identify logo-600x600.png', function (done) {
        var options = ['-format', '%wx%h', 'test/image/logo-600x600.png'];
        var identify = beezlib.image.imagemagick.identify(options, function(err, res) {
            err && should.fail(err);
            res = res.replace('\n', '').split('x');
            res[0].should.equal('600').be.ok;
            res[1].should.equal('600').be.ok;
            done();
        });
    });

    it('optipng logo.png', function(done) {
        beezlib.image.optipng('test/image/logo.png', function(err) {
            should.not.exist(err);
            done();
        });
    });

    it('jpegoptim logo.jpg', function(done) {
        beezlib.image.jpegoptim('test/image/logo.jpg', function(err) {
            should.not.exist(err);
            done();
        });
    });

});
