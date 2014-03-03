notepuddingApp.controller('PageCtrl', function($scope, $rootScope, $timeout, $modal, $http, $log) {

  var textN           = 0;
  $rootScope.maxPages = 80;
  $scope.pages        = [];

  user = getUser();

  if (user.length > 0) {
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

  $scope.settings = function() {
    var modalInstance = $modal.open({
      templateUrl: 'settings.html',
      controller: SettingsCtrl
    });

    modalInstance.result.then(function (newConfig) {
      $rootScope.config = newConfig;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  $scope.signUpIn = function() {
    var modalInstance = $modal.open({
      templateUrl: 'sign_up_in.html',
      controller: SignUpInCtrl
    });

    modalInstance.result.then(function (user) {
      $http.post('/users/sign_in', {
        user: {
          email: user.email,
          password: user.password
        }
      }).success(function (data, status, header, config) {
        $log.info(data);
        // $log.info(status);
        // $log.info(header);
        // $log.info(config);
        // Data returned hsould include the users pages
      }).error(function (data, status, header, config) {
        $log.info(data);
        // $log.info(status);
        // $log.info(header);
        // $log.info(config);
        // Error messages
      });
      // User sign in result
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.signOut = function() {
    $http.delete('/users/sign_out')
      .success(function (data) {
        $scope.pages = [];
        $scope.pages[0] = {textareas: []};
        $scope.userSignIn = false;
        $log.info(data);
    }).error(function (data) {
        $log.info(data);
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
    if (event.keyCode == 27)
      $timeout(function () { target.blur() }, 0, false);
    
  }

  $scope.removeIfEmpty = function(event, idx) {
    var target = event.target || event.srcElement;
    if ($(target).val() == "")
      $scope.currentPage.textareas.splice(idx, 1);
  }

  // When resizing using the browser we want the new size of the textarea to persist.
  $scope.rememberDimensions = function(event, idx) {
    var target = event.target || event.srcElement;
    $scope.currentPage.textareas[idx].style.width = $(target).width() + "px";
    $scope.currentPage.textareas[idx].style.height = $(target).height() + "px";
  }
});

function addText (event, $scope, n) {
  var x,y;
  x = event.offsetX == undefined ? event.clientX - $(event.target).offset().left : event.offsetX
  y = event.offsetY == undefined ? event.clientY - $(event.target).offset().top : event.offsetY
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
