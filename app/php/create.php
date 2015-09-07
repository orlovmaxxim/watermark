<?php

ini_set('display_errors', 'On');

require __DIR__.'/../vendor/autoload.php';

use PHPImageWorkshop\ImageWorkshop;

function generateRandomName($length = 16) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomName = '';
    for ($i = 0; $i < $length; $i++) {
        $randomName .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomName.'.jpg';
}

if( strtolower( $_SERVER[ 'REQUEST_METHOD' ] ) == 'post' && !empty( $_FILES ) && !empty( $_POST ))
	{

		if(isset($_FILES['bimg'])&&$_FILES['bimg']['error']==0 && isset($_FILES['wimg'])&&$_FILES['wimg']['error']==0){
			
			$basicImageLayer = ImageWorkshop::initFromPath($_FILES['bimg']['tmp_name']);
			$waterMarkLayer = ImageWorkshop::initFromPath($_FILES['wimg']['tmp_name']);
			$waterMarkLayer->opacity($_POST['opacity']);
			$basicImageLayer->addLayer(1, $waterMarkLayer, 12, 12, "LB");
 			$image = $basicImageLayer->getResult();

 			$tempName = generateRandomName();
			imagejpeg($image, './temp/'.$tempName, 95); // We chose to show a JPG with a quality of 95%
			
			header('Content-type: json');
			echo '{"status": "ok", "name":"'.$tempName.'"}';

			exit;

			// $extension = pathinfo($_FILES['img']['name'], PATHINFO_EXTENSION);

			// if(!in_array(strtolower($extension), $allowed)){
			// 	echo '{"status": "error"}';
			// 	exit;
			// }

			// if(move_uploaded_file($_FILES['img']['tmp_name'], 'uploads/'.$_FILES['img']['name'])){

			// echo '{"status": "ok", "img":"./php/uploads/'.$_FILES['img']['name'].'"}';
			// exit;
			// }
		}

		echo '{"status": "error"}';
		exit;
	    
	}
	echo '{"status": "error"}';
	exit;