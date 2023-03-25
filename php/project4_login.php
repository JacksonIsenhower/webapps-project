<html lang="en">
	<head>
		<title>Login to APE</title>
		<link rel="stylesheet" href="./css/project4_login.css">
		<meta charset="utf-8">
	</head>
	<body>
		<header>
			<div id="header">
				<span id="title"><em>Academic Planning Environment</em></span>
				<span id="version"><em>Version 4.0</em></span>
			</div>
		</header>
		<div class="login">
			<h1>Login to APE</h1>
			<form action="php/project4_auth.php" method="post">
				<label for="username">
					<i class="userField"></i>
				</label>
				<input type="text" name="username" placeholder="Username" id="username" required>
				<label for="password">
					<i class="passField"></i>
				</label>
				<input type="password" name="password" placeholder="Password" id="password" required>
				<input type="submit" value="Login">
			</form>
			<h3 id=#error> </h3>
		</div>
	</body>
</html>
