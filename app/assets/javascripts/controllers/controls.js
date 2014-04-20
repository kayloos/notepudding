notepuddingApp.controller('ControlsCtrl',
    ['$scope', '$rootScope', '$modal', '$http', '$timeout', '$log', 'pad',
    function ($scope, $rootScope, $modal, $http, $timeout, $log, pad) {

  $scope.save = function() {
    $http.post('/save_page', {
      pages_dump: pad.pages
    }).success(function(data) {
      timeoutAlert({ type: "success", info: "Saved pages successfully" });
    }).error(function(data) {
      timeoutAlert({ type: "danger", info: "Could not save pages" });
    });
  };

  $scope.signUpIn = function() {
    var modalInstance = $modal.open({
      templateUrl: 'sign_up_in.html',
      controller: 'SignUpInCtrl'
    });

    modalInstance.result.then(function (user) {
      $http.post('/users/sign_in', {
        user: {
          email: user.email,
          password: user.password,
          remember_me: 1
        },
        pages_dump: pad.pages
      }).success(function (data, status, header, config) {
        if (data.type == "success") {
          pad.pages = data.user.pages;
          pad.currentPageIdx = pad.pages.length - 1;
          pad.currentPage = pad.pages[pad.currentPageIdx];
          $rootScope.userSignedIn = true;
        }
        timeoutAlert({type: data.type, info: data.info});
      }).error(function (data, status, header, config) {
        timeoutAlert({type: data.type, info: data});
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.signOut = function() {
    $http.delete('/users/sign_out')
      .success(function (data) {
        pad.pages = [];
        pad.pages[0] = {textareas: []};
        pad.currentPage = pad.pages[0];
        $rootScope.userSignedIn = false;
        timeoutAlert({type: 'success', info: data.info});
    }).error(function (data) {
        timeoutAlert({type: 'danger', info: 'Could not sign out user: ' + data});
    });
  };

  $scope.settings = function() {
    var modalInstance = $modal.open({
      templateUrl: 'settings.html',
      controller: 'SettingsCtrl'
    });

    modalInstance.result.then(function (newConfig) {
      $rootScope.config = newConfig;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.turnLeft = function() {
    if (pad.currentPageIdx > 0) {
      pad.currentPageIdx--;
      pad.currentPage = pad.pages[pad.currentPageIdx];
    }
  };

  $scope.turnRight = function() {
    if (pad.currentPageIdx < pad.maxPages - 1 &&
        (pad.currentPage.textareas && pad.currentPage.textareas.length > 0) ||
        (pad.currentPage.curves    && pad.currentPage.curves.length > 0)) {
      pad.currentPageIdx++;
      if (!pad.pages[pad.currentPageIdx]) {
        pad.pages[pad.currentPageIdx] = { textareas: [], curves: [], idx: pad.currentPageIdx };
      }
      pad.currentPage = pad.pages[pad.currentPageIdx];
    }
  };

  // Might be usable by other components wanting to send a message:
  // Refactor into alert service
  timeoutAlert = function(newAlert) {
    idx = $rootScope.alerts.push(newAlert) - 1;
    $timeout(function() { $rootScope.closeAlert(idx); }, 8000, true);
  };
}]);
