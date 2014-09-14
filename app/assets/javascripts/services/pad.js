notepuddingApp.factory('pad', function() {
  var pad = {};

  pad.textN          = 0;
  pad.maxPages       = 80;
  pad.pages          = [{ textareas: [], curves: [], }];
  pad.currentPageIdx = 0;
  pad.currentPage    = pad.pages[0];
  pad.defaultPage = function() {
    return {
      textareas: [
        { content:"###Hi! Welcome to Notepudding.\nNotepudding is an app that is designed to function like a notepad.\nSome of the best things about a notepad is that you:\n\n- Don't have to pick a filename in order to save\n- You just flip open a new page\n- Write anywhere you want, make your own order\n- Draw freehand illustrations\n\nNotepudding aims to put these features of the common notepad on the web.\n\nSign in to save your content.\n",
          id: 0,
          divStyle: {"left":"119px","top":"62px"},
          textareaStyle: {"width":"545px","height":"420px"}
        },
      ],
      curves: []
    }
  };

  return pad;
});

