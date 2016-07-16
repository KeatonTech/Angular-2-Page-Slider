// Crypto module import.
var crypto = require('crypto');

var SHA512 = {
    itoa64: './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    to64: function(index, count) {
        var result = '';

        while (--count >= 0) { // Result char count.
            result += SHA512.itoa64[index & 63]; // Get corresponding char.
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
                salt += SHA512.itoa64[rchIndex];
            }
        }

        return salt;
    },
    getPassword: function(final) { // Password generation part.
        // Encrypted pass.
        var epass = '';

        epass += SHA512.to64((final.charCodeAt(0) << 16)
            | (final.charCodeAt(21) << 8)
            | final.charCodeAt(42), 4);

        epass += SHA512.to64((final.charCodeAt(22) << 16)
            | (final.charCodeAt(43) << 8)
            | final.charCodeAt(1), 4);

        epass += SHA512.to64((final.charCodeAt(44) << 16)
            | (final.charCodeAt(2) << 8)
            | final.charCodeAt(23), 4);

        epass += SHA512.to64((final.charCodeAt(3) << 16)
            | (final.charCodeAt(24) << 8)
            | final.charCodeAt(45), 4);

        epass += SHA512.to64((final.charCodeAt(25) << 16)
            | (final.charCodeAt(46) << 8)
            | final.charCodeAt(4), 4);

        epass += SHA512.to64((final.charCodeAt(47) << 16)
            | (final.charCodeAt(5) << 8)
            | final.charCodeAt(26), 4);

        epass += SHA512.to64((final.charCodeAt(6) << 16)
            | (final.charCodeAt(27) << 8)
            | final.charCodeAt(48), 4);

        epass += SHA512.to64((final.charCodeAt(28) << 16)
            | (final.charCodeAt(49) << 8)
            | final.charCodeAt(7), 4);

        epass += SHA512.to64((final.charCodeAt(50) << 16)
            | (final.charCodeAt(8) << 8)
            | final.charCodeAt(29), 4);

        epass += SHA512.to64((final.charCodeAt(9) << 16)
            | (final.charCodeAt(30) << 8)
            | final.charCodeAt(51), 4);

        epass += SHA512.to64((final.charCodeAt(31) << 16)
            | (final.charCodeAt(52) << 8)
            | final.charCodeAt(10), 4);

        epass += SHA512.to64((final.charCodeAt(53) << 16)
            | (final.charCodeAt(11) << 8)
            | final.charCodeAt(32), 4);

        epass += SHA512.to64((final.charCodeAt(12) << 16)
            | (final.charCodeAt(33) << 8)
            | final.charCodeAt(54), 4);

        epass += SHA512.to64((final.charCodeAt(34) << 16)
            | (final.charCodeAt(55) << 8)
            | final.charCodeAt(13), 4);

        epass += SHA512.to64((final.charCodeAt(56) << 16)
            | (final.charCodeAt(14) << 8)
            | final.charCodeAt(35), 4);

        epass += SHA512.to64((final.charCodeAt(15) << 16)
            | (final.charCodeAt(36) << 8)
            | final.charCodeAt(57), 4);

        epass += SHA512.to64((final.charCodeAt(37) << 16)
            | (final.charCodeAt(58) << 8)
            | final.charCodeAt(16), 4);

        epass += SHA512.to64((final.charCodeAt(59) << 16)
            | (final.charCodeAt(17) << 8)
            | final.charCodeAt(38), 4);

        epass += SHA512.to64((final.charCodeAt(18) << 16)
            | (final.charCodeAt(39) << 8)
            | final.charCodeAt(60), 4);

        epass += SHA512.to64((final.charCodeAt(40) << 16)
            | (final.charCodeAt(61) << 8)
            | final.charCodeAt(19), 4);

        epass += SHA512.to64((final.charCodeAt(62) << 16)
            | (final.charCodeAt(20) << 8)
            | final.charCodeAt(41), 4);

        epass += SHA512.to64(final.charCodeAt(63), 2);

        return epass;
    },
    encrypt: function(key, salt) {
        var cnt; 
        var cnt2;
        var alt_result = '';
        var temp_result = '';

        salt = SHA512.getSalt(salt);

        var ctx = key + salt;
        var alt_ctx = key + salt + key;

        alt_result = crypto.createHash('sha512').update(alt_ctx).digest('binary');

        for (cnt = key.length; cnt > 64; cnt -= 64) {
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


        alt_result = crypto.createHash('sha512').update(ctx).digest('binary');

        alt_ctx = '';

        for (cnt = 0; cnt < key.length; ++cnt) {
            alt_ctx += key;
        }

        temp_result = crypto.createHash('sha512').update(alt_ctx).digest('binary');

        var p_bytes = '';

        cnt2 = 0;
        for (cnt = key.length; cnt >= 0; cnt -= 64) {
            p_bytes += temp_result.substring(0, 64);
            p_bytes = p_bytes.slice(0, key.length);
            cnt2 +=64;
        }

        if (cnt > 0) {
            p_bytes += temp_result.substring(0, cnt);
        }

        alt_ctx = '';

        for (cnt = 0; cnt < 16 + alt_result.charCodeAt(0); ++cnt) {
            alt_ctx += salt;
        }

        temp_result = crypto.createHash('sha512').update(alt_ctx).digest('binary');

        var s_bytes = '';

        cnt2 = 0;
        for (cnt = salt.length; cnt >= 0; cnt -= 64) {
            s_bytes += temp_result.substring(0, 64);
            s_bytes = s_bytes.slice(0, salt.length);
            cnt2 +=64;
        }

        if (cnt > 0) {
            s_bytes += temp_result.substring(0, cnt);
        }

        // Just use default value for rounds like original version of apache-crypt
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
            alt_result = crypto.createHash('sha512').update(ctx).digest('binary');
        }

        // make sure that the ctx is cleared
        ctx = null;

        return "$6$" + salt + "$" + SHA512.getPassword(alt_result);
    }
};

// Exporting function.
module.exports = SHA512.encrypt;
