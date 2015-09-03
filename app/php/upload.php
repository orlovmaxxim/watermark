<?php
$allowed = ['png', 'jpeg', 'jpg'];

	if( strtolower( $_SERVER[ 'REQUEST_METHOD' ] ) == 'post' && !empty( $_FILES ) )
	{

		if(isset($_FILES['img'])&&$_FILES['img']['error']==0){
		
			$extension = pathinfo($_FILES['img']['name'], PATHINFO_EXTENSION);

			if(!in_array(strtolower($extension), $allowed)){
				echo '{"status": "error"}';
				exit;
			}

			if(move_uploaded_file($_FILES['img']['tmp_name'], 'uploads/'.$_FILES['img']['name'])){

			echo '{"status": "ok", "img":"./php/uploads/'.$_FILES['img']['name'].'"}';
			exit;
			}
		}

		echo '{"status": "error"}';
		exit;
	    
	}
	echo '{"status": "error"}';
	exit;