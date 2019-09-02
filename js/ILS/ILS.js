//Iterated Local Search
var distanceMatrix;
var data ;

//helper functions
function EuclideanDistance(x1,y1,x2,y2){
	return Math.round(Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) ));
}
function dist(){
	for (var i = 0; i < data.length; i++){
		var arr = [];
		for (var j = 0; j < data.length; j++){
			arr.push( EuclideanDistance(data[i][0], data[i][1],data[j][0], data[j][1]) );
		};
		distanceMatrix.push(arr);
	};
}
function totalDistance(tour){
	var tmpDist = 0;
	for (var j = 1; j < data.length; j++)
	tmpDist += parseInt(distanceMatrix[tour[j-1]][tour[j]]);
	tmpDist += parseInt(distanceMatrix[tour[data.length-1]][tour[0]]);
	return tmpDist;
}
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//apply
function applyILS(pValues){

	//reset distanceMatrix and data
	distanceMatrix = [];
	data = [];

	//extract value from user input - pValues
	var numberOfCities = pValues[0];
	var coordinatesOfCities = pValues[1];
	var maxTrials = pValues[2];
	var maxIterations = pValues[3];
	var intensityOfMutation = pValues[4];
	var depthOfSearch = pValues[5];

	//data for generating chart in the webpage, array of objects of format {x: , y:}
	var allBestSolution = [];				//best solution found
	var acceptedFitness = [];				//accepted solution's fitness for each iteration (first trial)
	var bestSolutionsAllTrial = []; // best solutions' fitnesses in each trial

	//convert from array of numbers to array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length/2; i++) data.push([coordinatesOfCities[2*i], coordinatesOfCities[2*i+1]]);

	//calculate distance between all pair of cities and store in distanceMatrix
	dist();

	// parameter list
	var tmp; //temporarily store a location in a solution
	var loc; // a location in a solution
	var loc2;// another location in a solution
	var meanObj=0;

	for (var noOfRuns=0;noOfRuns<maxTrials;noOfRuns++){
		var currentSolution = [];
		var currentSolutionDistance;
		var prevSolution = [];
		var prevSolutionDistance;
		var newSolutionDistance;

		// create a random permutation(initialization)
		for (var i = 0; i < data.length; i++)
		currentSolution.push(i);
		for (var i = 0; i < data.length-1; i++){
			loc = getRndInteger(i+1, data.length-1); // random location (i,maxLength)
			tmp = currentSolution[i];
			currentSolution[i] = currentSolution[loc];
			currentSolution[loc] = tmp;
		}
		currentSolutionDistance = totalDistance(currentSolution);

		for (var iteration = 0; iteration < maxIterations; iteration++){
			prevSolution = currentSolution.slice();
			prevSolutionDistance = currentSolutionDistance;

			// perturbation
			// Make a number of random exchanges forming a new solution from the current solution
			for (var m = 0; m < intensityOfMutation; m++){
				loc = getRndInteger(0, data.length-1);
				loc2 = getRndInteger(1, data.length-1);
				if (loc==loc2){ loc2 = loc2+1; if (loc2==data.length) loc2=0;};
				tmp = currentSolution[loc];
				currentSolution[loc] = currentSolution[loc2];
				currentSolution[loc2] = tmp;
			}

			currentSolutionDistance = totalDistance(currentSolution);

			// applying hill climbing for a number of passes
			for (var l = 0; l < depthOfSearch; l++){
				let bestIndex = -1;
				let bestCost = currentSolutionDistance;
				for (var i = 0; i < data.length; i++){
					// MAKE MOVE: adjacent exchange forming a new solution from current solution
					if (i==(data.length-1)) {
						tmp = currentSolution[i];
						currentSolution[i] = currentSolution[0];
						currentSolution[0] = tmp;
					} else{
						tmp = currentSolution[i];
						currentSolution[i] = currentSolution[i+1];
						currentSolution[i+1] = tmp;
					}

					newSolutionDistance = totalDistance(currentSolution);

					if (newSolutionDistance < bestCost){ // improving move
						bestCost = newSolutionDistance;
						bestIndex = i;
						//break; // no need to continue due to "<" and break out of for loop
					}
					// swap back
					if (i==(data.length-1)) {
						tmp = currentSolution[i];
						currentSolution[i] = currentSolution[0];
						currentSolution[0] = tmp;
					} else{
						tmp = currentSolution[i];
						currentSolution[i] = currentSolution[i+1];
						currentSolution[i+1] = tmp;
					}
				} // end for loop

				if(bestIndex > -1) {
					if (bestIndex==(data.length-1)) {
						tmp = currentSolution[bestIndex];
						currentSolution[bestIndex] = currentSolution[0];
						currentSolution[0] = tmp;
					} else{
						tmp = currentSolution[bestIndex];
						currentSolution[bestIndex] = currentSolution[bestIndex+1];
						currentSolution[bestIndex+1] = tmp;
					}
					currentSolutionDistance = bestCost;
				}
			}

			// go back to the solution before perturbation if there is no improvement after perturbation and hill climbing
			if (currentSolutionDistance>prevSolutionDistance){ // prevSolution is better
				currentSolutionDistance = prevSolutionDistance;
				currentSolution = prevSolution.slice();
			}
			if(noOfRuns == 0) acceptedFitness.push({x: iteration, y: currentSolutionDistance});
		}
		meanObj += currentSolutionDistance;
	}
}
