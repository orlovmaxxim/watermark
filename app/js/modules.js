"use strict";

//-------image upload module--------//
var imgUpload = (function(){

	var 
		_isBasicImageLarge = false,
		MAX_FILE_SIZE = 2000000; //2 MB

	function initialization(){
		_setupEventListeners();
	}

	function _setupEventListeners(){

		$('#basicImage').on('change', _basicImageChangeHandler);
		$('#waterMark').on('change', _waterMarkChangeHandler);

	}

	//basicImage onchage handler
	function _basicImageChangeHandler(e){
		var 
			$this = $(this),
			img = $this[0].files[0],
			waterMark = $('.waterMark__img');
		//if img not undefind read it from local machine
		if(img){
			if(waterMark.length){
				//TODO: change to wm clear function
				waterMark.remove();
			}
			//call file reader with event target scope
			_readFile.call(this, img, _basicImageLoadCallback);
		}
		
	}

	//callback function for basikImage loading
	function _basicImageLoadCallback(e){
		var
			$this = $(this),
			img = $this[0].files[0],
			imgContainer = $('.main-area'),
			imgMarkup = '<img src="" class="basicImage__img" />',
			waterMark = $this.closest('.upload').find('#waterMark'),
			basicImage = $('.basicImage__img');

		//remove image if already exist
		if(basicImage.length){
			basicImage.remove();
			_isBasicImageLarge = false;
		}
		//create new image 
		basicImage = imgContainer.append(imgMarkup).find('.basicImage__img').attr('src', e.target.result);
		waterMark.prop('disabled',false);

		$this.siblings('.imitation-upload').find('input').val(img.name);

		//position image and show after load
		basicImage.on('load', function(e){
			var 
				$this = $(this),
				imgContainer = $('.main-area'),
				imgNaturalWidth = $this.prop('naturalWidth'),
				imgNaturalHeight = $this.prop('naturalHeight'),
				imgWidth = $this.width(),
				imgHeight = $this.height(),
				imgContainerWidth = imgContainer.width(),
				imgContainerHeight = imgContainer.height();

			if(imgNaturalWidth > imgContainerWidth || imgNaturalHeight > imgContainerHeight){

				_isBasicImageLarge = true;

				if(imgNaturalWidth > imgNaturalHeight){

					$this.css('top', Math.round((imgContainerHeight - imgHeight)/2) + 'px' );

				} else {

					$this.css('left', Math.round((imgContainerWidth - imgWidth)/2) + 'px' );	
				}

			} else {

				$this.css({
					'top': Math.round((imgContainerHeight - imgHeight)/2) + 'px',
					'left': Math.round((imgContainerWidth - imgWidth)/2) + 'px' 	
				});
				
			}
			$this.css('opacity', 1);

		});
	}

	//waterMark onchage handler
	function _waterMarkChangeHandler(e){
		var 
			$this = $(this),
			img = $this[0].files[0];
		//if img not undefind read it from local machine
		if(img){
			//call file reader with event target scope
			_readFile.call(this, img, _waterMarkLoadCallback);
		}
		
	}

	//callback function for waterMark loading
	function _waterMarkLoadCallback(e){
		var
			$this = $(this),
			img = $this[0].files[0],
			imgContainer = $('.main-area'),
			disabledArea = $('.disabled-area'),
			imgMarkup = '<img src="" class="waterMark__img" />',
			waterMark = $('.waterMark__img');

		//remove image if already exist
		if(waterMark.length){
			waterMark.remove();
		}

		//append new image
		waterMark = imgContainer.append(imgMarkup).find('.waterMark__img').attr('src', e.target.result);
		disabledArea.css('display', 'none');
		$this.siblings('.imitation-upload').find('input').val(img.name);


		//caculate image sizes, position and show after load
		waterMark.on('load', function(e){
			var 
				$this = $(this),
				input = $('#waterMark').closest('.custom-upload'),
				imgContainer = $('.main-area'),
				basicImage = $('.basicImage__img'),
				basicImageNaturalWidth = basicImage.prop('naturalWidth'),
				basicImageNaturalHeight = basicImage.prop('naturalHeight'),
				basicImagePosition = basicImage.position(),  
				imgNaturalWidth = $this.prop('naturalWidth'),
				imgNaturalHeight = $this.prop('naturalHeight'),
				imgWidth = $this.width(),
				imgHeight = $this.height(),
				imgContainerWidth = imgContainer.width(),
				imgContainerHeight = imgContainer.height(),
				relImgWidth = 0,
				relImgHeight = 0,
				relIndex = imgNaturalWidth / imgNaturalHeight;

			if(imgNaturalWidth > basicImageNaturalWidth || imgNaturalHeight > basicImageNaturalHeight){
				$this.remove();
				console.log('tooltip: image is to big');
				input.tooltip({'position': 'top', 'content': 'Водяной знак больше исходного изображения!'});
			} else {

				if( _isBasicImageLarge ){

					if( basicImageNaturalWidth > basicImageNaturalHeight ){

						relImgWidth = (imgNaturalWidth * imgContainerWidth) / basicImageNaturalWidth;
						relImgHeight = relImgWidth / relIndex;

					} else if ( basicImageNaturalHeight > basicImageNaturalWidth ){

						relImgHeight = (imgNaturalHeight * imgContainerHeight) / basicImageNaturalHeight;
						relImgWidth = relImgHeight * relIndex;
					}

					$this.css({
						'width': Math.round(relImgWidth) + 'px',
						'height': Math.round(relImgHeight) + 'px'
					});

				} 

				 $this.css({
				 	'top': basicImagePosition.top + 'px',
					'left': basicImagePosition.left + 'px',
					'opacity': 1 	
				 });
				
			}		

		});
		
	}

	//upload images from local storage
	function _readFile(file, callback){
		var
			reader = new FileReader();

		//manipulation image after load
		$(reader).on('load', $.proxy(callback,this));

		$(reader).on('loadstart', function(e){
			if(e.originalEvent.total > MAX_FILE_SIZE){
				this.abort();
			}

		});

		$(reader).on('abort', $.proxy(function(){
			console.log('tooltip: image size is to big');
			$(this).tooltip({'position': 'top', 'content': 'Размер файла больше 2 МБ!'});
		},this));

		//show progressbar
		$(reader).on('progress', function(e){
			var
				oe = e.originalEvent,
				progress = 0;

			if(oe.lengthComputable){
				progress = parseInt( ((oe.loaded / oe.total) * 100), 10);
				console.log('progress: '+progress);
			}
		});
		if(file.type.match('image\/(png|jpe?g)')){
			reader.readAsDataURL(file);
		} else {
			$(this).closest('.custom-upload').tooltip({'position': 'top', 'content': 'Только картинки PNG и JPEG!'});
		}
		
	}


	return {
		init: initialization
	}

}());

//---------create watermark module----------//
var createWatermark = (function(){

	function initialization(){
		_setupEventListeners();
	}

	function _setupEventListeners(){
		console.log('okoko');
	}

	return {
		init: initialization
	}

}());

//---------create position module----------//

var positionModule = (function(){

	var initial = function () {
		_setUpListeners();
	};

	var _setUpListeners = function () {
		$('.switcher.multi').on('click', _multiTypeActive);
		$('.switcher.single').on('click', _singleTypeActive);
	}

	// Активируем мульти-режим
	var _multiTypeActive = function() {
		$('.switchers').children('.switcher.single').removeClass('active');
		$('.switchers').children('.switcher.multi').addClass('active');
		console.log("Multi active");
		multiModule.init();
		drag();
	}

	// Активируем одиночный режим
	var _singleTypeActive = function() {
		$('.switchers').children('.switcher.multi').removeClass('active');
		$('.switchers').children('.switcher.single').addClass('active');
		console.log("Single active");
		singleModule.init();
		drag();
		/*return false;*/
	}

	return {
		init: initial
	};

})();

//---------create single module----------//

var singleModule = (function(){

	var initial = function () {
		_setUpListeners();
	};

	var _setUpListeners = function () {
		$('[name = xpos]').on('keyup change', _writeNumberInputX);
		$('[name = ypos]').on('keyup change', _writeNumberInputY);
		$('.grid-item').on('click', _squarePosActive);
		$('.control-arrow').on('click', _arrowsPosExchange);
	}

	// позиционируем ватермарк через сетку
	var _squarePosActive = function() {
		var $this = $(this),
				square = $this.data('pos'),
				wmarkWrap = $('.waterMark__img'),
				imgWrap = $('.basicImage__img'),
				minPosX = 0,
        minPosY = 0,
        midPosX = (imgWrap.outerWidth() - wmarkWrap.outerWidth()) / 2,
        midPosY = (imgWrap.outerHeight() - wmarkWrap.outerHeight()) / 2,
        maxPosX = imgWrap.outerWidth() - wmarkWrap.outerWidth(),
        maxPosY = imgWrap.outerHeight() - wmarkWrap.outerHeight();

		//подсветка квадратика
		$('.grid-item').removeClass('active');
		$this.addClass('active');

		//клик - выбор квадратика
		switch (square) {
    	case 'top-left':
    	    wmarkWrap.css({'left':Math.round(minPosX),'top':Math.round(minPosY)});
    	    $('[name = xpos]').val(parseInt(minPosX,10));
					$('[name = ypos]').val(parseInt(minPosY,10));
    	    break;
    	case 'top-center':
    	    wmarkWrap.css({'left':Math.round(midPosX),'top':Math.round(minPosY)});
    	    $('[name = xpos]').val(parseInt(midPosX,10));
					$('[name = ypos]').val(parseInt(minPosY,10));
    	    break;
    	case 'top-right':
    	    wmarkWrap.css({'left':Math.round(maxPosX),'top':Math.round(minPosY)});
    	    $('[name = xpos]').val(parseInt(maxPosX,10));
					$('[name = ypos]').val(parseInt(minPosY,10));
    	    break;
    	case 'mid-left':
    	    wmarkWrap.css({'left':Math.round(minPosX),'top':Math.round(midPosY)});
    	    $('[name = xpos]').val(parseInt(minPosX,10));
					$('[name = ypos]').val(parseInt(midPosY,10));
    	    break;
    	case 'mid-center':
    	    wmarkWrap.css({'left':Math.round(midPosX),'top':Math.round(midPosY)});
    	    $('[name = xpos]').val(parseInt(midPosX,10));
					$('[name = ypos]').val(parseInt(midPosY,10));
    	    break;
    	case 'mid-right':
    	    wmarkWrap.css({'left':Math.round(maxPosX),'top':Math.round(midPosY)});
    	    $('[name = xpos]').val(parseInt(maxPosX,10));
					$('[name = ypos]').val(parseInt(midPosY,10));
    	    break;
    	case 'btm-left':
    	    wmarkWrap.css({'left':Math.round(minPosX),'top':Math.round(maxPosY)});
    	    $('[name = xpos]').val(parseInt(minPosX,10));
					$('[name = ypos]').val(parseInt(maxPosY,10));
    	    break;
    	case 'btm-center':
    	    wmarkWrap.css({'left':Math.round(midPosX),'top':Math.round(maxPosY)});
    	    $('[name = xpos]').val(parseInt(midPosX,10));
					$('[name = ypos]').val(parseInt(maxPosY,10));
    	    break;
    	case 'btm-right':
    	    wmarkWrap.css({'left':Math.round(maxPosX),'top':Math.round(maxPosY)});
    	    $('[name = xpos]').val(parseInt(maxPosX,10));
					$('[name = ypos]').val(parseInt(maxPosY,10));
    	    break;
     }
	};

	// вводим значение в инпут поле X
	var _writeNumberInputX = function () {
		//сброс подсветки с сетки
		$('.grid-item').removeClass('active');

		var $this = $(this),
				wmarkWrap = $('.waterMark__img'),
				imgWrap = $('.basicImage__img'),
				wmarkWidth = wmarkWrap.outerWidth(),
				imgWidth = imgWrap.outerWidth();

		//вызываем функция ввода только чисел
		onlyInteger($this);

		//проверка на максимально допустимое значение
		if($this.val() > (imgWidth - wmarkWidth)) {
			$this.val(imgWidth - wmarkWidth);
		}
		$('.waterMark__img').css({
			'left' : $this.val() + 'px'
		})
	};

	// вводим значение в инпут поле Y
	var _writeNumberInputY = function () {
		//сброс подсветки с сетки
		$('.grid-item').removeClass('active');

		var $this = $(this),
				wmarkWrap = $('.waterMark__img'),
				imgWrap = $('.basicImage__img'),
				wmarkHeight = wmarkWrap.outerHeight(),
				imgHeight = imgWrap.outerHeight();

		//вызываем функция ввода только чисел
		onlyInteger($this);

		//проверка на максимально допустимое значение
		if($this.val() > (imgHeight - wmarkHeight)) {
			$this.val(imgHeight - wmarkHeight);
		}
		$('.waterMark__img').css({
			'top' : $this.val() + 'px'
		})
	};

	//меняем координаты стрелками
	var _arrowsPosExchange = function(e) {
		e.preventDefault();

		var $this = $(this),
				minStepConst = 10;

	};
	
	return {
		init: initial
	};

})();

var multiModule = (function(){

	var initial = function () {
		_setUpListeners();
	};

	var _setUpListeners = function () {
		
	}

	return {
		init: initial
	};

})();