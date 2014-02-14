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


    it('cmd/which', function(done) {
        var cmd = 'ls';

        index.cmd.which(cmd, null, function (err, stdout, stderr) {
            stdout.should.equal('/bin/ls').be.ok;
            done();
        });
    });

    it('checker# save - write - reset - read', function(done) {
        var options = { extnames: ['.png', '.jpg'], ratios: [1, 2] };
        var images = index.css.sprite.getImages('test/image/sprite', 'logo', options);
        var checker = new index.fsys.Checker(images, 'test/image/sprite/', '.cache');
        checker.save('image');
        checker.data.image.should.equal(checker.getSize(images)).be.ok;
        checker.write();
        checker.reset();
        checker.read();
        checker.data.image.should.equal(checker.getSize(images)).be.ok;
        done();
    });


});
