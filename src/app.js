var scodaFacesApp = angular.module(
  'scodaFacesApp', [
    'ngRoute'
  ]);

// Configure the routing. The $routeProvider will be
// automatically injected into the configurator.
scodaFacesApp.config(
    function($routeProvider){

        $routeProvider
            .when(
                "/", //Default
                {
                   controller: 'MainCtrl',
                   templateUrl: 'templates/default.html'
                }
            )
            .when(
                "/members", //Members
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
scodaFacesApp.controller('MainCtrl', function($scope, $http, data){

});

scodaFacesApp.controller('MembersCtrl', function($scope, $routeParams, data){
scodaFacesApp.controller('MembersCtrl', function($scope, $routeParams, $http, data){

    var map = L.map('map', {
        center: [25.505, -0.09],
        zoom: 2,
        dragging: false,
        zoomControl: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        continuousWorld: false,
        // this option disables loading tiles outside of the world bounds.
        noWrap: true
    }).addTo(map);


    data.members(function(err, members) {
        console.log(members);
        $scope.members = members;
        members.forEach(function(member) {
            $http.get('http://nominatim.openstreetmap.org/search?city=' + member.city + '&format=json').then(function(response) {
                L.marker([parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)]).addTo(map)
                    .bindPopup(member.city + ', ' + member.country);
            })
        })
    })
});


scodaFacesApp.controller('GroupsCtrl', 
    function($scope){
    $scope.groupList = $scope.itemsList['groups'];
});

// Member profile 
scodaFacesApp.controller('MemberCtrl', 
  function($scope, $routeParams, data){
      data.members(function(err,members) {
          $scope.member = members[$routeParams.id];
      });
});

// Group profile 
scodaFacesApp.controller('GroupCtrl',
  function($scope, $routeParams){    
    $scope.group = $scope.itemsList['groups'][$routeParams.id];
});

scodaFacesApp.factory('data', function($http) {
    var spreadsheet = "1n03jx2PcTbJHCHgQU9KSJl4xX0ffpJo3uXoU7X-JjBs";
    var worksheet = 1;
    var loaded_members = null;
    return {
        members: function (cb) {
            if (!loaded_members) {
                $http({
                    url: 'https://spreadsheets.google.com/feeds/list/' + spreadsheet + '/' + worksheet + '/public/values?alt=json',
                    method: "GET"
                })
                    .then(function (response) {
                        var members = [];
                        var entries = response.data.feed.entry;
                        for (var i = 0; i < entries.length; i++) {
                            var currentMember = entries[i];
                            members.push({
                                timestamp: currentMember.gsx$timestamp.$t,
                                name: currentMember.gsx$fullname.$t,
                                city: currentMember.gsx$yourcityofresidence.$t,
                                country: currentMember.gsx$yourcountryofresidence.$t,
                                bio: currentMember.gsx$shortbiography.$t,
                                quote: currentMember.gsx$personalquote.$t,
                                chapter: currentMember.gsx$thelocalschoolofdatainstanceyouarepartof.$t,
                                chapter_web: currentMember.gsx$linktothewebsiteoftheschoolofdatainstance.$t,
                                organisation: currentMember.gsx$nameoftheorganisationhostingtheschoolofdatainstance.$t,
                                organisation_web: currentMember.gsx$linktothewebsiteofthehostorganisation.$t,
                                twitter: currentMember.gsx$linktoyourtwitterprofile.$t,
                                web: currentMember.gsx$linktoyourpersonalwebsite.$t,
                                language: currentMember.gsx$thelanguagesyouspeak.$t,
                                is_trainer: currentMember.gsx$haveyoueverfacilitateddataworkshopsasatrainer.$t,
                                is_data_wrangler: currentMember.gsx$doyouregularlyworkwithdata.$t,
                                data_wrangler_context: currentMember.gsx$ifyesinwhichcontext.$t,
                                skill_scout: currentMember.gsx$rateyourskillsscout.$t,
                                skill_engineer: currentMember.gsx$rateyourskillsengineer.$t,
                                skill_analyst: currentMember.gsx$rateyourskillsanalyst.$t,
                                skill_designer: currentMember.gsx$rateyourskillsdesigner.$t,
                                skill_storyteller: currentMember.gsx$rateyourskillsstoryteller.$t,
                                skill_data_pipeline: currentMember.gsx$whatarethetwopartsofthedatapipelinewhereyouhavethemostexperience.$t.split(','),
                                specialty: currentMember.gsx$yourtopicsofspeciality.$t,
                                is_fellow: currentMember.gsx$areyouacurrentorformerfellow.$t
                            });
                        }
                        loaded_members = members;
                        cb(null, members);
                    });
            }
            else {
                return cb(null,loaded_members);
            }
        }
    }
});