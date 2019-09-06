//Random mutation hill climbing
var distanceMatrix;		//distances between all pairs of cities, distanceMatrix[a][b] stands for the distance between city of index a and b in data
var data;							//array of array of numbers, represent the coordinates of cities

//helper functions
//calculate the Euclidean distance between two coordinates
function EuclideanDistance(x1,y1,x2,y2){
	return Math.round(Math.sqrt( Math.pow((x1-x2),2) + Math.pow((y1-y2),2) ));
}
//calculate the Euclidean distance between all pairs of cities and store the result in distanceMatrix
function dist(){
	for (var i = 0; i < data.length; i++){
		var arr = [];
		for (var j = 0; j < data.length; j++){
			arr.push( EuclideanDistance(data[i][0], data[i][1],data[j][0], data[j][1]) );
		};
		distanceMatrix.push(arr);
	};
}
//calculate the total didtance of a given tour
function totalDistance(tour){
	var tmpDist = 0.0;
	for (var j = 1; j < data.length; j++)
	tmpDist += parseInt(distanceMatrix[tour[j-1]][tour[j]]);
	tmpDist += parseInt(distanceMatrix[tour[data.length-1]][tour[0]]);
	return tmpDist;
}
//return a random integer between min and max, both end inclusive
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//apply
function applyRMHC(pValues) {

	//reset distanceMatrix and data
	distanceMatrix = [];
	data = [];

	//extract value from user input - pValues
	var numberOfCities = pValues[0];
	var coordinatesOfCities = pValues[1];
	var numberOfPasses = pValues[2];
	var moveAcceptance = pValues[3];

	//data for generating chart in the webpage, array of objects of format {x: , y:}
	var allBestSolution = [];			//best solution found

	//convert from array of numbers to array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length/2; i++) data.push([coordinatesOfCities[2*i], coordinatesOfCities[2*i+1]]);

	//calculate distance between all pair of cities and store in distanceMatrix
	dist();

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

			var accept;
			if(moveAcceptance == "0") accept = (newSolutionDistance < currentSolutionDistance); //improving only
			else if(moveAcceptance == "1") accept = (newSolutionDistance <= currentSolutionDistance); //improving and equal move

			if (accept){ // improving move
				currentSolutionDistance = newSolutionDistance;
			} else{ //swap back to the original configuration if the move is not an improving move
				tmp = currentSolution[loc2];
				currentSolution[loc2] = currentSolution[loc];
				currentSolution[loc] = tmp;
			}
		}
	}

	//convert the bestTour found to correct format for generate chart
	for(var i = 0; i < currentSolution.length; i++) allBestSolution.push({x: data[currentSolution[i]][0], y: data[currentSolution[i]][1]});
	allBestSolution.push({x: data[currentSolution[0]][0], y: data[currentSolution[0]][1]});

	//store all the data to a single array to easily return
	var chartData = [];
	chartData.push({name: "bestSolution: " + currentSolutionDistance, data: allBestSolution, chart: 0});

	return chartData;

}
