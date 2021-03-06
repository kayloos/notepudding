notepuddingApp.directive('focusedOn', ['$timeout', function($timeout) {
  return function($scope, $element, $attrs) {
    function focus() {
      $timeout(function() {
        $element.focus();
      }, 20);
    }

    if (_($attrs.focusedOn).isEmpty()) return focus();

    $scope.$watch($attrs.focusedOn, function(newVal) {
      if(newVal) focus();
    });
  };
}]);

notepuddingApp.directive('autosize', ['$timeout', function($timeout) {
  return function($scope, $element, $attrs) {
    $timeout(function() { $element.autosize(); }, 0, true);
  };
}]);

notepuddingApp.directive('svg', function() {
  return function(scope, element, attrs) {
    attrs.$observe('ngD', function(value) {
      attrs.$set('d', value);
    });
    attrs.$observe('ngCx', function(value) {
      attrs.$set('cx', value);
    });
    attrs.$observe('ngCy', function(value) {
      attrs.$set('cy', value);
    });
  };
});

notepuddingApp.directive('focusMe', ['$timeout', function($timeout) {
  return {
    link: function (scope, element, attrs, model) {
      $timeout(function () {
        element[0].focus();
      });
    }
  };
}]);

notepuddingApp.directive('notepuddingTextarea', ['state', function(state) {
  return {
    restrict: 'E',
    templateUrl: 'textarea.html',
    link: function(scope, iElement, iAttrs) {
      scope.isFocused = false;

      scope.enableFocus = function() {
        iElement.find('.rendered-textarea').hide();
        iElement.find('textarea').show().focus();
        scope.isFocused = true;
      };

      scope.disableFocus = function() {
        if (state.action == "resizing" || state.action == "moving") return;
        iElement.find('textarea').hide();
        iElement.find('.rendered-textarea').show();
        scope.isFocused = false;
      };

      if (scope.textarea.content != "")
        scope.disableFocus();
      else
        scope.enableFocus();
    }
  };
}]);

// notepuddingApp.directive('notepuddingCurve', ['pad', function(pad) {
  // return {
    // restrict: 'E',
    // replace: true,
    // template: '<path svg ng-repeat="curve in pad.currentPage.curves" ng-d="{{ curve }}" ng-click="niggaYouCrazy()" />',
    // link: function(scope, iElement) {
      // scope.pad = pad;
      // scope.niggaYouCrazy = function() {
      // }
    // }
  // }
// }]);

