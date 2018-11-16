$(window).ready(function(){
});


document.querySelector('link[rel="import"][href="header.html"]').onload = function() {
  // mobilemenu
  $.mobilemenu({
    container: 'body',
    trigger: '.mobilemenu-trigger button.trigger'
  });

  $( '.ha-waypoint' ).each( function(i) {
    var $el = $( this ),
      animClassDown = $el.data( 'animateDown' ),
      animClassUp = $el.data( 'animateUp' );

    $el.waypoint( function( direction ) {
      var $head = $( '.header-effects' );
      if ( $('.mobilemenu-trigger button.trigger.active').length > 0 ) return;

      if( direction === 'down' && animClassDown ) {
        if ( animClassDown === 'none' )
          $head.attr('class', "header-effects");
        else
          $head.attr('class', "header-effects header-effects-on " + animClassDown);
      }
      else if( direction === 'up' && animClassUp ){
        if ( animClassUp === 'none' )
          $head.attr('class', "header-effects");
        else
          $head.attr('class', "header-effects header-effects-on " + animClassUp);
      }
    }, { offset: '100%' } );
  } );

  initI18n();
}

window.addEventListener('load', function(){
  if (window.AOS) {
    var offset = Math.floor(window.innerHeight * 0.2);
    if (window.innerWidth >= 768) offset = Math.floor(window.innerHeight * 0.25);
    AOS.init({
      easing: 'ease-in-out-sine',
      offset: offset
    });
  }
});
