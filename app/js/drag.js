var drag = function(){

	var watermarkPic = $('.waterMark__img'),
			mainPic = $('.basicImage__img');

		//если имеется класс single, можно выпонлнять драгабл 
		if ($('.switcher').hasClass('single')) {
			watermarkPic.draggable ({
				containment: mainPic
			});
		};

		//вычисляем координаты ватермарка (drag event)
		watermarkPic.on('drag', function(){
			var posX = watermarkPic.css('left'),
					posY = watermarkPic.css('top');

					$('[name = xpos]').val(parseInt(posX,10));
					$('[name = ypos]').val(parseInt(posY,10));
		});

};