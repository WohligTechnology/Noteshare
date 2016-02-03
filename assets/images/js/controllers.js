angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('HomeCtrl', function($scope, $ionicPlatform, $http,$stateParams) {
  var id = $stateParams.id;
  function onSuccess(data, status) {
    console.log(data);
    $scope.note = data;
    _.each($scope.note.noteelements, function(n) {
      if(n.type == "image" || n.type == "scribble" ) {
        n.content = adminURL + "user/getmedia?file=" + n.content;
      }
      if (n.type == "checkbox") {
        if (n.contentA == "true") {
          n.contentA = true;
        } else {
          n.contentA = false;
        }
      }
    });
  }
  $http.post(adminURL+"note/findbyid", {
    "note": id
  }).success(onSuccess);
});
