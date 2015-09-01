var dragAndDrop;
var watermarkOpacity;
var watermarkPosition;
var switcher;
var loading;
var formImg;

dragAndDrop = (function(){

    // set variables
    var xpos = $('.controls input[name="xpos"]'),
        ypos = $('.controls input[name="ypos"]'),
        imgWrap = $('.main-image-wrapper'),
        wmarkWrap = $('.main-wmark-wrapper');

    // append watermark to working area
    var appendDraggableEl = function(url){
            var appendEl = $('<img class="watermark" src="' + url + '">');

            _removeClonedWatermark();
            wmarkWrap.append(appendEl);

            appendEl.on('load', function(){
                _dragDestroy();
                _checkContainment();
            });
        },

    // check the drag mode
        _checkContainment = function () {
            var img = $('#image'),
                wmark = $('.watermark');

            wmarkWrap.css({'height': wmark.height() ,'width': wmark.width()});

            if(wmark.width() > img.width() && wmark.height() > img.height()) {
                _dragUnContainment('single');
            } else {
                _dragContainment();
            }
        },

    // if watermark less than the image - use containment settings
        _dragContainment = function () {
            wmarkWrap.draggable({
                containment: '#image',
                cursor: 'move',
                drag: function(ev, ui){
                    xpos.val(Math.round(ui.position.left));
                    ypos.val(Math.round(ui.position.top));
                    watermarkPosition.clearGrid();
                }
            });
        },

    // if watermark bigger than the image - use uncontainment settings
        _dragUnContainment = function (mode) {
            wmarkWrap.draggable({
                drag: function(ev, ui){
                    if(mode === 'single') {
                        xpos.val(Math.round(ui.position.left));
                        ypos.val(Math.round(ui.position.top));
                        watermarkPosition.clearGrid();
                    }
                },
                stop: function(ev, ui) {
                    var hel = ui.helper,
                        pos = ui.position;

                    // horizontal
                    var h = -(hel.outerHeight() - $(hel).parent().outerHeight());
                    if (pos.top >= 0) {
                        hel.animate({ top: 0 });
                        if(mode === 'single') {
                            ypos.val(0);
                        }
                    } else if (pos.top <= h) {
                        hel.animate({ top: h });
                        if(mode === 'single') {
                            ypos.val(h);
                        }
                    }

                    // vertical
                    var v = -(hel.outerWidth() - $(hel).parent().outerWidth());

                    if (pos.left >= 0) {
                        hel.animate({ left: 0 });
                        if(mode === 'single') {
                            xpos.val(0);
                        }

                    } else if (pos.left <= v) {
                        hel.animate({ left: v });
                        if(mode === 'single') {
                            xpos.val(v);
                        }
                    }
                }
            });
        },

    // toggle multi or single mode
        toggleMode = function(mode){
            _dragDestroy();

            if(mode === 'multi') {
                _dragUnContainment('multi');
                _cloneWatermark();
            } else {
                _checkContainment();
                _removeClonedWatermark();
            }
        },

    // cloning watermark for the multi mode
        _cloneWatermark = function(){
            var wmark = $('.watermark'),
                wmarkHeight = wmark.height(),
                wmarkWidth = wmark.width(),
                patternWidth = imgWrap.width(),
                patternHeight = imgWrap.height(),
                clone = wmark.clone().addClass('watermark_cloned'),
                needClonesHor = Math.ceil(patternWidth / wmarkWidth),
                needClonesVert = Math.ceil(patternHeight / wmarkHeight),
                needClones = needClonesHor * needClonesVert * 4 -1,
                tmp = [];

            for ( var i = 0; i < needClones; i++ ) {
                $.merge( tmp, clone.clone().get() );
            }

            wmarkWrap.css({
                'width': needClonesHor * wmarkWidth + wmarkWidth + 'px',
                'height': needClonesVert * wmarkHeight + wmarkHeight +'px'
            });
            wmarkWrap.append(tmp);
        },

    // remove cloned watermarks
        _removeClonedWatermark = function(){
            var clonedEl = $('.watermark_cloned');

            if(clonedEl.length) {
                clonedEl.remove();
            }
        },

    // drag destroy
        _dragDestroy = function(){
            if(wmarkWrap.data('uiDraggable')){
                wmarkWrap.draggable("destroy");
            }
        };

    return {
        appendEl: appendDraggableEl,
        toggle: toggleMode
    };

})();

watermarkOpacity = (function(){

    // set variables
    var sliderEl = $('.opacity-slider'),
        wmarkWrap = $('.main-wmark-wrapper');

    var init = function(){
            // set variables
            var hiddenOpacity = $('input[name="opacity"]');

            // slider initialization
            if (sliderEl.length) {
                sliderEl.slider({
                    min: 0,
                    max: 100,
                    value: 100,
                    range: 'min',
                    disabled: true,
                    slide: function(event, ui) {
                        wmarkWrap.css('opacity', ui.value / 100);
                        hiddenOpacity.val(ui.value);
                    }
                });
            }
        },

    // slider enable
        sliderEnable = function(){
            sliderEl.slider( "option", "disabled", false );
        },

    // slider reset
        sliderReset = function(){
            sliderEl.slider('value', 100);
            wmarkWrap.css('opacity', 100);
        };

    return {
        init: init,
        enable: sliderEnable,
        reset: sliderReset
    };

})();

watermarkPosition = (function(){

    // set variables
    var min = 0,
        imgWrap = $('.main-image-wrapper'),
        wmarkWrap = $('.main-wmark-wrapper'),
        xpos = $('.b-controls input[name="xpos"]'),
        ypos = $('.b-controls input[name="ypos"]');

    var init = function(){
            _setUpListeners();
        },

    // set listeners
        _setUpListeners = function(){
            $('.b-controls input[type="text"]')
                .on('input', _inputChange).prop('disabled', false)
                .on('keypress', function(e) {
                    return /\d/.test(String.fromCharCode(e.keyCode));
                });
            $('.b-controls .b-control-arrow').on('click touchstart', _arrowsChange);
            $('.b-grid-list li').on('click touchstart', _gridChange);
        },

    // set the position of the watermark with the grid
        _gridChange = function(){
            var minPosX = 0,
                minPosY = 0,
                midPosX = (imgWrap.width() - wmarkWrap.width()) / 2,
                midPosY = (imgWrap.height() - wmarkWrap.height()) / 2,
                maxPosX = imgWrap.width() - wmarkWrap.width(),
                maxPosY = imgWrap.height() - wmarkWrap.height(),
                li = $(this),
                position = li.data('pos');

            clearGrid();
            li.addClass('active');

            switch (position) {
                case 'top-left':
                    wmarkWrap.css({'left':minPosX,'top':minPosY});
                    _setPosition(minPosX,minPosY);
                    break;
                case 'top-center':
                    wmarkWrap.css({'left':midPosX,'top':minPosY});
                    _setPosition(midPosX,minPosY);
                    break;
                case 'top-right':
                    wmarkWrap.css({'left':maxPosX,'top':minPosY});
                    _setPosition(maxPosX,minPosY);
                    break;
                case 'mid-left':
                    wmarkWrap.css({'left':minPosX,'top':midPosY});
                    _setPosition(minPosX,midPosY);
                    break;
                case 'mid-center':
                    wmarkWrap.css({'left':midPosX,'top':midPosY});
                    _setPosition(midPosX,midPosY);
                    break;
                case 'mid-right':
                    wmarkWrap.css({'left':maxPosX,'top':midPosY});
                    _setPosition(maxPosX,midPosY);
                    break;
                case 'btm-left':
                    wmarkWrap.css({'left':minPosX,'top':maxPosY});
                    _setPosition(minPosX,maxPosY);
                    break;
                case 'btm-center':
                    wmarkWrap.css({'left':midPosX,'top':maxPosY});
                    _setPosition(midPosX,maxPosY);
                    break;
                case 'btm-right':
                    wmarkWrap.css({'left':maxPosX,'top':maxPosY});
                    _setPosition(maxPosX,maxPosY);
                    break;
            }
        },

    // set the position of the watermark with the inputs
        _inputChange = function(){
            var $this = $(this),
                wmark = $('.watermark'),
                maxPosition = $this.is(xpos) ? imgWrap.width() - wmarkWrap.width() : imgWrap.height() - wmarkWrap.height(),
                maxMargin = $this.is(xpos) ? imgWrap.width() : imgWrap.height(),
                multi = $('.multi'),
                max = multi.hasClass('active') ? maxMargin : maxPosition,
                axis = $this.is(xpos) ? 'left' : 'top',
                wh = $this.is(ypos) ? 'width' : 'height',
                wmarkParam = $this.is(ypos) ? wmark.width() : wmark.height(),
                hv = $this.is(ypos) ? '.hor' : '.vert',
                margin = $this.is(xpos) ? 'margin-bottom' : 'margin-right',
                clonesWidthCount = Math.ceil(imgWrap.width() / wmark.width()) + 1,
                clonesHeightCount = Math.ceil(imgWrap.height() / wmark.height()) + 1,
                clones = $this.is(ypos) ? clonesWidthCount : clonesHeightCount;

            if($this.val() > max){
                $this.val(max);
            } else if($this.val() < min){
                $this.val(min);
            }

            if(multi.hasClass('active')){
                wmark.css(margin, $this.val() + 'px');
                $('.watermark:nth-child(' + clonesWidthCount + 'n)').css('margin-right', 0);
                wmarkWrap.css(wh, (wmarkParam * clones) + (parseInt($this.val()) * (clones -1)));
                if ($this.val() > 0) {
                    $('.interval' + hv).css(wh, Math.ceil($this.val()/2) + 'px');
                } else if ($this.val() == 0) {
                    $('.interval' + hv).css(wh, '1px');
                }
            } else {
                wmarkWrap.css(axis, $this.val() + 'px');
            }

            clearGrid();
        },

    // set the position of the watermark with the arrows
        _arrowsChange = function(e){
            e.preventDefault ? e.preventDefault() : e.returnValue;

            var $this = $(this),
                input = $this.siblings('input[type="text"]'),
                multi = $('.multi'),
                wmark = $('.watermark'),
                curVal = parseInt(input.val()) || 0,
                changeVal = $this.hasClass('top') ? curVal + 1 : curVal - 1,
                maxPosition = input.is(xpos) ? imgWrap.width() - wmarkWrap.width() : imgWrap.height() - wmarkWrap.height(),
                maxMargin = input.is(xpos) ? imgWrap.width() : imgWrap.height(),
                max = multi.hasClass('active') ? maxMargin : maxPosition,
                axis = input.is(xpos) ? 'left' : 'top',
                wh = input.is(ypos) ? 'width' : 'height',
                wmarkParam = input.is(ypos) ? wmark.width() : wmark.height(),
                hv = input.is(ypos) ? '.hor' : '.vert',
                margin = input.is(xpos) ? 'margin-bottom' : 'margin-right',
                clonesWidthCount = Math.ceil(imgWrap.width() / wmark.width()) + 1,
                clonesHeightCount = Math.ceil(imgWrap.height() / wmark.height()) + 1,
                clones = input.is(ypos) ? clonesWidthCount : clonesHeightCount;

            if(changeVal > max || changeVal < min){
                changeVal = (changeVal > max) ? max : min;
                $this.addClass('disabled');
            } else if($this.siblings().hasClass('disabled')){
                $this.siblings().removeClass('disabled');
            }

            if(multi.hasClass('active')){
                wmark.css(margin, changeVal);
                $('.watermark:nth-child(' + clonesWidthCount + 'n)').css('margin-right', 0);
                wmarkWrap.css(wh, (wmarkParam * clones) + (changeVal * (clones -1)));
                if (changeVal > 0) {
                    $('.interval' + hv).css(wh, Math.ceil(changeVal/2));
                }
            } else {
                wmarkWrap.css(axis, changeVal);
            }

            input.val(changeVal);
            clearGrid();
        },

    // set watermark position
        _setPosition = function(x,y){
            xpos.val(Math.round(x));
            ypos.val(Math.round(y));
        },

    // disable form events: buttons, arrows, grid, inputs
        disableEvents = function(){
            var elems = $('.b-controls input[type="text"], .b-control-arrow, .b-grid-list li');

            $('.b-controls input[type="text"]').off('input', _inputChange);
            $('.b-controls .b-control-arrow').off('click touchstart', _arrowsChange);
            $('.b-grid-list li').off('click touchstart', _gridChange);

            elems.on('click touchstart input', function(e){
                e.preventDefault ? e.preventDefault() : e.returnValue;
            });

            elems.filter('input').prop('disabled', true);
        },

    // remove grid marker
        clearGrid = function(){
            var gridItems = $('.grid-list li');

            if(gridItems.hasClass('active')){
                gridItems.removeClass('active');
            }
        },

    // reset watermark position
        resetPosition = function(){
            _setPosition(0,0);

            wmarkWrap.css({
                'left': 0,
                'top': 0
            });

            $('.watermark').removeAttr('style');

            clearGrid();

            $('.b-interval.m-hor').css('width', '1px');
            $('.b-interval.m-vert').css('height', '1px');
        };

    return {
        init: init,
        reset: resetPosition,
        clearGrid: clearGrid,
        disable: disableEvents
    };

})();

switcher  = (function(){

    // set variables
    var switchers = $('.switcher'),
        blockLocation =$('.location');

    var init = function(){
            _setupListeners();
        },

    // set listeners
        _setupListeners = function(){
            if (switchers.length) {
                switchers.on('click touchstart', function(e) {
                    (e.preventDefault) ? e.preventDefault(): e.returnValue;
                    changePattern($(this));
                });
            }
        },

    // change mode: multi or single
        changePattern = function(elem){

            watermarkPosition.reset();
            watermarkOpacity.reset();
            loading.reset();

            var el = elem || $(this),
                intervals = $('.intervals'),
                hidden = $('.hidden-switch'),
                inputWrap = $('.controls');

            if (el.data('switch') === 'single') {
                if (intervals.length) {
                    intervals.remove();
                    dragAndDrop.toggle('single');
                }
                hidden.val('single');
            } else {
                if (!intervals.length) {
                    blockLocation.prepend('<div class="intervals"><div class="interval hor" /><div class="interval vert" />');
                    dragAndDrop.toggle('multi');
                }
                hidden.val('multi');
            }

            // check icon mode
            if (!(el.hasClass('active'))) {
                el.addClass('active');
                el.siblings('.active').removeClass('active');

                // check input mode
                if (el.data('switch') === 'single') {
                    inputWrap.removeClass('for-multi');
                } else {
                    inputWrap.addClass('for-multi');
                }
            }
        };

    return {
        init: init,
        change: changePattern
    }

})();

loading = (function(){

    // set fileUpload options
    var init = function(){
            var options = {
                    dataType: 'json',
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    maxFileSize: 150000,
                    // Enable image resizing, except for Android and Opera,
                    // which actually support image resizing, but fail to
                    // send Blob objects via XHR requests:
                    disableImageResize: /Android(?!.*Chrome)|Opera/
                        .test(window.navigator && navigator.userAgent)
                },

                fileUpload = $('input[type="file"]').fileupload(options);
            _setUpFileUploadListeners(fileUpload);
        },

    // set listeners
        _setUpFileUploadListeners = function (fileUpload) {
            fileUpload.on('fileuploadadd', _fileUploadAdd);
            fileUpload.on('fileuploaddone', _fileUploadDone);
            fileUpload.on('fileuploadprocessalways', _fileUploadAlways);
            fileUpload.on('fileuploadchange', _fileUploadChange);
            fileUpload.on('fileuploaddrop', _fileDisableDrop);
        },

    // add options only for basic image
        _fileUploadAdd = function () {
            if($(this).is('#fileupload')) {
                var fileupload = $(this).data('blueimpFileupload');
                fileupload.options.imageMaxWidth = 650;
                fileupload.options.imageMaxHeight = 534;
                fileupload.options.maxFileSize = 1000000;
            }
        },

    // upload images in work area
        _fileUploadDone = function (e, data) {
            var $this = $(this),
                type = $this.is('#fileupload') ? 'image' : 'watermark',
                imgName = data.result.files[0].name,
                src = 'php/files/' + imgName,
                img = $('<img id="'+ type +'" src="' + src + '">'),
                wmark = $('.watermark'),
                wmarkFile = $('#wmarkfile');

            $this.siblings().children('input').val(imgName);

            switcher.change($('.switcher.single'));
            watermarkOpacity.init();

            if(type == 'image'){
                var imgWrap = $('.main-image-wrapper');

                if(wmark.length) {
                    wmark
                        .parent().removeAttr('style')
                        .end().remove();
                    wmarkFile
                        .parent('.custom-upload')
                        .find('.input').val('');
                    _disableSections();
                }

                imgWrap.prepend(img);
                img.on('load', function(){
                    $('.main-image-wrapper').css({'height':$(this).height() ,'width':$(this).width()});
                });

            } else {
                watermarkPosition.reset();
                dragAndDrop.appendEl(src);
                watermarkOpacity.enable();
                watermarkPosition.init();
                $('.disabled-area').css('display','none');
                $('.section').removeClass('disabled');
                $('.btns input').prop('disabled', false);
            }

            wmarkFile.prop('disabled', false);
            $('.custom-upload').removeClass('disabled');
        },

    // show errors
        _fileUploadAlways = function (e, data) {
            var index = data.index,
                file = data.files[index],
                lang = localStorage.getItem('lang') || 'ru',
                errorMsg = file.error;

            if(lang === 'ru'){
                if(file.error === 'File is too large') {
                    errorMsg = 'Файл слишком большой'
                } else {
                    errorMsg = 'Недопустимый тип файла'
                }
            }

            if (file.error) {
                $(this).tooltip({ content: errorMsg });
                $(this).siblings().children('input').val('');
                _disableSections();
            }
        },

    // remove errors and images
        _fileUploadChange = function () {
            var file = $(this).is('#fileupload') ? 'image' : 'watermark',
                fileSelector = $('#'+ file),
                type = $(this).attr('id');

            if(file == 'watermark'){
                fileSelector = $('.'+ file);
            }

            fileSelector
                .parent().removeAttr('style')
                .end().remove();
            $('.tooltip[data-name="' + file + '"]').remove();
        },

    // disable sections if watermark not loaded
        _disableSections = function(){
            watermarkPosition.reset();
            watermarkOpacity.reset();
            watermarkPosition.disable();

            $('.disabled-area').css('display','block');
            $('.section:not(:first-child)').addClass('disabled');
            $('.btns input').prop('disabled', true);
        },

    // disable sections if watermark not loaded
        _disableSections = function(){
            watermarkPosition.reset();
            watermarkOpacity.reset();
            $('.disabled-area').css('display','block');
            $('.section:not(:first-child)').addClass('disabled');
            $('.btns input').prop('disabled', true);
        },

    // disable sections if watermark not loaded
        _disableSections = function(){
            watermarkPosition.reset();
            watermarkOpacity.reset();
            watermarkPosition.disable();

            $('.disabled-area').css('display','block');
            $('.section:not(:first-child)').addClass('disabled');
            $('.btns input').prop('disabled', true);
        },

    // disable drop
        _fileDisableDrop = function (e) {
            (e.preventDefault) ? e.preventDefault(): e.returnValue;
        },

    // remove tooltip
        resetError = function(){
            $('.tooltip').remove();
        };

    return {
        init: init,
        reset: resetError
    }

})();

formImg = (function(){

    var init,
        _setUpListeners,
        _formSubmit,
        _showLoader,
        _hideLoader,
        _formReset;
    init = function () {
        _setUpListeners();
    };
    _setUpListeners = function () {
        var $form = $('form');
        $form.on('submit', _formSubmit);
        $form.on('reset', _formReset);
    };
    _formSubmit = function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue;

        // set variables
        var $form = $(this),
            formAction = $form.attr('action'),
            formdata = false,
            xposMulti = $('input[name="xposMulti"]'),
            yposMulti = $('input[name="yposMulti"]'),
            patternWidth = $('input[name="patternWidth"]'),
            patterHeight = $('input[name="patternHeight"]'),
            wmarkWrap = $('.main-wmark-wrapper');

        // set params for php
        xposMulti.val(wmarkWrap.position().left);
        yposMulti.val(wmarkWrap.position().top);
        patternWidth.val(wmarkWrap.width());
        patterHeight.val(wmarkWrap.height());

        // show Loader
        _showLoader();

        // set params for ajax
        var obj = {
            type: "POST",
            url: formAction,
            data: formdata ? formdata : $form.serialize()
        };

        if (window.FormData) {
            obj.data = new FormData(this);
            obj.processData = false;
            obj.contentType = false;
        }

        // get response from php
        $.ajax(obj)
            .done(function (data) {
                // add src for download iframe
                $('#loadFrame').attr('src', "./php/download.php?file=" + data);
            }).fail(function () {

                var lang = localStorage.getItem('lang') || 'ru';

                if (lang === 'ru') {
                    alert('У нас не хватает мощности для обработки ваших изображений. Пожалуйста, попробуйте использовать другой водяной знак.');
                } else {
                    alert("We didn't have enough power to handle your images. Please, try use another watermark.");
                }
            }).always(function () {
                _hideLoader();
            });
    };
    _showLoader = function () {
        $('body').append('<div class="overlay"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>');
    };
    _hideLoader = function () {
        $('.overlay').remove();
    };
    _formReset = function (e) {
        (e.preventDefault) ? e.preventDefault() : e.returnValue;
        watermarkPosition.reset();
        watermarkOpacity.reset();
        loading.reset();
    };

    return {
        init: init
    };

})();

$(document).ready(function(){

    // upload initialization
    if($('input[type="file"]').length){
        loading.init();
    }

    // slider initialization
    if($('.opacity-slider').length){
        watermarkOpacity.init();
    }

    // switchers initialization
    if($('.switchers').length){
        switcher.init();
    }

    // disable location
    if($('.location').length){
        watermarkPosition.disable();
    }

    //// translate initialization
    //if($('.language').length){
    //    translate.init();
    //}

    //// share initialization
    //if($('.share').length){
    //    share.init();
    //}

    // form initialization
    if($('.form').length){
        formImg.init();

        // placeholder initialization
        $('.input').placeholder();

        // disable form buttons
        $('.btns input').prop('disabled', true);
    }

});

