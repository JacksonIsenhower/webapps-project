<?php
session_start();

function badCredentials() {
	echo "<script language=\"JavaScript\">\n";
	echo "alert('Username or Password was incorrect!');\n";
	echo "window.location='project4_loginpage.php'";
	echo "</script>";
}

$DATABASE_HOST = 'james.cedarville.edu';
$DATABASE_USER = 'cs3220_sp23';
$DATABASE_PASS = 'E57y6Z1FwAlraEmA';
$DATABASE_NAME = 'cs3220_sp23';

$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if ( mysqli_connect_errno() ) {
	exit('Failed to connect to MySQL: ' . mysqli_connect_error());
}

// Are both username & password filled in?
if ( !isset($_POST['username'], $_POST['password']) ) {
	exit('Please fill both the username and password fields!');
}

// Hit the user/password database. Parameter binding is used to deny SQL Injections
if ($stmt = $con->prepare('SELECT id, password FROM iaj_user WHERE name = ?')) {
	$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
	$stmt->store_result();

	// If there is a username matching, the SQL statement will return at least one row
	if ($stmt->num_rows > 0) {
		$stmt->bind_result($id, $password);
		$stmt->fetch();
		
		// Verify password and (if it's correct) set up the login session. 
		if (password_verify($_POST['password'], $password)) {
			session_regenerate_id();
			$_SESSION['loggedin'] = TRUE;
			$_SESSION['name'] = $_POST['username'];
			$_SESSION['id'] = $id;
			header("location: ../project4.html");
			
		// Incorrect password
		} else {
			badCredentials();
		}
		
	// Incorrect username
	} else {
		badCredentials();
	}

	$stmt->close();
}
?>