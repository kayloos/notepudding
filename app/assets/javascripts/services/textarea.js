notepuddingApp.factory('textarea', ['$timeout', 'pad', 'state', function($timeout, pad, state) {
  return {
    moveTarget: null,
    moveTheTarget: function($index) {
      state.action  = "moving";
      this.moveTarget = $index;
    },
    move: function(event) {
      if (state.action != "moving") return;
      event.preventDefault();

      target = pad.currentPage.textareas[this.moveTarget];
      if (this.moveTarget != null) {

        var x = pen.getX(event) + 8,
            y = pen.getY(event) + 7;

        target.divStyle = { top: y + "px", left: x + "px" };
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
    // When resizing using the browser we want the new size of the textarea to persist.
    rememberDimensions: function(event, idx) {
      var target = $(event.delegateTarget);
      pad.currentPage.textareas[idx].textareaStyle.width  = target.outerWidth() + "px";
      pad.currentPage.textareas[idx].textareaStyle.height = target.outerHeight() + "px";
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
          top: y + "px",
        },
        textareaStyle: {
          width: "360px",
          height: "30px",
        },
        content: ""
      });
    }
  };
}]);

