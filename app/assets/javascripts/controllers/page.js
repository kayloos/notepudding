notepuddingApp.controller('PageCtrl', ['$scope', '$rootScope', '$timeout', '$modal', '$http', '$log', 'pad',
  function ($scope, $rootScope, $timeout, $modal, $http, $log, pad) {
    var user              = getUser(),
        lastPath          = { x1: null, y1: null, x2: null, y2: null},
        distanceThreshold = 2,
        moveTarget        = null;

    $scope.pad = pad;

    $rootScope.alerts   = [];

    if (!$.isEmptyObject(user)) {
      $rootScope.userSignedIn = true;
      pad.pages = user.pages;
    }
    else {
      $rootScope.userSignedIn = false;
      pad.pages[0]        = defaultPage();
    }

    pad.currentPageIdx = pad.pages.length - 1;
    pad.currentPage    = pad.pages[pad.currentPageIdx];

    $rootScope.config = {
      style: {
        fontSize: "18px",
        fontFamily: "Helvetica Neue",
        width: "800px",
        backgroundColor: "#FFFFC3"
      }
    };

    $rootScope.closeAlert = function(index) { $rootScope.alerts.splice(index, 1); };
    
    $scope.move = function(event) {
      if ($scope.isMoving && moveTarget != null) {
        var x = pen.getX(event) - 5,
            y = pen.getY(event) - 16;
        pad.currentPage.textareas[moveTarget].divStyle = { top: y + "px", left: x + "px" };
      }
    };

    $scope.moveTheTarget = function($index) {
      $scope.isMoving = true;
      moveTarget = $index;
    };

    $scope.stopMoveTarget = function() {
      $scope.isMoving = false;
      moveTarget = null;
    };

    $scope.textListener = function(event, id) {
      // $timeout logic due to a problem with angular (blur gets called synchronously and collides with keydown)
      // source: http://stackoverflow.com/questions/18389527/angularjs-submit-on-blur-and-blur-on-keypress
      var target = event.target || event.srcElement;
      if (event.keyCode == 27) $timeout(function () { target.blur() }, 0, false);
    };

    $scope.removeIfEmpty = function(event, idx) {
      var target = event.target || event.srcElement;
      if ($(target).val() == "") pad.currentPage.textareas.splice(idx, 1);
    };

    // When resizing using the browser we want the new size of the textarea to persist.
    $scope.rememberDimensions = function(event, idx) {
      var target = $(event.delegateTarget);
      pad.currentPage.textareas[idx].textareaStyle.width  = target.outerWidth() + "px";
      pad.currentPage.textareas[idx].textareaStyle.height = target.outerHeight() + "px";
    };

    actionState    = "neutral";
    emptyCurve = { lineString: "", points: [] }
    $scope.currentCurve   = emptyCurve;
    $scope.currentPathIdx = 0;
    $scope.curves         = [];

    $scope.startAction = function(event) {
      actionState = "drawing_temporary";

      $timeout(function() {
        if (actionState == "drawing_temporary")
          actionState = "drawing_permanent";
      }, 100, false);
    };

    $scope.endAction = function(event) {
      if (actionState == "drawing_temporary") {
        // Remove current curve
        // Add text field, ready for writing
        $scope.currentCurve = emptyCurve;
        addText(event, pad.textN++);
      }
      else if (actionState == "drawing_permanent") {
        // Save the current curve
        saveCurve();
      }
      actionState = "neutral"
    };

    $scope.freehand = function(event) {
      if (actionState == "drawing_temporary" || actionState == "drawing_permanent") {
        x = pen.getX(event),
        y = pen.getY(event);
        x0 = lastPath.x1, y0 = lastPath.y1;

        if (pen.distance(x, y, x0, y0) > distanceThreshold) {
          var startLetter = $scope.currentCurve.lineString.length > 0 ? "L" : "M"

          $scope.currentCurve.lineString += startLetter + x + ", " + y
          $scope.currentCurve.points.push({ x: x, y: y });

          lastPath.x1 = x, lastPath.y1 = y;
        }
      }
    };

    saveCurve = function() {
      // FIXME: Make a function that takes a list of points, and converts it into
      //        an svg-curve, that is smoothed using the smoothing calculations.
      console.log($scope.currentCurve.points);
      return undefined
    };

    addText = function(event, n) {
      if (pad.currentPage.textareas == null)
        pad.currentPage.textareas = []
      var x = pen.getX(event),
          y = pen.getY(event);
      if (90 < x && x < 140) x = 100;
      if (50 < y)            y = Math.round(y/30) * 30 + 5;
      pad.currentPage.textareas.push({
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
    };

  }
]);

function addText(event, n) {
  if (pad.currentPage.textareas == null)
    pad.currentPage.textareas = []
  var x = pen.getX(event),
      y = pen.getY(event);
  if (90 < x && x < 140) x = 100;
  if (50 < y)            y = Math.round(y/30) * 30 + 5;
  pad.currentPage.textareas.push({
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
};

