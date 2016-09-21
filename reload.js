var bookmarkClass = 'faveit';

$(function() {
  $('.'+bookmarkClass).remove();
  if($('._5pax').length !== 0) {
    //old facebook
    $('._5pax').each(function() {
      var username = strip($(this).find('a').html());
      var content = strip($(this).find('.userContent').html()) || "";
      var link = $(this).find('._5pcq').attr('href');  
      content = content.substring(0, 100);
      $(this).find('.'+bookmarkClass).remove();
      buildBookmarkTag($(this).find('._5pcp'), username, content, link);
    });
  } else {
  //new facebook		
     $('.userContentWrapper').each(function() {
      if($(this).find('.userContentWrapper').length === 0) {
        var username = strip($(this).find('._5pbw a').html());
        var content = strip($(this).find('.userContent').html()) || "";
        content = content.substring(0, 100);
        var link = $(this).find('._5pcq').attr('href');  
        $(this).find('.'+bookmarkClass).remove();
        buildBookmarkTag($(this).find('._42nr'), username, content, link);
      }
    });
    
  }
});
