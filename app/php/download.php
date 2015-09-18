<?php

if( strtolower( $_SERVER[ 'REQUEST_METHOD' ] ) == 'get' && !empty( $_GET )) {

	header("Pragma: public");
	header("Expires: 0");
	header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
	header("Content-Type: application/force-download");
	header("Content-Type: application/octet-stream");
	header("Content-Type: application/download");
	header("Content-Disposition: attachment;filename=image.jpg");
	header("Content-Transfer-Encoding: binary");

	$fileName = './temp/'.$_GET['name'];
	if(readfile($fileName)){
		unlink($fileName);	
	}
	

}

