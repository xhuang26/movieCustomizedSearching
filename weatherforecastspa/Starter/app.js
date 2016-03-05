//module
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

//routes
weatherApp.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl: 'home.html',
        controller: 'homeController'
        
    })
    .when('/forcast',{
        templateUrl: 'forcast.html',
        controller: 'forcastController'
    })
    .when('/forcast/:days',{
        templateUrl: 'forcast.html',
        controller: 'forcastController'
    })
});

//services
weatherApp.service('cityService', function(){
    this.city = "New York, NY";
});

//directives
weatherApp.directive('weatherResult', function(){
   return{
       restrict: 'E',
       templateUrl: 'weatherResult.html',
       replace: true,
       scope: {
           converttodate: "&",
           converttof: "&",
           weather: "=",
           format: "@"
       }
   } 
});

//controllers
weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService){
    $scope.city = cityService.city;
    $scope.$watch('city', function(){
        cityService.city = $scope.city;
    });
    
}]);

weatherApp.controller('forcastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService){
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '2';
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=cac5896d8b2f98ab220b802cb4c29f25", {callback: "JSON_CALLBACK"},{get: {method: "JSONP"}});
    $scope.weatherResult = $scope.weatherAPI.get({q: $scope.city, cnt: $scope.days});
    $scope.convertToFahrenheit = function(degK){
        return Math.round((1.8*(degK-273))+32);
    };
    $scope.convertToDate = function(dt){
        return new Date(dt * 1000); 
    };
}]);
