//Random mutation hill climbing

//defualt setting - start
var numberOfCities = 29;
var coordinatesOfCities = [
	{ x: 20833.3333, y: 17100.0},
	{ x: 20900.0, y: 17066.6667},
	{ x: 21300.0, y: 13016.6667},
	{ x: 21600.0, y: 14150.0},
	{ x: 21600.0, y: 14966.6667},
	{ x: 21600.0, y: 16500.0},
	{ x: 22183.3333, y: 13133.3333},
	{ x: 22583.3333, y: 14300.0},
	{ x: 22683.3333, y: 12716.6667},
	{ x: 23616.6667, y: 15866.6667},
	{ x: 23700.0, y: 15933.3333},
	{ x: 23883.3333, y: 14533.3333},
	{ x: 24166.6667, y: 13250.0},
	{ x: 25149.1667, y: 12365.8333},
	{ x: 26133.3333, y: 14500.0},
	{ x: 26150.0, y: 10550.0},
	{ x: 26283.3333, y: 12766.6667},
	{ x: 26433.3333, y: 13433.3333},
	{ x: 26550.0, y: 13850.0},
	{ x: 26733.3333, y: 11683.3333},
	{ x: 27026.1111, y: 13051.9444},
	{ x: 27096.1111, y: 13415.8333},
	{ x: 27153.6111, y: 13203.3333},
	{ x: 27166.6667, y: 9833.3333},
	{ x: 27233.3333, y: 10450.0},
	{ x: 27233.3333, y: 11783.3333},
	{ x: 27266.6667, y: 10383.3333},
	{ x: 27433.3333, y: 12400.0},
	{ x: 27462.5, y: 12992.2222}
];
var numberOfPasses = 1;
//defualt setting - end

//parameters
var distanceMatrix = [];
var data = [];

//calculate the euclidean distance between two cities
function EuclideanDistance(x1,y1,x2,y2){
	return Math.round(Math.sqrt( Math.pow((x1-x2),2) + Math.pow((y1-y2),2) ));
}
//calculate the euclidean distance between all pairs of cities and store in distanceMatrix
function dist(){
	for (var i = 0; i < data.length; i++){
		var arr = [];
		for (var j = 0; j < data.length; j++){
			arr.push( EuclideanDistance(data[i][0], data[i][1],data[j][0], data[j][1]) );
		};
		distanceMatrix.push(arr);
	};
}
//calculate the total distance in a given tour
function totalDistance(tour){
	var tmpDist = 0.0;
	for (var j = 1; j < data.length; j++)
	tmpDist += parseInt(distanceMatrix[tour[j-1]][tour[j]]);
	tmpDist += parseInt(distanceMatrix[tour[data.length-1]][tour[0]]);
	return tmpDist;
}
// inclusive min,max
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}
//apply
function applyRandomMutationHC() {
	
	var currentSolution = [];
	var currentSolutionDistance;

	var newSolutionDistance;

	var tmp; //temporarily store a location in a solution
	var loc; // a location in a solution
	var loc2; // another location in a solution

	// create a random permutation
	for (var i = 0; i < data.length; i++) currentSolution.push(i);
	for (var i = 0; i < data.length-1; i++){
		loc = getRndInteger(i+1, data.length-1); // random location (i,maxLength)
		tmp = currentSolution[i];
		currentSolution[i] = currentSolution[loc];
		currentSolution[loc] = tmp;
	}

	currentSolutionDistance = totalDistance(currentSolution);

	for (var k = 0; k < numberOfPasses; k++){
		// applying hill climbing for one pass
		for (var i = 0; i < data.length; i++){

			// MAKE MOVE: random swap forming a new solution from current solution
			loc = getRndInteger(0, data.length-1);
			loc2 = getRndInteger(1, data.length-1);
			if (loc==loc2){ loc2 = loc2+1; if (loc2==data.length) loc2=0;};
			tmp = currentSolution[loc];
			currentSolution[loc] = currentSolution[loc2];
			currentSolution[loc2] = tmp;

			newSolutionDistance = totalDistance(currentSolution);

			if (newSolutionDistance < currentSolutionDistance){ // improving move
				currentSolutionDistance = newSolutionDistance;
			} else{ //swap back to the original configuration if the move is not an improving move
				tmp = currentSolution[loc2];
				currentSolution[loc2] = currentSolution[loc];
				currentSolution[loc] = tmp;
			}
		}
	}
}
//run
function run(){
	//convert coordinatesOfCities into an array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length; i++){
		data.push([coordinatesOfCities[i].x, coordinatesOfCities[i].y]);
	}
	dist();
	applyRandomMutationHC();
}

run();
