<?php
 
if($_POST) {
    $name = $_POST['name'];
    $visitor_email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];
     
    $email_from = 'sendmailtopraveenkumar@gmail.com';
    $email_subject = 'Form Submission';
    $email_body = 'Sender\'s Name : $name\n Sender\'s Subject : $subject\n Sender\'s Email Address: $visitor_email\n Sender\'s Message : $message.';
    $email_to = 'sendmailtopraveenkumar@gmail.com';
    
    $headers = "From: $email_from \r\n";
    $headers .= "Reply-To: $visitor_email \r\n";
    mail($email_to,$email_subject,$email_body,$headers);
    header('index.html');
}
 
?>