<?php

ini_set('display_errors', 'On');

require __DIR__.'/../vendor/autoload.php';

use PHPImageWorkshop\ImageWorkshop;

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

if( strtolower( $_SERVER[ 'REQUEST_METHOD' ] ) == 'post' && !empty( $_FILES ) && !empty( $_POST ))
	{

		if(isset($_FILES['bimg'])&&$_FILES['bimg']['error']==0 && isset($_FILES['wimg'])&&$_FILES['wimg']['error']==0){


			$basicImageLayer = ImageWorkshop::initFromPath($_FILES['bimg']['tmp_name']);
			$basicImageLayerWidth = $basicImageLayer->getWidth();
			$basicImageLayerHeight = $basicImageLayer->getHeight();
			$imageSize = $basicImageLayerWidth*$basicImageLayerHeight*4;

			if($imageSize > 33177600){
				header("HTTp/1.1 400 Bad request");
				header('Content-type: json');
				echo '{"status": "error", "msg":"Image is to big"}';
				exit;
			}

			$waterMarkLayer = ImageWorkshop::initFromPath($_FILES['wimg']['tmp_name']);
			$waterMarkLayer->opacity($_POST['opacity']);
			$basicImageLayer->addLayer(1, $waterMarkLayer, $_POST['xpos'], $_POST['ypos'], "LU");
 			$image = $basicImageLayer->getResult();

 			$tempName = generateRandomName('.jpg');
			imagejpeg($image, './temp/'.$tempName, 95); // We chose to show a JPG with a quality of 95%
			
			header('Content-type: json');
			echo '{"status": "ok", "name":"'.$tempName.'", "size": "'.$imageSize.'"}';

			exit;

		}
		header("HTTp/1.1 400 Bad request");
		header('Content-type: json');
		echo '{"status": "error"}';
		exit;
	    
	}
	header("HTTp/1.1 400 Bad request");
	header('Content-type: json');
	echo '{"status": "error"}';
	exit;