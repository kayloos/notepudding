notepuddingApp.controller('PageCtrl', ['$scope', '$rootScope', '$timeout', '$modal', '$http', '$log', 
function($scope, $rootScope, $timeout, $modal, $http, $log) {

  var textN           = 0;
  $rootScope.maxPages = 80;
  $scope.pages        = [];
  $scope.alerts       = [];
  alertTimeoutTime    = 8000;

  user = getUser();

  if (!$.isEmptyObject(user)) {
    $scope.userSignedIn = true;
    $scope.pages = user.pages;
  }
  else {
    $scope.userSignedIn = false;
    $scope.pages[0]     = {textareas: []};
  }
  $scope.currentPageIdx = $scope.pages.length - 1;
  $scope.currentPage    = clone($scope.pages[$scope.currentPageIdx]);

  $rootScope.config = {
    style: {
      fontSize: "18px",
      fontFamily: "Helvetica Neue",
      width: "800px",
      backgroundColor: "#FFFFC3"
    }
  };

  $scope.save = function() {
    $scope.pages[$scope.currentPageIdx] = clone($scope.currentPage);
    $http.post('/save_page', {
      pages_dump: $scope.pages
    }).success(function(data) {
      timeoutAlert({type: "success", info: "Saved pages successfully"});
    }).error(function(data) {
      timeoutAlert({type: "danger", info: "Could not save pages"});
    });
    // FIXME: Save page to users database
    //        1. Make rails action
    //        2. make $http.post(pages) that calls rails action
    //        3. handle response
    //        Remember to check if user is signed in or not.
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

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
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
          password: user.password
        }
      }).success(function (data, status, header, config) {
        if (data.type == "success") {
          $scope.pages = data.user.pages;
          $scope.currentPageIdx = $scope.pages.length - 1;
          $scope.currentPage = clone($scope.pages[$scope.currentPageIdx]);
          $scope.userSignedIn = true;
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
        $scope.pages = [];
        $scope.pages[0] = {textareas: []};
        $scope.currentPage = clone($scope.pages[0]);
        $scope.userSignedIn = false;
        $scope.alerts.push({type: 'success', info: data.info});
        $log.info(data);
    }).error(function (data) {
        $log.info(data);
        $scope.alerts.push({type: 'danger', info: 'Could not sign out user: ' + data});
    });
  };
  
  $scope.turnLeft = function() {
    if ($scope.currentPageIdx > 0) {
      $scope.pages[$scope.currentPageIdx] = clone($scope.currentPage);
      $scope.currentPage = clone($scope.pages[$scope.currentPageIdx - 1]);
      textN = $scope.currentPage.textareas.length;
      $scope.currentPageIdx--;
    }
  };

  $scope.turnRight = function() {
    if ($scope.currentPageIdx < $rootScope.maxPages - 1 && $scope.currentPage.textareas.length > 0) {
      $scope.pages[$scope.currentPageIdx] = clone($scope.currentPage);
      var nextPage = $scope.pages[$scope.currentPageIdx + 1];
      $scope.currentPage = nextPage ? clone(nextPage) : {textareas: [], idx: $scope.currentPageIdx + 1};
      textN = $scope.currentPage.textareas.length;
      $scope.currentPageIdx++;
    }
  };

  $scope.addContent = function(event) {
    addText(event, $scope, textN++);
  };

  $scope.textListener = function(event, id) {
    // $timeout logic due to a problem with angular (blur gets called synchronously and collides with keydown)
    // source: http://stackoverflow.com/questions/18389527/angularjs-submit-on-blur-and-blur-on-keypress
    var target = event.target || event.srcElement;
    if (event.keyCode == 27) $timeout(function () { target.blur() }, 0, false);
  };

  $scope.removeIfEmpty = function(event, idx) {
    var target = event.target || event.srcElement;
    if ($(target).val() == "") $scope.currentPage.textareas.splice(idx, 1);
  };

  // When resizing using the browser we want the new size of the textarea to persist.
  $scope.rememberDimensions = function(event, idx) {
    var target = event.target || event.srcElement;
    $scope.currentPage.textareas[idx].style.width = $(target).width() + "px";
    $scope.currentPage.textareas[idx].style.height = $(target).height() + "px";
  };

  timeoutAlert = function(newAlert) {
    idx = $scope.alerts.push(newAlert) - 1;
    $timeout(function() { $scope.closeAlert(idx); }, alertTimeoutTime, true);
  };
}]);

function addText (event, $scope, n) {
  var x,y;
  x = event.offsetX == undefined ? event.clientX - $(event.target).offset().left : event.offsetX
  y = event.offsetY == undefined ? event.clientY - $(event.target).offset().top : event.offsetY
  if (90 < x && x < 120) x = 100;
  if (50 < y)       y = Math.round(y/30) * 30 + 5;
  console.log(event.offsetX);
  $scope.currentPage.textareas.push({
    id: n,
    style: {
      "left": x + "px",
      "top": y + "px",
      "min-width": "360px",
      height: "30px",
    },
    content: ""
  });
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
