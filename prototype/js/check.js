//check the inputs on EnterNumberOfCities page and prompt message accordingly
//the number of cities should be an positive integer
function checkCityNumber(){
	var input = document.querySelector("#citynumber input").value;
	//if input is not a positive integer number
	if ( parseInt(input) != input || parseInt(input) <= 0 ) {
		document.querySelector("#citynumber .warning").innerHTML="Please Enter a Positive Integer Number!";
		return;
	}
	numberOfCities = parseInt(input);
	toDiv2();
}

//check the inputs on EnterCoordinates page and prompt accordingly
//the coordinates of cities should match the number of cities entered on the EnterNumberOfCities page
//the coordinates could be integers or floats seperated be space, tab, or return
function checkCityCoordinate(){
	var input = document.querySelector("#citycoordinate textarea").value;
	input = input.replace(/\t/g, " ");
	input = input.replace(/\r/g, " ");
	input = input.replace(/\n/g, " ");
	var coordinates = input.split(" ");
	coordinates = coordinates.filter( function(item){return item != " " && item != "";} );
	//if there's NaN in the input or the total number of coordinates is not a even number
	if( !coordinates.every(function(item){return parseInt(item) ==item || parseFloat(item) == item;}) || coordinates.length % 2 !== 0){
		document.querySelector("#citycoordinate .warning").innerHTML="Invalid format!";
		return;
	}
	if(coordinates.length / 2 !== numberOfCities){
		document.querySelector("#citycoordinate .warning").innerHTML="Please enter " + numberOfCities + " cities!";
		return;
	}
	coordinatesOfCities = [];
	coordinateArray = coordinates.map(Number);
	for(var i = 0; i < coordinateArray.length/2; i++){
		coordinatesOfCities.push({x: coordinateArray[2*i], y: coordinateArray[2*i+1]});
	}
	toDiv3();
}

//check the parameter values on EnterParameters page and prompt accordingly
//the parameters should match the specification of specified algorithm on each web page
function checkParameters(){
	var trial = document.querySelector("#trial input").value;
	var iteration = document.querySelector("#iteration input").value;
	var iom = document.querySelector("#iom input").value;
	var cschedule = document.querySelector("[name=cooling]:checked").value;
	var crate = document.querySelector("#crate input").value;

	var pass = true;

	if ( parseInt(trial) != trial || parseInt(trial) <= 0 ) {
		document.querySelector("#trial .warning").innerHTML="Please Enter a Positive Integer Number!";
		pass = false;
	}
	if ( parseInt(iteration) != iteration || parseInt(iteration) <= 0 ) {
		document.querySelector("#iteration .warning").innerHTML="Please Enter a Positive Integer Number!";
		pass = false;
	}
	if ( parseInt(iom) != iom || parseInt(iom) <= 0 ) {
		document.querySelector("#iom .warning").innerHTML="Please Enter a Positive Integer Number!";
		pass = false;
	}
	if ( (parseInt(crate) != crate && parseFloat(crate) != crate)
			|| ( parseInt(crate) < 0 && parseInt(crate) > 1) || ( parseFloat(crate) < 0 && parseFloat(crate) > 1) ) {
		document.querySelector("#crate .warning").innerHTML="Please Enter a Number between 0 and 1!";
		pass = false;
	}

	if(!pass) return;

	maxTrials = parseInt(trial);
	maxIteration = parseInt(iteration);
	intensityOfMutation = parseInt(iom);
	coolingSchedule = cschedule;
	coolingRate = parseFloat(crate);
	toDiv4(false);
}
