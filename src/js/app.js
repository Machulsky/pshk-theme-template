

import '../vendor/owlcarousel/dist/owl.carousel'

    $( document ).ready ( ( ) => { 
      let str = 'Empty project with jquery '+ window.location
      console.log(str)


      $('#skills .owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        rewindNav : true,
        responsive: {
          0: {
            items: 1,
            nav: false
          },
          600: {
            items: 2,
            nav: true
          },
          1000: {
            items: 3,
            nav: true,
            loop: true,
            margin: 20
          }
        }
      })


      $('#welcome .owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        rewindNav : false,
        nav:false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
          0: {
            items: 1,
            
          },
          600: {
            items: 1,
            
          },
          1000: {
            items: 1,
           
            loop: true,
            margin: 20
          }
        }
      })
     
     } )  
     

     


