/* global variable*/
"use strict";

var express = require('express'),
    cfenv = require("cfenv"),
    appEnv = cfenv.getAppEnv(),
    app = express(),
    bodyParser = require('body-parser'),
    watson = require('watson-developer-cloud'),
    Cloudant=require('cloudant'),
	unirest=require('unirest');
	
/*
  
  Start the server */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()) 

app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});

/* Watson Conversation
*/
var conversation = watson.conversation({
    url: "https://gateway.watsonplatform.net/conversation/api",
  username: "c054eb14-c0df-42a2-a649-47327b925cc2", // set ur user name
  password: "FTcQ0pEEHL1W"  , // Set to your conversation password
    version_date: '2017-20-05',
    version: 'v1'
});

// Allow clients to interact with the bot
app.post('/api/bot', function(req, res) {
    
    console.log("Got request for Le Bot");
    //console.log("Request is: ",req);

    var workspace = '4957cfcd-4d7e-496b-a9c1-90ca297969bb'; // Set to your Conversation workspace ID

    if (!workspace) {
        console.log("No workspace detected. Cannot run the Watson Conversation service.");
    }

    var params = {
        workspace_id: workspace,
        context: {}, // Null context indicates new conversation
        input: {}    // Holder for message
    };

    // Update options to send to conversation service with the user input and a context if one exists
    if (req.body) {
        if (req.body.input) {
            params.input = req.body.input;
			console.log('send the data');
        }

        if (req.body.context) {
            params.context = req.body.context;
        }
		if (req.body.output) {
            params.output = req.body.output;
        }
    }

    // Send message to the conversation service with the current context
   
	  
   conversation.message(params, function(err, data) {
        if (err) {
            console.log("Error in sending message: ", err);
            return res.status(err.code || 500).json(err);
        }

        console.log("Response: ", data);
       var a=[];
	   a=data;
	   console.log(a.output.text);
        return res.json(a);
	  
  });

	
	/**var me = 'e1783b77-23bb-4bcd-88fd-bfbbe5766772-bluemix'; // Set this to your own account
var password = 'e8509baf604a50f5cf79a509def6d0cf0d0454a4e23451b28ed71bb574c5a999';
var vdetails="";
var cloudant = Cloudant({
   account: me,
   password: password
});
var db = cloudant.db.use('dsp');
cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});

   
   vdetails = req.body;
   //console.log("details"+vdetails)
   vdetails._id = req.body.chatMessaage;
  
   //console.log(req.body);
   db.insert({
       vdetails
   }, req.body.chatMessaage, function(err, result) {
	   
	    console.log(result)
}); 

    db.get("iot", function(err, data) {
   console.log("Found document:", data);
   console.log("Found document:", data.rsources);
   
   console.log("error"+err) **/
 //}); 


	 });	
	/*
 unirest.post("https://e7da2ca8-1fcc-40ac-b911-605175cacb2f-bluemix:688e3e2f9d93ede8b65ce1695d8d647873aa7219c1f31746fc4571396791a639@e7da2ca8-1fcc-40ac-b911-605175cacb2f-bluemix.cloudant.com/mars")
 .headers({
	 'Accept':'applictaion/json',
	 'Context Type':'application/json',
	 'Authorization':'Basic ZTdkYTJjYTgtMWZjYy00MGFjLWI5MTEtNjA1MTc1Y2FjYjJmLWJsdWVtaXg6Njg4ZTNlMmY5ZDkzZWRlOGI2NWNlMTY5NWQ4ZDY0Nzg3M2FhNzIxOWMxZjMxNzQ2ZmM0NTcxMzk2NzkxYTYzOQ=='
 })	 
 .send({
	 "id":"bbla",
	 "text":"req.params.input"
	 
	 })
	 .end(function(response){
		 console.log("data sucess");
	 }
		 
	 ); 
}); // End app.post '/api/bot'

*/
 