var express = require('express');
var http = require('http');
    request = require('request');
var fs = require("fs");
var app = express();
var path = require('path');

app.use(express.static('www'));
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
	
    console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/register.html'));
});


/************************
var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://hbqxopcdqtxvib:b3d37a4e79be99a437b33c89abc5010712ed5b81780ad5739d1c083a6af4be53@ec2-54-225-236-102.compute-1.amazonaws.com:5432/d6fok6bbulj28q';
var db = pgp(connectionString);
*///************************
//var fs = require("fs");

//var pg, client, query, conString;

//function clientConnect(){
//	pg = require('pg');
	
/*
var config = {
  user: 'postgres', //env var: PGUSER
  database: 'prHydroManage', //env var: PGDATABASE
  password: 'xxxxxxxxxx', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
};//*/

var fs = require("fs");
var pg, conString, client, query;
function clientConnect(){
	pg = require('pg');
	pg.defaults.ssl = true;          
	//conString = process.env.DATABASE_URL ||
	conString = "postgres://hbqxopcdqtxvib:b3d37a4e79be99a437b33c89abc5010712ed5b81780ad5739d1c083a6af4be53@ec2-54-225-236-102.compute-1.amazonaws.com:5432/d6fok6bbulj28q";
	client = new pg.Client(conString);
	client.connect();
}

clientConnect();


//Include libraries
var request = require("request"),
  cheerio = require("cheerio"),
  //URL for USGS river data 
  url = "https://waterdata.usgs.gov/pr/nwis/uv?cb_00060=on&cb_00065=on&format=rdb&site_no=50147800&period=2H";
  

  //Request function which loads the HTML body from the URL
app.get('/get/usgs', function (req,res) {
request(url, function (error, response, body) {
  if (!error) {
    //console.log(cheerio.load(body).html());
	text = cheerio.load(body).text();

  } else {
    console.log("We’ve encountered an error: " + error);
  }
  
		res.writeHead(200, {'Content-Type': 'text/plain'});
		//res.write(JSON.stringify(body));
		res.write(text);
		res.end();  
}); 
})

app.get('/db/get/users', function (req,res) {
	//clientConnect();
	query = client.query("select * from person;"); 
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows));
		res.end();  
	});
})

app.get('/db/insert/person/:email/:password/:secretQuestion/:secretAnswer', function(req,res){
	//clientConnect();
	query = client.query("\
		INSERT INTO person(email, password, secretQuestion, secretAnswer)\
		VALUES ('"+req.params.email+"','"+req.params.password+"'\
		,'"+req.params.secretQuestion+"','"+req.params.secretAnswer+"')\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})