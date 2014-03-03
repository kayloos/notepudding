var SignUpInCtrl = function($scope, $modalInstance) {
  $scope.user = {};

  $scope.signUpIn = function() {
    $modalInstance.close($scope.user);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
