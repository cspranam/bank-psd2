const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
var {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose.js');
const {OidcMap} = require('./models/oidcmapping.js');


//The code to be generic so that it works on Heroku
const port = process.env.PORT || 3001;


var app = express();
app.use(bodyParser.json());

app.get('/intent', (req,res) => {
	console.log('GET /intentsearch');
	var query = {};
	if(req.query.access_token){
		query = {"access_token":""+req.query.access_token};
	}else if(req.query.auth_code){
		query = {"auth_code":""+req.query.auth_code};
	}else if(req.query.client_id){
		query = {"client_id":""+req.query.client_id};
	}else if(req.query.intent_id){
		query = {"intent_id":""+req.query.intent_id};
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
	var body = _.pick(req.body,['client_id','intent_id']);
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

app.post('/intentcreate/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['auth_code','access_token','client_id','intent_id']);
	if (ObjectID.isValid(id)){
		OidcMap.findByIdAndUpdate(id, {$set: body}, {new: true}).then((oidcmap)=>{
			if(oidcmap){
				res.status(200).send({oidcmap})
			} else{
				res.status(404).send('oidcmap not found');
				console.log('Error during patching an OIDC Mapping');
			}
		},(err)=>{
			res.status(400).send(err);
			console.log('Error during patching an OIDC Mapping');
		}).catch((err) => {
			res.status(400).send(err);
			console.log('Error during patching an OIDC Mapping');
		});
	} else {
		res.status(400).send('id is invalid');
		console.log('Error during patching an OIDC Mapping');
	}
});


app.post('/intent',(req,res)=> {
	console.log('POST /intent');
	var body = _.pick(req.body,['client_id']);
	console.log(body);
	OidcMap.find({client_id:body.client_id}).then((oidcmapping) => {
	var result = _.map(oidcmapping, (currentObject) => {
		return _.pick(currentObject, ["intent_id"]);
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