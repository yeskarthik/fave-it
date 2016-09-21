function strip(html) {
  var tmp = document.createElement('div');
  tmp.innerHTML = html;
  var text =  tmp.textContent || tmp.innerText || '';
  return text.replace(/['"]/g, '');
}

var bookmarkLabel = '&#9734;   FaveIt';
var bookmarkedLabel = '&#9733; Fav\'d';
var bookmarkClass = 'faveit';
var bookmarkedClass = 'favedit';

function buildBookmarkTag($element, username, content, link) {
  var $tagBuilder = $('<a>'+bookmarkLabel+'</a>');
  $tagBuilder.attr('data-username', username).attr('data-content', content).attr('data-link', link)
    .attr('href', '#').addClass(bookmarkClass);
  chrome.runtime.sendMessage({'action': 'checkIfBookmarkExists', 'link': link}, function(response) {
      if(response.exists) {
        $tagBuilder.addClass(bookmarkedClass).html(bookmarkedLabel);
      }
      $element.find(".faveit").remove();
      $element.find(".favedit").remove();
      $element.append($tagBuilder.wrap('<div/>').parent().html());
  });
}

$(function() {
  $('.'+bookmarkClass).off('click', '**');
  $(document).on('click', '.'+bookmarkClass, function(){
    //console.log("clicked");
    var username= $(this).attr('data-username');
    var content = $(this).attr('data-content');
    var link = $(this).attr('data-link');
    var element = this;
    if(link.length > 0) {
      if(link[0] === '/'){
        link = window.location.origin + link;
      }
      chrome.runtime.sendMessage({'action': 'addFbBookmark', 'username': username, 'content': content, 'link': link}, function(response) {
        $(element).html(bookmarkedLabel).addClass(bookmarkedClass);
      }); 
    }
  });
  $(document).on('click', '.'+bookmarkedClass, function(){
    var username= $(this).attr('data-username');
    var content = $(this).attr('data-content');
    var link = $(this).attr('data-link');
    var element = this;
    chrome.runtime.sendMessage({'action': 'checkIfBookmarkExists', 'username': username, 'content': content, 'link': link}, function(response) {
      chrome.runtime.sendMessage({'action': 'removeFbBookmark', 'id': response.nodes[0].id}, function(response) {
        $(element).html(bookmarkLabel).removeClass(bookmarkedClass);
      });
    });
  });
});

