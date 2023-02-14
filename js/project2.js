let javascriptPlan = {
	planName: "",
	catalogueYear: "",
	major: "",
	studentName: "",
	currentSemester: "",
	courses: []
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

