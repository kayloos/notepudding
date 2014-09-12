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
