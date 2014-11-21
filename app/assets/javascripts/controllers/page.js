'use strict';

notepuddingApp.controller('PageCtrl', ['$scope', '$rootScope', '$timeout', 'pad', 'user', 'textarea', 'state', 'curve', 'action',
  function ($scope, $rootScope, $timeout, pad, user, textarea, state, curve, action) {
    $scope.pad        = pad;
    $scope.state      = state;
    $scope.textarea_s = textarea;
    $scope.curve      = curve;
    $scope.action     = action;

    $rootScope.alerts     = [];
    $rootScope.closeAlert = function(index) { $rootScope.alerts.splice(index, 1); };

    user.import(getUser());

    $scope.select = function(event) {
      var curve    = event.target,
          ancestor = $(curve).parent(),
          bboxRect = createRect(curve.getBBox());

      ancestor.find('.select').remove();
      ancestor.append(bboxRect);
      ancestor.html(ancestor.html());

// replace with directive

      return false;
    };

    var createRect = function(bbox) {
      var padding = 8,
          w       = bbox.width + 2*padding,
          h       = bbox.height + 2*padding,
          x       = bbox.x - padding,
          y       = bbox.y - padding;

      return '<rect class="select" stroke="blue" stroke-width="2px" width="' + w + '" height="' + h + '" x="' + x + '" y="' + y + '" />';
    };
  }
]);

