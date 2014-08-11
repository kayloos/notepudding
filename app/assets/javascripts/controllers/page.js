notepuddingApp.controller('PageCtrl',
  ['$scope', '$rootScope', '$timeout', '$http', 'pad',
  function ($scope, $rootScope, $timeout, $http, pad) {
    var user              = getUser(),
        lastPath          = { x1: null, y1: null, x2: null, y2: null },
        distanceThreshold = 6,
        moveTarget        = null,
        resizeTarget      = null,
        emptyCurve        = { lineString: "", points: [] };

    $scope.pad        = pad;
    $rootScope.alerts = [];

    $scope.actionState  = "neutral";
    $scope.currentCurve = emptyCurve;

    $rootScope.config = {
      style: {
        fontSize:        "18px",
        fontFamily:      "Helvetica Neue",
        width:           "800px",
        backgroundColor: "#FFFFC3"
      }
    };

    pad.fillOutPage(user);

    $rootScope.closeAlert = function(index) {
      $rootScope.alerts.splice(index, 1);
    };

    $scope.moveAction = function(event) {
      if ($scope.actionState == "moving")
        move(event);
      if ($scope.actionState == "drawing_temporary" ||
          $scope.actionState == "drawing_permanent")
        freehand(event);
      if ($scope.actionState == "resizing")
        resize(event);
    };

    move = function(event) {
      event.preventDefault();

      target = pad.currentPage.textareas[moveTarget];
      if (moveTarget != null) {

        var x = pen.getX(event) + 8,
            y = pen.getY(event) + 7;

        target.divStyle = { top: y + "px", left: x + "px" };
      }
    };

    $scope.moveTheTarget = function($index) {
      $scope.actionState = "moving";
      moveTarget = $index;
    };

    $scope.textListener = function(event, id) {
      // $timeout logic due to a problem with angular (blur gets called
      // synchronously and collides with keydown) source:
      // http://stackoverflow.com/questions/18389527/angularjs-submit-on-blur-and-blur-on-keypress
      var target = event.target || event.srcElement;
      if (event.keyCode == 27) $timeout(function () {
        target.blur()
      }, 0, false);
    };

    $scope.removeIfEmpty = function(event, idx) {
      var target = event.target || event.srcElement;
      if ($(target).val() == "") pad.currentPage.textareas.splice(idx, 1);
    };

    $scope.startAction = function(event) {
      if ($scope.actionState != "neutral") return;

      $scope.actionState = "drawing_temporary";

      $timeout(function() {
        if ($scope.actionState == "drawing_temporary") {
          $scope.actionState = "drawing_permanent";
        }
      }, 200, false);
    };

    $scope.endAction = function(event) {
      if ($scope.actionState == "drawing_temporary") {
        // Remove current curve
        // Add text field, ready for writing
        $scope.currentCurve = emptyCurve;
        addText(event, pad.currentPage.textareas.length);
      }
      else if ($scope.actionState == "drawing_permanent") {
        // Save the current curve
        saveCurve();
      }
      else if ($scope.actionState == "moving") {
        moveTarget = null;
      }
      else if ($scope.actionState == "resizing") {
        resizeTarget = null;
      }

      $scope.actionState = "neutral"
    };

    freehand = function(event) {
      x = pen.getX(event),
      y = pen.getY(event);
      x0 = lastPath.x1, y0 = lastPath.y1;

      if (pen.distance(x, y, x0, y0) > distanceThreshold) {
        var startLetter = $scope.currentCurve.lineString.length > 0 ? "L" : "M"

        $scope.currentCurve.lineString += startLetter + x + ", " + y
        $scope.currentCurve.points.push({ x: x, y: y });

        lastPath.x1 = x, lastPath.y1 = y;
      }
    };

    saveCurve = function() {
      var curveString = "",
          prevEndCp = "",
          i = 1;

      while (i < $scope.currentCurve.points.length) {
        currentPoint = $scope.currentCurve.points[i];
        prevPoint    = $scope.currentCurve.points[i-1];
        nextPoint    = $scope.currentCurve.points[i+1];

        targetPoint = currentPoint.x + " " + currentPoint.y;

        // At the end of the array, we still want to add the last point
        if (nextPoint === undefined) {
          curveString += "C" + prevEndCp + ", "
                         + targetPoint + ", " + targetPoint + "\n";
          break;
        }

        if (prevEndCp === "") {
          cpA          = prevPoint.x + " " + prevPoint.y;
          curveString += "M " + cpA + "\n";
        }

        else {
          cpA = prevEndCp;
        }

        result       = pen.calcControlPoints(subtractPoints(prevPoint, currentPoint),
                                             subtractPoints(nextPoint, currentPoint));
        cpB          = (result.a.x + currentPoint.x) + " "
                       + (result.a.y + currentPoint.y);
        curveString += "C" + cpA + ", " + cpB + ", " + targetPoint + "\n";
        prevEndCp    = (result.b.x + currentPoint.x) + " "
                       + (result.b.y + currentPoint.y);

        if (i >= $scope.currentCurve.points.length - 4)
          i += 1;
        else
          i += 3;
      }

      $scope.currentCurve.lineString = "";
      $scope.currentCurve.points     = [];

      if (pad.currentPage.curves == undefined)
        pad.currentPage.curves = [];

      if (curveString != "" && curveString != undefined)
        pad.currentPage.curves.push(curveString);

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
          top:  y + "px",
        },
        textareaStyle: {
          width:  "360px",
          height: "30px",
        },
        content: ""
      });
    };

    resize = function(event) {
      event.preventDefault();

      target = pad.currentPage.textareas[resizeTarget];
      if (resizeTarget != null) {

        var x = pen.getX(event),
            y = pen.getY(event);

        var tx, ty, rx, ry;

        tx = target.divStyle.top;
        ty = target.divStyle.left;

        tx = tx.substring(0, tx.length-2);
        ty = ty.substring(0, ty.length-2);

        rx = (x - tx) + "px";
        ry = (y - ty) + "px";
        console.log(x);
        console.log(y);
        console.log(tx);
        console.log(ty);
        console.log(rx);
        console.log(ry);

        target.textareaStyle.height = ry;
        target.textareaStyle.width  = rx;
      }
    };

    $scope.resizeElement = function(index) {
      $scope.actionState = "resizing";
      resizeTarget       = index;
    };
  }
]);

function subtractPoints(p1, p2) {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}
