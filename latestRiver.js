//WATER RIVERS DAILY DATA FUNCTION
//This script correspond to the functionality of retrieving data for water reservoirs from the USGS database.
// Sata has to collect the data from the day before in a single get for a single site
//Meaning that every get has to occurr after all data for previous has to be already uploaded
//In order to make the least amount of resquests possible.


//This are the libraries this function uses, "request" and "cheerio" are libraries used for the extraction of data from the USGS database thourgh the links generated below.
//Node schedule is used to schedule the time in which the function is allowed to run, it uses cron tab functionality with simplified syntaxis.
//Util is a script made with utility functions, one used to get the date from the day before and the other reads a json and gets the values of the keys specified in the parameter.
var request = require("request");
var cheerio = require("cheerio");
var unirest = require('unirest');
var schedule = require('node-schedule');
var util = require("./util.js");



//List of rivers by site number
var rivers = ["50092000","50100450","50106100","50110900","50112500","50113800","50124200","50138000","50136400","50144000","50147800","50014800","50028000","50025155","50038100",
				"50035000","50034000","50039500","50043800","50047850","50049100","50058350","50055225","50055000","50053025","50051800","50051310","50057000","50061800","50064200",
				"50063800","50065500","50067000","50071000","50075000","50081000","50090500"]; 
//Variables initialized			
var array_river_url = new Array();
var temp_URL = "";						
daily_urls = new Array(37);
//Link generating loop
//links will be stored in the variable array_river_url for later use.
for(var i = 0; i < rivers.length; i++){
			temp_URL = "http://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=" + rivers[i] + "&startDT=" + util.getYesterday() + "T00:00-0400&endDT=" + util.getYesterday() + "T23:55-0400&parameterCd=00060&siteType=ST&siteStatus=all";
			array_river_url.push(temp_URL);	  
	  }
//A counter that will be used by the reservoirget function to when is it time to send the information in the form of callback to the execute reservoir function.  
var cont = 36;

//This is the function that actually retrieves the information from the USGS database. It does so by doing a request with every link generated above. Then it parses the JSON recieved
//and extract the site number for which we are looking data, the instant value of the day, and uses these values to further generate the urls that will be used to trigger the routes in 
//the server file and store those same values into the prhydromanage database.
function riverget(out, callback){
//Request  asynchronuous function which loads the HTML body from the URL.
//It will load what at first is consider an HTML, but in reality is a JSON representation of the data it was requested by the function.
//Once it loads, it converts this string into a JSON and starts getting the values it needs.
for(var z = 0; z < array_river_url.length; z++){
	request(array_river_url[z], function (error, response, body) {
	if (!error) {
	  var json_not = cheerio.load(body).html();	 
	  var json_yes = JSON.parse(json_not.replace(/&quot;/g,'"'));	 
	  var str_list = Object.keys(json_yes);	  
	  var keyValue = util.getValues(json_yes, 'value');	  
	  var data_values = keyValue.slice(14,keyValue.length);	
		var non_data_values = keyValue.slice(0,1);	
		//console.log(JSON.stringify(non_data_values).substring(7,15));
		var siteNumber = JSON.stringify(non_data_values).substring(7,15);
	  var array_values = new Array();
			//Once the values are assigned, it verifies if the numerical value for the average of the instant readings of the discharge of the river is indeed a number or not
			//If its not a number, then is given the value of zero.
			for(var i = 0; i < data_values.length; i++){		  
				array_values.push(parseFloat(data_values[i]));
			};	  
			var value_sum = 0;
	  
			for(var j = 0; j < array_values.length; j++){
				if(array_values[j] == NaN){
					break;
				}
				value_sum = array_values[j] + value_sum;		  
			};
			
			if(array_values.length == 0){
				average_value = 0;
			}
			else {
				average_value = value_sum/array_values.length;
				}			
			//This adds the new link that will be used to insert the data into prhydromanage's database to an array
			daily_urls[cont] = "https://prhydromanage.herokuapp.com/db/insert/river/information/"+ siteNumber + "/'" + util.getYesterday() +"'/" + average_value.toFixed(2).toString();
			//daily_urls[cont] = "http://localhost:5000/db/insert/river/information/"+ siteNumber + "/'" + util.getYesterday() +"'/" + average_value.toFixed(2).toString();	
			
			
			//Here the counter is checked to verify if the data of the last resource in the list has been retrieved, if it does, the the information will be sent
			//as callback to executeRiver
			if(cont == 0){
				//console.log(daily_urls);
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
function executeRiver(){
	var fetched_rivers = new Array();
	riverget(fetched_rivers, function(val){
		var newval = val;
		for(var n = 0; n < newval.length; n++){
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
var k = schedule.scheduleJob('38 11 * * *', function(){
	executeRiver();	
	
	var req = request("https://prhydromanage.herokuapp.com/db/update/calendardays", function (error, response) {
	if (!error) { 
		console.log(response.body);
	} else {
		console.log("We’ve encountered an error: " + error);
	}});
});
 



