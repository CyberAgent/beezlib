var path = require('path');
var should = require('should');
var beezlib = require('../lib');

describe('beezlib.obj', function () {
    it('copy', function () {
        var original = {
            a: 0,
            c: "c",
            fn: {
                a: function () {
                    return "original";
                }
            },
            ary: [1,2,3,4,5],
            date: new Date("2000/01/01 00:00:0"),
            reg: new RegExp("^original$")
        };

        var extend = {
            fn: {
                a: function () {
                    return "extend";
                }
            },
            ary: [5,4,3,2,1],
            date: new Date("2000/12/31 23:59:59"),
            reg: new RegExp("^extend$"),
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

        var out = beezlib.obj.copy(extend, original);
        /**
        console.log("--original--");
        console.log(original);
        console.log("");
        console.log("");
        console.log("----");
        console.log("--extend--");
        console.log(extend);
        console.log("----");
        console.log("");
        console.log("");

        console.log("--out--");
        console.log(out);
        console.log("----");
         */

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
});
