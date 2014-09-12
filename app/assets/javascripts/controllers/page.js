'use strict';
notepuddingApp.controller('PageCtrl', ['$scope', '$rootScope', '$timeout', 'pad', 'user', 'textarea', 'state', 'curve', 'action',
  function ($scope, $rootScope, $timeout, pad, user, textarea, state, curve, action) {
    $scope.pad        = pad;
    $scope.state      = state;
    $scope.textarea_s = textarea;
    $scope.curve      = curve;
    $scope.action     = action;

    $rootScope.alerts     = [];
    $rootScope.closeAlert = function(index) { $rootScope.alerts.splice(index, 1); };

    user.import(getUser());
  }
]);

