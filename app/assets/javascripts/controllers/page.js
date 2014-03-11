notepuddingApp.controller('PageCtrl', ['$scope', '$rootScope', '$timeout', '$modal', '$http', '$log',
  function ($scope, $rootScope, $timeout, $modal, $http, $log) {
    var textN            = 0,
        user             = getUser(),
        alertTimeoutTime = 8000,
        lastPath         = {x1: null, y1: null, x2: null, y2: null},
        begCp            = {x:null, y:null},
        endCp;

    $scope.aCps = [];
    $scope.bCps = [];
    $rootScope.maxPages       = 80;
    $scope.pages              = [];
    $scope.alerts             = [];
    $scope.moveTarget         = null;
    $scope.shouldActivateDraw = "neutral";
    $scope.drawingPaths       = [];
    $scope.pathIndex          = 0;

    if (!$.isEmptyObject(user)) {
      $scope.userSignedIn = true;
      $scope.pages = user.pages;
    }
    else {
      $scope.userSignedIn = false;
      $scope.pages[0]     = defaultPage();
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
      if ($scope.currentPage.textareas.length > 0)
        $scope.pages[$scope.currentPageIdx] = clone($scope.currentPage);
      $http.post('/save_page', {
        pages_dump: $scope.pages
      }).success(function(data) {
        timeoutAlert({type: "success", info: "Saved pages successfully"});
      }).error(function(data) {
        timeoutAlert({type: "danger", info: "Could not save pages"});
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

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.signUpIn = function() {
      var modalInstance = $modal.open({
        templateUrl: 'sign_up_in.html',
        controller: 'SignUpInCtrl'
      });

      modalInstance.result.then(function (user) {
        $scope.pages[$scope.currentPageIdx] = clone($scope.currentPage);
        $http.post('/users/sign_in', {
          user: {
            email: user.email,
            password: user.password,
            remember_me: 1
          },
          pages_dump: $scope.pages
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
          timeoutAlert({type: 'success', info: data.info});
      }).error(function (data) {
          timeoutAlert({type: 'danger', info: 'Could not sign out user: ' + data});
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
    
    $scope.move = function(event) {
      if ($scope.isMoving && $scope.moveTarget != null) {
        var x = getX(event) - 5,
            y = getY(event) - 16;
        $scope.currentPage.textareas[$scope.moveTarget].divStyle = { top: y + "px", left: x + "px" };
      }
    };

    $scope.moveTheTarget = function($index) {
      $scope.isMoving = true;
      $scope.moveTarget = $index;
    };

    $scope.stopMoveTarget = function() {
      $scope.isMoving = false;
      $scope.moveTarget = null;
    };

    $scope.startDrawingTimer = function() {
      $scope.shouldActivateDraw = "neutral";
      $timeout(function() {
        if ($scope.shouldActivateDraw == "neutral")
          $scope.shouldActivateDraw = "ready";
      }, 100, false);
    }

    $scope.addContent = function(event) {
      if (jQuery.inArray($scope.shouldActivateDraw, ["neutral", "notready"]) != -1) {
        $scope.shouldActivateDraw = "notready";
        addText(event, $scope, textN++);
      }
    };
    
    $scope.stopDrawing = function() {
      $scope.shouldActivateDraw = "notready";
      if ($scope.drawingPaths[$scope.pathIndex] != undefined)
        $scope.pathIndex++;
    }

    $scope.freehand = function(event) {
      var x, y, ax, ay, bx, by, cps, resultString;
      if ($scope.shouldActivateDraw == "ready") {
        x = getX(event),
        y = getY(event);
        $scope.drawingPaths[$scope.pathIndex] = "M " + x + " " + y + "\n";
        lastPath.x1 = x, lastPath.y1 = y;
        $scope.shouldActivateDraw = "drawing";
      }
      else if ($scope.shouldActivateDraw == "drawing") {
        x = getX(event),
        y = getY(event);
        $scope.drawingPaths[$scope.pathIndex] += "L" + x + ", " + y + " ";
        // if (lastPath.x2 != null && lastPath.y2 != null) {
          // // Subtract middle vertex from first and last vertex.
          // // Then we do the calculations, assuming middle vertex is (0,0)
          // $log.info("All points: " + [lastPath.x1, lastPath.y1, lastPath.x2, lastPath.y2, x, y].join(", "));
          // ax = lastPath.x1 - lastPath.x2,
          // ay = lastPath.y1 - lastPath.y2,
          // bx = x           - lastPath.x2,
          // by = y           - lastPath.y2;

          // cps = calcControlPoints(ax,ay,bx,by);

          // cps = {
            // b: {x: cps.a.x + lastPath.x2, y: cps.a.y + lastPath.y2},
            // a: {x: cps.b.x + lastPath.x2, y: cps.b.y + lastPath.y2}
          // };

          // if (begCp.x == null) {
            // $log.info("I only happen the first time.");
            // begCp = {x: lastPath.x1, y: lastPath.y1};
          // }
          // endCp = cps.a;

          // resultString = "C" + begCp.x + " " + begCp.y + ", " + endCp.x + " " + endCp.y + ", " + lastPath.x2 + " " + lastPath.y2 + "\n";

          // begCp = cps.b;

          // $scope.drawingPaths[$scope.pathIndex] += resultString;
          // // $scope.aCps.push(cps.a);
          // // $scope.bCps.push(cps.b);

          // lastPath.x1 = lastPath.x2;
          // lastPath.y1 = lastPath.y2;
          // lastPath.x2 = x;
          // lastPath.y2 = y;
        // }
        // else {
          // lastPath.x2 = x;
          // lastPath.y2 = y;
        // }
      }

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
      var target = $(event.delegateTarget);
      $scope.currentPage.textareas[idx].textareaStyle.width  = target.outerWidth() + "px";
      $scope.currentPage.textareas[idx].textareaStyle.height = target.outerHeight() + "px";
    };

    timeoutAlert = function(newAlert) {
      idx = $scope.alerts.push(newAlert) - 1;
      $timeout(function() { $scope.closeAlert(idx); }, alertTimeoutTime, true);
    };
  }
]);

function getX(event) {
  return event.pageX - event.delegateTarget.offsetLeft;
}

function getY(event) {
  return event.pageY - event.delegateTarget.offsetTop;
}

function addText (event, $scope, n) {
  if ($scope.currentPage.textareas == null)
    $scope.currentPage.textareas = []
  var x = getX(event),
      y = getY(event);
  if (90 < x && x < 140) x = 100;
  if (50 < y)            y = Math.round(y/30) * 30 + 5;
  $scope.currentPage.textareas.push({
    id: n,
    divStyle: {
      left: x + "px",
      top: y + "px",
    },
    textareaStyle: {
      width: "360px",
      height: "30px",
    },
    content: ""
  });
}

// function calcControlPoints(x1,y1,x2,y2) {
  // var radA = absAngle(x1,y1),
      // radB = absAngle(x2,y2),
      // bisect = (radA + radB) / 2,
      // difference = radB - radA,
      // bOverLimit = difference > Math.PI,
      // newBisect = bOverLimit ? bisect : bisect - Math.PI,
      // tanAB = newBisect + Math.PI/2,
      // r = 5,
      // ax = round(Math.cos(tanAB) * r),
      // ay = round(Math.sin(tanAB) * r),
      // bx = round(Math.cos(tanAB) * -r),
      // by = round(Math.sin(tanAB) * -r),
      // a, b;
  // a = {x: ax, y: ay},
  // b = {x: bx, y: by};

  // return {a: a, b: b};
// }

// // Finds absolute angle based on the atan calculation.
// // Depending on which quadrant the point is in, the direction of measurement changes.
// function absAngle(x, y) {
  // var angle;
  // if (x != 0) {
    // angle = Math.atan(y/x);
    // if      (x > 0 && y >= 0) angle += 0;
    // else if (x < 0 && y >= 0) angle += Math.PI;
    // else if (x < 0 && y < 0) angle += Math.PI;
    // else if (x > 0 && y < 0) angle += 0;
  // }
  // // If x is zero, the angle can either be 90 deg (pi/2) or 270 deg (3pi/2)
  // else angle = (y > 0) ? Math.PI/2 : (3*Math.PI)/2;

  // return angle;
// }

// function round(x) {
  // return Math.round(x);
// }

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
