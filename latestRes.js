//WATER RESERVOIRS DAILY DATA FUNCTION
//This script correspond to the functionality of retrieving data for water reservoirs from the USGS database.
// Sata has to collect the data from the day before in a single get for a single site
//Meaning that every get has to occurr after all data for previous has to be already uploaded
//In order to make the least amount of resquests possible.


//This are the libraries this function uses, "request" and "cheerio" are libraries used for the extraction of data from the USGS database thourgh the links generated below.
//Node schedule is used to schedule the time in which the function is allowed to run, it uses cron tab functionality with simplified syntaxis.
//Util is a script made with utility functions, one used to get the date from the day before and the other reads a json and gets the values of the keys specified in the parameter.
var request = require("request");
var cheerio = require("cheerio");;
var schedule = require('node-schedule');
var util = require("./util.js");


//List of reservoirs by site number				
	var reservoirs = ["50125780", "50141500", "50113950", "50010800", "50045000", "50059000", "50047550", "50111210", "50026140", "50093045", "50027100", "50076800", "50071225"];
	
//Variables initialized
  var array_reservoirs_url = new Array();
  var temp_URL = "";
  var daily_urls = new Array();
  
//Link generating loop
//links will be stored in the variable array_reservoirs_url for later use.
  for(var i = 0; i < reservoirs.length; i++){
			temp_URL = "http://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=" + reservoirs[i] + "&startDT=" + util.getYesterday() + "T00:00-0400&endDT=" + util.getYesterday() + "T00:05-0400&parameterCd=62614&siteType=LK&siteStatus=all";
			array_reservoirs_url.push(temp_URL);	  
	  }
//A counter that will be used by the reservoirget function to when is it time to send the information in the form of callback to the execute reservoir function.
  var cont = 12;

//This is the function that actually retrieves the information from the USGS database. It does so by doing a request with every link generated above. Then it parses the JSON recieved
//and extract the site number for which we are looking data, the instant value of the day, and uses these values to further generate the urls that will be used to trigger the routes in 
//the server file and store those same values into the prhydromanage database.
function reservoirget(out, callback){
  
//Request  asynchronuous function which loads the HTML body from the URL.
//It will load what at first is consider an HTML, but in reality is a JSON representation of the data it was requested by the function.
//Once it loads, it converts this string into a JSON and starts getting the values it needs.
	for(var z = 0; z < array_reservoirs_url.length; z++){
		request(array_reservoirs_url[z], function (error, response, body) {
		if (!error) {
		  var json_not = cheerio.load(body).html();	 
		  var json_yes = JSON.parse(json_not.replace(/&quot;/g,'"'));	 
		  var str_list = Object.keys(json_yes);	  
		  var keyValue = util.getValues(json_yes, 'value');		  
		  var data_values = keyValue.slice(14,15);	
		  var non_data_values = keyValue.slice(0,1);	
		  var siteNumber = JSON.stringify(non_data_values).substring(7,15);	
			
			
			//Once the values are assigned, it verifies if the numerical value for the instant reading of the level of the reservoir is indeed a number or not
			//If its not a number, then is given the value of zero.
			instant_value = parseFloat(data_values);
			if(isNaN(instant_value) == true){
				instant_value = 0;
			}
			
			//This adds the new link that will be used to insert the data into prhydromanage's database to an array
			daily_urls[cont] = "https://prhydromanage.herokuapp.com/db/insert/waterreservoir/information/"+ siteNumber + "/'" + util.getYesterday() +"'/" + instant_value.toFixed(2).toString();	
			
			//Here the counter is checked to verify if the data of the last resource in the list has been retrieved, if it does, the the information will be sent
			//as callback to executeReservoir
			if(cont == 0){
				out = daily_urls;
				return callback(out);
			}			
			//The counter is updated
			cont--;		
	  } else {
		console.log("We’ve encountered an error: " + error);
	  }
	});
}
}


//This function triggers the reservoirget function so that it starts running only after that. This is done so that we can store all the urls generated within an array and not lose
//lose it along the way due to the asynchronuous behavior of the request inside the reservoirget function
function executeReservoir(){
	var fetched_reservoirs = new Array();
	reservoirget(fetched_reservoirs, function(val){
		var newval = val;
		for(var n = 0; n < newval.length; n++){
			//Again, a request is made but this time is done with the objective of entering new information into prhydromanage's database
			var req = request(newval[n], function (error, response) {
				if (!error) { 
					console.log(response.body);
				} else {
					console.log("We’ve encountered an error: " + error);
				}
			});
		}	
	});
}


//This is the node-schedule function that is executed at the time specified by the function
//It also includes a request that calls a route in the server that updates the calendar day of the river values
var j = schedule.scheduleJob('5 1 * * *', function(){
	executeReservoir();	
	/*var calendar_req = request.put("https://prhydromanage.herokuapp.com/db/update/calendardays", function (error, response) {
		if (!error) { 
			console.log(response.body);
		} else {
			console.log("We’ve encountered an error: " + error);
		}
	});*/
});

