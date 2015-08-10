var scodaFacesApp = angular.module('scodaFacesApp', ['ngRoute']);

// Configure the routing. The $routeProvider will be
// automatically injected into the configurator.
scodaFacesApp.config(
    function( $routeProvider ){

        $routeProvider
            .when(
                "/", //Members
                {
                   controller: 'MembersCtrl',
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
  function($scope, $http){
    //The spreadsheet loaded as default
    $scope.spreadsheet = "1l8HkzCSeEiyzjFALpmOq5sFlfx514vkP7liM8Tjxt4w";
    $scope.itemsList = {'members':[],'groups':[]};
    $scope.get_data = function(spreadsheet, worksheet, type){      
      // Using the http class to fetch data.
      $http({
        url: 'https://spreadsheets.google.com/feeds/list/'+spreadsheet+'/'+worksheet+'/public/values?alt=json',
        method: "GET"
      })
      .then(function(response) {
        // On success, put the response into the $scope.summary variable. 
        $scope.summary = response;        
        //load the first list with all the members.         
        for (i = 0; i < $scope.summary.data.feed.entry.length; i++) { 
            $scope.itemsList[type].push($scope.summary.data.feed.entry[i]);
        }
      }
    );
  }
  
  //load default spreadsheet the first time the page and controller are loaded.   
  $scope.get_data($scope.spreadsheet,2,'members'); // Load members worksheet
  $scope.get_data($scope.spreadsheet,1,'groups'); // Load groups worksheet


});

scodaFacesApp.controller('MembersCtrl', 
    function($scope, $routeParams){    
    $scope.memberList = $scope.itemsList['members'];
});


scodaFacesApp.controller('GroupsCtrl', 
    function($scope){
    $scope.groupList = $scope.itemsList['groups'];
    console.log($scope.groupList)
});

// Member profile 
scodaFacesApp.controller('MemberCtrl', 
  function($scope, $routeParams){    
    $scope.member = $scope.itemsList['members'][$routeParams.id];
});

// Group profile 
scodaFacesApp.controller('GroupCtrl',
  function($scope, $routeParams){    
    $scope.group = $scope.itemsList['groups'][$routeParams.id];
});