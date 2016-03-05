// MODULE
var movieApp = angular.module('movieApp', ['ngRoute', 'ngResource']);

// ROUTES
movieApp.config(function ($routeProvider) {

    $routeProvider
    .when('/',{
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
        
    })
    .when('/search',{
        templateUrl: 'pages/search.htm',
        controller: 'searchController'
    })
    .when('/search/:items/:sort',{
        templateUrl: 'pages/search.htm',
        controller: 'searchController'
    })
    .when('/gallery',{
        templateUrl: 'pages/gallery.htm',
        controller: 'galleryController'
    })
    .when('/movie/:item',{
        templateUrl: 'pages/movie.htm',
        controller: 'movieController'
    })
    
    
});

//directives
movieApp.directive('movieResult', function(){
   return{
       restrict: 'E',
       templateUrl: "pages/movieResult.htm",
       replace: true,
       scope: {
          movie: "=movieData",
          afterSelected: "&"
       }
   }; 
});


//services
movieApp.service('movienameService', function(){
    this.movie = "The Shawshank Redemption";
});

movieApp.service('selectedService', function(){
    this.selected = "The Shawshank Redemption";
    this.movielist = [];
});

movieApp.service('galleryService', function(){
    this.movielist = [];
    this.movielength = 0;
});



// CONTROLLERS
movieApp.controller('homeController', ['$scope','$http','movienameService', 'galleryService', function($scope, $http, movienameService, galleryService) {
    $scope.movie = movienameService.movie;
    $scope.$watch('movie', function(){
        movienameService.movie = $scope.movie;
    });
    $http.get("movieData.json")
    .then(function(response){
        galleryService.movielist = response.data;
        galleryService.movielength = response.data.length;
    });
    
}]);

movieApp.controller('galleryController', ['$scope','selectedService', 'galleryService', function($scope, selectedService, galleryService) {
    $scope.genre = ['Crime', 'Drama', 'Thriller','History', 'Western', 'Fantasy', 'Sci-Fi', 'Mistery', 'War', 'Family', 'Horror'];
    $scope.movieList = galleryService.movielist;
    console.log($scope.movieList);

}]);

movieApp.controller('movieController', ['$scope','$routeParams',  'selectedService', function($scope, $routeParams, selectedService) {
    $scope.selected = selectedService.selected;  
    $scope.movieList = selectedService.movielist;
    
    $scope.found = 0;
    $scope.nextMovie = function(){
        for(var i=0; i<$scope.movieList.length-1; i++){
            if($scope.selected.rank === $scope.movieList[i].rank){
                console.log($scope.selected.rank);
                $scope.selected = $scope.movieList[i+1];
                break;   
            }
        }
    }
    
    $scope.preMovie = function(){
        for(var i=1; i<$scope.movieList.length; i++){
            if($scope.selected.rank === $scope.movieList[i].rank){
                console.log($scope.selected.rank);
                $scope.selected = $scope.movieList[i-1];  
                break;
            }
        }
    }
    
    $scope.goback = function(){
        history.back();
    }
}]);



movieApp.controller('searchController', ['$scope','$http','$filter', '$location', '$routeParams', 'movienameService', 'selectedService', 'galleryService',function($scope, $http, $filter, $location, $routeParams, movienameService, selectedService, galleryService) {
    $scope.movie = movienameService.movie;
    $scope.items = $routeParams.items || '20';
    $scope.sort = $routeParams.sort || 'd';
    
    $scope.$watch('sort', function(){
        console.log($scope.sort);
    });
    $scope.getlistD = function(){
        var i;
        $scope.resultList = [];
        for(i=0; i<$scope.resultLength; i++){
            var currindex=0;
            var len = $scope.movie.length;
            while(currindex+len<=$scope.movieResult[i].title.length){
                var currstring = $scope.movieResult[i].title.substring(currindex, currindex+len);
                if(currstring === $scope.movie){
                    $scope.resultList.push($scope.movieResult[i]);
                    currindex++;
                    break;
                }
                currindex++;
            }
        }
    }
    $scope.getlistA = function(){
        var i;
        $scope.resultList = [];
        for(i=$scope.resultLength-1; i>=0; i--){
            var currindex=0;
            var len = $scope.movie.length;
            while(currindex+len<=$scope.movieResult[i].title.length){
                var currstring = $scope.movieResult[i].title.substring(currindex, currindex+len);
                if(currstring === $scope.movie){
                    $scope.resultList.push($scope.movieResult[i]);
                    currindex++;
                    break;
                }
                currindex++;
            }
        }
    }
    $scope.getlistN = function(){
        $scope.getlistD();
        
        $scope.resultList=$filter('orderBy')($scope.resultList, $scope.resultList.title, false);
        console.log($scope.resultList);
    }
    
    //$http.get("movieData.json")
    //.then(function(response){
        //$scope.resultLength = response.data.length;
       // $scope.movieResult = response.data;
    $scope.resultLength = galleryService.movielength;
    $scope.movieResult = galleryService.movielist;
    if($scope.sort === 'd')
        $scope.getlistD();
    if($scope.sort === 'a')
        $scope.getlistA();
    if($scope.sort === 'n')
        $scope.getlistN();
    
    $scope.afterSelected = function(movieSelected){
        console.log(movieSelected);
        $scope.selected = movieSelected;
        selectedService.movielist = $scope.resultList;
        selectedService.selected = $scope.selected;
        var path = "movie/" + movieSelected.title;
        $location.path(path);
    }
    
     
}]);