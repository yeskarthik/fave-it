$(function() {
  console.log("hello");
  $("._5pcp").each(function() {
    $(this).find(".krowBookmark").remove();
    $(this).append("<a style='margin-left: 2px;' class='krowBookmark' data-link='"+ $(this).find("._5pcq").attr('href') + "' href='#'>Bookmark</a>");
  });

  $('.krowBookmark').off();
  $('.krowBookmark').click(function(){
    console.log('dai');
    var link = $(this).attr('data-link');
    if(link.length > 0) {
      if(link[0] === '/'){
        link = window.location.origin + link;
      }
      chrome.runtime.sendMessage({link: link}, function(response) {
        console.log(response);
      }); 
    }
  });

});

