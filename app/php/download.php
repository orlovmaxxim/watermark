<?php

	$content = file_get_contents($_REQUEST['file']);
	header('Content-Description: File Transfer');
	header('Content-Type: image/jpeg');
	header("Cache-Control: ");
	header("Pragma: ");
	header("Content-Disposition: attachment; filename=\"".basename($_REQUEST['file'])."\"");

	ob_end_clean();
	ob_start();
	echo $content;
	ob_end_flush();
	exit();
