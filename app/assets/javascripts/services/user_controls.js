notepuddingApp.factory('userControls',
  ['$http', '$rootScope', 'pad',
  function($http, $rootScope, pad) {
    var userControls = {};

    userControls.save = function() {
      // TODO: Maybe this should be in the pad service??
      var lastPage = pad.pages[pad.pages.length - 1]
      if (lastPage.textareas.length + lastPage.curves.length == 0)
        pad.pages.pop();

      $http.post('/save_pad', {
        pages_dump: pad.pages,
        config: $rootScope.config
      }).success(function(data) {
        timeoutAlert({ type: "success", info: "Saved" });
      }).error(function(data) {
        timeoutAlert({ type: "danger", info: "Unable to save" });
      });
    };

    return userControls;
  }
]);

