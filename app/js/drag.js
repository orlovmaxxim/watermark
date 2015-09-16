var drag = function(type){

	var watermarkPic = $('.main-wmark-wrapper'),
			mainPic = $('.basicImage__img');
		
		if(watermarkPic.hasClass('ui-draggable')){
			watermarkPic.draggable('destroy');
			watermarkPic.off('drag dragstart dragstop');
		}

		if(type === 'single'){
			watermarkPic.draggable ({
				containment: mainPic
			});

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


		} else if (type === 'multi'){
			watermarkPic.draggable ();

			//вычисляем координаты ватермарка (drag event)
			watermarkPic.on('drag', function(){
				var	
					posX = watermarkPic.css('left'),
					posY = watermarkPic.css('top');

					$('[name = xposMulti]').val(parseInt(posX,10));
					$('[name = yposMulti]').val(parseInt(posY,10));

			}).on('dragstart', function(e,ui){	
				$(this).css('transition', 'none');
			}).on('dragstop', function(e,ui){	
				$(this).css('transition', 'left .5s, top .5s');
			});


		}

};