"use strict";

var upload = (function(){

	function initialization(){
		_setupEventListeners();
		_imageUpload('#basicImage', _basicImageDoneCallback);
		_imageUpload('#waterMark', _waterMarkDoneCallback);
		//_formUpload();
	}

	function _setupEventListeners(){
		$('#main-form').on('submit', _formSubmitHandler);
	}

	function _formSubmitHandler(e){
		e.preventDefault();
		
		var 
			data = $(this).serializeArray();
		console.log(data);
		// var
		// 	$this = $(this);

		// $this.fileupload('send', {})
	}

	function _formUpload(){
		var
			form = $('#main-form');

		form.fileupload({
			dataType: 'json',
			url: 'php/main.php',
			replaceFileInput: false,
			autoUpload: false,
			done: function(e,data){
				console.log('form sbmt');
			}
		});
	}

	function _basicImageDoneCallback(e,data){
		var
			$this = $(this),
			imgContainer = $('.main-area'),
			imgMarkup = '<img src="" class="basicImage__img" />',
			waterMark = $this.closest('.upload').find('#waterMark');

		$this.siblings('.imitation-upload').find('input').val(data.files[0].name);
		waterMark.prop('disabled',false);
		imgContainer.append(imgMarkup).find('.basicImage__img').attr('src', data.result.img);
	}

	function _waterMarkDoneCallback(e,data){
		var
			$this = $(this),
			imgContainer = $('.main-area'),
			disabledArea = $('.disabled-area'),
			imgMarkup = '<img src="" class="waterMark__img" />';

		$this.siblings('.imitation-upload').find('input').val(data.files[0].name);
		imgContainer.append(imgMarkup).find('.waterMark__img').attr('src', data.result.img);
		_controlsInit();

	}

	function _imageUpload(input_id, callback){
		var
			el = $(input_id);

		el.fileupload({
			dataType: 'json',
			url: 'php/upload.php',
			replaceFileInput: false,
			done: callback
		});
	}

	function _controlsInit(){

	}

	return {
		init: initialization
	}

}());