
function Plan(name, year, major, studentName, currentSemester, courses = []) {
	this.name = name;
	this.year = year;
	this.major = major;
	this.studentName = studentName;
	this.currentSemester = currentSemester;
	this.courses = courses;
};

function Course(id, name, credits, term, year) {
	this.id = id;
	this.name = name;
	this.credits = credits;
	this.term = term;
	this.year = year;
};

function Year(year, terms = []) {
	this.year = year;
	this.terms = terms;
};

function Term(semester, courses = []) {
	this.semester = semester;
	this.courses = courses;
};

function planToYears(plan) {
	let years = [];
	let yearIndex = -1;
	let termIndex = -1;
	let yearFound = false;
	let termFound = false;
	let first = true;
	for (let k = 0; k < plan.courses.length; k++) {
		for (let i = 0; i < years.length; i++) {
			if (plan.courses[k].year == years[i].year) {
				yearFound = true;
				yearIndex = i;
			}
		}
		if (!yearFound) {
			years.push(new Year(plan.courses[k].year));
			yearIndex = years.length - 1;
		}
		for (let i = 0; i < years[yearIndex].terms.length; i++) {
			if (plan.courses[k].term == years[yearIndex].terms[i].semester) {
				termFound = true;
				termIndex = i;
			}
		}
		if (!termFound) {
			years[yearIndex].terms.push(new Term(plan.courses[k].term));
			termIndex = years[yearIndex].terms.length - 1;
		}
		years[yearIndex].terms[termIndex].courses.push(plan.courses[k]);
		yearFound = false;
		termFound = false;
	}
	return years.sort((a, b) => (a.year > b.year) ? 1 : (a.year < b.year) ? -1 : 0);
}

function sumCreditHours(courses) {
	sum = 0;
	for (let i = 0; i < courses.length; i++) {
		sum += courses[i].credits;
	}
	return sum;
}

function generateScheduleHTML(plan) {
	let returnHTML = "";
	let yearsFormatted = planToYears(plan);
	let present = false;
	for (let i = 0; i < yearsFormatted.length; i++) {
		year = yearsFormatted[i];
		for (let k = 0; k < year.terms.length; k++) {
			term = year.terms[k];
			if (present == false) {
				returnHTML +=
					"<div class=\"schedule-year-block\"><span class=\"semester-title\">" +
					term.semester + " " + year.year +
					"</span><span class=\"semester-hours\">Hours: " +
					sumCreditHours(term.courses) + "</span><br><ul class=\"course-list\">";
				if (plan.currentSemester == term.semester + " " + year.year) {
					present = true;
				}
			}
			else {
				returnHTML +=
					"<div class=\"schedule-year-block active\"><span class=\"semester-title\">" +
					term.semester + " " + year.year +
					"</span><span class=\"semester-hours\">Hours: " +
					sumCreditHours(term.courses) + "</span><br><ul class=\"course-list\">";
			}
			for (let j = 0; j < term.courses.length; j++) {
				course = term.courses[j];
				returnHTML += "<li class=\"course\">" + course.id + " " + course.name +
					"</li>";
			}
			returnHTML += "</ul></div>";
		}
	}
	return returnHTML;
}

function generateScheduleHeader(plan) {
	let returnHTML = "";
	returnHTML = "<h2>Academic Plan: " + plan.name + "</h2>";
	return returnHTML;
}

function loadPlan() {
	let returnPlan = new Plan("John Smith's Plan", 2020, "Computer Science", "John Smith", "Spring 2023");
	/*returnPlan.courses.push(new Course(id, name, credits, term, year));*/
	returnPlan.courses.push(new Course("MATH-1710", "Calculus I", 3, "Fall", 2020));
	returnPlan.courses.push(new Course("EGCP-1010", "Digital Logic Design", 3, "Fall", 2020));
	returnPlan.courses.push(new Course("CS-1210", "Intro to C++", 3, "Spring", 2021));
	returnPlan.courses.push(new Course("", "", 0, "Summer", 2021));
	returnPlan.courses.push(new Course("MATH-2710", "Calculus II", 3, "Fall", 2021));
	returnPlan.courses.push(new Course("CS-1220", "Obj-Orient Design/C++", 3, "Fall", 2021));
	returnPlan.courses.push(new Course("CS-3220", "Programming Language Survey", 3, "Spring", 2022));
	returnPlan.courses.push(new Course("", "", 0, "Summer", 2022));
	returnPlan.courses.push(new Course("MATH-3710", "Calculus III", 3, "Fall", 2022));
	returnPlan.courses.push(new Course("PHYS-2110", "General Physics I", 3, "Fall", 2022));
	returnPlan.courses.push(new Course("CS-3610", "Database Org & Design", 3, "Spring", 2023));
	returnPlan.courses.push(new Course("", "", 0, "Summer", 2023));
	returnPlan.courses.push(new Course("BIO-1115", "Biology 1: Cell Biology", 4, "Fall", 2023));
	returnPlan.courses.push(new Course("EGCP-3010", "Advanced Digital Logic Design", 3, "Spring", 2024));
	returnPlan.courses.push(new Course("", "", 0, "Summer", 2024));

	return returnPlan;
}

function searchCourses(){
	let notValid = /[^\w" "+-]/;
	let amountOfCourses = 0;
	let num = document.getElementById("showing");
	let input = document.getElementById("search").value.toUpperCase();
	let table = document.getElementById("courselist");
	for (let i = 1, cell; cell = table.rows[i]; i++) {
		let t = cell.textContent || cell.innerText;
		if (t.toUpperCase().indexOf(input)>-1){
			cell.style.display="";
			amountOfCourses+=1;
		}else{ 
			cell.style.display="none";
		}
	}
	num.innerHTML = ("Showing 1 to "+amountOfCourses +" of "+amountOfCourses);
	num.style.color = "black";
	if (amountOfCourses==0){
		num.innerHTML = ("No Classes Found");
		num.style.color = "blue";
	}
	if (input.match(notValid)){
		num.innerHTML = ("Invalid input");
		num.style.color = "red";
	}
}


function clearCourses(){
	document.getElementById("search").value = "";
	searchCourses();
}


window.onload = init;
  function init(){
	let amountOfCourses = document.getElementById("courselist").rows.length-1
	let num = document.getElementById("showing");
	num.innerHTML = ("Showing 1 to "+amountOfCourses +" of "+amountOfCourses);
	if (amountOfCourses==0){
		num.innerHTML = ("No Classes Found");
		num.style.color = "blue";
	}
	document.getElementById("search").addEventListener("keyup", searchCourses);
	document.getElementById("clear").addEventListener("click", clearCourses);
	document.getElementById("clear").style.cursor = "pointer";
	const pageScheduleContainer = document.getElementsByClassName("schedule-container")[0];
	const pageScheduleHeader = document.getElementById("schedule-header");
	currentPlan = loadPlan();
	pageScheduleContainer.innerHTML = generateScheduleHTML(currentPlan);
	pageScheduleHeader.innerHTML = generateScheduleHeader(currentPlan);
}
