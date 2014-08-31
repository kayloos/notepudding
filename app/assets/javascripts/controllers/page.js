'use strict';
notepuddingApp.controller('PageCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$log', 'pad', 'user', 'textarea', 'state', 'curve', 'action',
  function ($scope, $rootScope, $timeout, $http, $log, pad, user, textarea, state, curve, action) {
    $scope.pad        = pad;
    $scope.state      = state;
    $scope.textarea_s = textarea;
    $scope.curve      = curve;
    $scope.action     = action;

    $rootScope.alerts     = [];
    $rootScope.closeAlert = function(index) { $rootScope.alerts.splice(index, 1); };

    user.importUser(getUser());

    $timeout(function() { curve.save() }, 100, false);
  }
]);

function subtractPoints(p1, p2) {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}
