notepuddingApp.factory('action', ['$timeout', 'state', 'textarea', 'curve', function($timeout, state, textarea, curve) {
  return {
    start: function(event) {
      if (state.action != "neutral") return;

      state.action = "drawing_temporary";

      $timeout(function() {
        if (state.action == "drawing_temporary") {
          state.action = "drawing_permanent";
        }
      }, 200, false);
    },

    end: function(event) {
      if (state.action == "drawing_temporary") {
        // Remove current curve
        // Add text field, ready for writing
        curve.current = curve.empty;
        textarea.addText(event, pad.currentPage.textareas.length);
      }
      else if (state.action == "drawing_permanent") {
        // Save the current curve
        curve.save();
      }
      else if (state.action == "moving") {
        textarea.moveTarget = null;
      }
      else if ($scope.actionState == "resizing") {
        textarea.resizeTarget = null;
      }

      state.action = "neutral"
    },
  };
}]);

