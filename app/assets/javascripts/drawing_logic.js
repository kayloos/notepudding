test = {
  calcControlPoints: {
    testAll: function() {
      fromLeft  = test.calcControlPoints.testStraightLineFromLeft();
      console.log("-180 degs: " + fromLeft);

      fromRight = test.calcControlPoints.testStraightLineFromRight();
      console.log("180 degs: " + fromRight);

      ninety    = test.calcControlPoints.test90();
      console.log("90 degs: " + ninety);

      fortyfive    = test.calcControlPoints.test45();
      console.log("45 degs:: " + fortyfive);

      tmp    = test.calcControlPoints.test135();
      console.log("2nd quadrant degs: " + tmp);

      tmp    = test.calcControlPoints.testStump();
      console.log("135 stump: " + tmp);

      tmp    = test.calcControlPoints.test225();
      console.log("225: " + tmp);

      return "test ran";
    },
    testStraightLineFromLeft: function() {
      // with radfactor 1
      a = { x: -8, y: 0 };
      b = { x: 8, y: 0 };
      result = pen.calcControlPoints(a, b);

      expectA = result.a.x == a.x && result.a.y == a.y;
      expectB = result.b.x == b.x && result.b.y == b.y;

      return expectA && expectB;
    },
    testStraightLineFromRight: function() {
      // with radfactor 1
      a = { x: 8, y: 0 };
      b = { x: -8, y: 0 };
      result = pen.calcControlPoints(a, b);

      expectA = result.a.x == a.x && result.a.y == a.y;
      expectB = result.b.x == b.x && result.b.y == b.y;

      return expectA && expectB;
    },
    test90: function() {
      a = { x: 8, y: 0 };
      b = { x: 0, y: 8 };
      result = pen.calcControlPoints(a, b);

      expectA = result.a.x == 6 && result.a.y == -6;
      expectB = result.b.x == -6 && result.b.y == 6;

      return expectA && expectB;
    },
    test45: function() {
      a = { x: 8, y: 0 };
      b = { x: 8, y: 8 };
      result = pen.calcControlPoints(a, b);

      expectA = result.a.x == 3 && result.a.y == -7;
      expectB = result.b.x == -4 && result.b.y == 10;

      return expectA && expectB;
    },
    test135: function() {
      a = { x: -8, y: 0 };
      b = { x: -8, y: 8 };
      result = pen.calcControlPoints(a, b);

      expectA = result.a.x == -3 && result.a.y == -7;
      expectB = result.b.x == 4 && result.b.y == 10;

      return expectA && expectB;
    },
    testStump: function() {
      a = { x: 8, y: 0 };
      b = { x: -8, y: 8 };
      result = pen.calcControlPoints(a, b);

      expectA = result.a.x == 7 && result.a.y == -3;
      expectB = result.b.x == -10 && result.b.y == 4;

      return expectA && expectB;
    },
    test225: function() {
      a = { x: 8, y: 0 };
      b = { x: -8, y: -8 };
      result = pen.calcControlPoints(a, b);

      expectA = result.a.x == 7 && result.a.y == 3;
      expectB = result.b.x == -10 && result.b.y == -4;

      return expectA && expectB;
    }
  }
};

pen = {
  getX: function(event) {
    return event.pageX - event.delegateTarget.offsetLeft;
  },

  getY: function(event) {
    return event.pageY - event.delegateTarget.offsetTop;
  },

  calcControlPoints: function(p1, p2) {
    var x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y,
        radA      = pen.absAngle(x1,y1),
        radB      = pen.absAngle(x2,y2),
        bisect    = (radA + radB) / 2,
        cpAngle   = bisect + (Math.PI / 2),
        radFactor = 1,
        operator  = radA - radB < 0 ? -1 : 1,
        ra        = Math.sqrt(x1*x1 + y1*y1) / radFactor,
        rb        = Math.sqrt(x2*x2 + y2*y2) / radFactor,
        ax        = Math.round(Math.cos(cpAngle) * operator * ra),
        ay        = Math.round(Math.sin(cpAngle) * operator * ra),
        bx        = Math.round(Math.cos(cpAngle) * operator * -rb),
        by        = Math.round(Math.sin(cpAngle) * operator * -rb),
        a, b;
    a = { x: ax, y: ay },
    b = { x: bx, y: by };

    return { a: a, b: b };
  },

// Finds absolute angle based on the atan calculation.
// Depending on which quadrant the point is in, the direction of measurement changes.
  absAngle: function(x, y) {
    var angle;
    if (x != 0) {
      angle = Math.atan(y/x);
      if ((x < 0 && y >= 0) || (x < 0 && y < 0)) angle += Math.PI;
    }
    // If x is zero, the angle can either be 90 deg (pi/2) or 270 deg (3pi/2)
    else angle = (y > 0) ? Math.PI/2 : (3*Math.PI)/2;

    return angle;
  },

  distance: function(x1, y1, x2, y2) {
    katA = Math.pow(Math.abs(x1-x2),2);
    katB = Math.pow(Math.abs(y1-y2),2);
    hyp  = Math.sqrt(katA+katB);
    return hyp;
  },

  clone: function (obj) {
    return JSON.parse(JSON.stringify(obj));
  },
};
