notepuddingApp.factory('user', ['$rootScope', 'pad', 'config', function($rootScope, pad, config) {
  return {
    import: function(user) {
      if (!$.isEmptyObject(user)) {
        $rootScope.userSignedIn = true;
        pad.pages               = user.pages;
        pad.currentPageIdx      = pad.pages.length - 1;
        pad.currentPage         = pad.pages[pad.currentPageIdx];

        if (pad.currentPage.textareas == null)
          pad.currentPage.textareas = [];
        if (pad.currentPage.curves == null)
          pad.currentPage.curves = [];

        if (user.config != null)
          $rootScope.config = user.config;
        else $rootScope.config = config.defaultConfig;
      }
      else {
        $rootScope.userSignedIn = false;
        pad.pages[0] = defaultPage();
        pad.currentPage = pad.pages[0];

        $rootScope.config = config.defaultConfig;
      }
    }
  }
}]);

