<?php require_once ('./php/locale.php') ?>

<!--Created by Vital on 26.08.2015.
-->
<!DOCTYPE html>
<html lang="ru-RU">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <title><?php echo $lang["wm_gn"]; ?></title>
    <!-- build:css css/vendor.min.css-->
    <!-- bower:css-->
    <link rel="stylesheet" href="./bower/normalize.css/normalize.css">
    <!-- endbower-->
    <!-- endbuild-->
    <!-- build:css css/styles.min.css-->
    <link rel="stylesheet" href="css/styles.css">
    <!-- endbuild-->
    <script src="./js/vendor/modernizr.min.js"></script>
  </head>

  <body>
    <!--[if lt IE 8]>
    <p class='b-unhappy-browser'>Вы используете устаревший браузер. Пожалуйста
    <a href="http://browsehappy.com/">обновите</a> его.</p>
    <![endif]-->
    <div class="page">
      <div class="page-gradient"></div>
      <!-- Основной контент-->
      <div class="main-container">
        <div class="left-panel">
          <!--Created by Vital on 26.08.2015.
          -->
          <ul class="language">
            <li class="language-item"><a class="language-link active" href="?lang=ru">РУС</a></li>
            <li class="language-item"><a class="language-link" href="?lang=en">ENG</a></li>
          </ul>
          <div class="share">
            <div class="share-icon"><a href="#" class="share-icon-link">Like Me</a></div>
            <ul class="share-socials-list">
              <li class="share-socials-item"><a href="#" class="fb-icon share-socials-link">FaceBook</a></li>
              <li class="share-socials-item"><a href="#" class="tw-icon share-socials-link">Twitter</a></li>
              <li class="share-socials-item"><a href="#" class="vk-icon share-socials-link">ВКонтакте</a></li>
            </ul>
          </div>
        </div>
        <div class="columns">
          <div class="main">
            <!--Created by Vital on 26.08.2015.
            -->
            <section class="main-section">
              <div class="main-area-title"><?php echo $lang['wm_gn']; ?></div>
              <div class="main-area">
                <div class="main-image-wrapper">
                  <div class="main-wmark-wrapper"></div>
                </div>
              </div>
            </section>
          </div>
          <div class="settings">
            <!--Created by Vital on 26.08.2015.
            -->
            <div class="settings-title"><?php echo $lang['opt']; ?></div>
            <form id="main-form" action="php/" enctype="multipart/form-data" method="post" class="form">
              <!--Created by Vital on 26.08.2015.
              -->
              <section class="section upload">
                <div class="form-line">
                  <div class="form-label"><?php echo $lang['b_img']; ?></div>
                  <div class="custom-upload">
                    <input type="file" name="bimg" id="basicImage" class="input input-file">
                    <div class="imitation-upload">
                      <div class="icon-upload"></div>
                      <input type="text" name="basicImage" readonly placeholder="<?php echo $lang['ch_img']; ?>" class="input"> </div>
                  </div>
                </div>
                <div class="form-line">
                  <div class="form-label"><?php echo $lang['w_img']; ?></div>
                  <div class="custom-upload m-disabled">
                    <input type="file" name="wimg" disabled id="waterMark" class="input input-file">
                    <div class="imitation-upload">
                      <div class="icon-upload"></div>
                      <input type="text" name="waterMark" readonly placeholder="<?php echo $lang['ch_img']; ?>" class="input"> </div>
                  </div>
                </div>
              </section>
              <!--Created by Vital on 26.08.2015.
              -->
              <section class="section location disabled">
                <div class="disabled-area"></div>
                <div class="switchers">
                  <a href="#" data-switch="multi" class="switcher multi"></a>
                  <a href="#" data-switch="single" class="switcher single active"></a>
                </div>
                <div class="form-label extra-spaced"><?php echo $lang['pos']; ?></div>
                <div class="location">
                  <ul class="grid-list">
                    <li data-pos="top-left" class="grid-item"></li>
                    <li data-pos="top-center" class="grid-item"></li>
                    <li data-pos="top-right" class="grid-item"></li>
                    <li data-pos="mid-left" class="grid-item"></li>
                    <li data-pos="mid-center" class="grid-item"></li>
                    <li data-pos="mid-right" class="grid-item"></li>
                    <li data-pos="btm-left" class="grid-item"></li>
                    <li data-pos="btm-center" class="grid-item"></li>
                    <li data-pos="btm-right" class="grid-item"></li>
                  </ul>
                  <div class="controls">
                    <div class="control-item">
                      <div class="control-tip vertical">X</div>
                      <input type="text" name="xpos" value="0" class="control">
                      <a href="" class="control-arrow top top-x"></a>
                     <a href="" class="control-arrow btm btm-x"></a>
                    </div>
                    <div class="control-item">
                      <div class="control-tip horizontal">Y</div>
                      <input type="text" name="ypos" value="0" class="control">
                      <a href="" class="control-arrow top top-y"></a>
                     <a href="" class="control-arrow btm btm-y"></a>
                    </div>
                  </div>
                </div>
              </section>
              <!--Created by Vital on 26.08.2015.
              -->
              <section class="section opacity disabled">
                <div class="disabled-area"></div>
                <div class="form-label"><?php echo $lang['op']; ?></div>
                <div class="wmark-opacity">
                  <div class="opacity-slider"></div>
                </div>
              </section>
              <!--Created by Vital on 26.08.2015.
              -->
              <section class="section btns disabled">
                <div class="disabled-area"></div>
                <input type="reset" value="<?php echo $lang['clr']; ?>" class="btn neg to-left">
                <input type="submit" value="<?php echo $lang['dld']; ?>" class="btn to-right"> </section>
              <input type="hidden" name="mode" value="single" class="hidden-switch">
              <input type="hidden" name="opacity" value="100">
              <input type="hidden" name="yposMulti" value="0">
              <input type="hidden" name="xposMulti" value="0">
              <input type="hidden" name="patternHeight">
              <input type="hidden" name="patternWidth"> </form>
          </div>
        </div>
      </div>
      <!-- Основной контент конец-->
    </div>
    <!-- Подвал-->
    <!--Created by Vital on 26.08.2015.
    -->
    <footer class="footer">
      <div class="container">
        <p class="copyright">&copy; <?php echo $lang['cprt']; ?></p>
      </div>
    </footer>
    <!-- Подвал конец-->
    <!--Фрейм для загрузки картинки-->
    <iframe id="loadFrame" src=""></iframe>
    <!-- build:js js/vendor/vendor.min.js-->
    <!-- bower:js-->
    <script src="./bower/jquery/jquery.js"></script>
    <script src="./bower/jquery-placeholder/jquery.placeholder.js"></script>
    <!-- endbower-->
    <!-- endbuild-->
    <!--vendor-->
    <script src="js/vendor/jquery-ui.min.js"></script>
    <!-- upload scripts-->
    <!-- build:js js/vendor/loading.min.js-->
    <!--script(src='js/vendor/load-image.all.min.js')-->
    <!--script(src='js/vendor/canvas-to-blob.js')-->
    <script src="js/vendor/jquery.iframe-transport.js"></script>
    <script src="js/vendor/jquery.fileupload.js"></script>
    <!--script(src='js/vendor/jquery.fileupload-process.js')-->
    <!--script(src='js/vendor/jquery.fileupload-image.js')-->
    <!--script(src='js/vendor/jquery.fileupload-validate.js')-->
    <!-- endbuild-->
    <!--[if IE 8]>
    <script src='js/vendor/selectivizr.min.js'></script>
    <![endif]-->
    <!-- build:js js/main.min.js-->
    <!--script(src='js/main.js')-->
    <script src="js/tooltip.js"></script>
    <script src="js/modules.js"></script>
    <script src="js/main2.js"></script>
    <script src="js/drag.js"></script>
    <script src="js/onlyInteger.js"></script>
    <script src="js/opacity.js"></script>
    <!-- endbuild-->
  </body>

</html>