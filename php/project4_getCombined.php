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
	exit('No user provided');
	//$_SESSION['id'] = '12345';
}

$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if ( mysqli_connect_errno()) {
	exit('Failed to connect to MySQL:' . mysqli_connect_error());
}

// Select a default plan to specify as selected upon the start of the session
if (!isset($_SESSION['plan']) && $stmt = $con->prepare("SELECT plan_id FROM iaj_plan WHERE user_id = ? AND default_plan = 'true'")) {
	$stmt->bind_param('s', $_SESSION['id']);
	$stmt->execute();
	$stmt->store_result();

	// If there is a default plan, the SQL statement will return at least one row
	if ($stmt->num_rows > 0) {
		$stmt->bind_result($planID);
		$stmt->fetch();
		
		$_SESSION['plan'] = $planID;
	}
	else {
		$_SESSION['plan'] = null;
	}

	$stmt->close();
}

$combined = array();
$plan = array();
$catalog = array();

// Hit the database tables to get the Plan information
if ($stmt = $con->prepare('SELECT iaj_user.name, iaj_plan.plan_id, iaj_plan.plan_name, iaj_plan.catalog FROM iaj_user, iaj_plan WHERE iaj_plan.plan_id = ?')) {
	$stmt->bind_param('s', $_SESSION['plan']);
	$stmt->execute();
	$stmt->store_result();

	if ($stmt->num_rows > 0) {
		$stmt->bind_result($userName, $planID, $planName, $planCatalog);
		$row = $stmt->fetch();
		$plan = array("name"=>$planName,"planID"=>$planID,"student"=>$userName,"catalog"=>$planCatalog,"courses"=>array(),"majors"=>array(),"currYear"=>(int)date("Y"),"currTerm"=>getCurrentTerm());

		if ($courseStmt = $con->prepare('SELECT course_id, year, term FROM iaj_plan_courses WHERE plan_id = ?')) {
			$courseStmt->bind_param('s', $_SESSION['plan']);
			$courseStmt->execute();
			$courseStmt->store_result();
			$courseStmt->bind_result($courseID, $courseYear, $courseTerm);
			while ($courseRow = $courseStmt->fetch()) {
				$plan["courses"][$courseID] = array("id"=>$courseID,"year"=>$courseYear,"term"=>$courseTerm);
			}
			$courseStmt->close();
		}
		
		if ($majorStmt = $con->prepare("SELECT subject FROM iaj_plan_subjects WHERE plan_id = ? AND type = 'Major'")) {
			$majorStmt->bind_param('s', $_SESSION['plan']);
			$majorStmt->execute();
			$majorStmt->store_result();
			$majorStmt->bind_result($subject);
			$tempVar = 0;
			while ($majorRow = $majorStmt->fetch()) {
				$plan["majors"][$tempVar] = $subject;
				$tempVar++;
			}
			$majorStmt->close();
		}
	}
	$combined["plan"] = $plan;
	$stmt->close();
}

// Hit the database tables to get the Catalog information for this plan
if ($stmt = $con->prepare('SELECT iaj_catalog.year FROM iaj_catalog, iaj_plan')) {
	$stmt->execute();
	$stmt->store_result();

	if ($stmt->num_rows > 0) {
		$stmt->bind_result($currentCatalog);
		$row = $stmt->fetch();
		$catalog = array("year"=>$currentCatalog,"courses"=>array());
		
		if ($courseStmt = $con->prepare('SELECT iaj_course.course_id, name, description, credits FROM iaj_requirements, iaj_course WHERE iaj_requirements.year = ?')) {
			$courseStmt->bind_param('s', $currentCatalog);
			$courseStmt->execute();
			$courseStmt->store_result();
			$courseStmt->bind_result($courseID, $courseName, $courseDescription, $courseCredits);
			while ($courseRow = $courseStmt->fetch()) {
				if ($courseID != null) {
					$catalog["courses"][$courseID] = array("id"=>$courseID,"name"=>$courseName,"description"=>$courseDescription,"credits"=>$courseCredits);
				}
			}
			$courseStmt->close();
		}
	}
	$combined["catalog"] = $catalog;
	$stmt->close();
}

echo json_encode($combined);
?>
