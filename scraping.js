//Data posted on DB has to correspond the data of day previous to current day
//Thus data has to collect the data from the day before in a single get for a single site
//Meaning that every get has to occurr after all data for previous has to be already uploaded
//In order to make the least amount of resquests possible

//List of rivers by site number
var rivers = ["182743067004200", "50010500", "50011000", "50011085", "50011128", "50011180", "50011200", "50014800", "50021700", "50024950", "50025155", "50026025", "50027000", 
				"50027600", "50028000", "50028400", "50029000", "50031200", "50034000", "50035000", "50038100", "50038320", "50039500", "50039995", "50043000", "50043197", "50043800",
				"50043980", "50044810", "50045010", "50046000", "50047535", "50047560", "50047850", "50048565", "50049100", "50049620", "50050900", "50051310", "50051800", "50053025",
				"50055000", "50055225", "50055380", "50055750", "50056400", "50057000", "50058350", "50059050", "50059210", "50061800", "50063800", "50064200", "50065500", "50067000",
				"50070900", "50071000", "50075000", "50075500", "50081000", "50083500", "50085100", "50090500", "50092000", "50093000", "50093053", "50093075", "50093078", "50093083",
				"50093084", "50093090", "50093110", "50093115", "50093120", "50094545", "50095000", "50100200", "50100450", "50106100", "50110650", "50110900", "50111320", "50111330",
				"50111340", "50111500", "50112500", "50113800", "50114000", "50114900", "50115240", "50115420", "50124200", "50126150", "50128905", "50128907", "50128920", "50128925",
				"50128933", "50128940", "50128945", "50128948", "50129254", "50136400", "50138000", "50144000", "50147800", "50148890", "50231500"]; 

//List of reservoirs by site number				
var embalses = ["50010800", "50011088", "50020100", "50020550", "50023110", "50026140", "50027100", "50032290", "50032590", "50039995", "50045000", "50047550", "50048680", "50059000", 
				"50071225", "50075550", "50076800", "50093045", "50095800", "50106850", "50111210", "50111300", "50113950", "50125780", "50128900", "50141500", "50146073"];

//List of aquifers by site number				
var acuiferos = ["182639066385200", "181352066025300", "182515065594100", "182133066342800", "180122066560300", "175858066100200", "180052066471000", "182637066475900", "180057066311300",
				"182224065430300", "182549066304300", "181301067081900", "181217065453000", "175934066364800", "175947066130601", "175734066233300", "182515066194000", "182647066201700", 
				"180559065280501"]; 
				
				


//Include libraries
var request = require("request"),
  cheerio = require("cheerio"),
  //URL for USGS river data 
  url = "https://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=180559065280501&startDT=2017-03-01T00:00-0400&endDT=2017-03-01T23:55-0400&parameterCd=72019&siteType=GW&siteStatus=all";
	//url = "https://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=50092000&startDT=2017-03-01T00:00-0400&endDT=2017-03-01T00:00-0400&parameterCd=00060&siteType=ST&siteStatus=all"

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
  
  
  //Request function which loads the HTML body from the URL
request(url, function (error, response, body) {
  if (!error) {
	  var json_not = cheerio.load(body).html();
	 
	  var json_yes = JSON.parse(json_not.replace(/&quot;/g,'"'));
	 
 	  var json_str = JSON.stringify(json_yes);

 	  var parse_str = JSON.parse(json_str);

	  var str_list = Object.keys(parse_str);
	  
	  var keyValue = getValues(parse_str, 'value');
	  
	  var data_values = keyValue.slice(14,keyValue.length);
	  
	  var array_values = new Array();
	  
	  for(var i = 0; i < data_values.length; i++){		  
		  array_values.push(parseFloat(data_values[i]));
	  };
	  
	  console.log(array_values);
	  
	  var value_sum = 0;
	  
	  for(var j = 0; j < array_values.length; j++){
		value_sum = array_values[j] + value_sum;		  
	  };
	  
	  average_value = value_sum/array_values.length; 
	  	  
	  
	  console.log(average_value);
  } else {
    console.log("We’ve encountered an error: " + error);
  }
});

