const mongoose = require('mongoose');
var OidcMap = mongoose.model('OidcMapping',{
	accessToken: {
		type: String
	},
	clientId: {
		type: String
	},
	intentId: {
		type: String,
		unique: true
	}
});
module.exports = {OidcMap};