notepuddingApp.factory('pad', function() {
  var pad = {};

  pad.textN = 0;
  pad.maxPages = 80;
  pad.pages = [{
    textareas: [],
    curves: [],
  }];

  pad.currentPageIdx = 0;
  pad.currentPage = pad.pages[0];

  return pad;
});

notepuddingApp.factory('userControls', function($http, $rootScope, pad) {
  var userControls = {};

  userControls.save = function() {
    $http.post('/save_page', {
      pages_dump: pad.pages,
      config: $rootScope.config
    }).success(function(data) {
      timeoutAlert({ type: "success", info: "Saved pages successfully" });
    }).error(function(data) {
      timeoutAlert({ type: "danger", info: "Could not save pages" });
    });
  };

  return userControls;
});
