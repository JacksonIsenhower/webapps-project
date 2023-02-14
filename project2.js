
//const valid = [/\w+\++" "+/];
const valid = /[^\w" "+-]/;


function testInput(input){
	return input.value.test(valid)
}

function testCourses(input){
	let matches = [];
	for (var i = 0; i < courses.length; i++){
		if(matches[i].indexOf(input)!=-1){
			matches.push(courses[i])
		}
	}
	return matches;
}

function clearCourses(){
	document.getElementById("search").value = "";
	searchCourses();
}

function searchCourses(){
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
	if (input.match(valid)){
		num.innerHTML = ("Invalid input");
		num.style.color = "red";
	}
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


