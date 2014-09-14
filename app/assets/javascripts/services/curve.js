'use strict';

notepuddingApp.factory('curve', ['pad', 'state', function(pad, state) {
  var stageDistanceThreshold  = 2;
  var commitDistanceThreshold = 5;
  var emptyCurve = function() { return { lineString: "", points: [] } };

  var subtractPoints = function(p1, p2) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
  };

  return {
    lastPath: { x1: null, y1: null, x2: null, y2: null},

    resetCurrent: function() {
      this.current = emptyCurve();
    },

    current: emptyCurve(),

    freehand: function(event) {
      if (state.action == "drawing_temporary" ||
          state.action == "drawing_permanent") {
        var x, y, x0, y0;
        x  = pen.getX(event);
        y  = pen.getY(event);
        x0 = this.lastPath.x1;
        y0 = this.lastPath.y1;

        var distance = pen.distance(x, y, x0, y0);

        if (distance > stageDistanceThreshold) {
          var startLetter = this.current.lineString.length > 0 ? "L" : "M";
          this.current.lineString += startLetter + x + ", " + y;
        }
        if (distance > commitDistanceThreshold) {
          this.current.points.push({ x: x, y: y });
          this.lastPath.x1 = x;
          this.lastPath.y1 = y;
        }
      }
    },

    save: function() {
      var curveString = "",
          prevEndCp   = "",
          i           = 1,
          currentPoint,
          prevPoint,
          nextPoint,
          targetPoint,
          cpA,
          cpB,
          result;

      while (i < this.current.points.length) {
        currentPoint = this.current.points[i];
        prevPoint    = this.current.points[i-1];
        nextPoint    = this.current.points[i+1];

        targetPoint = currentPoint.x + " " + currentPoint.y;

        // At the end of the array, we still want to add the last point
        if (nextPoint === undefined) {
          curveString += "C" + prevEndCp + ", " + targetPoint + ", "
                         + targetPoint + "\n";
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
        cpB          = (result.a.x + currentPoint.x) + " " +
                       (result.a.y + currentPoint.y);
        curveString += "C" + cpA + ", " + cpB + ", " + targetPoint + "\n";

        prevEndCp = (result.b.x + currentPoint.x) + " "
                    + (result.b.y + currentPoint.y);

        if (i >= this.current.points.length - 4)
          i += 1;
        else
          i += 3;
      }

      this.resetCurrent();

      if (pad.currentPage.curves == undefined)
        pad.currentPage.curves = [];

      if (curveString != "" && curveString != undefined)
        pad.currentPage.curves.push(curveString);
    }
  };
}]);

