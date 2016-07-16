// Crypto module import.
var crypto = require('crypto');

var SHA256 = {
    itoa64: './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    to64: function(index, count) {
        var result = '';

        while (--count >= 0) { // Result char count.
            result += SHA256.itoa64[index & 63]; // Get corresponding char.
            index = index >> 6; // Move to next one.
        }

        return result;
    },
    getSalt: function(inputSalt) {
        var salt = '';

        if (inputSalt) { // Remove $apr1$ token and extract salt.
            salt = inputSalt.split("$")[2];
        } else {
            while(salt.length < 16) { // Random 16 chars.
                var rchIndex = Math.floor((Math.random() * 64));
                salt += SHA256.itoa64[rchIndex];
            }
        }

        return salt;
    },
    getPassword: function(final) { // Password generation part.
        // Encrypted pass.
        var epass = '';

        epass += SHA256.to64((final.charCodeAt(0) << 16)
            | (final.charCodeAt(10) << 8)
            | final.charCodeAt(20), 4);

        epass += SHA256.to64((final.charCodeAt(21) << 16)
            | (final.charCodeAt(1) << 8)
            | final.charCodeAt(11), 4);

        epass += SHA256.to64((final.charCodeAt(12) << 16)
            | (final.charCodeAt(22) << 8)
            | final.charCodeAt(2), 4);

        epass += SHA256.to64((final.charCodeAt(3) << 16)
            | (final.charCodeAt(13) << 8)
            | final.charCodeAt(23), 4);

        epass += SHA256.to64((final.charCodeAt(24) << 16)
            | (final.charCodeAt(4) << 8)
            | final.charCodeAt(14), 4);

        epass += SHA256.to64((final.charCodeAt(15) << 16)
            | (final.charCodeAt(25) << 8)
            | final.charCodeAt(5), 4);

        epass += SHA256.to64((final.charCodeAt(6) << 16)
            | (final.charCodeAt(16) << 8)
            | final.charCodeAt(26), 4);

        epass += SHA256.to64((final.charCodeAt(27) << 16)
            | (final.charCodeAt(7) << 8)
            | final.charCodeAt(17), 4);

        epass += SHA256.to64((final.charCodeAt(18) << 16)
            | (final.charCodeAt(28) << 8)
            | final.charCodeAt(8), 4);

        epass += SHA256.to64((final.charCodeAt(9) << 16)
            | (final.charCodeAt(19) << 8)
            | final.charCodeAt(29), 4);

        epass += SHA256.to64((final.charCodeAt(31) << 8)
            | final.charCodeAt(30), 3);

        return epass;
    },
    encrypt: function(key, salt) {
        var cnt; 
        var cnt2;
        var alt_result = '';
        var temp_result = '';

        salt = SHA256.getSalt(salt);

        var ctx = key + salt;
        var alt_ctx = key + salt + key;

        alt_result = crypto.createHash('sha256').update(alt_ctx).digest('binary');

        for (cnt = key.length; cnt > 32; cnt -= 32) {
            ctx += alt_result;
        }

        ctx += alt_result.substring(0,cnt);

        for (cnt = key.length; cnt > 0; cnt >>= 1) {
            if (cnt & 1) {
                ctx += alt_result;
            } else {
                ctx += key;
            }
        }

        alt_result = crypto.createHash('sha256').update(ctx).digest('binary');

        alt_ctx = '';

        for (cnt = 0; cnt < key.length; ++cnt) {
            alt_ctx += key;
        }

        temp_result = crypto.createHash('sha256').update(alt_ctx).digest('binary');

        var p_bytes = '';

        cnt2 = 0;
        for (cnt = key.length; cnt >= 0; cnt -= 32) {
            p_bytes += temp_result.substring(0, 32);
            p_bytes = p_bytes.slice(0, key.length);
            cnt2 +=32;
        }

        if (cnt > 0) {
            p_bytes += temp_result.substring(0, cnt);
        }

        alt_ctx = '';

        for (cnt = 0; cnt < 16 + alt_result.charCodeAt(0); ++cnt) {
            alt_ctx += salt;
        }

        temp_result = crypto.createHash('sha256').update(alt_ctx).digest('binary');

        var s_bytes = '';

        cnt2 = 0;
        for (cnt = salt.length; cnt >= 0; cnt -= 32) {
            s_bytes += temp_result.substring(0, 32);
            s_bytes = s_bytes.slice(0, salt.length);
            cnt2 +=32;
        }

        if (cnt > 0) {
            s_bytes += temp_result.substring(0, cnt);
        }

        // Just use default value of 5000 rounds like original version of apache-crypt
        for (cnt = 0; cnt < 5000; ++cnt) {
            ctx = '';
            
            if (cnt & 1) {
                ctx += p_bytes;
            } else {
                ctx += alt_result;
            }
            if (cnt % 3) {
                ctx += s_bytes;
            }
            if (cnt % 7) {
                ctx += p_bytes;
            }
            if (cnt & 1) {
                ctx += alt_result;
            } else {
                ctx += p_bytes;
            }
            // Final assignment after each loop.
            alt_result = crypto.createHash('sha256').update(ctx).digest('binary');
        }

        // make sure that the ctx is cleared
        ctx = null;

        return "$5$" + salt + "$" + SHA256.getPassword(alt_result);
    }
};

// Exporting function.
module.exports = SHA256.encrypt;