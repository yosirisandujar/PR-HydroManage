//Data posted on DB has to correspond the data of day previous to current day
//Thus data has to collect the data from the day before in a single get for a single site
//Meaning that every get has to occurr after all data for previous has to be already uploaded
//In order to make the least amount of resquests possible

var request = require("request");
var cheerio = require("cheerio");
var util = require("./util.js");

//List of reservoirs by site number				
	
	var aquifers = ["182639066385200", "181352066025300", "182515065594100", "182133066342800", "180122066560300", "175858066100200", "180052066471000", "182637066475900", "180057066311300",
				"182224065430300", "182549066304300", "181301067081900", "181217065453000", "175934066364800", "175947066130601", "175734066233300", "182515066194000", "182647066201700", 
				"180559065280501"]; 
	var daily_results = {  "0": {}, "1": {}, "2": {}, "3": {}, "4": {}, "5": {}, "6": {}, "7": {}, "8": {}, "9": {}, "10": {}, "11": {}, "12": {}, "13": {}, "14": {}, "15": {}, "16": {}, 
						"17": {}, "18": {}  };
				

  var array_aquifers_url = new Array();
  var temp_URL = "";
  var daily_aquifers = {};
  for(var i = 0; i < aquifers.length; i++){
			temp_URL = "http://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=" + aquifers[i] + "&startDT=" + util.getYesterday() + "T00:00-0400&endDT=" + util.getYesterday() + "T00:05-0400&parameterCd=72019&siteType=GW&siteStatus=all";
			array_aquifers_url.push(temp_URL);	  
	  }

var cont = 18;
  
//Request function which loads the HTML body from the URL
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



