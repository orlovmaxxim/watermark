$(document).ready(function() {
    // $('.opacity-range').change(function() {
    //     var opasityw = $('.opacity-range').val();
    //     var watermark = $('.waterMark__img').css({
    //         'opacity': +($('.opacity-range').val())
    //     });
    // });
    
	$('.opacity-slider').slider({
		min: 0,
		max: 100,
		value: 100,
		animate: "fast",
		range: "min"
	});

	$('.opacity-slider').on('slide', function(e,ui){
		$('input[name=opacity]').val(ui.value);
		$('.waterMark__img').css('opacity', ui.value / 100 );
	});

});
