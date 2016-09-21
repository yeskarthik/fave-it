chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,tab) {
  console.log(changeInfo);
  if ((tab.url.indexOf('http://www.facebook.com/') !=-1 || tab.url.indexOf('https://www.facebook.com/') !=-1) && changeInfo.status === 'complete') {
  chrome.tabs.executeScript(tabId, {file: 'reload.js'});
}
});

chrome.webRequest.onCompleted.addListener(function(details) {
  var url = document.createElement('a');
  url.href = details.url;
  if (url.search && url.search.indexOf('ajaxpipe=1') !== -1) {
    chrome.tabs.executeScript(details.tabId, {'file' : 'reload.js'});
  }
}, {urls : ['*://*.facebook.com/*']});

var bookmarksFolderId = null;
var bookmarksFolderName = 'Facebook Favs'
chrome.bookmarks.search(bookmarksFolderName, function(bookmarkTreeNodes){
  if(bookmarkTreeNodes.length > 0){
    bookmarksFolderId = bookmarkTreeNodes[0].id;
  } else {
    chrome.bookmarks.search('Bookmarks Bar', function(bookmarksBarTreeNodes){
      chrome.bookmarks.create({ 'parentId':  bookmarksBarTreeNodes[0].id,
        'title': bookmarksFolderName},
        function(newFolder) {
          bookmarksFolderId = newFolder.id;
        });
    });
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.action === 'addFbBookmark') {
    if(request.link) {
      chrome.bookmarks.search(request.link, function(treeNodes) {           
        if(treeNodes.length === 0) { 
          chrome.bookmarks.create({'parentId': bookmarksFolderId, 
            'title': request.username + ': ' + request.content,
            'url': request.link});
        }
      });
      sendResponse({bookmarkCreate: 'success'});
    } else {
      sendResponse({bookmarkCreate: 'fail'});
    }
  } else if (request.action === 'checkIfBookmarkExists') {
    if(request.link) {
      chrome.bookmarks.search(request.link, 
        function(treeNodes) { 
          sendResponse({'exists': (treeNodes.length > 0), 'nodes': treeNodes});
        });
      return true;
    } else {
      sendResponse({'exists': false});
    }
  } else if (request.action === 'removeFbBookmark') {
    if(request.id) {
      chrome.bookmarks.remove(request.id);
      sendResponse({bookmarkDelete: 'success'});
    } else {
      sendResponse({bookmarkDelete: 'fail'});
    }
  }
});

