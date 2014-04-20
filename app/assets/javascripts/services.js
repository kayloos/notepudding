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
