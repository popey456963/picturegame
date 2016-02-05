function generateImageFromSRC() {
  var c=document.getElementById("canvas");
  var ctx=c.getContext("2d");
  var image = new Image();
  var mask = new Image();
  image.crossOrigin = '';
  mask.crossOrigin = '';
  image.src = document.getElementById('userimage').value
  image.onload = function() {
    ctx.canvas.width = image.width;
    ctx.canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      if (document.getElementById('mask').value == "") {
        mask.src = "http://i.imgur.com/yNAsDDD.png";
      } else {
        mask.src = document.getElementById('mask').value
      }
      mask.onload = function() {
          ctx.drawImage(mask, 0, 0);
          var img = c.toDataURL("image/png");
          document.getElementById("form").style.display = "none";
          var div = document.getElementById("image");
          div.innerHTML = div.innerHTML + '<img alt="image" src="' + img + '" />'
      }
  };
}

(function(){
  
  $('.floatlabel').SmartPlaceholders();
  
  var $form = $('#form'),
      $smart = $('.smart-placeholder-wrapper');

  $form.submit(function(e) {
    e.preventDefault();
    console.log("Success");
    generateImageFromSRC();
  });
  
  function clearForm(el) {
    el.reset();
    $smart.removeClass('focused, populated');
  }

})();

$(function () {
  var extractToken = function(hash) {
    var match = hash.match(/access_token=(\w+)/);
    return !!match && match[1];
  };

  var $post = $('.post');
  var $msg = $('.hidden');
  var $img = $('img');

  $post.click(function() {
    localStorage.doUpload = true;
    localStorage.imageBase64 = $img.attr('src').replace(/.*,/, '');
  });

  var token = extractToken(document.location.hash);
  if (token && JSON.parse(localStorage.doUpload)) {
    localStorage.doUpload = false;
    $post.hide();
    $msg.show();

    $.ajax({
      url: 'https://api.imgur.com/3/image',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json'
      },
      data: {
        image: localStorage.imageBase64,
        type: 'base64'
      },
      success: function(result) {
        var id = result.data.id;
        window.location = 'https://imgur.com/gallery/' + id;
      }
    });
  }
});