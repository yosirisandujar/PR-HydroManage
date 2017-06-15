//Data posted on DB has to correspond the data of day previous to current day
//Thus data has to collect the data from the day before in a single get for a single site
//Meaning that every get has to occurr after all data for previous has to be already uploaded
//In order to make the least amount of resquests possible

var request = require("request");
var cheerio = require("cheerio");
var unirest = require('unirest');
var schedule = require('node-schedule');
var util = require("./util.js");

//List of reservoirs by site number				
	
	var aquifers = ["180057066311300",  "175934066364800", "175947066130601", "175734066233300"]; 				
	var daily_urls = new Array();
  var array_aquifers_url = new Array();
  var temp_URL = "";
  for(var i = 0; i < aquifers.length; i++){
			temp_URL = "http://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=" + aquifers[i] + "&startDT=" + util.getYesterday() + "T00:00-0400&endDT=" + util.getYesterday() + "T00:05-0400&parameterCd=72019&siteType=GW&siteStatus=all";
			array_aquifers_url.push(temp_URL);	  
	  }

var cont = 3;
  
//Request function which loads the HTML body from the URL

function aquiferget(out, callback){

for(var z = 0; z < array_aquifers_url.length; z++){
	request(array_aquifers_url[z], function (error, response, body) {
	if (!error) {
	  var json_not = cheerio.load(body).html();	 
	  var json_yes = JSON.parse(json_not.replace(/&quot;/g,'"'));	 
	  var str_list = Object.keys(json_yes);	  
	  var keyValue = util.getValues(json_yes, 'value');		  
	  var data_values = keyValue.slice(14,15);	
	  var non_data_values = keyValue.slice(0,1);	
	  var siteNumber = JSON.stringify(non_data_values).substring(7,22);	
		
	instant_value = parseFloat(data_values);
		if(isNaN(instant_value) == true){
			instant_value = 0;
		}
			
			daily_urls[cont] = "https://prhydromanage.herokuapp.com/db/insert/aquifer/information/"+ siteNumber + "/'" + util.getYesterday() +"'/" + instant_value.toFixed(2).toString();
			
			if(cont == 0){
				
				out = daily_urls;
				return callback(out);
			}			
			cont--;

			
  } else {
    console.log("We’ve encountered an error: " + error);
  }
});
}
}


function executeAquifer(){
	var fetched_aquifers = new Array();
	aquiferget(fetched_aquifers, function(val){
		var newval = val;
		for(var n = 0; n < newval.length; n++){
			var req = request(newval[n], function (error, response) {
				if (!error) { 
					console.log(response.body);
				} else {
					console.log("We’ve encountered an error: " + error);
					}
});}});}




var q = schedule.scheduleJob('10 1 * * *', function(){
	executeAquifer();	
	
	var req = request("https://prhydromanage.herokuapp.com/db/update/calendardays", function (error, response) {
	if (!error) { 
		console.log(response.body);
	} else {
		console.log("We’ve encountered an error: " + error);
	}});
});		