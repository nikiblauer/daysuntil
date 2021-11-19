

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


$(".list-item").on("click", function(e){
  let name = event.target.innerHTML;
  name = name.substring(1, name.length-1);
  let url = cutUrl(window.location.href, 3);
  url = url + "/" + name;

  window.location.replace(url);
});
