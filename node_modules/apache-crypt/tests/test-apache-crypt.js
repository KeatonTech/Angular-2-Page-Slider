// Apache crypt.
var crypt = require('../lib/apache-crypt.js');
var keys = require('./config.json').keys;
var salts = require('./config.json').salts;
var results = require('./config.json').results;

function cryptTest (i, j, k, validate) {
    var key;
    var salt;
    switch (j) {
        case 0: 
            key = keys.md5;
            salt = salts.md5_1;
            break;
        case 1:
            key = keys.md5;
            salt = salts.md5_apr1;
            break; 
        case 2:
            key = keys.sha256;
            salt = salts.sha256;
            break;
        case 3:
            key = keys.sha512;
            salt = salts.sha512;
            break;
        case 4:
            key = keys.des;
            salt = salts.des;
    }

    key = key[i];
    salt = salt[k];

    if (validate) {
        salt = validate;
    }

    return crypt(key, salt);
}

function runTest (test, i) {
    var err = '';
    for (var j = 0; j < 5; ++j) {
        for (var k = 0; k < 4; ++k) {
            err = 'failure of Test: ' + i.toString() + '-' + j + '-' + k;
            if (!(j === 4 && k === 0)) {                        
                test.strictEqual(cryptTest(i, j, k), results[i][j][k], err);    
            } else {
                test.doesNotThrow(function () {
                    test.strictEqual(cryptTest(i, j, k).length, 13);
                    test.notStrictEqual(cryptTest(i, j, k), cryptTest(i, j, k), err);
                });       
            }
        }
    }
}  

module.exports.passwordField = {
    
    noPassword: function (test) {
        test.throws(function () {
            crypt();
        });
        runTest(test, 0);
        test.done();
    },

    withinMaxLength: function (test) {
        runTest(test, 1);
        test.done();
    },

    maxLength: function (test) {
        runTest(test, 2);
        test.done();
    },

    exceedsMaxLength: function (test) {
        runTest(test, 3);
        test.done();
    }
}


module.exports.validate = {
    // Test for valid password.
    testValidPassword: function(test) {
        var crypted = ''
        
        for (var j = 0; j < 5; ++j) {
            crypted = cryptTest(1, j, 2);
            test.strictEqual(cryptTest(1, j, 2, crypted), crypted);
        
        }
        test.done();
    },
    // Test for invalid password.
    testInValidPassword: function(test) {
        var crypted = ''

        for (var j = 0; j < 5; ++j) {
            crypted = cryptTest(1, j, 2);
            test.notStrictEqual(cryptTest(2, j, 2, crypted), crypted);
        }

        test.done();
    }
};


