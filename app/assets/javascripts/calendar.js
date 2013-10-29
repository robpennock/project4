var currentDay;		//globals
var currentYear;
var currentMonth;
var firstWeekFlag;
var d = new Date();	//date object now global

var months = [
"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December"
];

//sets the date object with current month, day, and year
function initializeCurrentDate(){
	currentDay=d.getDay();
	currentYear=d.getFullYear();
	currentMonth=d.getMonth();
}
// returns a number 0-11 representing the current month
function getMonth(){
	//var d = new Date();
	return currentMonth;
}

// returns a string representing the current month's name
function getMonthName(){
	return months[getMonth()];
}
//gets the 4 digits of the year
function getYear(){
	//var d = new Date();
	return currentYear;	
}
//return integer day of the week 0-6
function getDay(){
	//var d = new Date();		
	return d.getDay();
}
//return the current day of month 1-31
function getDate(){
	//var d = new Date();		
	return d.getDate();
}
//get the first day of the month
function getFirstDay(){
	//var d = new Date();
	var year = currentYear;
	var month = currentMonth;	
	var date = new Date(year, month, 1);
	return date.getDay();
}


//get the last day of the month
function getLastDay(){
	//var d = new Date();
	var year = currentYear;
	var month = currentMonth;	
	var date = new Date(year, month + 1, 0);
	return date.getDate();
}
//set firstWeekFlag as needed
function setFirstWeekFlag(tOrF){
	if(tOrF==true)
		firstWeekFlag=true;
	else
		firstWeekFlag=false;
}
function incrementMonth(){
	currentMonth++;
    if(currentMonth<12)
    	d.setMonth(currentMonth);
    else{
    	currentMonth=0;
    	incrementYear();
    	d.setMonth(currentMonth);
    }
    setFirstWeekFlag(true);
}
function decrementMonth(){
	currentMonth--;
    if(currentMonth<0){
    	currentMonth=11;
    	decrementYear();
    	d.setMonth(currentMonth);
    }	
    else{
    	d.setMonth(currentMonth);
    }
    setFirstWeekFlag(true);
}
function incrementYear(){
	currentYear++;
	d.setYear(currentYear);
    setFirstWeekFlag(true);
}
function decrementYear(){
	currentYear--;
	d.setYear(currentYear);
    setFirstWeekFlag(true);
}
//this is the function that pretty much does everything
//this creates a row of cells 1 week at a time
function makeWeek(){
	var week = "<tr>";	//our new string of tags to make week row
	var numOfBlanks = 0;
	if(firstWeekFlag){
		//loop for initial blanks
		for (var i = getFirstDay(); i > 0; i--) {
			week = week + "<td> </td>";
			numOfBlanks++;
		};	
		firstWeekFlag = false;	//remember to reset flag
	}		
	//given number of blanks before first day (weekDay), loop until end of week
	for (var i = 0; i < (7 - numOfBlanks); i++) {				
		week = week + "<td>";
		if(currentDay > getLastDay()){
			week = week + " </td>";
		}else {
			week = week + currentDay + "<ul></ul></td>";
		}
		currentDay++;
	};	
	week = week + "</tr>";
	return week;
}

function makeMonth(){
	currentDay = 1;
	firstWeekFlag = true; //make sure blanks are only added to the first of the month
	for (var i = 0; i < 6; i++) {
		$('.calendar tbody').append(makeWeek());
	};
}	
function clearMonth(){
	$('tbody').empty();	//clear the tbody section which contains all calendar cells
};

//sourced from => http://www.stormconsultancy.co.uk/blog/development/code-snippets/jquery-document-ready-events-and-turbolinks/
var do_on_load = function(){
	//re-render the calendar on a page change
	//setup timepicker plugin
	/*$('#timepicker').timepicker({
		defaultTime: false
	});*/
	initializeCurrentDate();
	makeMonth();
	//fill in the calendar header
	$('#month_year').html(getMonthName() + " " + getYear());
}
$(document).ready(do_on_load);					
$(window).bind('page:change', do_on_load);	//not quite sure what this does? Does it prevent the "refresh" issue?

$(document).on('click', '#backMonth', function(){
	decrementMonth();
	clearMonth();
	$('#month_year').html(getMonthName() + " " + getYear());
	makeMonth();
});	

$(document).on('click', '#backYear', function(){
	decrementYear();
	clearMonth();
	$('#month_year').html(getMonthName() + " " + getYear());
	makeMonth();
});	

$(document).on('click', '#forwardMonth', function(){
	//alert("forwardMonth");
	incrementMonth();
	clearMonth();
	$('#month_year').html(getMonthName() + " " + getYear());
	makeMonth();

});	

$(document).on('click', '#forwardYear', function(){
	incrementYear();
	clearMonth();
	$('#month_year').html(getMonthName() + " " + getYear());
	makeMonth();
});	