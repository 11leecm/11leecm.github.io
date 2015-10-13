<?php

	$myemail = "minirocket1@gmail.com";

	$name = $_POST['name'];
	$email = $_POST['email'];
	$subject = "chrismlee.com: ".$_POST['subject'];
	$message = $_POST['message'];

	$body = "Name: ".$name."

	Email: ".$email."

	Message: ".$message;

	if (mail ($myemail, $subject, $body)) {
		echo "Success";
	} else {
		echo "Failure";
	}

?>