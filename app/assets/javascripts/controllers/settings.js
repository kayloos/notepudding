notepuddingApp.controller('SettingsCtrl', ['$scope', '$rootScope', '$modalInstance', function ($scope, $rootScope, $modalInstance) {
  $scope.tempConfig = pen.clone($rootScope.config);
  $scope.ok = function () {
    $modalInstance.close($scope.tempConfig);
  };

  $scope.cancel = function () {
    $scope.tempConfig = [];
    $modalInstance.dismiss('cancel');
  };
}]);
