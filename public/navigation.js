

const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: false,



  // If we need pagination
  // pagination: {
  //   el: '.swiper-pagination',
  // },

  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  initialSlide: 1,

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});


function cutUrl(url,n){
    return url.split('/').slice(0,n).join('/');
}

var toggled = 0;


$(".list-item").on("click", function(e){



  let name = event.target.innerHTML;
  name = name.substring(1, name.length-1);
  let url = cutUrl(window.location.href, 3);

  if($(".list-item").hasClass("delete")){
    if (window.confirm('Willst du den Tag: ' + '"' + name + '"' + ' wirklich löschen?')) {
      url = url + "/?delete=" + name;
      toggled = 0;
      $(".list-item").removeClass("delete");
      $(".edit-btn").removeClass(".edit-btn-toggled");

      window.location.replace(url);
    } else {

    }

  } else {
    url = url + "/" + name;
    window.location.replace(url);
  }

});


$(".edit-btn").on("click", function(e){
  if(toggled === 0){
    $(".list-item").addClass("delete");
    $(".edit-btn").addClass("edit-btn-toggled");

    toggled = 1;
  } else {
    $(".list-item").removeClass("delete");
    $(".edit-btn").removeClass("edit-btn-toggled");
    toggled = 0;
  }
});
