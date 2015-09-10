$(document).ready(function() {
    $('.opacity-range').change(function() {
        var opasityw = $('.opacity-range').val();
        var watermark = $('.waterMark__img').css({
            'opacity': +($('.opacity-range').val())
        });
    });
});
