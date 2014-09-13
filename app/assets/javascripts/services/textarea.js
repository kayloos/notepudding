'use strict';

notepuddingApp.factory('textarea', ['$timeout', 'pad', 'state', function($timeout, pad, state) {
  return {
    moveTarget: null,
    resizeTarget: null,
    moveTheTarget: function($index) {
      state.action    = "moving";
      this.moveTarget = $index;
    },
    move: function(event) {
      if (state.action != "moving") return;
      event.preventDefault();

      var target = pad.currentPage.textareas[this.moveTarget];
      if (this.moveTarget != null) {

        var x = pen.getX(event) + 8,
            y = pen.getY(event) + 7;

        target.divStyle = { top: y + "px", left: x + "px" };
      }
    },
    startResize: function($index) {
      state.action      = 'resizing';
      this.resizeTarget = $index;
    },
    resize: function(event) {
      if (state.action != "resizing") return;
      event.preventDefault();

      var target = pad.currentPage.textareas[this.resizeTarget];

      if (this.resizeTarget != null) {
        var x = pen.getX(event),
            y = pen.getY(event);

        var tx, ty, rx, ry;

        tx = target.divStyle.left;
        ty = target.divStyle.top;

        tx = tx.substring(0, tx.length-2);
        ty = ty.substring(0, ty.length-2);

        rx = (x - tx) + "px";
        ry = (y - ty) + "px";

        target.textareaStyle = {
          height: ry,
          width: rx
        };
      }
    },
    deselect: function(event) {
      // $timeout logic due to a problem with angular (blur gets called synchronously and collides with keydown)
      // source: http://stackoverflow.com/questions/18389527/angularjs-submit-on-blur-and-blur-on-keypress
      var escKeyNr = 27;
      var target = event.target || event.srcElement;
      if (event.keyCode == escKeyNr) $timeout(function () { target.blur() }, 0, false);
    },
    removeIfEmpty: function(event, idx) {
      var target = event.target || event.srcElement;
      if ($(target).val() == "") pad.currentPage.textareas.splice(idx, 1);
    },
    addText: function(event, n) {
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
          top: y + "px"
        },
        textareaStyle: {
          width: "360px",
          height: "30px"
        },
        content: ""
      });
    }
  };
}]);

