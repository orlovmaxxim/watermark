"use strict";

//-----localisation-----//
var lang = (function () {
		var 
			ru = {
				'err_res': 'Разрешение изображения больше 2560x1600!',
				'err_mb': 'Размер файла больше 5 МБ!',
				'err_frmt' :'Только картинки PNG и JPEG!',
				'err_wm_sz' :'Водяной знак больше исходного изображения!',
				'msg_wt' :'Подождите...',
				'msg_dld' :'Скачать'
			},
			en = {
				'err_res': 'Image resolution bigger than 2560x1600!',
				'err_mb': 'File size bigger than 5 MB!',
				'err_frmt' :'Only PNG and JPEG images!',
				'err_wm_sz' :'Watermark size bigger than basic image!',
				'msg_wt' :'Wait...',
				'msg_dld' :'Download'
			};
		
		if(window.location.search === "?lang=en"){
			return en;
		} else if(window.location.search === "?lang=ru"){
			return ru;
		} else {
			return ru;
		}
				
}());

//-------image upload module--------//
var imgUpload = (function(){

	var 
		_isBasicImageLarge = false,
		MAX_FILE_SIZE = 5000000, // this/1000000 MB
		MAX_UNCOMPRESSED_FILE_SIZE = 16384000;//color image 2560x1600


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
			imgContainer = $('.main-image-wrapper'),
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

		//position image and show after load
		basicImage.on('load', function(e){
			var 
				$this = $(this),
				imgContainer = $('.main-area'),
				input = $('#basicImage').closest('.custom-upload'),
				imgNaturalWidth = $this.prop('naturalWidth'),
				imgNaturalHeight = $this.prop('naturalHeight'),
				imgWidth = $this.width(),
				imgHeight = $this.height(),
				imgContainerWidth = imgContainer.width(),
				imgContainerHeight = imgContainer.height();

			if((imgNaturalWidth * imgNaturalHeight * 4) > MAX_UNCOMPRESSED_FILE_SIZE){

				_clearInput(input);
				//input.tooltip({'position': 'top', 'content': 'Разрешение изображения больше 4К!'});
				input.tooltip({'position': 'top', 'content': lang.err_res });
				return;
			}

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
			$('.main-image-wrapper').css({
						/*'position' : 'relative',*/
						'left' : $('.basicImage__img').css('left'),
						'top' : $('.basicImage__img').css('top')
					})

		});


			waterMark.prop('disabled',false);

			$this.siblings('.imitation-upload').find('input').val(img.name);

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
			imgContainer = $('.main-wmark-wrapper'),
			disabledArea = $('.disabled-area'),
			imgMarkup = '<img src="" class="waterMark__img" />',
			waterMark = $('.waterMark__img');

		//remove image if already exist
		if(waterMark.length){
			waterMark.remove();
		}

		//append new image
		waterMark = imgContainer.prepend(imgMarkup).find('.waterMark__img').attr('src', e.target.result);
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

			if((imgNaturalWidth * imgNaturalHeight * 4) > MAX_UNCOMPRESSED_FILE_SIZE){

				_clearInput(input);
				//input.tooltip({'position': 'top', 'content': 'Разрешение изображения больше 4К!'});
				input.tooltip({'position': 'top', 'content': lang.err_res});
				return;
			}

			if(imgNaturalWidth > basicImageNaturalWidth || imgNaturalHeight > basicImageNaturalHeight){
				$this.remove();
				console.log('tooltip: image is to big');
				_clearInput(input);
				//input.tooltip({'position': 'top', 'content': 'Водяной знак больше исходного изображения!'});
				input.tooltip({'position': 'top', 'content': lang.err_wm_sz});
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
					$('.main-image-wrapper').css({
						'position' : 'relative',
					})
					drag();
					singleModule.init();
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
			//$(this).tooltip({'position': 'top', 'content': 'Размер файла больше 2 МБ!'});
			$(this).tooltip({'position': 'top', 'content': lang.err_mb});
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
			//$(this).closest('.custom-upload').tooltip({'position': 'top', 'content': 'Только картинки PNG и JPEG!'});
			$(this).closest('.custom-upload').tooltip({'position': 'top', 'content': lang.err_frmt});
		}
		
	}

	function _clearInput(input){
		var
			inputField = input.find('input[type=text]');
		inputField.val('');
	}


	return {
		init: initialization
	}

}());

//---------create watermark module----------//
var createWatermark = (function(){

	var
		_submitFlag = true;

	function initialization(){
		_setupEventListeners();
	}

	function _setupEventListeners(){
		$('#main-form').on('submit', _submitForm);
	}

	function _submitForm(e){
		e.preventDefault();

		var
			$this = $(this),
			submitBtn = $this.find('input[type=submit]');

		if(_submitFlag){

			_submitFlag = false;
			submitBtn.val(lang.msg_wt);

			$.ajax({
			url: './php/create.php',
			data: new FormData(this),
			contentType: false,
			processData: false,
			type: 'POST',
			}).done(function(data){

				console.log(data.name);
				$('#loadFrame').attr('src', './php/download.php?name='+data.name);

			}).fail(function(jqXHR){

				console.log($.parseJSON(jqXHR.responseText).msg);

			}).always(function(){

				_submitFlag = true;
				submitBtn.val(lang.msg_dld);

			});
		}
		

	}

	return {
		init: initialization
	}

}());

//-----sharing module-----//
var shareModule = (function(){

	function initialization(){
		_setupEventListeners();
	}

	function _setupEventListeners(){
		$('.share-icon, .share-socials-list').on('mouseenter', function(e){
			$('.share-icon').addClass('active');
		}).on('mouseleave', function(e){
			$('.share-icon').removeClass('active');
		});
		$('.share-socials-link').on('click', _clickHandler);
	}

	function _clickHandler(e){
		e.preventDefault;

		var
			$this = $(this),
			info = {
				url: 'http://homework.sarychevstas.ru/gp3',
				title: 'Генератор водяных знаков',
				img: 'http://homework.sarychevstas.ru/gp3/img/group-logo.png',
				text: 'Выпускной проект #3 команды "Супер группа".'
			};

		if($this.hasClass('vk-icon')){

			_vk(info.url, info.title, info.img, info.text);

		} else if ($this.hasClass('fb-icon')){

			_fb(info.url, info.title, info.img, info.text);

		} else if ($this.hasClass('tw-icon')){

			_tw(info.url, info.title);

		}
	}

	function _vk(url, title, img, text) {
        url  = 'http://vkontakte.ru/share.php?';
        url += 'url='          + encodeURIComponent(url);
        url += '&title='       + encodeURIComponent(title);
        url += '&description=' + encodeURIComponent(text);
        url += '&image='       + encodeURIComponent(img);
        url += '&noparse=true';
		_popup(url);
    }

    function _fb(url, title, img, text) {
        url  = 'http://www.facebook.com/sharer.php?s=100';
        url += '&p[title]='     + encodeURIComponent(title);
        url += '&p[summary]='   + encodeURIComponent(text);
        url += '&p[url]='       + encodeURIComponent(url);
        url += '&p[images][0]=' + encodeURIComponent(img);
        _popup(url);
    }

    function _tw(url, title) {
        url  = 'http://twitter.com/share?';
        url += 'text='      + encodeURIComponent(title);
        url += '&url='      + encodeURIComponent(url);
        url += '&counturl=' + encodeURIComponent(url);
        _popup(url);
    }

    function _popup(url){
    	window.open(url,'','toolbar=0,status=0,width=626,height=436');
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
				wmarkWrap = $('.main-wmark-wrapper'),
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
		$('.main-wmark-wrapper').css({
			'left' : $this.val() + 'px'
		})
	};

	// вводим значение в инпут поле Y
	var _writeNumberInputY = function () {
		//сброс подсветки с сетки
		$('.grid-item').removeClass('active');

		var $this = $(this),
				wmarkWrap = $('.main-wmark-wrapper'),
				imgWrap = $('.basicImage__img'),
				wmarkHeight = wmarkWrap.outerHeight(),
				imgHeight = imgWrap.outerHeight();

		//вызываем функция ввода только чисел
		onlyInteger($this);

		//проверка на максимально допустимое значение
		if($this.val() > (imgHeight - wmarkHeight)) {
			$this.val(imgHeight - wmarkHeight);
		}
		$('.main-wmark-wrapper').css({
			'top' : $this.val() + 'px'
		})
	};

	//меняем координаты стрелками
	var _arrowsPosExchange = function(e) {
		e.preventDefault();

		var $this = $(this),
				minStepConst = 5,
				wmarkWrap = $('.main-wmark-wrapper'),
				imgWrap = $('.basicImage__img'),
				currentPosX = parseInt(wmarkWrap.css('left'), 10),
				currentPosY = parseInt(wmarkWrap.css('top'), 10),
				maxPosX = imgWrap.outerWidth() - wmarkWrap.outerWidth(),
        maxPosY = imgWrap.outerHeight() - wmarkWrap.outerHeight();
				/*currentWidth = wmarkWrap.css('width'), //пока за место проверки
				currentHeight = wmarkWrap.css('height'); // пока за место проверки*/

				if( (e.target.className == "control-arrow top top-x") && (currentPosX!=maxPosX)) {

					wmarkWrap.css('left', currentPosX + minStepConst);
					$('[name = xpos]').val(currentPosX + minStepConst);

				} else if(e.target.className == "control-arrow btm btm-x" && (currentPosX!=0)) {

						wmarkWrap.css('left', currentPosX - minStepConst);
						$('[name = xpos]').val(currentPosX - minStepConst);

					} else if(e.target.className == "control-arrow top top-y" && (currentPosY!=0)) {

							wmarkWrap.css('top', currentPosY - minStepConst);
							$('[name = ypos]').val(currentPosY - minStepConst);

					} else if(e.target.className == "control-arrow btm btm-y" && (currentPosY!=maxPosY)){

								wmarkWrap.css('top', currentPosY + minStepConst);
								$('[name = ypos]').val(currentPosY + minStepConst);
					}
				
				/*wmarkWrap.css({
				'height' : currentHeight,
				'width' : currentWidth
			})*/
				$('.grid-item').removeClass('active');

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

	var reproduceWaterm = function () {
		
	};

	return {
		init: initial
	};

})();
