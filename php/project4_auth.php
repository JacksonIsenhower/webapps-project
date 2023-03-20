<?php
session_start();

// This will need to be changed
$DATABASE_HOST = 'localhost';
$DATABASE_USER = 'root';
$DATABASE_PASS = '';
$DATABASE_NAME = 'phplogin';

$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if ( mysqli_connect_errno() ) {
	exit('Failed to connect to MySQL: ' . mysqli_connect_error());
}

// Are both username & password filled in?
if ( !isset($_POST['username'], $_POST['password']) ) {
	exit('Please fill both the username and password fields!');
}

// Hit the user/password database. Parameter binding is used to deny SQL Injections
if ($stmt = $con->prepare('SELECT id, password FROM accounts WHERE username = ?')) {
	$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
	$stmt->store_result();

	// If there is a username matching, the SQL statement will return at least one row
	if ($stmt->num_rows > 0) {
		$stmt->bind_result($id, $password);
		$stmt->fetch();
		
		// Verify password and (if it's correct) set up the login session. 
		// WARNING: the password field needs to be a HASH of the password, not the password itself!
		if (password_verify($_POST['password'], $password)) {
			session_regenerate_id();
			$_SESSION['loggedin'] = TRUE;
			$_SESSION['name'] = $_POST['username'];
			$_SESSION['id'] = $id;
			header("location: project4.php");
			
		// Incorrect password
		} else {
			echo 'Incorrect username and/or password!';
		}
		
	// Incorrect username
	} else {
		echo 'Incorrect username and/or password!';
	}

	$stmt->close();
}
?>