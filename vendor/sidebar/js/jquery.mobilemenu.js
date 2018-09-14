  (function($) {

    $.mobilemenu = function(options) {

        var settings = $.extend({
            menu: '#mobilemenu',
            trigger: '#mobilemenu button.trigger',
            container: 'body'
        }, options);

        $(settings.menu).remove();

        $(settings.trigger).click(function() {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                $(settings.menu).addClass('active');
                $(settings.container).addClass('mobilemenu-active');
                return $('body').css('overflow', 'hidden');
            } else {
                $(this).removeClass('active');
                $(settings.menu).removeClass('active');
                setTimeout(function() {
                  $(settings.container).removeClass('mobilemenu-active');
                },500);
                return $('body').css('overflow', 'auto');
            }
        });

    };

}(jQuery));
