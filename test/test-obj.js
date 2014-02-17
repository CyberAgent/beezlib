var path = require('path');
var should = require('should');
var beezlib = require('../lib');

describe('beezlib.obj', function () {
    it('copy', function () {
        var original = {
            aaaa: 0,
            cccc: "c",
            fn: {
                hoge: false,
                a: function () {
                    return "original";
                }
            },
            ary: [1,2,3,4,5],
            date: new Date("2000/01/01 00:00:0"),
            reg: new RegExp("^original$")
        };

        var extend = {
            bbbb: 1,
            dddd: [0,"",[0, 1], {
                ffff: 0,
                gggg: 1,
                hhhh: "",
                iiii: []
            }],
            fn: {
                hoge: true,
                a: function () {
                    return "extend";
                }
            },
            ary: [5,4,3,2,1],
            date: new Date("2000/12/31 23:59:59"),
            reg: new RegExp("^extend$")
        };

        var out = beezlib.obj.copy(extend, original);

        // fn
        original.fn.a().should.equal('original');
        extend.fn.a().should.equal('extend');
        out.fn.a().should.equal('extend');
        // ary
        original.date.toString().should.equal('Sat Jan 01 2000 00:00:00 GMT+0900 (JST)').be.ok;
        extend.date.toString().should.equal('Sun Dec 31 2000 23:59:59 GMT+0900 (JST)').be.ok;
        out.date.toString().should.equal('Sun Dec 31 2000 23:59:59 GMT+0900 (JST)').be.ok;
        // reg
        original.reg.toString().should.equal("/^original$/").be.ok;
        extend.reg.toString().should.equal("/^extend$/").be.ok;
        out.reg.toString().should.equal("/^extend$/").be.ok;

    });

    it('copy object merge', function () {
        var original = {
            options: {
                compress: true,
                firebug: false,
                linenos: false,
                nib: true,
                fn : {
                    none: true,
                    color: '#000000',
                    'body-padding': function (value) {
                        should.fail();
                    }
                }
            }
        };
        var extend = {
            options: {
                fn: {
                    color: '#111111',
                    'body-padding': function (value) {
                        value.should.equal(3);
                        return value + 'px';
                    }
                }
            }
        };

        var out = beezlib.obj.copy(extend, original);

        out.options.should.be.ok;
        out.options.compress.should.be.ok;

        out.options.firebug.should.not.be.ok;
        out.options.linenos.should.not.be.ok;
        out.options.nib.should.be.ok;
        out.options.fn.none.should.be.ok;
        out.options.fn.color.should.equal('#111111').be.ok;
        out.options.fn['body-padding'](3).should.equal('3px').be.ok;
    });
});
