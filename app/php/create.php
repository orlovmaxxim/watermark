<?php

ini_set('display_errors', 'On');
//ini_set('memory_limit', '256M' );
require __DIR__.'/../vendor/autoload.php';

use PHPImageWorkshop\ImageWorkshop;

define("IMG_CONTAINER_WIDTH", 650);
define("IMG_CONTAINER_HEIGHT", 534);
define("MAX_UNCOMPRESSED_FILE_SIZE", 16384000);

function generateRandomName($extension = '') {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $length = 16;
    $randomName = '';
    for ($i = 0; $i < $length; $i++) {
        $randomName .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomName.$extension;
}

function response($status, $message){
	$response = ['status' => '', 'msg' => $message];

	header('Content-type: json');

	if($status == 200){
		header("HTTP/1.1 200 OK");
		$response['status'] = 'ok';
	}

	if($status == 400){
		header("HTTP/1.1 400 Bad request");
		$response['status'] = 'error';
	}

	echo json_encode($response);
}

if( strtolower( $_SERVER[ 'REQUEST_METHOD' ] ) == 'post' && !empty( $_FILES ) && !empty( $_POST ))
	{

		if(isset($_FILES['bimg'])&&$_FILES['bimg']['error']==0 && isset($_FILES['wimg'])&&$_FILES['wimg']['error']==0){

			try {
				
				$basicImageLayer = ImageWorkshop::initFromPath($_FILES['bimg']['tmp_name']);

				$basicImageLayerWidth = $basicImageLayer->getWidth();
				$basicImageLayerHeight = $basicImageLayer->getHeight();

				$imageSize = $basicImageLayerWidth*$basicImageLayerHeight*4;

				if($imageSize > MAX_UNCOMPRESSED_FILE_SIZE){

					response(400,"Image is to big");
					exit;
				}

				$waterMarkLayer = ImageWorkshop::initFromPath($_FILES['wimg']['tmp_name']);
				$waterMarkLayerWidth = $waterMarkLayer->getWidth();
				$waterMarkLayerHeight = $waterMarkLayer->getHeight();
				$waterMarkLayer->opacity($_POST['opacity']);
				
				//singlemode
				if(isset($_POST['mode'])&&$_POST['mode']==0){


					$waterMarkLayerXpos = $_POST['xpos'];
					$waterMarkLayerYpos =  $_POST['ypos'];


					if($basicImageLayerWidth > IMG_CONTAINER_WIDTH || $basicImageLayerHeight > IMG_CONTAINER_HEIGHT){

					$relIndex = $basicImageLayerWidth / $basicImageLayerHeight;

					if( $basicImageLayerWidth > $basicImageLayerHeight ){

							$waterMarkLayerXpos = round(($waterMarkLayerXpos * $basicImageLayerWidth) / IMG_CONTAINER_WIDTH);
							$waterMarkLayerYpos = round(($waterMarkLayerYpos * $basicImageLayerHeight ) / (IMG_CONTAINER_WIDTH / $relIndex));

						} else if ( $basicImageLayerHeight  > $basicImageLayerWidth ){

							$waterMarkLayerYpos = round(($waterMarkLayerYpos * $basicImageLayerHeight) / IMG_CONTAINER_HEIGHT);
							$waterMarkLayerXpos = round(($waterMarkLayerXpos * $basicImageLayerWidth ) / (IMG_CONTAINER_HEIGHT * $relIndex));
						}
					}


					$basicImageLayer->addLayer(1, $waterMarkLayer, $waterMarkLayerXpos, $waterMarkLayerYpos, "LT");

				}


				//multimode
				if(isset($_POST['mode'])&&$_POST['mode']==1){

					$waterMarkLayerXpos = $_POST['xposMulti'];
					$waterMarkLayerYpos =  $_POST['yposMulti'];
					$patternWidth = $_POST['patternWidth'];
					$patternHeight = $_POST['patternHeight'];
					
					if($basicImageLayerWidth > IMG_CONTAINER_WIDTH || $basicImageLayerHeight > IMG_CONTAINER_HEIGHT){

						$relIndex = $basicImageLayerWidth / $basicImageLayerHeight;

						if( $basicImageLayerWidth > $basicImageLayerHeight ){

								$waterMarkLayerXpos = round(($waterMarkLayerXpos * $basicImageLayerWidth) / IMG_CONTAINER_WIDTH);
								$waterMarkLayerYpos = round(($waterMarkLayerYpos * $basicImageLayerHeight ) / (IMG_CONTAINER_WIDTH / $relIndex));


								$patternWidth = round(($patternWidth * $basicImageLayerWidth) / IMG_CONTAINER_WIDTH);
								$patternHeight = round(($patternHeight * $basicImageLayerHeight ) / (IMG_CONTAINER_WIDTH / $relIndex));

							} else if ( $basicImageLayerHeight  > $basicImageLayerWidth ){

								$waterMarkLayerYpos = round(($waterMarkLayerYpos * $basicImageLayerHeight) / IMG_CONTAINER_HEIGHT);
								$waterMarkLayerXpos = round(($waterMarkLayerXpos * $basicImageLayerWidth ) / (IMG_CONTAINER_HEIGHT * $relIndex));
						

								$patternHeight = round(($patternHeight * $basicImageLayerHeight) / IMG_CONTAINER_HEIGHT);
								$patternWidth = round(($patternWidth * $basicImageLayerWidth ) / (IMG_CONTAINER_HEIGHT * $relIndex));
							}
					}

					//generate pattern matrix
					$wmarkCountX = round($basicImageLayerWidth*2/$waterMarkLayerWidth);
					$wmarkCountY = round($basicImageLayerHeight*2/$waterMarkLayerHeight);

					$wmarkPosX = $waterMarkLayerXpos;
					$wmarkPosY = $waterMarkLayerYpos;

					$deltaX = 0;
					$deltaY = 0;

					if($patternWidth > $wmarkCountX*$waterMarkLayerWidth){
						$deltaX = round(($patternWidth - $wmarkCountX*$waterMarkLayerWidth)/($wmarkCountX-1));	
					}

					if($patternHeight > $wmarkCountY*$waterMarkLayerHeight){
						$deltaY = round(($patternHeight - $wmarkCountY*$waterMarkLayerHeight)/($wmarkCountY-1));	
					}
					

					for ($i = 0; $i < $wmarkCountY; $i++ ){

						if($wmarkPosY < $basicImageLayerHeight && $wmarkPosY > -$waterMarkLayerHeight){

							for ($j = 0; $j < $wmarkCountX; $j++ ){

								if($wmarkPosX < $basicImageLayerWidth && $wmarkPosX > -$waterMarkLayerWidth){

									$basicImageLayer->addLayer(1, $waterMarkLayer, $wmarkPosX, $wmarkPosY, "LT");
									$basicImageLayer = ImageWorkshop::initFromResourceVar($basicImageLayer->getResult());

								}
								$wmarkPosX += $deltaX + $waterMarkLayerWidth;
							}
						
						}

						$wmarkPosY += $deltaY + $waterMarkLayerHeight;
						$wmarkPosX = $waterMarkLayerXpos;

					}


				}

				$image = $basicImageLayer->getResult();

		 		$tempName = generateRandomName('.jpg');
				imagejpeg($image, './temp/'.$tempName, 95); 
					
				response(200, $tempName);
				exit;




			} catch (Exception $e) {
				response(400, $e);
				exit;
			}

			
		}
		response(400,"Error");
		exit;
    
	}
response(400,"Error");
exit;
