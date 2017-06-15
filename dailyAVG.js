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
var rivers = ["50092000","50100450","50106100","50110900","50112500","50113800","50124200","50138000","50136400","50144000","50147800","50014800","50028000","50025155","50038100",
				"50035000","50034000","50039500","50043800","50047850","50049100","50058350","50055225","50055000","50053025","50051800","50051310","50057000","50061800","50064200",
				"50063800","50065500","50067000","50071000","50075000","50081000","50090500"]; 
		
var avg_river_url = new Array();
var temp_URL_7dayAVG = "";
var temp_URL_1monthAVG = "";
var temp_URL_3monthAVG = "";
var temp_URL_6monthAVG = "";
var temp_URL_9monthAVG = "";
var temp_URL_1yearAVG = "";

//Url generator
for(var i = 0; i < rivers.length; i++){
			
			//console.log(util.getYesterday());
			var temp_URL_7dayAVG = "https://prhydromanage.herokuapp.com/db/insert/river/7dayAvg/" +rivers[i]+ "/'"+ util.getYesterday()+"'/";
			var temp_URL_1monthAVG = "https://prhydromanage.herokuapp.com/db/insert/river/1MonthAvg/" + rivers[i] + "/'" + util.getYesterday()+"'/";
			var temp_URL_3monthAVG = "https://prhydromanage.herokuapp.com/db/insert/river/3MonthAvg/" + rivers[i] + "/'" + util.getYesterday()+"'/";
			var temp_URL_6monthAVG = "https://prhydromanage.herokuapp.com/db/insert/river/6MonthAvg/" + rivers[i] + "/'" + util.getYesterday()+"'/";
			var temp_URL_9monthAVG = "https://prhydromanage.herokuapp.com/db/insert/river/9MonthAvg/" + rivers[i] + "/'" + util.getYesterday()+"'/";
			var temp_URL_1yearAVG = "https://prhydromanage.herokuapp.com/db/insert/river/1YearAvg/" + rivers[i] + "/'" + util.getYesterday()+"'/";
			
			/*var temp_URL_7dayAVG = "http://localhost:3000/db/insert/river/7dayAvg/" +rivers[i]+ "/'"+ util.getYesterday()+"'/";
			var temp_URL_1monthAVG = "http://localhost:3000/db/insert/river/1MonthAvg/" + rivers[i] + "/'" + util.getYesterday()+"'/";
			var temp_URL_3monthAVG = "http://localhost:3000/db/insert/river/3MonthAvg/" + rivers[i] + "/'" + util.getYesterday()+"'/";
			var temp_URL_6monthAVG = "http://localhost:3000/db/insert/river/6MonthAvg/" + rivers[i] + "/'" + util.getYesterday()+"'/";
			var temp_URL_9monthAVG = "http://localhost:3000/db/insert/river/9MonthAvg/" + rivers[i] + "/'" + util.getYesterday()+"'/";
			var temp_URL_1yearAVG = "http://localhost:3000/db/insert/river/1YearAvg/" + rivers[i] + "/'" + util.getYesterday()+"'/";*/
			
			
			avg_river_url.push(temp_URL_7dayAVG);
			avg_river_url.push(temp_URL_1monthAVG);
			avg_river_url.push(temp_URL_3monthAVG);
			avg_river_url.push(temp_URL_6monthAVG);
			avg_river_url.push(temp_URL_9monthAVG);
			avg_river_url.push(temp_URL_1yearAVG);
			
	  }
  
function executeRiverAVG(){
	for(var n = 0; n < avg_river_url.length; n++){
		//console.log(avg_river_url[n]);
		var req_avg = request.put(avg_river_url[n], function (error, response) {
				if (!error) { 
					console.log(response.body);
				} else {
					console.log("We’ve encountered an error: " + error);
					}
				});
	}	
}; 

var v = schedule.scheduleJob('30 1 * * *', function(){
	executeRiverAVG();
	
});



