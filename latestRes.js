//Data posted on DB has to correspond the data of day previous to current day
//Thus data has to collect the data from the day before in a single get for a single site
//Meaning that every get has to occurr after all data for previous has to be already uploaded
//In order to make the least amount of resquests possible

var request = require("request");
var cheerio = require("cheerio");
var util = require("./util.js");

//List of reservoirs by site number				
	var reservoirs = ["50125780", "50141500", "50113950", "50010800", "50045000", "50059000", "50047550", "50111210", "50026140", "50093045", "50027100", "50076800", "50071225"];

	var daily_results = {  "0": {}, "1": {}, "2": {}, "3": {}, "4": {}, "5": {}, "6": {}, "7": {}, "8": {}, "9": {}, "10": {}, "11": {}, "12": {}  };

  var array_reservoirs_url = new Array();
  var temp_URL = "";
  var daily_rivers = {};

  for(var i = 0; i < reservoirs.length; i++){
			temp_URL = "http://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=" + reservoirs[i] + "&startDT=" + util.getYesterday() + "T00:00-0400&endDT=" + util.getYesterday() + "T00:05-0400&parameterCd=62614&siteType=LK&siteStatus=all";
			array_reservoirs_url.push(temp_URL);	  
	  }

var cont = 12;
  
//Request function which loads the HTML body from the URL
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
		
		instant_value = parseFloat(data_values);
		if(isNaN(instant_value) == true){
			instant_value = 0;
		}
		
		daily_results[cont.toString()] = {
				'siteno' : siteNumber,
				'value' : instant_value,
				'datef' : util.getYesterday()
			};
			
			if(cont == 0){
				console.log(daily_results);
				
			}			
			cont--;
	  
			
  } else {
    console.log("We’ve encountered an error: " + error);
  }
});
}



