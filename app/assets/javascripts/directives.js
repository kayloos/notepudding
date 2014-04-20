// notepuddingApp.directive('ngText', function($compile) {
  // return {
    // template: '<input type="text" class="text_field" />',
    // restrict: 'E',
    // replace: true,
    // link: function($scope, elem) {
      // $scope.addText = function(event) {
        // var fromTop, fromLeft;
        // fromTop = event.pageY; fromLeft = event.pageX;
        // elem.after($compile('<ng-text></ng-text>')($scope)).offset({top: fromTop, left: fromLeft}).focus();
      // }
    // }
  // };
// });

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
    $timeout(function() {$element.autosize();}, 0, true);
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
