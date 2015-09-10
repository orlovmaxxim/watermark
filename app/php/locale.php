<?php 

session_start();

$allowed_lang = array('en', 'ru');

if(isset($_GET['lang']) === true && in_array($_GET['lang'], $allowed_lang) === true){
	
	$_SESSION['lang'] = $_GET['lang'];

} else if(isset($_SESSION['lang']) === false){
	$_SESSION['lang'] = 'ru';
}

include './php/lang/'.$_SESSION['lang'].'.php';