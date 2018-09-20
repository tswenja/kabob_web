var $head = $( '.header-effects' );
$( '.ha-waypoint' ).each( function(i) {
  var $el = $( this ),
    animClassDown = $el.data( 'animateDown' ),
    animClassUp = $el.data( 'animateUp' );

  $el.waypoint( function( direction ) {
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


// mobilemenu
if (window.AOS) {
  var offset = 88;
  if (window.innerWidth >= 768) offset = 120;
  AOS.init({
    easing: 'ease-in-out-sine',
    offset: offset
  });
}

$(window).ready(function(){
  $.mobilemenu({
    container: 'body',
    trigger: '.mobilemenu-trigger button.trigger'
  });
});
