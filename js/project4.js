/*
 * jQuery UI Accordion 1.8.17
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Accordion
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
	let planYear = -1;
	for (let k = 0; k < plan.courses.length; k++) {
		if (plan.courses[k].term === "Spring" || plan.courses[k].term === "Summer") {
			planYear = plan.courses[k].year - 1;
		}
		else {
			planYear = plan.courses[k].year;
		}
		for (let i = 0; i < years.length; i++) {
			if (planYear == years[i].year) {
				yearFound = true;
				yearIndex = i;
			}
		}
		if (!yearFound) {
			years.push(new Year(planYear));
			yearIndex = years.length - 1;
			years[yearIndex].terms.push(new Term("Fall"));
			years[yearIndex].terms.push(new Term("Spring"));
			years[yearIndex].terms.push(new Term("Summer"));
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
	let outputYear;
	for (let i = 0; i < yearsFormatted.length; i++) {
		year = yearsFormatted[i];
		for (let k = 0; k < year.terms.length; k++) {
			term = year.terms[k];
			if (term.semester === "Spring" || term.semester === "Summer") {
				outputYear = year.year + 1;
			}
			else {
				outputYear = year.year;
			}
			if (present == false) {
				returnHTML +=
					"<div class=\"schedule-year-block\"><span class=\"semester-title\">" +
					term.semester + " " + outputYear +
					"</span><span class=\"semester-hours\">Hours: " +
					sumCreditHours(term.courses) + "</span><br><ul class=\"course-list\">";
				if (plan.currentSemester == term.semester + " " + outputYear) {
					present = true;
				}
			}
			else {
				returnHTML +=
					"<div class=\"schedule-year-block active\"><span class=\"semester-title\">" +
					term.semester + " " + outputYear +
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

function externalPlanHandler() {
	if (this.status === 200) {
		let returnPlan = new Plan("John Smith's Plan", 0, "", "John Smith", "");
		let externalPlans = this.response.plans;
		let externalCatalogs = this.response.catalogs;
		let externalPlan;
		let currentYear;
		for (let planKey in externalPlans) {
			if (externalPlans[planKey].default === "true") {
				externalPlan = externalPlans[planKey];
			}
		}
		for (let catalogKey in externalCatalogs) {
			if (externalCatalogs[catalogKey].year == externalPlan.catalog) {
				currentCatalog = externalCatalogs[catalogKey];
			}
		}
		returnPlan.name = externalPlan.name;
		returnPlan.year = externalPlan.currYear;
		returnPlan.major = externalPlan.major;
		returnPlan.currentSemester = "" + externalPlan.currTerm + " " + externalPlan.currYear;
		returnPlan.studentName = externalPlan.student;
		let currentCourse;
		for (let courseKey in externalPlan.courses) {
			currentCourse = externalPlan.courses[courseKey];
			if (courseKey != "") {
				returnPlan.courses.push(new Course(
					currentCourse.id,
					currentCatalog.courses[courseKey].name,
					currentCatalog.courses[courseKey].credits,
					capitalizeFirstLetter(currentCourse.term),
					currentCourse.year)
				);
				
			}
		}
		currentPlan = returnPlan;
		pageScheduleContainer.innerHTML = generateScheduleHTML(currentPlan);
		pageScheduleHeader.innerHTML = generateScheduleHeader(currentPlan);
		//document.getElementById("student").innerHTML = "<strong>Student: </strong>" + externalPlan.student;
		//document.getElementById("catalog").innerHTML = "<strong>Catalog: </strong>" + currentCatalog.year;
		//document.getElementById("major").innerHTML = "<strong>Major: </strong>" + externalPlan.major;
		//document.getElementById("minor").innerHTML = "<strong>Minor: </strong>" + externalPlan.minor;

		for (const property in (currentCatalog.courses)) {
			$("tbody").append("<tr><td>"+property+"</td><td>"+currentCatalog.courses[property].name+"</td><td>"+currentCatalog.courses[property].credits+"</td></tr>")
		}
		searchCourses();
	}
}

function loadPlan() {
	let returnPlan = new Plan("John Smith's Plan", 2020, "Computer Science", "John Smith", "Spring 2023");
	/*returnPlan.courses.push(new Course(id, name, credits, term, year));*/
	returnPlan.courses.push(new Course("MATH-1710", "Calculus I", 3, "Fall", 2020));
	returnPlan.courses.push(new Course("EGCP-1010", "Digital Logic Design", 3, "Fall", 2020));
	returnPlan.courses.push(new Course("CS-1210", "Intro to C++", 3, "Spring", 2021));
	returnPlan.courses.push(new Course("MATH-2710", "Calculus II", 3, "Fall", 2021));
	returnPlan.courses.push(new Course("CS-1220", "Obj-Orient Design/C++", 3, "Fall", 2021));
	returnPlan.courses.push(new Course("CS-3220", "Programming Language Survey", 3, "Spring", 2022));
	returnPlan.courses.push(new Course("MATH-3710", "Calculus III", 3, "Fall", 2022));
	returnPlan.courses.push(new Course("PHYS-2110", "General Physics I", 3, "Fall", 2022));
	returnPlan.courses.push(new Course("CS-3610", "Database Org & Design", 3, "Spring", 2023));
	returnPlan.courses.push(new Course("BIO-1115", "Biology 1: Cell Biology", 4, "Fall", 2023));
	returnPlan.courses.push(new Course("EGCP-3010", "Advanced Digital Logic Design", 3, "Spring", 2024));

	return returnPlan;
}

function isCourseOnPlan(id) {
	var $courses = $(".course");
	for(let i = 0; i < $courses.length; i++) {
		if($courses.eq(i).html().split(" ")[0] == id) {
			return true;
		} else {
			//console.log(id);
		}
	}
	return false;
}

function loadRequirements() {
	let requirements = this.response.categories;
	//console.log(requirements);
	let currentCourseName = "";
	
	// Load Core Classes
	let coreHTML = "<p>";
	for(let course in requirements.Core.courses) {
		if(isCourseOnPlan(requirements.Core.courses[course])) {
			coreHTML += "<img src='./images/checkmark.png' width=10 height=10> ";
		} else {
			coreHTML += "<img src='./images/x-mark.png' width=10 height=10> ";
		}
		currentCourseName = currentCatalog.courses[requirements.Core.courses[course]].name;
		coreHTML += requirements.Core.courses[course] + " " + currentCourseName + "<br>";
	}
	$(".core").html(coreHTML + "</p>");
	
	// Load Track (Elective) Classes
	let trackHTML = "<p>";
	for(let course in requirements.Electives.courses) {
		if(isCourseOnPlan(requirements.Electives.courses[course])) {
			trackHTML += "<img src='./images/checkmark.png' width=10 height=10> ";
		} else {
			trackHTML += "<img src='./images/x-mark.png' width=10 height=10> ";
		}
		currentCourseName = currentCatalog.courses[requirements.Electives.courses[course]].name;
		trackHTML += requirements.Electives.courses[course] + " " + currentCourseName + "<br>";
	}
	$(".track").html(trackHTML + "</p>");
	
	// Load Cognates
	let cognatesHTML = "<p>";
	for(let course in requirements.Cognates.courses) {
		if(isCourseOnPlan(requirements.Cognates.courses[course])) {
			cognatesHTML += "<img src='./images/checkmark.png' width=10 height=10> ";
		} else {
			cognatesHTML += "<img src='./images/x-mark.png' width=10 height=10> ";
		}
		currentCourseName = currentCatalog.courses[requirements.Cognates.courses[course]].name;
		cognatesHTML += requirements.Cognates.courses[course] + " " + currentCourseName + "<br>";
	}
	$(".cognates").html(cognatesHTML + "</p>");
	
	// Load Gen Eds
	let genEdsHTML = "<p>";
	for(let course in requirements.GenEds.courses) {
		if(isCourseOnPlan(requirements.GenEds.courses[course])) {
			genEdsHTML += "<img src='./images/checkmark.png' width=10 height=10> ";
		} else {
			genEdsHTML += "<img src='./images/x-mark.png' width=10 height=10> ";
		}
		currentCourseName = currentCatalog.courses[requirements.GenEds.courses[course]].name;
		genEdsHTML += requirements.GenEds.courses[course] + " " + currentCourseName + "<br>";
	}
	$(".geneds").html(genEdsHTML + "</p>");
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
		//num.style.color = "blue";
	}
	if (input.match(notValid)){
		num.innerHTML = ("Invalid input");
		//num.style.color = "red";
	}
}


function clearCourses(){
	document.getElementById("search").value = "";
	searchCourses();
}

function hexAdd(a,b){
	let r1 = parseInt(a.slice(1,3), 16);
	let g1 = parseInt(a.slice(3,5), 16);
	let b1 = parseInt(a.slice(5,7), 16);
	let r2 = parseInt(b.slice(1,3), 16);
	let g2 = parseInt(b.slice(3,5), 16);
	let b2 = parseInt(b.slice(5,7), 16);
	return (rgbCombine(r1+r2,g1+g2,b1+b2));
}
function hexSub(a,b){
	let r1 = parseInt(a.slice(1,3), 16);
	let g1 = parseInt(a.slice(3,5), 16);
	let b1 = parseInt(a.slice(5,7), 16);
	let r2 = parseInt(b.slice(1,3), 16);
	let g2 = parseInt(b.slice(3,5), 16);
	let b2 = parseInt(b.slice(5,7), 16);
	r1-=r2;
	g1-=g2;
	b1-=b2;
	if(r1<0){r1=0}
	if(r1>255){r1=255}
	if(g1<0){g1=0}
	if(g1>255){g1=255}
	if(b1<0){b1=0}
	if(b1>255){b1=255}
	return (rgbCombine(r1,g1,b1));	
}
function hexText(a){
	let r1 = parseInt(a.slice(1,3), 16);
	let g1 = parseInt(a.slice(3,5), 16);
	let b1 = parseInt(a.slice(5,7), 16);
	if((r1+g1+b1)>382){
		return('#000000')
	}else{
		return('#FFFFFF')
	}
}
function hexShade(a,b){
	let r1 = parseInt(a.slice(1,3), 16);
	let g1 = parseInt(a.slice(3,5), 16);
	let b1 = parseInt(a.slice(5,7), 16);
	let r2 = parseInt(a.slice(1,3), 16);
	let g2 = parseInt(a.slice(3,5), 16);
	let b2 = parseInt(a.slice(5,7), 16);
	let diff = 40;
	if((r2+g2+b2)>382){
		r1-=diff;
		g1-=diff;
		b1-=diff;
	}else{
		r1+=diff;
		g1+=diff;
		b1+=diff;
	}
	if(r1<0){r1=0}
	if(r1>255){r1=255}
	if(g1<0){g1=0}
	if(g1>255){g1=255}
	if(b1<0){b1=0}
	if(b1>255){b1=255}
	return (rgbCombine(r1,g1,b1));
}
function hexBright(a){
	let r1 = parseInt(a.slice(1,3), 16);
	let g1 = parseInt(a.slice(3,5), 16);
	let b1 = parseInt(a.slice(5,7), 16);
	let r2 = parseInt(a.slice(1,3), 16);
	let g2 = parseInt(a.slice(3,5), 16);
	let b2 = parseInt(a.slice(5,7), 16);
	let diff = 40;
	if((r2+g2+b2)<382){
		r1-=diff;
		g1-=diff;
		b1-=diff;
	}else{
		r1+=diff;
		g1+=diff;
		b1+=diff;
	}
	if(r1<0){r1=0}
	if(r1>255){r1=255}
	if(g1<0){g1=0}
	if(g1>255){g1=255}
	if(b1<0){b1=0}
	if(b1>255){b1=255}
	return (rgbCombine(r1,g1,b1));
}
function hexAvg(a,b){
	let r1 = parseInt(a.slice(1,3), 16);
	let g1 = parseInt(a.slice(3,5), 16);
	let b1 = parseInt(a.slice(5,7), 16);
	let r2 = parseInt(b.slice(1,3), 16);
	let g2 = parseInt(b.slice(3,5), 16);
	let b2 = parseInt(b.slice(5,7), 16);
	return (rgbCombine(Math.floor((r1+r2)/2),Math.floor((g1+g2)/2),Math.floor((b1+b2)/2)));
}

let white=false;
let black=false;
let red=false;
let green=false;
let blue=false;
let yellow=false;
let cyan=false;
let purple=false;
async function rainbows(){
	//black, purple, blue, cyan, green, yellow, red, pink, white, black
	
	//225 107 148 pink
	let a = ($("#colors").val())
	let r = parseInt(a.slice(1,3), 16);
	let g = parseInt(a.slice(3,5), 16);
	let b = parseInt(a.slice(5,7), 16);
	if ((r==255)&&(g==255)&&(b==255)){
		white=true;
		black=false;
		red=false;
		green=false;
		blue=false;
		yellow=false;
		cyan=false;
		purple=false;
	}
	if ((r==0)&&(g==0)&&(b==0)){
		black=true;
		white=false;
		red=false;
		green=false;
		blue=false;
		yellow=false;
		cyan=false;
		purple=false;
	}
	if ((r==255)&&(g==0)&&(b==0)){
		red=true;
		white=false;
		black=false;
		green=false;
		blue=false;
		yellow=false;
		cyan=false;
		purple=false;
	}
	if ((r==0)&&(g==255)&&(b==0)){
		green=true;
		white=false;
		black=false;
		red=false;
		blue=false;
		yellow=false;
		cyan=false;
		purple=false;
	}
	if ((r==0)&&(g==0)&&(b==255)){
		blue=true;
		white=false;
		black=false;
		red=false;
		green=false;
		yellow=false;
		cyan=false;
		purple=false;
	}
	if ((r==255)&&(g==255)&&(b==0)){
		yellow=true;
		white=false;
		black=false;
		red=false;
		green=false;
		blue=false;
		cyan=false;
		purple=false;
	}
	if ((r==0)&&(g==255)&&(b==255)){
		cyan=true;
		white=false;
		black=false;
		red=false;
		green=false;
		blue=false;
		yellow=false;
		purple=false;
	}
	if ((r==255)&&(g==0)&&(b==255)){
		purple=true;
		white=false;
		black=false;
		red=false;
		green=false;
		blue=false;
		yellow=false;
		cyan=false;
	}
	if (black){
		b+=1;
		r+=1;
	}
	if (purple){
		r-=1;
	}
	if (blue){
		g+=1;
	}
	if (cyan){
		b-=1;
	}
	if (green){
		r+=1;
	}
	if (yellow){
		g-=1;
	}
	if (red){
		g+=1;
		b+=1;
	}
	if (white){
		r-=1;
		g-=1;
		b-=1;
	}
	
	let result = rgbCombine(r,g,b);
	document.getElementById("colors").value = result;
	changeColor();
} 
async function r(){
	if (document.getElementById("rainbow").checked){
		delayTime = (100-(document.getElementById("rainbowSpeed").value))*5;
		setTimeout(r, delayTime);
		rainbows();
	}
}
function rgbCombine(r, g, b){
	let x=r.toString(16);
	let y=g.toString(16);
	let z=b.toString(16);
	if (x.length==1){
		x="0"+x;
	}
	if (y.length==1){
		y="0"+y;
	}
	if (z.length==1){
		z="0"+z;
	}
	return ("#"+x+y+z);
}

	//black, purple, blue, cyan, green, yellow, red, pink, white, black

function changeColor(){
	if (document.getElementById("colorCheck").checked){	
		let colorA = ($("#colors").val());
		let colorB = hexShade(colorA,colorA);
		let colorC = (hexSub('#DDDDDD', colorA));
		let colorD = hexShade(colorB,colorA);
		let colorE = hexBright(colorA,colorA);
		let colorT = hexText(colorA);
		$("body, h2, div, .active, a, showing").css("color", colorT);
		$("em").css("color", (hexText(colorT)));
		$(".grid-item, #accordion, .accord-collapsed, .accord-content").css('backgroundColor', colorA).css("border","1px solid" +colorT);
		$(".schedule-year-block").css('backgroundColor', colorB);
		$("body").css("backgroundColor", colorA);
		$("header").css("background-image", "linear-gradient(to right, "+colorT+" , "+colorA+")");
		$("button,input").css("backgroundColor", colorD).css("background-image","none").css("color",hexText(colorD)).css("border","1px solid" +colorE);
		basicB = "none";
		basicC = "none";
		$(".section-header, .accord-header, .track").css("backgroundColor", colorB);
		$(".active, select, .accord-active, .accord-collapsed:active").css("background-color", colorD).css("border","1px solid" +colorE).css("color", hexText(colorD))
		$("header").css("border","1px solid" +colorE)
		hoverB = "linear-gradient(to right, "+colorA+", "+colorD+")"
		hoverC = "linear-gradient(to right, "+colorD+", "+colorD+")"
		$(".section-header").css("backgroundColor", colorB);
		$(".active").css("background-color", colorD).css("border","1px solid" +colorE).css("color", hexText(colorD))
		$("header").css("border","1px solid" +colorE);
		$("#accordion").css("background-color", colorD);
		$("#accordion .ui-accordion-content").css("background-color", colorB);
		$(".ui-accordion-header-active").css("background-color", colorD);
		$(".ui-accordion-header-collapsed").css("background-color", colorA).css("background-image","none");
		$(".ui-accordion-header-collapsed:hover").css("background-color", colorD);
		$(".ui-accordion-header-collapsed:active").css("background-color", colorE).css("color", hexText(colorD));
		hoverB = "linear-gradient(to right, "+colorA+", "+colorD+")";
	} else {
		$("body, h2, div, .active, a, select").css("color", "black");
		$("em").css("color", "blue");
		$("button").css("background-image","linear-gradient(to right, rgb(220, 190, 50), rgb(255, 250, 30))").css("color","black").css("border","2px solid black").css("border-radius","4px");
		basicB = "linear-gradient(to right, rgb(220, 190, 50), rgb(255, 250, 30))";
		basicC = "linear-gradient(to right, rgb(220, 190, 50), rgb(220, 190, 50))";
		$(".section-header").css("color","2779aa").css("backgroundColor","rgb(200, 220, 255)");
		$("#title").css("color","blue");
		$(".schedule-year-block").css("background-color","rgb(238, 238, 238)").css("border","1px solid rgb(200,200,200)");
		$(".active").css("background-color","rgb(200, 220, 255)").css("color","#2779aa").css("border","1px solid #2779aa")
		$(".grid-item").css("background","white").css("border","1px solid lightblue");
		$("header").css("border","1px solid blue").css("background-image","linear-gradient(to right, rgb(200, 220, 255), white)")
		$("body, select").css("backgroundColor","white");
		$("h2").css("color","#2779aa");
		$("input").css("background-image", "").css("backgroundColor","white").css("color","black").css("border","2px groove lightgrey").css("border-radius", "3px");
		hoverB = "linear-gradient(to right, rgb(250, 230, 50), rgb(255, 255, 255))"
		hoverC = "linear-gradient(to right, rgb(250, 230, 50), rgb(250, 230, 50))"
		$("#accordion").css("background-color", "rgb(220, 230, 255)");
		$(".ui-accordion-content").css("background-color", "rgb(200, 220, 255)");
		$(".ui-accordion-header-active").css("background-color", "rgb(255, 250, 30)").css("color","black");;
		$(".ui-accordion-header-collapsed").css("background-color", "rgb(220, 190, 50)");
		$(".ui-accordion-header-collapsed:hover").css("background-color", "rgb(255, 255, 55)");
		$(".ui-accordion-header-collapsed:active").css("background-color", "rgb(255, 255, 255)");
		hoverB = "linear-gradient(to right, rgb(250, 230, 50), rgb(255, 255, 255))";
	}
}


let colorA = '#000000';
let colorB = '#0000FF';
let colorC = '#FFFFFF';
let hoverB = "linear-gradient(to right, rgb(250, 230, 50), rgb(255, 255, 255))";
let basicB = "linear-gradient(to right, rgb(220, 190, 50), rgb(255, 250, 30))";
let basicC = "linear-gradient(to right, rgb(220, 190, 50), rgb(220, 190, 50))";
let hoverC = "linear-gradient(to right, rgb(250, 230, 50), rgb(250, 230, 50))"
let delayTime = 1000000;
let pageScheduleContainer;
let pageScheduleHeader;
let currentCatalog;

function init(){
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		document.getElementById("colorCheck").setAttribute("checked", "");
	}
	
	$("button").mouseover(function() {
		//$(this).css("background-image", hoverB);
		changeColor()
	}).mouseout(function(){
		//$(this).css("background-image", basicB);
		changeColor()
	});
	$("#accordion .ui-accordion-header-collapsed").mouseover(function() {
		//$(this).css("background-image", hoverC);
		changeColor()
	}).mouseout(function(){
		//$(this).css("background-image", basicC);
		changeColor()
	});


	document.getElementById("rainbow").addEventListener("click", r);
	
	let amountOfCourses = document.getElementById("courselist").rows.length-1
	let num = document.getElementById("showing");
	num.innerHTML = ("Showing 1 to "+amountOfCourses +" of "+amountOfCourses);
	if (amountOfCourses==0){
		num.innerHTML = ("No Classes Found");
		//num.style.color = "blue";
	}	
	document.getElementById("search").addEventListener("keyup", searchCourses);
	document.getElementById("clear").addEventListener("click", clearCourses);
	document.getElementById("clear").style.cursor = "pointer";
	pageScheduleContainer = document.getElementsByClassName("schedule-container")[0];
	pageScheduleHeader = document.getElementById("schedule-header");
	
	let xhr = new XMLHttpRequest();
	let xhrReq;
	
	xhr.addEventListener("load", externalPlanHandler);
	xhr.responseType = "json";
	xhr.open("GET", "./php/project4_getCombined.php");
	xhr.onreadystatechange = function() {
		if(xhrReq == undefined) {
			xhrReq = new XMLHttpRequest();
			xhrReq.addEventListener("load", loadRequirements);
			xhrReq.responseType = "json";
			xhrReq.open("GET", "http://judah.cedarville.edu/~knoerr/cs3220/termProject/getRequirements.php");
			xhrReq.send();
		}
	}
	xhr.send();
	
	document.getElementById("colors").addEventListener("input", changeColor);
	document.getElementById("colorCheck").addEventListener("change", changeColor);
	klisten0(document.getElementById("year"), "http://judah.cedarville.edu/~gallaghd/ymm/ymmdb.php?fmt=xml");
	document.getElementById("year").addEventListener("change", klisten1);
	document.getElementById("make").addEventListener("change", klisten2);
}
function klisten0(doc, addr) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(xhttp.responseText,"text/xml");
		let years = xmlDoc.getElementsByTagName("year")
		for (let i = 0; i < years.length; i++) {
			let option = document.createElement("option");
			option.text = years[i].textContent;
			option.value = "car";
			doc.appendChild(option);
		}
	}
	};
	let option = document.createElement("option");
	option.text = " ";
	option.value = "";
	doc.appendChild(option)
	xhttp.open("GET", addr, true);
	xhttp.send();
  }
function klisten1(){
	if (!(document.getElementById("year").value=='')){
		document.getElementById("make").disabled=false;
	
		var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(xhttp.responseText,"text/xml");
		let makes = xmlDoc.getElementsByTagName("make")
		for (let i = 0; i < makes.length; i++) {
			let option = document.createElement("option");
			let vars = makes[i].textContent.split(" ");
			option.text = vars[8].trim();
			option.value = vars[4].trim();
			document.getElementById("make").appendChild(option);
		}
	}
	};
	let option = document.createElement("option");
	option.text = " ";
	option.value = "";
	document.getElementById("make").appendChild(option)
	let t = document.getElementById("year");
	xhttp.open("GET", "http://judah.cedarville.edu/~gallaghd/ymm/ymmdb.php?fmt=xml&year="+t.options[t.selectedIndex].text, true);
	xhttp.send();

	} else {
		clearCars(document.getElementById("make"));
		clearCars(document.getElementById("model"));
		document.getElementById("make").disabled=true;
		document.getElementById("model").disabled=true;
	}
}
function klisten2(){
	if (!(document.getElementById("make").value=='')){	
		document.getElementById("make").disabled=false;
		document.getElementById("model").disabled=false;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(xhttp.responseText,"text/xml");
			let makes = xmlDoc.getElementsByTagName("model")
			for (let i = 0; i < makes.length; i++) {
				let option = document.createElement("option");
				let vars = makes[i].textContent.split(" ");
				option.text = vars[8].trim();
				option.value = vars[4].trim();
				document.getElementById("model").appendChild(option);
			}
		}
	}
	let option = document.createElement("option");
	option.text = " ";
	option.value = "";
	document.getElementById("model").appendChild(option)
	let t = document.getElementById("year");
	let m =document.getElementById("make");
	xhttp.open("GET", "http://judah.cedarville.edu/~gallaghd/ymm/ymmdb.php?fmt=xml&year="+t.options[t.selectedIndex].text+"&make="+m.options[m.selectedIndex].value, true);
	xhttp.send();
	} else {
		clearCars(document.getElementById("model"));
		document.getElementById("model").disabled=true;
	}
}
function clearCars(doc){
	while (doc.hasChildNodes()){
		doc.removeChild(doc.firstChild);
	}
	
}

$( function() {
    $( "#accordion" ).accordion({
		active: 1,
		animate: 100,
		heightStyle: "fill",
		activate: function(event, ui) {
			$( "#accordion" ).accordion( "refresh" );
			changeColor();
		},
		beforeActivate: function(event, ui) {
			$( "#accordion" ).accordion( "refresh" );
			changeColor();
		}
	});
  } );
  
window.onresize = function() {
	$( "#accordion" ).accordion( "refresh" );
}

$(document).ready(init);
