var app = angular.module('myApp', []);
app.controller('formCtrl', function($scope, $http) {


    $scope.register = function() {
						console.log('inside register fn');
						console.log($scope.secretQuestion);

                        $http({method: 'GET',
						url : "/db/insert/person/"+$scope.email+"/"+
						$scope.password+"/"+
						$scope.secretQuestion+"/"+
						$scope.secretAnswer+""
						}).success(function(data, status) {  
                                    $scope.dataset = data;
                            }).
                        error(function(data, status) {
                          $scope.dataset = data || "Request failed "; 
						  console.log(dataset);
                      }); 	
		
    };
});

app.controller('signInCtrl', function($scope, $http) {

	//console.log('inside toregister fn');
    $scope.signIn = function() {
		console.log('im here');
		
    };

});