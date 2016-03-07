

//services
app.service('movienameService', function(){
    this.movie = "search for movies...";
});
app.service('galleryService', function(){
    this.movielist = [];
    this.movielength = 0;
});
app.service('selectedService', function(){
    this.selected = undefined;
});

//controllers
app.controller("homeController", ['$scope', '$http', '$filter', '$routeParams', '$sce','$location', 'selectedService','movienameService', 'galleryService', function($scope, $http, $filter, $routeParams, $sce, $location, selectedService, movienameService, galleryService){
    $scope.movie = movienameService.movie;
    $scope.ready = 0;
    $scope.movielength = 0;
    $scope.sort = $routeParams.sort||'r';
    $scope.order = $routeParams.order || 'd';
    $scope.movielist = [];
    $scope.$watch('movie', function(){
        movienameService.movie = $scope.movie;
        if($scope.ready === 1){
            if($scope.sort === 'r'){
                $scope.getListR();
                console.log("word changed, getlistR");
            }else if($scope.sort === 'n'){
                $scope.getListN();
                console.log("word changed, getlistN");
            }
            if($scope.order === 'a'){
                $scope.getListA();
                console.log("word changed, getlistA");
            } else if($scope.order === 'd'){
                $scope.getListD();
                console.log("word changed, getlistD");
            }
        }
    })
    
    
    $http.get("data/imdb250.json")
    .then(function(response){
        
        galleryService.movielist = response.data;
        galleryService.movielength = response.data.length;
        
        $scope.movielist = galleryService.movielist;
        $scope.movielength = galleryService.movielength;
        
        $scope.ready = 1;
        if($scope.sort === 'r'){
            $scope.getListR();
            //console.log("sort changed, getlistR");
        }else if($scope.sort === 'n'){
            $scope.getListN();
            //console.log("sort changed, getlistN");
        }
        if($scope.order === 'a'){
            $scope.getListA();
            //console.log("sort changed, getlistA");
        } else if($scope.order === 'd'){
            $scope.getListD();
            //console.log("sort changed, getlistD");
        }
        
    });
    
    
    $scope.getListR = function(){
        
       //console.log($scope.movie);
        //console.log(titleList);
       //$scope.resultList =  $filter('filter')({$scope.movielist: }, $scope.movie);
        
        var i;
        //console.log("curr movie "+ $scope.movie);
        //console.log($scope.movielist[0]);
        var titlelen = $scope.movie.length;
        $scope.resultList = [];
        for(i=0; i<$scope.movielength; i++){
            
            var currindex = 0;
            var targetmovie = $filter('lowercase')($scope.movielist[i].title);
            //console.log(targetmovie);
            while(currindex+titlelen <= targetmovie.length){
                var currstring = targetmovie.substring(currindex, currindex+titlelen);
                if(currstring === $filter('lowercase')($scope.movie)){
                     $scope.resultList.push($scope.movielist[i]);

                    currindex++;
                    break;
                }
                currindex++;
            }
        }
    }
    $scope.getListN = function(){
        
        var i;
        //console.log("curr movie "+ $scope.movie);
        //console.log($scope.movielist[0]);
        var titlelen = $scope.movie.length;
        $scope.resultList = [];
        for(i=0; i<$scope.movielength; i++){
            
            var currindex = 0;
            var targetmovie = $filter('lowercase')($scope.movielist[i].title);
            //console.log(targetmovie);
            while(currindex+titlelen <= targetmovie.length){
                var currstring = targetmovie.substring(currindex, currindex+titlelen);
                if(currstring === $filter('lowercase')($scope.movie)){
                     $scope.resultList.push($scope.movielist[i]);

                    currindex++;
                    break;
                }
                currindex++;
            }
        }
        var temp = $scope.resultList;
        var titleList = [];
        for(i=0; i<$scope.resultList.length; i++){
            titleList.push($scope.resultList[i].title);
        }
        
        $scope.resultList=$filter('orderBy')(temp, 'title', false);
        
    }
    $scope.getListA = function(){
        if($scope.sort === "r"){
            var i;
            var titlelen = $scope.movie.length;
            $scope.resultList = [];
            for(i=$scope.movielength-1; i>=0; i--){

                var currindex = 0;
                var targetmovie = $filter('lowercase')($scope.movielist[i].title);

                while(currindex+titlelen <= targetmovie.length){
                    var currstring = targetmovie.substring(currindex, currindex+titlelen);
                    if(currstring === $filter('lowercase')($scope.movie)){
                        $scope.resultList.push($scope.movielist[i]);
                        currindex++;
                        break;
                    }
                    currindex++;
                }
            }
        } else if($scope.sort === "n"){
            console.log("get here");
            var i;
            //console.log("curr movie "+ $scope.movie);
            //console.log($scope.movielist[0]);
            var titlelen = $scope.movie.length;
            $scope.resultList = [];
            for(i=0; i<$scope.movielength; i++){

                var currindex = 0;
                var targetmovie = $filter('lowercase')($scope.movielist[i].title);
                //console.log(targetmovie);
                while(currindex+titlelen <= targetmovie.length){
                    var currstring = targetmovie.substring(currindex, currindex+titlelen);
                    if(currstring === $filter('lowercase')($scope.movie)){
                         $scope.resultList.push($scope.movielist[i]);

                        currindex++;
                        break;
                    }
                    currindex++;
                }
            }
            var temp = $scope.resultList;
            $scope.resultList=$filter('orderBy')(temp, 'title', true);
            console.log($scope.resultList);
            
        }
    }
    $scope.getListD = function(){
        if($scope.sort === "r")
                $scope.getListR();
        else if($scope.sort === "n")
                $scope.getListN();
    }
    $scope.getSrc = function(id){
        var realSrc = "data/images/"+id+".jpg";
        //console.log(realSrc);
        return realSrc;
    }
    $scope.afterSelected = function(movieSelected){
        $scope.selected = movieSelected;
        selectedService.movielist = $scope.resultList;
        selectedService.selected = $scope.selected;
        var path = "details/" + movieSelected.title;
        console.log("path: " + path);
        $location.path(path);
    }
}]);

app.controller("galleryController", ['$scope', '$http', '$filter', '$routeParams', '$sce', '$location','movienameService', 'galleryService', 'selectedService', function($scope, $http, $filter, $routeParams, $sce,$location, movienameService, galleryService, selectedService){
    $scope.movielist = galleryService.movielist;
    $scope.movielength = galleryService.movielength;
    $scope.genre = $routeParams.genre || '';
    
    $scope.resultList = [];
    
    $scope.convert = function (array){
        return array.toString();
        
    }
    $scope.genreList = ["All", "Crime", "Drama", "Action", "Thriller", "Biography", "History", "Western", "Adventure", "Fantasy", "Romance", "Mystery", "Sci-Fi", "Family", "Comedy", "War", "Animation", "Horror", "Music", "Film-Noir", "Musical", "Sport"];
    $scope.getdata = function(){
        $http.get("data/imdb250.json")
        .then(function(response){

            galleryService.movielist = response.data;
            galleryService.movielength = response.data.length;
            console.log(galleryService.movielength);
            $scope.movielist = galleryService.movielist;
            $scope.movielength = galleryService.movielength;
            if($routeParams.genre === undefined)
                $scope.resultList = $scope.movielist;
            else
                $scope.filterbygenre();
            
            
            
        });
    }
    
    $scope.filterbygenre = function(){
        $scope.resultList = [];
        if($scope.genre === 'All'){
                console.log("got here");
               $scope.resultList = $scope.movielist;
               return;
        }
        for(i=0; i<$scope.movielength; i++){
            var genres = $scope.movielist[i].genre;
            
            for(j=0; j<genres.length; j++){
                if(genres[j] === $scope.genre){
                    $scope.resultList.push($scope.movielist[i]);
                    break;
                }
            }
            
        }
    }
    $scope.getSrc = function(id){
        var realSrc = "data/images/"+id+".jpg";
        return realSrc;
    }
    console.log($scope.movielength === 0);
    if($scope.movielength === 0){
        $scope.getdata();
        
        
    } else{
    
         if($routeParams.genre === undefined)
            $scope.resultList = $scope.movielist;
        else
            $scope.filterbygenre();
    }
    
    $scope.afterSelected = function(movieSelected){
        $scope.selected = movieSelected;
        selectedService.movielist = $scope.resultList;
        selectedService.selected = $scope.selected;
        var path = "details/" + movieSelected.title;
        $location.path(path);
    }
    $scope.getGenre = function(){
        for(i=0; i<$scope.movielength; i++){
            var curr = $scope.movielist[i].genre;
            
            for(j=0; j<curr.length; j++){
                if($scope.genreList.indexOf(curr[j]) === -1)
                    $scope.genreList.push(curr[j]);
            }
        }
    }
}]);

app.controller("detailsController", ['$scope', '$http', '$filter',  '$routeParams', '$sce', 'movienameService', 'galleryService', 'selectedService', function($scope, $http, $filter,  $routeParams, $sce, movienameService, galleryService, selectedService){
    $scope.movielist = galleryService.movielist;
    $scope.movielength = galleryService.movielength;
    $scope.convert = function (array){
        return array.toString();
        
    }
    
    $scope.getdata = function(){
        $http.get("data/imdb250.json")
        .then(function(response){

            galleryService.movielist = response.data;
            galleryService.movielength = response.data.length;
            $scope.movielist = galleryService.movielist;
            $scope.movielength = galleryService.movielength;
            $scope.selected = selectedService.selected|| $scope.movielist[0];
            
        });
    }
    if($scope.movielength === 0)
        $scope.getdata();
    else 
        $scope.selected = selectedService.selected|| $scope.movielist[0];   
   
    
   
    $scope.nextMovie = function(){
        var i = $scope.selected.rank;
        if(i == 250)
            $scope.selected = $scope.movielist[i-1];
        else
            $scope.selected = $scope.movielist[i];
        /*for(var i=0; i<$scope.movielength-1; i++){
            if($scope.selected.rank === $scope.movielist[i].rank){
                console.log($scope.selected.rank);
                console.log($scope.movielist[i+1]);
                $scope.selected = $scope.movielist[i+1];
                break;   
            }
        }*/
    }
    
    $scope.preMovie = function(){
        var i = $scope.selected.rank;
        if(i == 1)
            $scope.selected = $scope.movielist[i-1];
        else
            $scope.selected = $scope.movielist[i-2];
    }
    
    
    $scope.goback = function(){
        history.back();
    }
    $scope.getSrc = function(id){
        //console.log("id: "+id)
        if(id === undefined)
            return undefined;
        var realSrc = "data/images/"+id+".jpg";
        return realSrc;
    }
}]);