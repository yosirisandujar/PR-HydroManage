//Data posted on DB has to correspond the data of day previous to current day
//Thus data has to collect the data from the day before in a single get for a single site
//Meaning that every get has to occurr after all data for previous has to be already uploaded
//In order to make the least amount of resquests possible

//List of rivers by site number
var rivers = ["50092000","50100450","50106100","50110900","50112500","50113800","50124200","50138000","50136400","50144000","50147800","50014800","50028000","50025155","50038100",
				"50035000","50034000","50039500","50043800","50047850","50049100","50058350","50055225","50055000","50053025","50051800","50051310","50057000","50061800","50064200",
				"50063800","50065500","50067000","50071000","50075000","50081000","50090500"]; 

				
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
  var array_river_url = new Array();
  var temp_URL = "";
  var daily_rivers = {};
  //console.log(river_daily_data);
  for(var i = 0; i < rivers.length; i++){
			temp_URL = "http://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=" + rivers[i] + "&startDT=" + getYesterday() + "T00:00-0400&endDT=" + getYesterday() + "T23:55-0400&parameterCd=00060&siteType=ST&siteStatus=all";
			array_river_url.push(temp_URL);	  
	  }

  //console.log(array_river_url);
  
//Request function which loads the HTML body from the URL
for(var z = 0; z < array_river_url.length; z++){
	request(array_river_url[z], function (error, response, body) {
	if (!error) {
	  var json_not = cheerio.load(body).html();	 
	  var json_yes = JSON.parse(json_not.replace(/&quot;/g,'"'));	 
	  var str_list = Object.keys(json_yes);	  
	  var keyValue = getValues(json_yes, 'value');	  
	  var data_values = keyValue.slice(14,keyValue.length);	
		var non_data_values = keyValue.slice(0,1);	
		console.log(JSON.stringify(non_data_values).substring(7,15));
		var siteNumber = JSON.stringify(non_data_values).substring(7,15);
	  var array_values = new Array();
	  
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
			
			 
			//console.log(array_values.length);
			console.log(average_value.toFixed(2));
			
			//daily_rivers[siteNumber] = average_value;
			//console.log(daily_rivers);
			
  } else {
    console.log("We’ve encountered an error: " + error);
  }
});
}



