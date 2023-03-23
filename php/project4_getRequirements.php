<?php
function getCurrentTerm() {
	$month = idate("m");
	if ($month > 5) {
		return "Summer";
	}
	else if ($month > 7) {
		return "Fall";
	}
	else {
		return "Spring";
	}
}

session_start();

$DATABASE_HOST = 'localhost';
$DATABASE_USER = 'root';
$DATABASE_PASS = '';
$DATABASE_NAME = 'test';

if (!isset($_SESSION['id'])) {
	//exit('No user provided');
	$_SESSION['id'] = '12345';
}

$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if ( mysqli_connect_errno()) {
	exit('Failed to connect to MySQL:' . mysqli_connect_error());
}

$requirements = array();

// Hit the database tables to get the Plan information
if ($stmt = $con->prepare('SELECT subject, type FROM iaj_plan_subjects WHERE plan_id = ?')) {
	$stmt->bind_param('s', $_SESSION['plan']);
	$stmt->execute();
	$stmt->store_result();

	if ($stmt->num_rows > 0) {
		$stmt->bind_result($subject, $type);
		$requirements["categories"] = array("Core"=>array("courses"=>array()),"Electives"=>array("courses"=>array()),"Cognates"=>array("courses"=>array()),"GenEds"=>array("courses"=>array()));
		while ($row = $stmt->fetch()) {
			if ($courseStmt = $con->prepare('SELECT iaj_requirements.course_id, iaj_requirements.category FROM iaj_requirements, iaj_plan WHERE iaj_plan.plan_id = ? AND iaj_requirements.year = iaj_plan.catalog AND iaj_requirements.subject = ? AND iaj_requirements.type = ?')) {
				$courseStmt->bind_param('sss', $_SESSION['plan'], $subject, $type);
				$courseStmt->execute();
				$courseStmt->store_result();
				$courseStmt->bind_result($course, $courseCategory);
				while ($courseRow = $courseStmt->fetch()) {
					if ($courseCategory == "Core") {
						$requirements["categories"]["Core"]["courses"][] = $course;
					}
					if ($courseCategory == "Electives") {
						$requirements["categories"]["Electives"]["courses"][] = $course;
					}
					if ($courseCategory == "Cognates") {
						$requirements["categories"]["Cognates"]["courses"][] = $course;
					}
					if ($courseCategory == "GenEds") {
						$requirements["categories"]["GenEds"]["courses"][] = $course;
					}
				}
			}
		}
	}
	//$requirements["plans"] = $plans;
}

echo json_encode($requirements);
?>
