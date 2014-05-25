notepuddingApp.controller('SettingsCtrl',
    ['$scope', '$rootScope', '$modalInstance', 'userControls',
    function ($scope, $rootScope, $modalInstance, userControls) {

  $scope.tempConfig = pen.clone($rootScope.config);

  $scope.ok = function () {
    $modalInstance.close($scope.tempConfig);
  };

  $scope.cancel = function () {
    $scope.tempConfig = [];
    $modalInstance.dismiss('cancel');
  };
}]);
