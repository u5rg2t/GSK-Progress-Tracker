var items = [];
var itemsMaster = [];
var totalEmployeeCount = 0;

$(document).ready(function () {
	
	$(".filters input:radio").button();
	
	$('.selector .filterdropdown').on('change', function() {
		renderTable($(this).find("option:selected").text());
		$("#box").val("");
	});

	$('.selector .sort').on('change', function() {
		
		sortData($(this).find("option:selected").text());
		renderTable($('.selector .filterdropdown option:selected').text());
		$("#box").val("");
	});
	
	$('#box').keyup(function () {
		var valThis = this.value.toLowerCase(),
			lenght  = this.value.length;

		$('.tableview ul>li').each(function () {
			var text  = $(this).find(".statusindicator").text(),
				textL = text.toLowerCase();
				//htmlR = '<b>' + text.substr(0, lenght) + '</b>' + text.substr(lenght);
			(textL.indexOf(valThis) == 0) ? $(this).show() : $(this).hide();
		});

	});

	getItems();
	
});

function sortData(sorttype){

	if(sorttype == "Name (A to Z)"){
		items.sort(function(a, b){
			var nameA=a.title.toLowerCase(), nameB=b.title.toLowerCase();
			if (nameA < nameB) //sort string ascending
				return -1;
			if (nameA > nameB)
				return 1;
			return 0; //default return value (no sorting)
		});
	}
	else if(sorttype == "Name (Z to A)"){
		items.sort(function(a, b){
			var nameA=a.title.toLowerCase(), nameB=b.title.toLowerCase();
			if (nameA > nameB) //sort string ascending
				return -1;
			if (nameA < nameB)
				return 1;
			return 0; //default return value (no sorting)
		});
	}
	else if(sorttype == "Status (Green to Red)"){
		items.sort(function(a, b){

			var statusIntA = 0;
			if (a.status == "Green"){statusIntA = 0};
			if (a.status == "Amber"){statusIntA = 1};
			if (a.status == "Red"){statusIntA = 2};

			var statusIntB = 0;
			if (b.status == "Green"){statusIntB = 0};
			if (b.status == "Amber"){statusIntB = 1};
			if (b.status == "Red"){statusIntB = 2};

			if (statusIntA < statusIntB) //sort string ascending
				return -1;
			if (statusIntA > statusIntB)
				return 1;
			return 0; //default return value (no sorting)
		});
	}
	else if(sorttype == "Status (Red to Green)"){
		items.sort(function(a, b){
			var statusIntA = 0;
			if (a.status == "Green"){statusIntA = 0};
			if (a.status == "Amber"){statusIntA = 1};
			if (a.status == "Red"){statusIntA = 2};

			var statusIntB = 0;
			if (b.status == "Green"){statusIntB = 0};
			if (b.status == "Amber"){statusIntB = 1};
			if (b.status == "Red"){statusIntB = 2};

			if (statusIntA > statusIntB) //sort string ascending
				return -1;
			if (statusIntA < statusIntB)
				return 1;
			return 0; //default return value (no sorting)
		});
	}
	else if(sorttype == "Employee count (High to low)"){
		items.sort(function(a, b){

			if (a.employeecount > b.employeecount) //sort string ascending
				return -1;
			if (a.employeecount < b.employeecount)
				return 1;
			return 0; //default return value (no sorting)
		});
	}
	else if(sorttype == "Employee count (Low to high)"){
		items.sort(function(a, b){

			if (a.employeecount < b.employeecount) //sort string ascending
				return -1;
			if (a.employeecount > b.employeecount)
				return 1;
			return 0; //default return value (no sorting)
		});
	}
	else if(sorttype == "Target date (Sooner to later)"){
		items.sort(function(a, b){

			if (a.targetdate < b.targetdate) //sort string ascending
				return -1;
			if (a.targetdate > b.targetdate)
				return 1;
			return 0; //default return value (no sorting)
		});
	}
	else if(sorttype == "Target date (Later to sooner)"){
		items.sort(function(a, b){

			if (a.targetdate > b.targetdate) //sort string ascending
				return -1;
			if (a.targetdate < b.targetdate)
				return 1;
			return 0; //default return value (no sorting)
		});
	}

}

function getItems(){

	var Fields = "<ViewFields><FieldRef Name=\"ID\" /><FieldRef Name=\"Title\" /><FieldRef Name=\"Country_x0020_Code\" /><FieldRef Name=\"Status\" /><FieldRef Name=\"Display\" /><FieldRef Name=\"Action\" /><FieldRef Name=\"Next_x0020_Action\" /><FieldRef Name=\"Target_x0020_Date\" /><FieldRef Name=\"Employee_x0020_Count_x0020__x002\" /><FieldRef Name=\"Employee_x0020_Count_x0020__x0020\" /><FieldRef Name=\"Employee_x0020_Count_x0020__x0021\" /><FieldRef Name=\"Employee_x0020_Count_x0020__x0022\" /><FieldRef Name=\"Employee_x0020_Count_x0020__x0023\" /><FieldRef Name=\"Employee_x0020_Count_x0020__x0024\" /><FieldRef Name=\"Employee_x0020_Count\" /></ViewFields>";
	var CAML = "<Query><OrderBy><FieldRef Name='Title' Ascending='True' /></OrderBy><Where><Eq><FieldRef Name='Display'></FieldRef><Value Type='Text'>TRUE</Value></Eq></Where></Query>";

	$().SPServices({
		webURL:"https://connect.gsk.com/sites/Cx",
		operation: "GetListItems",
		async: true,
		listName: "Newsweaver - Market Progress Tracker",
		CAMLViewFields: Fields,	
		CAMLQuery: CAML,	
		completefunc: function (xData, Status) {

			var quantity = $(xData.responseXML).SPFilterNode("z:row").length;
			
			$(xData.responseXML).SPFilterNode("z:row").each(function(id) {
				
				theMessage = '{'

				theMessage += '"id":' + JSON.stringify($(this).attr("ows_ID")) + ',';
				theMessage += '"title":' + JSON.stringify($(this).attr("ows_Title")) + ',';
				theMessage += '"status":' + JSON.stringify($(this).attr("ows_Status")) + ',';
				theMessage += '"nextaction":' + JSON.stringify($(this).attr("ows_Next_x0020_Action")) + ',';
				theMessage += '"display":' + JSON.stringify($(this).attr("ows_Display")) + ',';
				theMessage += '"action":' + JSON.stringify($(this).attr("ows_Action")) + ',';
				theMessage += '"targetdate":' + JSON.stringify($(this).attr("ows_Target_x0020_Date")) + ',';
				theMessage += '"employeecount":' + JSON.stringify(0) + ',';
				theMessage += '"employeecountall":' + JSON.stringify(parseInt($(this).attr("ows_Employee_x0020_Count"))) + ',';
				theMessage += '"employeecountch":' + JSON.stringify(parseInt($(this).attr("ows_Employee_x0020_Count_x0020__x002"))) + ',';  // CH numbers
				theMessage += '"employeecountgms":' + JSON.stringify(parseInt($(this).attr("ows_Employee_x0020_Count_x0020__x0020"))) + ',';  // GMS numbers
				theMessage += '"employeecountgsf":' + JSON.stringify(parseInt($(this).attr("ows_Employee_x0020_Count_x0020__x0021"))) + ',';  // GSF numbers
				theMessage += '"employeecountpharma":' + JSON.stringify(parseInt($(this).attr("ows_Employee_x0020_Count_x0020__x0022"))) + ',';  // Pharma numbers
				theMessage += '"employeecountrd":' + JSON.stringify(parseInt($(this).attr("ows_Employee_x0020_Count_x0020__x0023"))) + ',';  // RD numbers
				theMessage += '"employeecountvaccines":' + JSON.stringify(parseInt($(this).attr("ows_Employee_x0020_Count_x0020__x0024")));  // Vaccines numbers

				theMessage += "}";
				
				var obj = jQuery.parseJSON(theMessage);
				itemsMaster.push(obj);
				
			});
			// All BUs and all status...
			filterItems("All");  // And render the screen...

			// Now the data is in place - enable to the action listers on the top filters...
			$(".filters input").change(function(){
				filterItems($(this).attr("id"));
				$("#box").val("");
				$(".selector select").val($("option:first").val());
			});
		}
	});
}

function filterItems(scope){
	
	items = [];
	totalEmployeeCount = 0;
	
	for (var i in itemsMaster){
		if (scope == "All"){
			var tempHolder = itemsMaster[i];
			tempHolder.employeecount = itemsMaster[i].employeecountall;
			items.push(tempHolder);
			totalEmployeeCount = totalEmployeeCount + itemsMaster[i].employeecount;
		}else if(scope == "CH"){
			if((itemsMaster[i].employeecountch != null) && (itemsMaster[i].employeecountch != 0)){
				var tempHolder = itemsMaster[i];
				tempHolder.employeecount = itemsMaster[i].employeecountch;
				items.push(tempHolder);
				totalEmployeeCount = totalEmployeeCount + itemsMaster[i].employeecount;
			}
		}else if(scope == "GMS"){
			if((itemsMaster[i].employeecountgms != null) && (itemsMaster[i].employeecountgms != 0)){
				var tempHolder = itemsMaster[i];
				tempHolder.employeecount = itemsMaster[i].employeecountgms;
				items.push(tempHolder);
				totalEmployeeCount = totalEmployeeCount + itemsMaster[i].employeecount;
			}
		}else if(scope == "GSF"){
			if((itemsMaster[i].employeecountgsf != null) && (itemsMaster[i].employeecountgsf != 0)){
				var tempHolder = itemsMaster[i];
				tempHolder.employeecount = itemsMaster[i].employeecountgsf;
				items.push(tempHolder);
				totalEmployeeCount = totalEmployeeCount + itemsMaster[i].employeecount;
			}
		}else if(scope == "Pharma"){
			if((itemsMaster[i].employeecountpharma != null) && (itemsMaster[i].employeecountpharma != 0)){
				var tempHolder = itemsMaster[i];
				tempHolder.employeecount = itemsMaster[i].employeecountpharma;
				items.push(tempHolder);
				totalEmployeeCount = totalEmployeeCount + itemsMaster[i].employeecount;
			}
		}else if(scope == "RD"){
			if((itemsMaster[i].employeecountrd != null) && (itemsMaster[i].employeecountrd != 0)){
				var tempHolder = itemsMaster[i];
				tempHolder.employeecount = itemsMaster[i].employeecountrd;
				items.push(tempHolder);
				totalEmployeeCount = totalEmployeeCount + itemsMaster[i].employeecount;
			}
		}else if(scope == "Vaccines"){
			if((itemsMaster[i].employeecountvaccines != null) && (itemsMaster[i].employeecountvaccines != 0)){
				var tempHolder = itemsMaster[i];
				tempHolder.employeecount = itemsMaster[i].employeecountvaccines;
				items.push(tempHolder);
				totalEmployeeCount = totalEmployeeCount + itemsMaster[i].employeecount;
			}
		}		
	}
	
	renderCharts();
	sortData("Name (A to Z)");
	renderTable("All");
	renderTop10list();
	rendernext10list();	
}

function renderCharts(){

	var greenCount = 0;
	var greenCountEmployee = 0;
	
	var amberCount = 0;
	var amberCountEmployee = 0;
	
	var redCount = 0;
	var redCountEmployee = 0;
	
	var totalCount = 0;
	var totalCountEmployee = 0;
	
	var percentages = [];

	for (var i in items){
		if (items[i].status == "Green"){
			greenCount++;
			greenCountEmployee = greenCountEmployee + parseInt(items[i].employeecount);
		}
		if (items[i].status == "Amber"){
			amberCount++;
			amberCountEmployee = amberCountEmployee + parseInt(items[i].employeecount);
		}
		if (items[i].status == "Red"){
			redCount++;
			redCountEmployee = redCountEmployee + parseInt(items[i].employeecount);
		}
		totalCount++;
		totalCountEmployee = totalCountEmployee + parseInt(items[i].employeecount);
	}

	percentages.push(parseInt((greenCountEmployee/totalCountEmployee) * 100)); // Green %
	percentages.push(parseInt((amberCountEmployee/totalCountEmployee) * 100)); // Amber %
	percentages.push(parseInt((redCountEmployee/totalCountEmployee) * 100)); // Red %
	
	$(".overallstatus .thenumber").html(percentages[0]);
	$(".overallstatus").fadeIn(700);

		var ChartData10 = {
			labels: [
				"Green",
				"Amber",
				"Red"
			],
			datasets: [
				{
					data: [percentages[0], percentages[1], percentages[2]],
					backgroundColor: [
						"#54a41c",
						"#f0efed",
						"#f0efed"
					]
				}]
		};	
			
		var ctx10 = document.getElementById("myChart");
		
		var myChart10 = new Chart(ctx10, {
			type: 'doughnut',
			data: ChartData10,
			options: {
				cutoutPercentage:95,
				legend: {
					display: false,
					labels: {
						fontColor: 'rgb(255, 99, 132)'
					}
				},
				tooltips:{
					enabled: true
				}
			}
		});

}

function renderTop10list(){
	var theHTML = "";
	
	var toptenlist = items;
	toptenlist.sort(function(a, b){

		if (a.employeecount > b.employeecount) //sort string ascending
			return -1;
		if (a.employeecount < b.employeecount)
			return 1;
		return 0; //default return value (no sorting)
	});
	
	for (var i in toptenlist){
		if (i < 10){
			var statuscolour = "";
			if (toptenlist[i].status == "Green"){
				statuscolour = "#54a41c";
			}else if(toptenlist[i].status == "Amber"){
				statuscolour = "#f36633";
			}else if(toptenlist[i].status == "Red"){
				statuscolour = "#e82a10";
			}
			
			var employeePercentage = ((toptenlist[i].employeecount / totalEmployeeCount) * 100).toFixed(2);
			thecount = i;
			thecount++;
			theHTML += "<li><span class=\"statusindicator\" style=\"background-color:" + statuscolour + ";\">" + thecount + "</span>" + toptenlist[i].title + "<span class=\"employeecount\">" + toptenlist[i].employeecount + " <span class=\"light\">(" + employeePercentage + "%)</span></span></li>";

		}
	}

	$(".left ul.leftlist").html(theHTML);
	
}

function rendernext10list(){
	var theHTML = "";
	
	var toptenlist = []
	var templist = items;
	templist.sort(function(a, b){
		if (a.targetdate < b.targetdate) //sort string ascending
			return -1;
		if (a.targetdate > b.targetdate)
			return 1;
		return 0; //default return value (no sorting)
	});
	
	for (var x in templist){
		if (templist[x].status != "Green"){
			toptenlist.push(templist[x]);
		}
	}
	
	for (var i in toptenlist){
		if (i < 10){


			var statuscolour = "";
			if (toptenlist[i].status == "Green"){
				statuscolour = "#54a41c";
			}else if(toptenlist[i].status == "Amber"){
				statuscolour = "#f36633";
			}else if(toptenlist[i].status == "Red"){
				statuscolour = "#e82a10";
			}
			
			var employeePercentage = ((toptenlist[i].employeecount / totalEmployeeCount) * 100).toFixed(2);
			thecount = i;
			thecount++;
			theHTML += "<li><span class=\"statusindicator\" style=\"background-color:" + statuscolour + ";\">" + thecount + "</span>" + toptenlist[i].title + "<span class=\"employeecount light\">" + moment(toptenlist[i].targetdate).format("Do MMM YYYY") + "</span></li>";

		}
	}

	$(".right ul.rightlist").html(theHTML);
	
}

function renderTable(filter){

	var theHTML = "";

	var thecount = 0;
	for (var i in items){

		var statuscolour = "";
		if (items[i].status == "Green"){
			statuscolour = "#54a41c";
		}else if(items[i].status == "Amber"){
			statuscolour = "#f36633";	
		}else if(items[i].status == "Red"){
			statuscolour = "#e82a10";			
		}
		
		if(filter == "All" || (filter == items[i].status)){
		
			var employeePercentage = ((items[i].employeecount / totalEmployeeCount) * 100).toFixed(2);
			thecount++;

			theHTML += "<li><span class=\"thenumber\">" + thecount + ".</span><span class=\"statusindicator\" style=\"background-color:" + statuscolour + ";\">" + items[i].title + " </span><span class=\"date\">" + moment(items[i].targetdate).format("Do MMM YYYY") + "</span><span class=\"employeecount\">" + items[i].employeecount + " <span class=\"light\">(" + employeePercentage + "%)</span></span></li>";
		}
	}

	$(".tableview ul").html(theHTML);
}