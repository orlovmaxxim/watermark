"use strict";

//-------image upload module--------//
var imgUpload = (function(){

	var 
		_isBasicImageLarge = false,
		MAX_FILE_SIZE = 5000000, // this/1000000 MB
		MAX_UNCOMPRESSED_FILE_SIZE = 33177600;//4k color image 3640x2160


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
				input.tooltip({'position': 'top', 'content': 'Разрешение изображения больше 4К!'});
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

			if((imgNaturalWidth * imgNaturalHeight * 4) > MAX_UNCOMPRESSED_FILE_SIZE){

				_clearInput(input);
				input.tooltip({'position': 'top', 'content': 'Разрешение изображения больше 4К!'});
				return;
			}

			if(imgNaturalWidth > basicImageNaturalWidth || imgNaturalHeight > basicImageNaturalHeight){
				$this.remove();
				console.log('tooltip: image is to big');
				_clearInput(input);
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
			submitBtn.val('Подождите...');

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
				submitBtn.val('Скачать');

			});
		}
		

	}

	return {
		init: initialization
	}

}());

