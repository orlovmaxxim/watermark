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
				'msg_dld' :'Скачать',
				'err_srv' : 'Ой... Произошла ошибка на сервере. Попробуйте другие настройки.'
			},
			en = {
				'err_res': 'Image resolution bigger than 2560x1600!',
				'err_mb': 'File size bigger than 5 MB!',
				'err_frmt' :'Only PNG and JPEG images!',
				'err_wm_sz' :'Watermark size bigger than basic image!',
				'msg_wt' :'Wait...',
				'msg_dld' :'Download',
				'err_srv' : 'Oops... Server error. Try to use another options.'
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
			waterMark = $('.waterMark__img'),
			waterMarkFile = $('#waterMark'),
			watermarkInput = waterMarkFile.siblings('.imitation-upload').find('input');
		//if img not undefind read it from local machine
		if(img){
			if(waterMark.length){
				waterMark.remove();
				watermarkInput.val('');
				_resetFile(waterMarkFile);
			}

			if($('[name=mode]').val() === '0'){
				singleModule.destroy();
			} else {
				multiModule.destroy();
				$('.switcher').toggleClass('active');
			}

			$('.disabled-area').css('display', 'block');

			//call file reader with event target scope
			_readFile.call(this, img, _basicImageLoadCallback);
		}
		
	}

	function _resetFile(el) {
	 	el.wrap('<form>').closest('form').get(0).reset();
	 	el.unwrap();
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
			imgContainer.removeAttr('style');
			_isBasicImageLarge = false;
		}
		//create new image 

		basicImage = imgContainer.prepend(imgMarkup).find('.basicImage__img').attr('src', e.target.result);

		//position image and show after load
		basicImage.on('load', function(e){
			var 
				$this = $(this),
				imgContainer = $('.main-image-wrapper'),
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

					//$this.css('top', Math.round((imgContainerHeight - imgHeight)/2) + 'px' );

					imgContainer.css({
						'height' : imgHeight
					});

				} else {

					//$this.css('left', Math.round((imgContainerWidth - imgWidth)/2) + 'px' );	
					
					imgContainer.css({
						'width' : imgWidth
					});
				}

			} else {

				// $this.css({
				// 	'top': Math.round((imgContainerHeight - imgHeight)/2) + 'px',
				// 	'left': Math.round((imgContainerWidth - imgWidth)/2) + 'px' 	
				// });
				
				imgContainer.css({
					'width' : imgWidth,
					'height' : imgHeight
				});
				
			}

			// imgContainer.css({
			// 	'width' : imgWidth,
			// 	'height' : imgHeight
			// });

			$this.css('opacity', 1);
			// $('.main-image-wrapper').css({
			// 			/*'position' : 'relative',*/
			// 			'left' : $('.basicImage__img').css('left'),
			// 			'top' : $('.basicImage__img').css('top')
			// 		})

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
			imgContainer.removeAttr('style');
		}

		if($('[name=mode]').val() === '0'){
				singleModule.destroy();
		} else {
				multiModule.destroy();
				$('.switcher').toggleClass('active');
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
					// $('.main-image-wrapper').css({
					// 	'position' : 'relative',
					// })
					drag('single');
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
		$('#main-form').on('submit', _submitForm)
						.on('reset', _resetForm);
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
			url: './create.php',
			data: new FormData(this),
			contentType: false,
			processData: false,
			type: 'POST',
			}).done(function(data){

				console.log(data.msg);
				if(data.msg){

					$('#loadFrame').attr('src', './php/download.php?name='+data.msg);	
				
				}else{

					_showAlert(lang.err_srv);
					
				}
				

			}).fail(function(jqXHR){

				_showAlert($.parseJSON(jqXHR.responseText).msg);

			}).always(function(){

				_submitFlag = true;
				submitBtn.val(lang.msg_dld);

			});
		}
		

	}

	function _showAlert(msg){
		var 
			markup =  '<div class="alert"></div>',
			alert = $('.alert');

		if(alert.length){
			alert.remove();
		}
		$('.main-area').append(markup).find('.alert').text(msg).delay(3000).fadeOut();
	}

	function _resetForm(e){
		e.preventDefault();

		if($('[name=mode]').val() === '0'){
			singleModule.destroy();
			singleModule.init();
		} else {
			multiModule.destroy();
			multiModule.init();
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

	function _vk(purl, title, img, text) {
		var url = '';
        url  = 'http://vkontakte.ru/share.php?';
        url += 'url='          + encodeURIComponent(purl);
        url += '&title='       + encodeURIComponent(title);
        url += '&description=' + encodeURIComponent(text);
        url += '&image='       + encodeURIComponent(img);
        url += '&noparse=true';
		_popup(url);
    }

    function _fb(purl, title, img, text) {
    	var url = '';
        url  = 'http://www.facebook.com/sharer.php?s=100';
        url += '&p[title]='     + encodeURIComponent(title);
        url += '&p[summary]='   + encodeURIComponent(text);
        url += '&p[url]='       + encodeURIComponent(purl);
        url += '&p[images][0]=' + encodeURIComponent(img);
        _popup(url);
    }

    function _tw(purl, title) {
    	var url = '';
        url  = 'http://twitter.com/share?';
        url += 'text='      + encodeURIComponent(title);
        url += '&url='      + encodeURIComponent(purl);
        url += '&counturl=' + encodeURIComponent(purl);
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
	var _multiTypeActive = function(e) {
		e.preventDefault();
		$('.switchers').children('.switcher.single').removeClass('active');
		$('.switchers').children('.switcher.multi').addClass('active');
		

		if($('[name=mode]').val()==='0'){
			console.log("Multi active");
		
			singleModule.destroy();
			multiModule.init();
			drag('multi');

		}

		
	}

	// Активируем одиночный режим
	var _singleTypeActive = function(e) {
		e.preventDefault();
		$('.switchers').children('.switcher.multi').removeClass('active');
		$('.switchers').children('.switcher.single').addClass('active');
		


		if($('[name=mode]').val()==='1'){
			console.log("Single active");
			
			multiModule.destroy();
			singleModule.init();
			drag('single');
		}
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
		$('[name=mode]').val(0);
	};

	var destroy = function() {
		var 
			inputs = $('input[type=hidden]').add('input[name=xpos], input[name=ypos]'),
			slider = $('.opacity-slider'),
			grid = $('.grid-list'),
			waterMark = $('.main-wmark-wrapper');

		inputs.val('0').filter('[name=opacity]').val(100);
		grid.find('.active').removeClass('active');
		slider.slider('value', 100);
		waterMark.css({'left': 0 , 'top': 0, 'opacity': 1});
		$('[name = xpos]').off('keyup change');
		$('[name = ypos]').off('keyup change');
		$('.grid-item').off('click');
		$('.control-arrow').off('click');
	};

	var _setUpListeners = function () {
		$('[name = xpos]').on('keyup change', _writeNumberInputX);
		$('[name = ypos]').on('keyup change', _writeNumberInputY);
		$('.grid-item').on('click', _squarePosActive);
		$('.control-arrow').on('click', _arrowsPosExchange);
	};

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

				if( (e.target.className == "control-arrow top top-x") && (currentPosX<maxPosX)) {

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
				
				$('.grid-item').removeClass('active');

	};
	
	return {
		init: initial,
		destroy: destroy
	};

})();

var multiModule = (function(){

	var initial = function () {
		var
			markup = '<div class="intervals"><div class="interval hor"></div><div class="interval vert"></div></div>';
		
		_setUpListeners();
		_reproduceWatermark();
		$('[name=mode]').val(1);
		$('.controls').addClass('for-multi');
		$('div.location').prepend(markup);
	};

	var destroy = function() {
		var 
			inputs = $('input[type=hidden]').add('input[name=xpos], input[name=ypos]'),
			slider = $('.opacity-slider'),
			grid = $('.grid-list'),
			waterMark = $('.main-wmark-wrapper'),
			clonnedWaterMark = waterMark.find('.clonned'),
			interval = $('.interval');

		inputs.val('0').filter('[name=opacity]').val(100);
		grid.find('.active').removeClass('active');
		slider.slider('value', 100);
		clonnedWaterMark.remove();
		waterMark.removeAttr('style').find('img').css('margin', 0);
		interval.filter('.hor').width(1).end().filter('.vert').height(1);
		$('.controls').removeClass('for-multi');
		$('.intervals').remove();
		$('[name = xpos]').off('keyup change');
		$('[name = ypos]').off('keyup change');
		$('.control-arrow').off('click');
		
	};

	var _setUpListeners = function () {
		$('[name = xpos]').on('keyup change', _writeNumberInputX);
		$('[name = ypos]').on('keyup change', _writeNumberInputY);
		$('.control-arrow').on('click', _arrowsPosExchange);
	}

	// вводим значение в инпут поле X
	var _writeNumberInputX = function () {

		var $this = $(this),
			basicImage = $('.main-image-wrapper'),
			waterMarkContainer = $('.main-wmark-wrapper'),
			waterMark = waterMarkContainer.find('img'),
			waterMarkSizes = { width: waterMark.width(), height: waterMark.height() },
			waterMarkCounts = { x: Math.round(basicImage.width()*2 / waterMarkSizes.width), y: Math.round(basicImage.height()*2 / waterMarkSizes.height) };
		
		//вызываем функция ввода только чисел
		onlyInteger($this);
		
		if(parseInt($this.val()) < 0 || $this.val().length === 0){
			$this.val(0);
		} else if(parseInt($this.val()) > 95){
			$this.val(95);
		}


		waterMarkContainer.width(waterMarkSizes.width*waterMarkCounts.x + parseInt($this.val())*(waterMarkCounts.x-1) );
	
		_setPatternSizes();
		if(parseInt($this.val()) === 0){
			$('.interval.hor').width(1);
		}else{
			$('.interval.hor').width(parseInt($this.val()));
		}
		

		$.each($('.waterMark__img'), function(idx, val){
			if(idx%waterMarkCounts.x != 0){

				$(val).css('margin-left', $this.val()+'px');

			}
		});

	};

	// вводим значение в инпут поле Y
	var _writeNumberInputY = function () {
		//сброс подсветки с сетки
		$('.grid-item').removeClass('active');

		var $this = $(this),
			basicImage = $('.main-image-wrapper'),
			waterMarkContainer = $('.main-wmark-wrapper'),
			waterMark = waterMarkContainer.find('img'),
			waterMarkSizes = { width: waterMark.width(), height: waterMark.height() },
			waterMarkCounts = { x: Math.round(basicImage.width()*2 / waterMarkSizes.width), y: Math.round(basicImage.height()*2 / waterMarkSizes.height) };
	

		//вызываем функция ввода только чисел
		onlyInteger($this);
			
		if(parseInt($this.val()) < 0 || $this.val().length === 0 ){
			$this.val(0);
		} else if(parseInt($this.val()) > 95){
			$this.val(95);
		}	

		waterMarkContainer.height(waterMarkSizes.height*waterMarkCounts.y + parseInt($this.val())*(waterMarkCounts.y-1) );
		_setPatternSizes();
		if(parseInt($this.val()) === 0){
			$('.interval.vert').height(1);
		} else {
			$('.interval.vert').height(parseInt($this.val()));
		}
		

		$.each($('.waterMark__img'), function(idx, val){
					
			$(val).css('margin-bottom', $this.val()+'px');
	
		});

	};

	var _setPatternSizes = function(){
		var
			waterMarkContainer = $('.main-wmark-wrapper');

		$('[name=patternWidth]').val(waterMarkContainer.width());
		$('[name=patternHeight').val(waterMarkContainer.height());
	}

	var _reproduceWatermark = function () {
		
		var 
			basicImage = $('.main-image-wrapper'),
			waterMarkContainer = $('.main-wmark-wrapper'),
			waterMark = waterMarkContainer.find('img'),
			waterMarkSizes = { width: waterMark.width(), height: waterMark.height() },
			waterMarkCounts = { x: Math.round(basicImage.width()*2 / waterMarkSizes.width), y: Math.round(basicImage.height()*2 / waterMarkSizes.height) };
		
		waterMarkContainer.width(waterMarkSizes.width * waterMarkCounts.x).height(waterMarkSizes.height * waterMarkCounts.y);
		for (var i = 0; i < waterMarkCounts.x * waterMarkCounts.y - 1; i++ ){
			waterMark.clone().addClass('clonned').appendTo(waterMarkContainer);
		}

		$('.waterMark__img').css('margin-left', 0);
		_setPatternSizes();
			

	};

	//меняем координаты стрелками
	var _arrowsPosExchange = function(e) {
		e.preventDefault();


		var $this = $(this),
			minStepConst = 1,
			basicImage = $('.main-image-wrapper'),
			waterMarkContainer = $('.main-wmark-wrapper'),
			waterMark = waterMarkContainer.find('img'),
			waterMarkSizes = { width: waterMark.width(), height: waterMark.height() },
			waterMarkCounts = { x: Math.round(basicImage.width()*2 / waterMarkSizes.width), y: Math.round(basicImage.height()*2 / waterMarkSizes.height) },
			xPos = $('input[name=xpos]'),
			yPos = $('input[name=ypos]');
			

				if (e.target.className === "control-arrow top top-x" && xPos.val() < 95) {

					
					$.each($('.waterMark__img'), function(idx, val){
						if(idx%waterMarkCounts.x != 0){
							var 
								offset = $(val).css('margin-left');

							$(val).css('margin-left', parseInt(offset)+minStepConst );

						}
					});
					waterMarkContainer.width(waterMarkContainer.width() + minStepConst*(waterMarkCounts.x-1) );
					xPos.val(parseInt(xPos.val())+minStepConst);
					//$('[name = xpos]').val(currentPosX + minStepConst);

				} else if(e.target.className === "control-arrow btm btm-x" && xPos.val() > 0) {

						$.each($('.waterMark__img'), function(idx, val){
						if(idx%waterMarkCounts.x != 0){
							var 
								offset = $(val).css('margin-left');

							$(val).css('margin-left', parseInt(offset)-minStepConst );

						}
					});
					waterMarkContainer.width(waterMarkContainer.width() - minStepConst*(waterMarkCounts.x-1) );
					xPos.val(parseInt(xPos.val())-minStepConst);

					} else if(e.target.className === "control-arrow top top-y" && yPos.val() < 95) {

						$.each($('.waterMark__img'), function(idx, val){
							
								var 
									offset = $(val).css('margin-bottom');

								$(val).css('margin-bottom', parseInt(offset)+minStepConst );

							
						});
						waterMarkContainer.height(waterMarkContainer.height() + minStepConst*(waterMarkCounts.y-1) );
						yPos.val(parseInt(yPos.val())+minStepConst);
					} else if(e.target.className === "control-arrow btm btm-y" && yPos.val() > 0){

						$.each($('.waterMark__img'), function(idx, val){
							
								var 
									offset = $(val).css('margin-bottom');

								$(val).css('margin-bottom', parseInt(offset)-minStepConst );

							
						});
						waterMarkContainer.height(waterMarkContainer.height() - minStepConst*(waterMarkCounts.y-1) );
						yPos.val(parseInt(yPos.val())-minStepConst);
					}
				_setPatternSizes();
				$('.interval.hor').width(parseInt(xPos.val()));
				$('.interval.vert').height(parseInt(yPos.val()));
				if(parseInt(xPos.val()) === 0){
					$('.interval.hor').width(1);
				} 
				if (parseInt(yPos.val()) === 0){
					$('.interval.vert').height(1);
				}
				

	};

	return {
		init: initial,
		destroy: destroy
	};

})();
