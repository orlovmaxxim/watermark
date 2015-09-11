var drag = function(){

	var watermarkPic = $('.main-wmark-wrapper'),
			mainPic = $('.basicImage__img');

	var wideArea;


		//если имеется класс single, можно выпонлнять драгабл 
		if ($('.switcher').hasClass('single')){
			watermarkPic.draggable({
				containment: mainPic,
				cursor: "move"
			});
		} else {
			watermarkPic.draggable({
				containment: $('.main-image-wrapper'),
				cursor: "move"
			});
		};

		//вычисляем координаты ватермарка (drag event)
		watermarkPic.on('drag', function(){
			var posX = watermarkPic.css('left'),
					posY = watermarkPic.css('top');

					$('[name = xpos]').val(parseInt(posX,10));
					$('[name = ypos]').val(parseInt(posY,10));

					$('.grid-item').removeClass('active');
		});

};

var reproduceWaterm = function() {
	var watermark = $('.main-wmark-wrapper'),
			image = $('.main-image-wrapper'),
			dublicates = watermark.html(),
			markup = '';
			
			console.log(dublicates.length);

		var 
			imageWidth = image.outerWidth(),
			imageHeight = image.outerHeight(),
			watermarkWidth = watermark.outerWidth(),
			watermarkHeight = watermark.outerHeight();

		var 
			cols = Math.ceil(imageWidth / watermarkWidth),
			rows = Math.ceil(imageHeight / watermarkHeight),
			dublicatesToAddCount = cols*rows;
		

			//Сбрасываем и сдвигаем обертку влево-вверх
		watermark.css({
			'width' :  imageWidth+watermarkWidth*2,
/*			'margin-top' : -(watermarkHeight*2),
			'margin-left' : -(watermarkWidth*2),*/
			'left' : 0,
			'top' : 0,
		}); 

		for (var i = 0;  i <= dublicatesToAddCount; i++) {
			markup += dublicates;
		};
		watermark.html(markup);
		markup = '';


};