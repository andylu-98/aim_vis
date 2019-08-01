//check whether an element is a space or empty string or not
function checkSpace(element){
	if(element === ' ') return false;
	if(element === '') return false;
	return true;
}

//check whether an element is a number or not
function checkNumber(element){
	if (parseInt(element) == element || parseFloat(element) == element) return true;
	return false;
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
	coordinates = coordinates.filter(checkSpace);
	if(!coordinates.every(checkNumber) || coordinates.length % 2 !== 0){
		document.querySelector("#citycoordinate .warning").innerHTML="Invalid format!";
		return 1;
	}
	if(coordinates.length / 2 !== numberOfCities){
		document.querySelector("#citycoordinate .warning").innerHTML="Please enter " + numberOfCities + " cities!";
		return 1;
	}
	coordinatesOfCities = [];
	coordinateArray = coordinates.map(Number);

	for(var i = 0; i < coordinateArray.length/2; i++){
		coordinatesOfCities.push({x: coordinateArray[2*i], y: coordinateArray[2*i+1]});
	}
	
	toDiv3();
}
