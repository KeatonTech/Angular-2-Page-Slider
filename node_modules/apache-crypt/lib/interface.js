var DES = require('unix-crypt-td-js');
var MD5 = require('apache-md5');
var SHA256 = require('./apache-sha256.js');
var SHA512 = require('./apache-sha512.js');
var crypto = require('crypto');

// create an object with one function to match original API
var CryptModule = {};

CryptModule.crypt = function (password, salt) {	
	// get magic + salt
	var magic = salt.split('$');

	// if salt is in 'magic' format go through switch
	// default return '*0' if imrpoper format
	// else use default DES
	if (!magic[0] && magic.length > 2) {
		switch (magic[1]) {
			case '1':
				return MD5(password, salt.substring(0,11)); 
				break;
			case '5':
				return SHA256(password, salt.substring(0,19));
				break;
			case '6':
				return SHA512(password, salt.substring(0,19));
				break;	
			case 'apr1':
				return MD5(password, salt.substring(0,14));
				break;
			default:
				return '*0';
				break;
		}

	} else if (!magic[0]) {
		return '*0';
	} else {
		if (salt.length === 1) {
			salt += salt;
		}
		return DES(password, salt);
	}
}

module.exports = CryptModule;