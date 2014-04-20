notepuddingApp.factory('pad', function() {
  var pad = {};

  pad.textN = 0;
  pad.maxPages = 80;
  pad.pages = [];
  pad.currentPageIdx = 0;
  pad.currentPage = {};

  return pad;
})
.factory('blank', function() {
  return {};
});
