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
    res.sendFile(path.join(__dirname + '/homepage.html'));
	console.log("path success");
});

app.get('/to/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/register.html'));
	console.log("path success to register");
});

app.get('/to/signin', function(req, res) {
    res.sendFile(path.join(__dirname + '/signIn.html'));
	console.log("path success to signin");
});

app.get('/to/forgotpassword', function(req, res) {
    res.sendFile(path.join(__dirname + '/forgotPassword.html'));
	console.log("path success to forgot password");
});

app.get('/to/homepage', function(req, res) {
    res.sendFile(path.join(__dirname + '/homepage.html'));
	console.log("path success to homepage");
});

app.get('/to/rivers', function(req, res) {
    res.sendFile(path.join(__dirname + '/riversMain.html'));
	console.log("path success to homepage");
});

app.get('/to/waterReservoirs', function(req, res) {
    res.sendFile(path.join(__dirname + '/waterReservoirsMain.html'));
	console.log("path success to homepage");
});

app.get('/to/aquifers', function(req, res) {
    res.sendFile(path.join(__dirname + '/aquifersMain.html'));
	console.log("path success to homepage");
});

app.get('/to/reservesAndShelters', function(req, res) {
    res.sendFile(path.join(__dirname + '/reservesAndSheltersMain.html'));
	console.log("path success to homepage");
});

/*var config = {
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

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'prhydromanage1@gmail.com',
		pass:'neonaturecode'
	}
});

app.get('/mailer/:email/:emailConfirmationNumber',function(req,res){
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'prhydromanage1@gmail.com', // sender address
	    to: req.params.email, // list of receivers
	    subject: 'PR HydroManage Confirmacion',
	    text: 'Gracias por registrarse con PR HydroManage\n'+ // plain text body
		'su numero de confirmacion es: '+req.params.emailConfirmationNumber+
		'por favor verifique su cuenta ingresando dicho numero y su correo electronico'+
	    'Siga el siguiente enlace para verificar: xxxx ', 
		//html: '<b>Hello world ?</b>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
})

//Include libraries
var request = require("request"),
  cheerio = require("cheerio"),
  //URL for USGS river data 
  url = "https://waterdata.usgs.gov/pr/nwis/uv?cb_00060=on&cb_00065=on&format=rdb&site_no=50147800&period=1D";
  

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

app.get('/db/get/person', function (req,res) {
	//clientConnect();
	query = client.query("select * from person;"); 
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows));
		res.end();  
	});
})

app.get('/db/get/person/:email', function (req,res) {
	//clientConnect();
	query = client.query("select * from person where email='"+req.params.email+"';"); 
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

//underconstruction
app.get('/db/insert/users/:personid/:organization/:city/:emailConfirmationNumber', function(req,res){
	//clientConnect();
	query = client.query("\
		INSERT INTO users(personid, organization, city, emailConfirmationNumber)\
		VALUES ('"+req.params.personid+"','"+req.params.organization+"'\
		,'"+req.params.city+"','"+req.params.emailConfirmationNumber+"')\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();  
	});
})
