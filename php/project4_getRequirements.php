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

$requirements = array();

// Hit the database tables to get the Plan information
if ($stmt = $con->prepare('SELECT year FROM iaj_requirements')) {
	//$stmt->bind_param('s', $_SESSION['id']);
	$stmt->execute();
	$stmt->store_result();

	if ($stmt->num_rows > 0) {
		$stmt->bind_result($year);
		while ($row = $stmt->fetch()) {
			$requirements[$year] = array("subjects"=>array());
			
			if ($subjectStmt = $con->prepare('SELECT subject, type FROM iaj_requirements WHERE iaj_requirements.year = ?')) {
				$subjectStmt->bind_param('s', $year);
				$subjectStmt->execute();
				$subjectStmt->store_result();
				$subjectStmt->bind_result($subject, $type);
				while ($subjectRow = $subjectStmt->fetch()) {
					$requirements[$year]["subjects"][$subject] = array("subject"=>$subject,"type"=>$type,"categories"=>array());
					
					if ($categoryStmt = $con->prepare('SELECT category FROM iaj_requirements WHERE iaj_requirements.year = ? AND iaj_requirements.subject = ? AND iaj_requirements.type = ?')) {
						$categoryStmt->bind_param('sss', $year, $subject, $type);
						$categoryStmt->execute();
						$categoryStmt->store_result();
						$categoryStmt->bind_result($category);
						while ($categoryRow = $categoryStmt->fetch()) {
							$requirements[$year]["subjects"][$subject]["categories"][$category] = array("category"=>$category,"courses"=>array());
							
							if ($courseStmt = $con->prepare('SELECT course_id FROM iaj_requirements WHERE iaj_requirements.year = ? AND iaj_requirements.subject = ? AND iaj_requirements.type = ? AND iaj_requirements.category = ?')) {
								$courseStmt->bind_param('ssss', $year, $subject, $type, $category);
								$courseStmt->execute();
								$courseStmt->store_result();
								$courseStmt->bind_result($course);
								$tempVar = 0;
								while ($courseRow = $courseStmt->fetch()) {
									$requirements[$year]["subjects"][$subject]["categories"][$category]["courses"][$tempVar] = $course;
									$tempVar++;
								}
							}
						}
					}
				}
			}
		}
	}
	//$requirements["plans"] = $plans;
}

echo json_encode($requirements);
?>
