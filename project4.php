<!DOCTYPE html>
<html lang="en">
	<head>
		<?php   // session2.php
		session_start();
		if (isset($_SESSION["loggedin"])) {
			if ($stmt = $con->prepare('SELECT "subject" FROM iaj_plan_subjects WHERE plan_id = (select plan_id from iaj_plan where user_id=(select ID from iaj_user where name = ?)) and type = Major')) {
				$stmt->bind_param('s', $_POST['username']);
				$stmt->execute();
				$stmt->store_result();
			
				// If there is a username matching, the SQL statement will return at least one row
				if ($stmt->num_rows > 0) {
					$stmt->bind_result($id, $password);
					$stmt->fetch();
					var TempMajor = $subject
				}}
			if ($stmt = $con->prepare('SELECT "subject" FROM iaj_plan_subjects WHERE plan_id = (select plan_id from iaj_plan where user_id=(select ID from iaj_user where name = ?)) and type = Minor')) {
				$stmt->bind_param('s', $_POST['username']);
				$stmt->execute();
				$stmt->store_result();
			
				// If there is a username matching, the SQL statement will return at least one row
				if ($stmt->num_rows > 0) {
					$stmt->bind_result($id, $password);
					$stmt->fetch();
					var TempMinor = $subject
				}}
			if ($stmt = $con->prepare('SELECT "year" FROM iaj_plan_courses WHERE plan_id = (select plan_id from iaj_plan where user_id=(select ID from iaj_user where name = ?)) and type = Minor')) {
				$stmt->bind_param('s', $_POST['username']);
				$stmt->execute();
				$stmt->store_result();
			
				// If there is a username matching, the SQL statement will return at least one row
				if ($stmt->num_rows > 0) {
					$stmt->bind_result($id, $password);
					$stmt->fetch();
					var TempYear = $year
				}}
				var TempName = $_SESSION["username"]
		} else {
			header("Location: ../login.php");
			die();
		}
		?>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script src="https://code.jquery.com/jquery-3.6.0.js"></script>
		<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
		<script src="./js/project4.js"></script>
		<title>Academic Planning Environment</title>
		<link rel="stylesheet" href="./css/project4.css">
		<link rel="shortcut icon" href="https://ape.cedarville.edu/img/favicon.ico">
		<meta name="viewport" content="width=device-width, height=device-height initial-scale=1">
		<meta charset="utf-8">
	</head>
	<body>
		<div id="app-container">
			<header>
				<div id="header">
					<span id="title"><em>Academic Planning Environment</em></span>
					<span id="version"><em>Version 4.0</em></span>
					<div id="headerItems">
						<span class="header-column">
							<button id="logout"><strong>Log Out</strong></button>
							<button id="options"><strong>Options</strong></button>
							<button id="save"><strong>Save</strong></button>
							<input type="checkbox" id="colorCheck" name="colorCheck" value="colorCheck">
							<label for="colorCheck">More Colors?</label>
							<input type="color" id="colors" name="colors">
							<input type="checkbox" id="rainbow" name="rainbow" value="rainbow">
							<label for="colorCheck">Rainbow</label>
							<input type="range" min="1" max="100" value="50" class="slider" id="rainbowSpeed" name="rainbowSpeed">
							<label for="rainbowSpeed">Speed</label>
						</span>
						<span class="header-column">
							<span id="major"><strong>Major: </strong><var>TempMajor</var></span><br>
							<span id="minor"><strong>Minor: </strong><var>TempMinor</var></span>
						</span>
						<span class="header-column">
							<span id="student"><strong>Student: </strong><var>TempName</var></span><br>
							<span id="catalog"><strong>Catalog: </strong><var>TempYear</var></span>
						</span>
					</div>
				</div>
			</header>
			<div class="grid-container">
				<div class="grid-item" id="ul-container">
					<div class="section-header">
						<h2>
							<!-- this needs to be centered-->
							Requirements
						</h2>
					</div>
					<div id="accordion">
						<p>Core Classes</p>
						<div class="core">
							<p>Time to deliver some pizza</p>
						</div>
						<p>Track</p>
						<div class="track">
							<p>Choo Choo<br>I SAID CHOO CHOO</p>
						</div>
						<p>Required Cognates</p>
						<div class="cognates">
							<p>brain moment</p>
						</div>
						<p>Gen Eds</p>
						<div class="geneds">
							<p>The general shibang</p>
						</div>
					</div>
				</div>
				<div class="grid-item" id="ur-container">
					<div class="section-header" id="schedule-header">
						<h2>Academic Plan: plan</h2>
					</div>
					<div class="schedule-container">
						No years loaded.
					</div>
					<div class="schedule-ui">
						<button>Open Notes</button><button>Delete Year</button><button>Add Year</button>
					</div>
				</div>
				<div class="grid-item" id="ll-container">
					<div class="navigation">
						<div class="section-header">
							<h2>
								Navigation
							</h2>
						</div>
						<label for="year">Year</label>
						<select name="year" id="year" class="cars" ></select>
						
						<label for="make">Make</label>
						<select name="make" id="make" class="cars" disabled></select>
						<label for="model">Model</label>
						<select name="model" id="model" class="cars" disabled></select>
						
						<ul class="validation-courses">
							<li><a href="/">Course Page</a></li>
							<li><a href="../../~mcgraw/cs3220.html">Andrew McGraw</a></li>
							<li><a href="../../~hubble/cs3220.html">Ian Hubble</a></li>
							<li><a href="../cs3220.html">Jackson Isenhower</a></li>
						</ul>
					</div>
				</div>
				<div class="grid-item" id="lr-container">
					<p id="showing" class="right-float">
						Loading...
					</p>
					<h3 class="left-float">
						Course Finder
					</h3>
					<div class="block-container">
						<form action="http://judah.cedarville.edu/echo.php" method="post">
						  Search: <u id='clear'>(clear)</u> <input type="text" id="search" name="search">
						  <input type="submit" value="Submit">
						</form>
					</div>
					<div class="table">
						<table id=courselist>
							<tr>
								<td>Name</td>
								<td>Title</td>
								<td>Cred</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
