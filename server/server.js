const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {mongoose} = require('./db/mongoose.js');
const {OidcMap} = require('./models/oidcmapping.js');


//The code to be generic so that it works on Heroku
const port = process.env.PORT || 3001;


var app = express();
app.use(bodyParser.json());

app.get('/intent', (req,res) => {
	console.log('GET /intentsearch');
	var query = {};
	if(req.query.accessToken){
		query = {"accessToken":""+req.query.accessToken};
	}else if(req.query.clientId){
		query = {"clientId":""+req.query.clientId};
	}else if(req.query.intentId){
		query = {"intentId":""+req.query.intentId};
	}else if(req.query.id){
		query = {"_id":""+req.query.id};
	}
	console.log(query);

	OidcMap.find(query).then((oidcmapping) => {
		res.status(200).send({oidcmapping});
	},(err) => {
		res.status(400).send('Failure');
		console.log('Error during retrieving OIDC Mappings');
	}).catch((e) => {
		res.status(400).send('Failure');
		console.log('Error during retrieving OIDC Mappings');
	});
});

app.post('/intentcreate',(req,res)=> {
	console.log('POST /intentcreate');
	var body = _.pick(req.body,['accessToken','clientId','intentId']);
	console.log(body.accessToken);
	console.log(req.body);
	var oidcMap = new OidcMap(body);
	oidcMap.save().then((oidcmap) =>{
		res.status(201).send('Success');
	}, (err) => {
		res.status(400).send('Failure');
		console.log('Error during saving an OIDC Mapping');
	}).catch((e) => {
		res.status(400).send('Failure');
		console.log('There is an error during POST',e);
	});
});

app.post('/intent',(req,res)=> {
	console.log('POST /intent');
	var body = _.pick(req.body,['accessToken']);
	console.log(body.accessToken);
	OidcMap.find({accessToken:body.accessToken}).then((oidcmapping) => {
	var result = _.map(oidcmapping, (currentObject) => {
		return _.pick(currentObject, ["intentId"]);
	});
	res.status(200).send(result);
	},(err) => {
		res.status(400).send('Failure');
		console.log('Error during retrieving OIDC Mappings');
	}).catch((e) => {
		res.status(400).send('Failure');
		console.log('Error during retrieving OIDC Mappings');
	});
});




app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});