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

notepuddingApp.directive('notepuddingTextarea', [function() {
  return {
    restrict: 'E',
    templateUrl: 'textarea.html',
    link: function(scope, iElement, iAttrs, controller, transcludeFn) {
      scope.toggleFocus = function(event) {
        // TODO: Make toggle action that toggles the focus of a textarea.
        //       We want to be able to toggle the state of the textarea,
        //       and control when it is in focus. The goal is that when
        //       the user clicks the rendered textarea, the real textarea
        //       is not only shown but also in focus.
      };
    }
  }
}]);

