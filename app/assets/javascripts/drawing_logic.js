pen = {
  getX: function(event) {
    return event.pageX - event.delegateTarget.offsetLeft;
  },

  getY: function(event) {
    return event.pageY - event.delegateTarget.offsetTop;
  },

  calcControlPoints: function(x1,y1,x2,y2) {
    var radA = absAngle(x1,y1),
        radB = absAngle(x2,y2),
        bisect = (radA + radB) / 2,
        difference = radB - radA,
        bOverLimit = difference > Math.PI,
        newBisect = bOverLimit ? bisect : bisect - Math.PI,
        tanAB = newBisect + Math.PI/2,
        r = 20,
        ax = round(Math.cos(tanAB) * r),
        ay = round(Math.sin(tanAB) * r),
        bx = round(Math.cos(tanAB) * -r),
        by = round(Math.sin(tanAB) * -r),
        a, b;
    a = {x: ax, y: ay},
    b = {x: bx, y: by};

    return {a: a, b: b};
  },

// Finds absolute angle based on the atan calculation.
// Depending on which quadrant the point is in, the direction of measurement changes.
  absAngle: function(x, y) {
    var angle;
    if (x != 0) {
      angle = Math.atan(y/x);
      if      (x > 0 && y >= 0) angle += 0;
      else if (x < 0 && y >= 0) angle += Math.PI;
      else if (x < 0 && y < 0) angle += Math.PI;
      else if (x > 0 && y < 0) angle += 0;
    }
    // If x is zero, the angle can either be 90 deg (pi/2) or 270 deg (3pi/2)
    else angle = (y > 0) ? Math.PI/2 : (3*Math.PI)/2;

    return angle;
  },

  distance: function(x1, y1, x2, y2) {
    katA = Math.pow(Math.abs(x1-x2),2);
    katB = Math.pow(Math.abs(y1-y2),2);
    hyp = Math.sqrt(katA+katB);
    return hyp;
  },

  clone: function (obj) {
    return JSON.parse(JSON.stringify(obj));
  },
};
