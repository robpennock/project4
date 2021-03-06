//globals
var currentDate;		
var currentYear;
var currentMonth;
var todaysDate;		
var todaysYear;
var todaysMonth;
var firstWeekFlag;
var d = new Date();	//date object now global
var appointments = [];	//all appointments for the current month

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
	currentYear=d.getFullYear();
	currentMonth=d.getMonth();	
	todaysYear=d.getFullYear();
	todaysMonth=d.getMonth();
	todaysDate=d.getDate();	
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
		//highlight today's date on calendar
        if(todaysYear == currentYear && todaysMonth == currentMonth
        && todaysDate == currentDate){
            week = week + "<td style='background:pink' class='day' data-day='" + 
        	currentDate + "'>" + currentDate + "</td>";
        }else{
	        //add blanks at end of month
			if(currentDate > getLastDay()){
				week = week + "<td> </td>";
			}else {
				week = week + "<td class='day' data-day='" + currentDate + "'>" + currentDate + "</td>";
			}
		}
		currentDate++;
	};	
	week = week + "</tr>";
	return week;
}

function makeMonth(){
	//create an aray of appointment for the current month
	$.ajax({
		type: 'get',
		url: "/appointment",
		dataType: 'json',
		async: false,
		data: { the_month: currentMonth, the_year: currentYear }
	}).success(function(data){
		appointments = data;
	});

	//create a month one week at a time
	currentDate = 1;
	firstWeekFlag = true; //make sure blanks are only added to the first of the month
	for (var i = 0; currentDate <= getLastDay(); i++) {
		$('.calendar tbody').append(makeWeek());
	}

	//add DB appointments to the calendar days
	var lastDay = getLastDay();
	for (var i = appointments.length - 1; i >= 0; i--) {
		for (var j = 1; j <= lastDay; j++) {
			var temp = "td[data-day=" + j + "]";
			var $das_cell = $(temp);
			if(appointments[i].the_day == j){
				var str = "<br/>" + appointments[i].the_desc + " @ " + appointments[i].the_time;
				$das_cell.append(str);
			}
		};		
	};	

}	
function updateMonth(){
	$('.calendar tbody').empty();	//clear the tbody section which contains all calendar cells
	$('#month_year').html(getMonthName() + " " + getYear());
	makeMonth();
};

//sourced from => http://www.stormconsultancy.co.uk/blog/development/code-snippets/jquery-document-ready-events-and-turbolinks/
var do_on_load = function(){
	//re-render the calendar on a page change
	initializeCurrentDate();
	updateMonth();	
}
$(document).ready(do_on_load);					
$(window).bind('page:change', do_on_load);	//not quite sure what this does? Does it prevent the "refresh" issue?

//on-click events for the table header buttons
$(document).on('click', '#backMonth', function(){
	decrementMonth();
	updateMonth();	
});
$(document).on('click', '#backYear', function(){
	decrementYear();
	updateMonth();
});
$(document).on('click', '#forwardMonth', function(){
	//alert("forwardMonth");
	incrementMonth();
	updateMonth();
});	
$(document).on('click', '#forwardYear', function(){
	incrementYear();
	updateMonth();
});	

// $("#eventDetails").focus(function(){
// 	$(this).val('');
// });

$(document).on('click', ".day", function(event){
	var $das_cell = $(event.target);
	var time = $("#timeSelect option:selected").text();
	var details = "<br/>" + $("#eventDetails").val();
	details = details + " @ " + time
	if($("#eventDetails").val() != '' && $("#timeSelect option").is(":selected")){
		//create a new appointment in the database
		$.ajax({
			type: 'post',
			url: "/appointment",
			dataType: 'json',
			async: false,
			data: { 
				//order doesn't matter, rails knows what to do with named fields
				the_desc: $("#eventDetails").val(), 
				the_time: $("#timeSelect option:selected").text(), 
				the_day: $das_cell.data("day"), 
				the_month: currentMonth, 
				the_year: currentYear 
			}
		})
	}
	$cell.append(details);	
	$("#timeSelect option:selected").removeAttr("selected");
	$("#eventDetails").val('');	
});