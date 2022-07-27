<?php
// Email Submit
// Note: filter_var() requires PHP >= 5.2.0
if ( isset($_POST['first_name']) && isset($_POST['last_name']) && isset($_POST['email']) && isset($_POST['project_name']) && isset($_POST['description'])  && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ) {
    // detect & prevent header injections
    $test = "/(content-type|bcc:|cc:|to:)/i";
    foreach ( $_POST as $key => $val ) {
        if ( preg_match( $test, $val ) ) {
        exit;
    }
}

$first_name = $_POST['first_name'];
$last_name = $_POST['last_name'];
$email = $_POST['email'];
$project_name = $_POST['project_name'];
$description = $_POST['description'];

$message = "
First Name: $first_name \n
Last Name: $last_name\n
Project Name: $project_name\n
Description: $description
";

mail( "spam@choyan.me", $_POST['date'], $message, "From:" . $_POST['email'] );
  //            ^
  //  Replace with your email
}
?>