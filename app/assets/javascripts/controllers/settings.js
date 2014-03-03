var SettingsCtrl = function ($scope, $rootScope, $modalInstance) {
  $scope.tempConfig = clone($rootScope.config);
  $scope.ok = function () {
    $modalInstance.close($scope.tempConfig);
  };

  $scope.cancel = function () {
    $scope.tempConfig = [];
    $modalInstance.dismiss('cancel');
  };
};
