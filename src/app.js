var scodaFacesApp = angular.module('scodaFacesApp', ['ngRoute']);

// Configure the routing. The $routeProvider will be
// automatically injected into the configurator.
scodaFacesApp.config(
    function( $routeProvider ){

        $routeProvider
            .when(
                "/", //Members
                {
                   controller: 'MainCtrl',
                   templateUrl: 'templates/member-list.html'
                }
            )
            .when(
                "/member/:id",
                {
                    controller: 'MemberCtrl',
                    templateUrl: 'templates/member.html'
                }
            )
            .when(
                "/groups", //Groups
                {
                   controller: 'GroupsCtrl',
                   templateUrl: 'templates/group-list.html'
                }
            )
            .when(
                "/group/:id",
                {
                    controller: 'GroupCtrl',
                    templateUrl: 'templates/group.html'
                }
            )
        ;

    }
);


// Faces of School of Data main Angularjs controller. 
scodaFacesApp.controller('MainCtrl', 
  function($scope,$http){
    //The spreadsheet loaded as default
    $scope.spreadsheet = "1l8HkzCSeEiyzjFALpmOq5sFlfx514vkP7liM8Tjxt4w";
    $scope.get_data = function(spreadsheet){      
      // Using the http class to fetch data.
      $http({
        url: 'https://spreadsheets.google.com/feeds/list/'+spreadsheet+'/1/public/values?alt=json',
        method: "GET"
      })
      .then(function(response) {
        // On success, put the response into the $scope.summary variable. 
        $scope.summary = response;        
        //Reset the members lists. 
        $scope.members = [];
        //load the first list with all the members.         
        for (i = 0; i < $scope.summary.data.feed.entry.length; i++) { 
            $scope.members.push($scope.summary.data.feed.entry[i]);
        }
      }
    );
  }
  //load default spreadsheet the first time the page and controller are loaded.   
  $scope.get_data($scope.spreadsheet);

});


// Groups 
scodaFacesApp.controller('GroupsCtrl', 
  function($scope,$http){
    //The spreadsheet loaded as default
    $scope.spreadsheet = "1l8HkzCSeEiyzjFALpmOq5sFlfx514vkP7liM8Tjxt4w";
    $scope.get_data = function(spreadsheet){
      // Using the http class to fetch data. 
      $http({
        url: 'https://spreadsheets.google.com/feeds/list/'+spreadsheet+'/2/public/values?alt=json',
        method: "GET"
      })
      .then(function(response) {        
        // On success, put the response into the $scope.summary variable. 
        $scope.summary = response;
        //Reset the members lists. 
        $scope.groupList = [];
        //load the first list with all the groups.         
        for (i = 0; i < $scope.summary.data.feed.entry.length; i++) { 
            $scope.groupList.push($scope.summary.data.feed.entry[i]);
        }
      }
    );
  }
  //load default spreadsheet the first time the page and controller are loaded.   
  $scope.get_data($scope.spreadsheet);
  console.log($scope.groupList);

});

// Member profile 
scodaFacesApp.controller('MemberCtrl', 
  function($scope, $route, $routeParams){
    
    var member = $scope.members[$routeParams.id];

    $scope.name = member.gsx$name.$t;
    $scope.photo = member.gsx$photo.$t;
    $scope.group = member.gsx$group.$t;

});

// Group profile 
scodaFacesApp.controller('GroupCtrl', 
  function($scope, $route, $routeParams){
    
    console.log($scope.groupList);

});