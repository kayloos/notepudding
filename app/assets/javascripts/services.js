notepuddingApp.factory('pad', ['$rootScope', function($rootScope) {
  var pad = {};

  var defaultPage = function() {
    return {
      textareas: [
        { content:"Hi! Welcome to Notepudding.\nNotepudding is an app that is designed to function like a notepad.\nSome of the best things about a notepad is that you:\n\n- Don't have to pick a filename in order to save\n- You just flip open a new page\n- Write anywhere you want, make your own order\n- Draw freehand illustrations (in development)\n\nNotepudding aims to put these features of the common notepad on the web.\n\nSign in to save your content.\n",
          id: 0,
          divStyle: {"left":"119px","top":"62px"},
          textareaStyle: {"width":"545px","height":"420px"}
        },

        { content:"Notepudding.",
          id:1,
          divStyle: {"left":"625px","top":"30px"},
          textareaStyle: {"width":"360px","height":"32px"}
        }
      ],
      curves: []
    }
  };

  pad.textN    = 0;
  pad.maxPages = 80;
  pad.pages = [{
    textareas: [],
    curves: [],
  }];

  pad.currentPageIdx = 0;
  pad.currentPage    = pad.pages[0];

  pad.fillOutPage = function(user) {
    if ($.isEmptyObject(user)) {
      $rootScope.userSignedIn = false;
      pad.pages[0]            = defaultPage();
      pad.currentPage         = pad.pages[0];
    }
    else {
      $rootScope.userSignedIn = true;
      pad.pages               = user.pages;
      pad.currentPageIdx      = pad.pages.length - 1;
      pad.currentPage         = pad.pages[pad.currentPageIdx];

      if (pad.currentPage.textareas == null) pad.currentPage.textareas = [];
      if (pad.currentPage.curves == null)    pad.currentPage.curves    = [];

      if (user.config != null)               $rootScope.config = user.config;
    }
  };

  return pad;
}]);

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
