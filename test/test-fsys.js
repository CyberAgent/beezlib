var path = require('path');
var should = require('should');
var beezlib = require('../lib');

describe('beezlib.fsys', function () {

    it('mkdirp', function (done) {
        var dirpath = '/tmp/hoge/foo/bar/spam';
        beezlib.fsys.mkdirp(dirpath, 0755,  function (err, result) {
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
    it('rmrfSync', function () {
        var dirpath = '/tmp/hoge';
        beezlib.fsys.rmrfSync(dirpath);
    });
    it('isFile', function () {
        var dirpath = '/tmp';
        var dirpath1 = '/tmp/hoge';

        beezlib.fsys.isDirectorySync(dirpath).should.be.ok;
        beezlib.fsys.isDirectorySync(dirpath1).should.not.be.ok;

        beezlib.fsys.isFileSync(dirpath).should.not.be.ok;
    });
    it('readFileFnJSONSync', function () {
        var json = beezlib.fsys.readFileFnJSONSync('test/json/json.js');
        json.hoge.should.equal('foo').be.ok;

        var user = beezlib.fsys.readFileFnJSONSync('test/json/user.js');
        user.name.should.equal('nickname').be.ok;
        var user_body = beezlib.fsys.readFileFnJSONSync('test/json/user.body.js');
        user_body.head.should.equal('head1').be.ok;
        user.body.should.eql(user_body).be.ok;
    });
    it('readFileMultiConfigureSync', function () {
        var json = beezlib.fsys.readFileMultiConfigureSync('test/json/json.js');
        json.hoge.should.equal('foo').be.ok;
        json = beezlib.fsys.readFileMultiConfigureSync('test/json/item.json');
        json.item.fruit.should.equal('Orange').be.ok;
    });
    it('store', function() {
        var dir = 'test/json';
        var store = new beezlib.fsys.store.JSONStore(dir);
        store.basename.should.equal('json').be.ok;
        store.data.item.should.be.ok;
        debugger;
        store.mapping.item.should.equal('test/json/item.json');
        store.mapping.hoge.should.equal('test/json/json.js');
        store.hash['test/json/dir/index.json'].should.equal('8b8ef0b684580b7a03e1928651a8d3b545211a6838a1432a91e030015ca8a803').be.ok;
    });
    it('readJsonSync',function() {
        var file = 'test/json/user.json';
        var res = beezlib.fsys.readJsonSync(file, true);
        res.user.name.should.equal('fkei').be.ok;
    });
    it('chmodfilesSync', function() {
        var files = ['test/json/user.json', 'test/json/item.json'];
        beezlib.fsys.chmodfilesSync(files, 0755);
    });
    it('cp', function(done) {
        var src = 'test/json/user.json';
        var dst = 'test/json/user.copy.json';

        beezlib.fsys.cp(src, dst, function (err, res) {
            beezlib.fsys.isFileSync(dst).should.be.ok;
            done();
        });
    });

    it('resolveTilde', function() {
        var str = beezlib.fsys.resolveTilde('~/Desktop');
        str.substr(0,1).should.equal('/').be.ok;
        //console.log(str);
    });

    it('pathTilde', function() {
        var str = beezlib.fsys.pathTilde('~/Desktop');
        str.substr(0,1).should.equal('/').be.ok;
        //console.log(str);
    });


});
