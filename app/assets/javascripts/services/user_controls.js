notepuddingApp.factory('userControls', function($http, $rootScope, pad) {
  var userControls = {};

  userControls.save = function() {
    $http.post('/save_pad', {
      pages_dump: pad.pages,
      config: $rootScope.config
    }).success(function(data) {
      timeoutAlert({ type: "success", info: "Saved pad successfully" });
    }).error(function(data) {
      timeoutAlert({ type: "danger", info: "Could not save pad" });
    });
  };

  return userControls;
});

