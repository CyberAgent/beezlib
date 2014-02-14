var path = require('path');
var should = require('should');
var beezlib = require('../lib');

describe('beezlib.template', function () {
    it('hbs2hbsc', function() {
        var dstpath = beezlib.template.hbs2hbscjs('test/hbs/', 'test.hbs');
        //console.log(dstpath);
        dstpath.should.equal('test/hbs/test.hbsc.js');
    });
    it('hbsp2hbspjs', function() {
        var dstpath = beezlib.template.hbsp2hbspjs('test/hbs/', 'test.hbsp');
        //console.log(dstpath);
        dstpath.should.equal('test/hbs/test.hbsp.js');
    });
    it('requirehbs2hbsc', function() {
        var store = {
            stat: new beezlib.fsys.store.JSONStore('test/store')
        };
        var dstpath = beezlib.template.requirehbs2hbsc('test/hbs/require.beez.local.develop.js', 'require.beez.js.hbs', store);
        //console.log(dstpath);
        dstpath.should.equal('test/hbs/require.beez.local.develop.js');
    });
    it('hbs2hbsc2html', function() {
        var store = {
            stat: new beezlib.fsys.store.JSONStore('test/store')
        };
        var dstpath = beezlib.template.hbs2hbsc2html('test/hbs/index.local.develop.html', 'index.html.hbs', store);
        dstpath.should.equal('test/hbs/index.local.develop.html');
    });
});
