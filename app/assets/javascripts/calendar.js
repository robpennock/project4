var currentDay;
var firstWeekFlag;

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

// returns a number 0-11 representing the current month
function getMonth(){
	var d = new Date();
	return d.getMonth();
}

// returns a string representing the current month's name
function getMonthName(){
	return months[getMonth()];
}

function getYear(){
	var d = new Date();
	return d.getFullYear();	
}

function getDay(){
	var d = new Date();		
	return d.getDay();
}

function getDate(){
	var d = new Date();		
	return d.getDate();
}

function getFirstDay(){
	var d = new Date();
	var currentYear = d.getFullYear();
	var currentMonth = d.getMonth();	
	var date = new Date(currentYear, currentMonth, 1);
	return date.getDay();
}

function getLastDay(){
	var d = new Date();
	var currentYear = d.getFullYear();
	var currentMonth = d.getMonth();	
	var date = new Date(currentYear, currentMonth + 1, 0);
	return date.getDate();
}

function makeWeek(){
	var week = "<tr>";
	var numOfBlanks = 0;
	if(firstWeekFlag){
		//loop for initial blanks
		for (var i = getFirstDay(); i > 0; i--) {
			week = week + "<td> </td>";
			numOfBlanks++;
		};	
		firstWeekFlag = false;
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

// $(document).on('click', '#test', function(){
// 	makeMonth();
// });	

var do_on_load = function(){
	//re-render the calendar on a page change
	makeMonth();
	//fill in the calendar header
	$('#month_year').html(getMonthName() + " " + getYear());
	//setup timepicker plugin
	$('#timepicker').timepicker({
		defaultTime: false
	});
}
$(document).ready(do_on_load);
$(window).bind('page:change', do_on_load);
