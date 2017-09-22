const mongoose = require('mongoose');
var OidcMap = mongoose.model('OidcMapping',{
	access_token: {
		type: String
	},
	auth_code: {
		type: String
	},
	client_id: {
		type: String
	},
	intent_id: {
		type: String
	}
});
module.exports = {OidcMap};