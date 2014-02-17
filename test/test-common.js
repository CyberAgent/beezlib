var path = require('path');
var should = require('should');
var beezlib = require('../lib');

describe('beezlib.common', function () {

    it('isUAOverride Success', function () {
        var config = {
            extend: {
                condition: {
                    ua: ['android']
                }
            }
        };
        var headers = {
            'user-agent': 'Mozilla/5.0 (Linux; U; Android 4.0.1; ja-jp; Galaxy Nexus Build/ITL41D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
        };

        var res = beezlib.common.isUAOverride(config, headers);
        res.should.be.ok;


    });
    it('isUAOverride Failure', function () {
        var config = {
            extend: {
                condition: {
                    ua: ['ios']
                }
            }
        };

        var headers = {
            'user-agent': 'Mozilla/5.0 (Linux; U; Android 4.0.1; ja-jp; Galaxy Nexus Build/ITL41D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
        };

        var res = beezlib.common.isUAOverride(config, headers);
        res.should.not.be.ok;

    });
});
