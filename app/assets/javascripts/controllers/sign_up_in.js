notepuddingApp.controller('SignUpInCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
  $scope.user = {};

  $scope.signUpIn = function() {
    $modalInstance.close($scope.user);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);
