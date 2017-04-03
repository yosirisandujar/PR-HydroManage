//Data posted on DB has to correspond the data of day previous to current day
//Thus data has to collect the data from the day before in a single get for a single site
//Meaning that every get has to occurr after all data for previous has to be already uploaded
//In order to make the least amount of resquests possible

//List of reservoirs by site number				
	var reservoirs = ["50125780", "50141500", "50113950", "50010800", "50045000", "50059000", "50047550", "50111210", "50026140", "50093045", "50027100", "50076800", "50071225"];

	
	function getValues(obj, key) {
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(getValues(obj[i], key));
			} else if (i == key) {
				objects.push(obj[i]);
			}
		}
		return objects;
	}
  
	function getYesterday(){
		
	var today = new Date();
	var yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);
	var dd = yesterday.getDate();
	var mm = yesterday.getMonth()+1; //January is 0!
	var yyyy = yesterday.getFullYear();
		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		} 
	yesterday = yyyy+'-'+mm+'-'+dd;
	yesterday = yesterday + "";
	//console.log(yesterday);
		
		return yesterday;
	}				
	
	  
  
				
//Include libraries
var request = require("request"),
  cheerio = require("cheerio");
  var array_reservoirs_url = new Array();
  var temp_URL = "";
  var daily_rivers = {};
  //console.log(river_daily_data);
  for(var i = 0; i < reservoirs.length; i++){
			temp_URL = "http://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=" + reservoirs[i] + "&startDT=" + getYesterday() + "T00:00-0400&endDT=" + getYesterday() + "T00:05-0400&parameterCd=62614&siteType=LK&siteStatus=all";
			array_reservoirs_url.push(temp_URL);	  
	  }

  //console.log(array_river_url);
  
//Request function which loads the HTML body from the URL
for(var z = 0; z < array_reservoirs_url.length; z++){
	request(array_reservoirs_url[z], function (error, response, body) {
	if (!error) {
	  var json_not = cheerio.load(body).html();	 
	  var json_yes = JSON.parse(json_not.replace(/&quot;/g,'"'));	 
	  var str_list = Object.keys(json_yes);	  
	  var keyValue = getValues(json_yes, 'value');		  
	  var data_values = keyValue.slice(14,15);	
	  var non_data_values = keyValue.slice(0,1);	
	  var siteNumber = JSON.stringify(non_data_values).substring(7,15);	
		
		instant_value = parseFloat(data_values);
		if(isNaN(instant_value) == true){
			instant_value = 0;
		}
		
		console.log(siteNumber);
		console.log(instant_value);
	  
			
  } else {
    console.log("We’ve encountered an error: " + error);
  }
});
}



