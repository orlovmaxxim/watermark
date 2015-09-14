var drag = function(type){

	var watermarkPic = $('.main-wmark-wrapper'),
			mainPic = $('.basicImage__img');

		//если имеется класс single, можно выпонлнять драгабл 
		// if ($('.switcher').hasClass('single')) {
		// 	watermarkPic.draggable ({
		// 		containment: mainPic,
		// 		cursor: "move"
		// 	});
		// };

		// if ($('.switcher').hasClass('multi')) {
		// 	watermarkPic.draggable ({
		// 		containment: '',
		// 		cursor: 'move'
		// 	});
		// };
		
		if(watermarkPic.hasClass('ui-draggable')){
			watermarkPic.draggable('destroy');
		}

		if(type === 'single'){
			watermarkPic.draggable ({
				containment: mainPic,
				cursor: "move"
			});
		} else if (type === 'multi'){
			watermarkPic.draggable ({
				cursor: "move"
			});
		}

		//вычисляем координаты ватермарка (drag event)
		watermarkPic.on('drag', function(){
			var	
				posX = watermarkPic.css('left'),
				posY = watermarkPic.css('top');

				$('[name = xpos]').val(parseInt(posX,10));
				$('[name = ypos]').val(parseInt(posY,10));

				$('.grid-item').removeClass('active');
		}).on('dragstart', function(e,ui){	
			$(this).css('transition', 'none');
		}).on('dragstop', function(e,ui){	
			$(this).css('transition', 'left .5s, top .5s');
		});

};