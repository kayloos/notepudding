notepuddingApp.filter('markdown', function($sce) {
  return function(input) {
    marked.setOptions({
      breaks: true
    });
    return $sce.trustAsHtml(marked(input));
  };
});
