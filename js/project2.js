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

function Year(terms = []) {
	this.terms = terms;
};

function Term(semester, courses = []) {
	this.semester = semester;
	this.courses = courses;
};


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
}


