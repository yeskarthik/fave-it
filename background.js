chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,tab) {
  console.log(changeInfo);
  if ((tab.url.indexOf('http://www.facebook.com/') !=-1 || tab.url.indexOf('https://www.facebook.com/') !=-1) && changeInfo.status === 'complete') {
  chrome.tabs.executeScript(tabId, {file: 'inject.js'});
}
});

chrome.webRequest.onCompleted.addListener(function(details) {
  var url = document.createElement('a');
  url.href = details.url;
  if (url.search && url.search.indexOf('ajaxpipe=1') !== -1) {
    chrome.tabs.executeScript(details.tabId, {'file' : 'inject.js'});
  }
}, {urls : ['*://*.facebook.com/*']});

var krowBookmarksId = null;

chrome.bookmarks.search('Krow Bookmarks', function(bookmarkTreeNodes){
  if(bookmarkTreeNodes.length > 0){
    krowBookmarksId = bookmarkTreeNodes[0].id;
  } else {
    chrome.bookmarks.search('Bookmarks Bar', function(bookmarksBarTreeNodes){
      console.log(JSON.stringify(bookmarksBarTreeNodes));
      chrome.bookmarks.create({ 'parentId':  bookmarksBarTreeNodes[0].id,
        'title': 'Krow bookmarks'},
        function(newFolder) {
          krowBookmarksId = newFolder.id;
          console.log('added folder: ' + newFolder.title);
        });
    });
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ?
    'from a content script:' + sender.tab.url :
    'from the extension');
  chrome.bookmarks.create({'parentId': krowBookmarksId, 
    'title': request.username + ': ' + request.content,
    'url': request.link});
  sendResponse({bookmarkCreate: 'success'});
});

