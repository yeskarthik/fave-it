function strip(html) {
  var tmp = document.createElement('div');
  tmp.innerHTML = html;
  var text =  tmp.textContent || tmp.innerText || '';
  return text.replace(/['"]/g, '');
}

$(function() {
  if($('._5pax').length !== 0) {
    //old facebook
      $('._5pax').each(function() {
        var username = strip($(this).find('a').html());
        var content = strip($(this).find('.userContent').html().substring(0, 100));
        var link = $(this).find('._5pcq').attr('href');  

        $(this).find('.krowBookmark').remove();
        $(this).find('._5pcp').append('<a class="krowBookmark" '+
          'data-username="'+ username + '" ' +
          'data-content="'+ content + '" ' +
          'data-link="'+ link + 
          '" href="#">Bookmark</a>');
      });
  } else {
  //new facebook		
      $('.userContentWrapper').each(function() {
        var username = strip($(this).find('._5pbw a').html());
        var content = strip($(this).find('.userContent').html().substring(0, 100));
        var link = $(this).find('._5pcq').attr('href');  
        $(this).find('.krowBookmark').remove();
        $(this).find('._5vsi').append('<a class="krowBookmark" '+
          'data-username="'+ username + '" ' +
          'data-content="'+ content + '" ' +
          'data-link="'+ link + 
          '" href="#">Bookmark</a>');
        });
  }

$('.krowBookmark').off();
$('.krowBookmark').click(function(){
  var username= $(this).attr('data-username');
  var content = $(this).attr('data-content');
  var link = $(this).attr('data-link');
  if(link.length > 0) {
    if(link[0] === '/'){
      link = window.location.origin + link;
    }
    chrome.runtime.sendMessage({username: username, content: content, link: link}, function(response) {
      //console.log("success");
    }); 
  }
});

});

