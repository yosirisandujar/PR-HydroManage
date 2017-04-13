var exports = module.exports = {};



	exports.getValues =  function(obj, key) {
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(exports.getValues(obj[i], key));
			} else if (i == key) {
				objects.push(obj[i]);
			}
		}
		return objects;
		
}
	
	
		exports.getYesterday = function(){
		
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