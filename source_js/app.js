var app = angular.module('mp3',['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/',{
        templateUrl: "partials/list.html",
        controller: "homeController"
    })
    .when('/gallery',{
        templateUrl: "partials/gallery.html",
        controller: "galleryController"
    })
    .when('/details/:title',{
          templateUrl: "partials/details.html",
          controller: "detailsController"
    })
    .when('/:sort', {
        templateUrl: "partials/list.html",
        controller: "homeController"
    })
    .when('/gallery/:genre',{
        templateUrl: "partials/gallery.html",
        controller: "galleryController"
    })
    .otherwise({
            redirectTo: '/'
    });
});



