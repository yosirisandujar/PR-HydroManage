var pg = require('pg');
var express = require('express');
var http = require('http');
var request = require('request');
var fs = require("fs");
var path = require('path');

////////////////////////////////////////////////////////////////

//var latestRes = require("./latestRes.js");
//var latestRiver = require("./latestRiver.js");
//var latestAqu = require("./latestAqu.js");
//var dailyPer = require("./dailyPER.js");
//var dailyAvg = require("./dailyAVG.js");
//var aquiferchange = require("./aquiferChange.js");

/////////////////////////////////////////////////////////////////



var app = express();
app.use(express.static('www'));
app.set('port', process.env.PORT || 3000);
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

app.get('/to/accountConfirmation', function(req, res) {
    res.sendFile(path.join(__dirname + '/accountConfirmation.html'));
	console.log("path success to homepage");
});

app.get('/to/thankyou', function(req, res) {
    res.sendFile(path.join(__dirname + '/thankyou.html'));
	console.log("path success to homepage");
});

app.get('/to/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname + '/dashboard.html'));
	console.log("path success to homepage");
});

app.get('/to/settings', function(req, res) {
    res.sendFile(path.join(__dirname + '/settings.html'));
	console.log("path success to homepage");
});

app.get('/to/addPrivileges', function(req, res) {
    res.sendFile(path.join(__dirname + '/addPrivileges.html'));
	console.log("path success to homepage");
});

app.get('/to/removePrivileges', function(req, res) {
    res.sendFile(path.join(__dirname + '/removePrivileges.html'));
	console.log("path success to homepage");
});

app.get('/to/removeUser', function(req, res) {
    res.sendFile(path.join(__dirname + '/removeUser.html'));
	console.log("path success to homepage");
});

app.get('/to/editUser', function(req, res) {
    res.sendFile(path.join(__dirname + '/editUser.html'));
	console.log("path success to homepage");
});

app.get('/to/editForm', function(req, res) {
    res.sendFile(path.join(__dirname + '/editForm.html'));
	console.log("path success to homepage");
});

app.get('/to/addForm', function(req, res) {
    res.sendFile(path.join(__dirname + '/addForm.html'));
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

var conString, client, query;
function clientConnect(){
	pg.defaults.ssl = true;          
	//conString = process.env.DATABASE_URL ||
	conString = "postgres://aulbirpuyqfmri:7cc4c6f3ac349a95129692af1f2f8044db909aaaad853e9d94ce48c69168f0c9@ec2-54-243-252-91.compute-1.amazonaws.com:5432/dbkkivo19b6n7b";
	client = new pg.Client(conString);
	client.connect();
}

clientConnect();

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'prhydromanage@gmail.com',
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
		'\npor favor verifique su cuenta ingresando dicho numero y su correo electronico'+
	    '\nSiga el siguiente enlace para verificar: http://localhost:5000/to/accountconfirmation ', 
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

app.get('/db/get/users/:personid', function (req,res) {
	//clientConnect();
	query = client.query("select * from users where personid='"+req.params.personid+"';"); 
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(result.rows));
		res.end();  
	});
})

app.get('/db/get/administrator/:personid', function (req,res) {
	//clientConnect();
	query = client.query("select * from administrator where personid='"+req.params.personid+"';"); 
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

//MAYBE NOT NEEDED
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

app.get('/db/update/users/confirmation/:personid',function(req,res){
	
	//clientConnect();
	query = client.query("\
		update users\
		set emailConfirmation=true\
		where personid = "+req.params.personid+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.get('/db/update/person/email/:personid/:email',function(req,res){
	
	//clientConnect();
	query = client.query("\
		update person\
		set email='"+req.params.email+"'\
		where personid = "+req.params.personid+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.get('/db/update/person/password/:personid/:password',function(req,res){
	
	//clientConnect();
	query = client.query("\
		update person\
		set password='"+req.params.password+"'\
		where personid = "+req.params.personid+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.get('/db/update/person/question/:personid/:secretquestion/:secretanswer',function(req,res){
	
	//clientConnect();
	query = client.query("\
		update person\
		set secretquestion="+req.params.secretquestion+",secretanswer='"+req.params.secretanswer+"' \
		where personid = "+req.params.personid+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.get('/db/update/users/city/:personid/:city',function(req,res){
	
	//clientConnect();
	query = client.query("\
		update users\
		set city='"+req.params.city+"'\
		where personid = "+req.params.personid+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.get('/db/update/users/organization/:personid/:organization',function(req,res){
	
	//clientConnect();
	query = client.query("\
		update users\
		set organization='"+req.params.organization+"'\
		where personid = "+req.params.personid+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.post('/db/insert/river/information/:siteno/:dateTimeusgs/:paramstatdesc',function(req,res){
	//siteno = station
	//clientConnect();	
	console.log(req.method);
	query = client.query("\
		insert into riversusgs(siteno, datetimeusgs, paramstatdesc)\
		values("+req.params.siteno+","+req.params.dateTimeusgs+","+req.params.paramstatdesc+")\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
	console.log("Query was successful");
})

app.get('/db/get/river/information/:siteno',function(req,res){
	
	//clientConnect();
	query = client.query("\
		select * from riversusgs\
		where siteno="+req.params.siteno+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.get('/db/get/river/information/avg/:siteno/:date1/:date2',function(req,res){
	//siteno = station
	query = client.query("\
		select avg(paramStatDesc)\
		from riversusgs\
		where dateTimeUSGS between '"+req.params.date1+"' and '"+req.params.date2+"'\
		and siteno="+req.params.siteno+"\
	");    
   	query.on("end", function (result) {     
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.get('/db/update/rivers/calendarday',function(req,res){
	
	//clientConnect();
	query = client.query("\
		UPDATE riversusgs\
		Set calendarday = EXTRACT(DOY FROM datetimeusgs)\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.get('/db/get/river/information/:siteno',function(req,res){
	
	//clientConnect();
	query = client.query("\
		select * from riversusgs\
		where siteno="+req.params.siteno+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
	
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/db/insert/waterreservoir/information/:uniqueid/:dateTimeusgs/:level_m',function(req,res){
	//uniqueid = siteno
	//level_m = paramstatdesc
	//console.log("im here")
	console.log(req.method);
	query = client.query("\
		insert into waterreservoirslevel(uniqueid, datetimeusgs, level_m)\
		values("+req.params.uniqueid+","+req.params.dateTimeusgs+","+req.params.level_m+")\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.post('/db/insert/waterreservoir/reference/:uniqueid/:level/:volume',function(req,res){
	//uniqueid = siteno
	//level_m = paramstatdesc
	//console.log("im here")
	console.log(req.method);
	query = client.query("\
		insert into waterreservoirsreference(uniqueid, level, volume)\
		values("+req.params.uniqueid+","+req.params.level+","+req.params.volume+")\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

//https://prhydromanage.herokuapp.com/db/get/river/max/50092000
app.get('/db/get/river/max/:siteno',function(req,res){
	//siteno = station
	query = client.query("\
		select max(datetimeusgs) as max, to_char(max(datetimeusgs),'mm/dd/yyyy') as max1\
		from riversusgs\
		where siteno="+req.params.siteno+"\
	");    
   	query.on("end", function (result) {     
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.post('/db/insert/aquifer/information/:monitoringstation/:dateTimeusgs/:aquiferlevel',function(req,res){
	//monitoringstation
	query = client.query("\
		insert into aquiferslevel(monitoringstation, datetimeusgs, aquiferlevel)\
		values("+req.params.monitoringstation+","+req.params.dateTimeusgs+","+req.params.aquiferlevel+")\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.put('/db/insert/river/7dayAvg/:siteno/:dateTimeusgs/',function(req,res){
	//uniqueid = siteno
	//level_m = paramstatdesc
	//console.log("im here")
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION average(x date) RETURNS float AS $avg1$\
	declare avg1 float;\
    BEGIN\
    	select avg(paramstatdesc) into avg1\
        from riversusgs\
        where datetimeusgs between x-interval '7 days' and x-interval '1 day'\
		and paramstatdesc != 0\
		and siteno="+req.params.siteno+";\
        RETURN avg1;\
    END;\
    $avg1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set sevendaysavg_flow = average(datetimeusgs)\
    where siteno= "+req.params.siteno+"\
	and datetimeusgs = "+req.params.dateTimeusgs+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.put('/db/insert/river/1MonthAvg/:siteno/:dateTimeusgs/',function(req,res){
	//uniqueid = siteno
	//level_m = paramstatdesc
	//console.log("im here")
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION average(x date) RETURNS float AS $avg1$\
	declare avg1 float;\
    BEGIN\
    	select avg(paramstatdesc) into avg1\
        from riversusgs\
        where datetimeusgs between x-interval '30 days' and x-interval '1 day'\
		and paramstatdesc != 0\
		and siteno="+req.params.siteno+";\
        RETURN avg1;\
    END;\
    $avg1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set onemonthavg_flow = average(datetimeusgs)\
    where siteno= "+req.params.siteno+"\
	and datetimeusgs = "+req.params.dateTimeusgs+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.put('/db/insert/river/3MonthAvg/:siteno/:dateTimeusgs/',function(req,res){
	//uniqueid = siteno
	//level_m = paramstatdesc
	//console.log("im here")
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION average(x date) RETURNS float AS $avg1$\
	declare avg1 float;\
    BEGIN\
    	select avg(paramstatdesc) into avg1\
        from riversusgs\
        where datetimeusgs between x-interval '90 days' and x-interval '1 day'\
		and paramstatdesc != 0\
		and siteno="+req.params.siteno+";\
        RETURN avg1;\
    END;\
    $avg1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set threemonthsavg_flow = average(datetimeusgs)\
    where siteno= "+req.params.siteno+"\
	and datetimeusgs = "+req.params.dateTimeusgs+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.put('/db/insert/river/6MonthAvg/:siteno/:dateTimeusgs/',function(req,res){
	//uniqueid = siteno
	//level_m = paramstatdesc
	//console.log("im here")
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION average(x date) RETURNS float AS $avg1$\
	declare avg1 float;\
    BEGIN\
    	select avg(paramstatdesc) into avg1\
        from riversusgs\
        where datetimeusgs between x-interval '180 days' and x-interval '1 day'\
		and paramstatdesc != 0\
		and siteno="+req.params.siteno+";\
        RETURN avg1;\
    END;\
    $avg1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set sixmonthsavg_flow = average(datetimeusgs)\
    where siteno= "+req.params.siteno+"\
	and datetimeusgs = "+req.params.dateTimeusgs+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.put('/db/insert/river/9MonthAvg/:siteno/:dateTimeusgs/',function(req,res){
	//uniqueid = siteno
	//level_m = paramstatdesc
	//console.log("im here")
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION average(x date) RETURNS float AS $avg1$\
	declare avg1 float;\
    BEGIN\
    	select avg(paramstatdesc) into avg1\
        from riversusgs\
        where datetimeusgs between x-interval '270 days' and x-interval '1 day'\
		and paramstatdesc != 0\
		and siteno="+req.params.siteno+";\
        RETURN avg1;\
    END;\
    $avg1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set ninemonthsavg_flow = average(datetimeusgs)\
    where siteno= "+req.params.siteno+"\
	and datetimeusgs = "+req.params.dateTimeusgs+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})



app.put('/db/insert/river/1YearAvg/:siteno/:dateTimeusgs/',function(req,res){
	//uniqueid = siteno
	//level_m = paramstatdesc
	//console.log("im here")
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION average(x date) RETURNS float AS $avg1$\
	declare avg1 float;\
    BEGIN\
    	select avg(paramstatdesc) into avg1\
        from riversusgs\
        where datetimeusgs between x-interval '365 days' and x-interval '1 day'\
		and paramstatdesc != 0\
		and siteno="+req.params.siteno+";\
        RETURN avg1;\
    END;\
    $avg1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set oneyearavg_flow = average(datetimeusgs)\
    where siteno= "+req.params.siteno+"\
	and datetimeusgs = "+req.params.dateTimeusgs+"\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.post('/db/insert/river/1monthPer/:siteno/:dateTimeusgs',function(req,res){
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION percentile(x float, y date, z int) RETURNS float AS $per1$\
	declare per1 float;\
    BEGIN\
    \
    	select percent_rank(x) WITHIN GROUP (ORDER BY onemonthavg_flow)*100 into per1\
        from riversusgs\
        where calendarday = z\
        and paramstatdesc != 0\
        and siteno = "+req.params.siteno+"\
        and datetimeusgs < y;\
        \
        RETURN per1;\
    END;\
    $per1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set onemonthper = percentile(onemonthavg_flow, datetimeusgs, calendarday)\
    where siteno= "+req.params.siteno+"\
    and datetimeusgs = '"+req.params.dateTimeusgs+"' \
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.post('/db/insert/river/3monthPer/:siteno/:dateTimeusgs',function(req,res){
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION percentile(x float, y date, z int) RETURNS float AS $per1$\
	declare per1 float;\
    BEGIN\
    \
    	select percent_rank(x) WITHIN GROUP (ORDER BY threemonthsavg_flow)*100 into per1\
        from riversusgs\
        where calendarday = z\
        and paramstatdesc != 0\
        and siteno = "+req.params.siteno+"\
        and datetimeusgs < y;\
        \
        RETURN per1;\
    END;\
    $per1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set threemonthsper = percentile(threemonthsavg_flow, datetimeusgs, calendarday)\
    where siteno= "+req.params.siteno+"\
    and datetimeusgs = '"+req.params.dateTimeusgs+"' \
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.post('/db/insert/river/6monthPer/:siteno/:dateTimeusgs',function(req,res){
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION percentile(x float, y date, z int) RETURNS float AS $per1$\
	declare per1 float;\
    BEGIN\
    \
    	select percent_rank(x) WITHIN GROUP (ORDER BY sixmonthsavg_flow)*100 into per1\
        from riversusgs\
        where calendarday = z\
        and paramstatdesc != 0\
        and siteno = "+req.params.siteno+"\
        and datetimeusgs < y;\
        \
        RETURN per1;\
    END;\
    $per1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set sixmonthsper = percentile(sixmonthsavg_flow, datetimeusgs, calendarday)\
    where siteno= "+req.params.siteno+"\
    and datetimeusgs = '"+req.params.dateTimeusgs+"' \
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.post('/db/insert/river/9monthPer/:siteno/:dateTimeusgs',function(req,res){
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION percentile(x float, y date, z int) RETURNS float AS $per1$\
	declare per1 float;\
    BEGIN\
    \
    	select percent_rank(x) WITHIN GROUP (ORDER BY ninemonthsavg_flow)*100 into per1\
        from riversusgs\
        where calendarday = z\
        and paramstatdesc != 0\
        and siteno = "+req.params.siteno+"\
        and datetimeusgs < y;\
        \
        RETURN per1;\
    END;\
    $per1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set ninemonthsper = percentile(ninemonthsavg_flow, datetimeusgs, calendarday)\
    where siteno= "+req.params.siteno+"\
    and datetimeusgs = '"+req.params.dateTimeusgs+"' \
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.post('/db/insert/river/1yearPer/:siteno/:dateTimeusgs',function(req,res){
	console.log(req.method);
	query = client.query("\
	CREATE OR REPLACE FUNCTION percentile(x float, y date, z int) RETURNS float AS $per1$\
	declare per1 float;\
    BEGIN\
    \
    	select percent_rank(x) WITHIN GROUP (ORDER BY oneyearavg_flow)*100 into per1\
        from riversusgs\
        where calendarday = z\
        and paramstatdesc != 0\
        and siteno = "+req.params.siteno+"\
        and datetimeusgs < y;\
        \
        RETURN per1;\
    END;\
    $per1$ LANGUAGE plpgsql;\
    \
    update riversusgs\
    set oneyearper = percentile(oneyearavg_flow, datetimeusgs, calendarday)\
    where siteno= "+req.params.siteno+"\
    and datetimeusgs = '"+req.params.dateTimeusgs+"' \
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})


app.put('/db/update/calendardays',function(req,res){
	console.log(req.method);
	query = client.query("\
				UPDATE riversusgs\
				Set calendarday = EXTRACT(DOY FROM datetimeusgs)\
	");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

app.put('/db/update/aquifers/:siteno/:dateTimeusgs/',function(req,res){
	console.log(req.method);
	query = client.query("\
		CREATE OR REPLACE FUNCTION changefn(x date) RETURNS float AS $change$\
			declare change float;\
			BEGIN\
				select aquiferlevel into change\
											from aquiferslevel\
											where monitoringstation = "+req.params.siteno+"\
											and	aquiferlevel !=0\
											and datetimeusgs = x-interval'1 day';\
				\
				RETURN change;\
			END;\
			$change$ LANGUAGE plpgsql;\
		\
		update aquiferslevel\
		set changesintime = round(cast(aquiferlevel - changefn(datetimeusgs) as numeric),2)\
		where monitoringstation = "+req.params.siteno+"\
		and aquiferlevel != 0 and datetimeusgs = "+req.params.dateTimeusgs+"\
			");    
   	query.on("end", function (result) {          
   		//client.end(); 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).write(JSON.stringify(result.rows, null, "    "));
		res.end();
	});
})

