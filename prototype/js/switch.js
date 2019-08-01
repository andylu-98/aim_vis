//parameters
var numberOfCities;
var coordinatesOfCities;
var maxTrials;
var maxIteration;
var intensityOfMutation;
var coolingSchedule;
var coolingRate;
var initialTemperature;
var stoppingTemperature;

//Enter CityNumber page
function toDiv1(){
	var el = document.getElementById("div");
	el.innerHTML =
	'<h1>Simulated Annealing</h1>' +
	'<p>Description</p>' +
	'<p>Enter number of cities:</p>' +
	'<div id="citynumber">' +
	'<input type="text" value="5" size="5" maxlength="3">' +
	'<button type="button" onclick="checkCityNumber()" >Enter</button>' +
	'<p class = "warning"> warning msg </p></div>';
}

//Enter CityCoordinate page
function toDiv2(){
	var el = document.getElementById("div");
	el.innerHTML =
	'<h1>Simulated Annealing</h1>' +
	'<p>Description</p>' +
	'<p>Enter city coordinates:</p>' +
	'<div id="citycoordinate">' +
	'<textarea rows="12" cols="12"></textarea>' +
	'<button type="button" onclick="checkCityCoordinate()" >Enter</button>' +
	'<p class = "warning"> warning msg </p></div>';
}

////Enter EnterParameter page
function toDiv3(){
	var el = document.getElementById("div");
	el.innerHTML =
	'<div id="left"><h1>Simulated Annealing</h1><p>Description</p><p>Enter parameters:</p>' +
	'<p id="trail"><span>Number of Trials: </span><input type="text" value="30"><span class = "warning"></span></p>' +
	'<p id="iteration"><span>Number of Iterations: </span><input type="text" value="150000"><span class = "warning"></span></p>' +
	'<p id="iom"><span>Intensity of Mutation: </span><input type="text" value="1"><span class = "warning"></span></p>' +
	'<p id="cschedule"><span>Cooling Schedule: </span><input type="radio" name="cooling" value="Geometric">Geometric' +
	'<input type="radio" name="cooling" value="LundyMees" checked="checked">LundyMees<span class = "warning"></span></p>' +
	'<p id="crate"><span>Cooling Rate: </span><input type="text" value="0.0001"><span class = "warning"></span></p>' +
	'<button type="button" onclick="checkParameters()" >Enter</button>' +
	'</div><div id="right"><canvas id="chart"></canvas></div>';
	generateChart(coordinatesOfCities, false);
}

////Enter Run page
function toDiv4(){
	var el = document.getElementById("left");
	el.innerHTML =
	'<h1>Simulated Annealing</h1><p>Description</p>' +
	'<h3>Your settings: </h3>' +
	'<p>Number of Trials: ' + maxTrials + '</p>' +
	'<p>Number of Iterations for each trail: ' + maxIteration + '</p>' +
	'<p>Intensity of Mutation: ' + intensityOfMutation + '</p>' +
	'<p>Cooling Schedule: ' + coolingSchedule + '</p>' +
	'<p>Cooling Rate: ' + coolingRate + '</p>' +
	'<div id="demo"><button type="button" onclick="run()"> Run </button></div>';
}
