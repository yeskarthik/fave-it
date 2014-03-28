function strip(html) {
  var tmp = document.createElement('div');
  tmp.innerHTML = html;
  var text =  tmp.textContent || tmp.innerText || '';
  return text.replace(/['"]/g, '');
}

function buildBookmarkTag($element, username, content, link) {
  var $tagBuilder = $("<a>Bookmark</a>");
  $tagBuilder.attr("data-username", username).attr("data-content", content).attr("data-link", link)
    .attr("href", "#").addClass("krowBookmark");
  chrome.runtime.sendMessage({action: 'checkIfBookmarkExists', link: link}, function(response) {
      if(response.exists) $tagBuilder.addClass("krowed").html("Bookmarked");
      $element.append($tagBuilder.wrap('<div/>').parent().html());
  });
}

$(function() {
  $('.krowBookmark').off('click', '**');
  $(document).on('click', '.krowBookmark', function(){
    console.log("clicked");
    var username= $(this).attr('data-username');
    var content = $(this).attr('data-content');
    var link = $(this).attr('data-link');
    var element = this;
    if(link.length > 0) {
      if(link[0] === '/'){
        link = window.location.origin + link;
      }
      chrome.runtime.sendMessage({action: 'addFbBookmark', username: username, content: content, link: link}, function(response) {
        $(element).html("Bookmarked").addClass("krowed");
        //console.log("success");
      }); 
    }
  });
});

