//Data posted on DB has to correspond the data of day previous to current day
//Thus data has to collect the data from the day before in a single get for a single site
//Meaning that every get has to occurr after all data for previous has to be already uploaded
//In order to make the least amount of resquests possible

var request = require("request");
var cheerio = require("cheerio");
var unirest = require('unirest');
var schedule = require('node-schedule');
var util = require("./util.js");


var exports = module.exports = {};
//List of rivers by site number
var aquifers = ["180057066311300",  "175934066364800", "175947066130601", "175734066233300"]; 		
var change_aquifer_url = new Array();

for(var i = 0; i < aquifers.length; i++){
			
			
			var change_in_time = "https://prhydromanage.herokuapp.com/db/update/aquifer/" +aquifers[i]+ "/"+ util.getYesterday();
			
			
			//var change_in_time = "http://localhost:3000/db/update/aquifers/" +aquifers[i]+ "/'"+ util.getYesterday()+"'/";			
			change_aquifer_url.push(change_in_time);			
	  }
  
function executeAquiferChange(){
	for(var n = 0; n < change_aquifer_url.length; n++){
		var req = request(change_aquifer_url[n], function (error, response) {
				if (!error) { 
					console.log(response.body);
				} else {
					console.log("We’ve encountered an error: " + error);
					}
				});
	}	
}; 

var v = schedule.scheduleJob('12 1 * * *', function(){
	executeAquiferChange();
	
});



