// author: Xingjian Lu (Andy) 2019 psyxl11

//simulated Annealing
var distanceMatrix;		//distances between all pairs of cities, distanceMatrix[a][b] stands for the distance between city of index a and b in data
var data;							//array of array of numbers, represent the coordinates of cities

//helper functions
//calculate the euclidean distance between two cities
function EuclideanDistance(x1,y1,x2,y2){
	return Math.round(Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) ));
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
	var tmpDist = 0;
	for (var j = 1; j < data.length; j++)
	tmpDist += parseInt(distanceMatrix[tour[j-1]][tour[j]]);
	//the distance between the last city and the first city in the tour
	tmpDist += parseInt(distanceMatrix[tour[data.length-1]][tour[0]]);
	return tmpDist;
}
// get a random integer between min and max, both end inclusive
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//apply
function applySA(pValues){

	distanceMatrix = [];
	data = [];

	var numberOfCities = pValues[0];
	var coordinatesOfCities = pValues[1].data;
	var scaleDistance = pValues[3];
	var coolingSchedule = pValues[4];
	var coolingRate = pValues[5];
	var maxIteration = pValues[6];
	var maxTrials = pValues[7];
	var stoppingTemp = pValues[8];

	//convert coordinatesOfCities into an array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length/2; i++){
		data.push([coordinatesOfCities[2*i], coordinatesOfCities[2*i+1]]);
	}
	dist();

	var acceptedFitness = [];
	var bestFitness = [];
	var allBestSolution = [];
	var allBestDistance = Number.MAX_SAFE_INTEGER;

	// parameter list
	var tmp; //temporarily store a location in a solution
	var loc; // a location in a solution
	var loc2; // another location in a solution
	var meanObj = 0; //average objective value across all runs

	// run the algorithms for maxTrials number of times
	for (var noOfRuns=0; noOfRuns < maxTrials; noOfRuns++){

		var currentSolution = [];
		var currentSolutionDistance;

		var bestSolution = [];
		var bestSolutionDistance;

		var prevSolution = [];
		var prevSolutionDistance;

		var newSolutionDistance;
		var selfT ; // temperature in each iteration
		var k = 0;

		// create a random permutation (initialization)
		for (var i = 0; i < data.length; i++) currentSolution.push(i);
		for (var i = 0; i < data.length-1; i++){
			loc = getRndInteger(i+1, data.length-1); // random location (i,maxLength)
			tmp = currentSolution[i];
			currentSolution[i] = currentSolution[loc];
			currentSolution[loc] = tmp;
		}

		currentSolutionDistance = totalDistance(currentSolution);

		prevSolution = currentSolution.slice(); //create a copy of currentSolution
		prevSolutionDistance = currentSolutionDistance;

		bestSolution = currentSolution.slice(); //set best solution to initial solution
		bestSolutionDistance = currentSolutionDistance;

		selfT = scaleDistance*currentSolutionDistance ; // initial temperature setting

		while( (selfT >= stoppingTemp) && (k++ < maxIteration) ){ //termination criteria
			// perturbation

			loc = getRndInteger(0, data.length-1);
			loc2 = getRndInteger(1, data.length-1);
			if (loc==loc2){ loc2 = loc2+1; if (loc2==data.length) loc2=0;};
			tmp = currentSolution[loc];
			currentSolution[loc] = currentSolution[loc2];
			currentSolution[loc2] = tmp;

			newSolutionDistance = totalDistance(currentSolution);
			// accept the improving move OR worsening move based on the Boltzman probability
			if ( (newSolutionDistance < currentSolutionDistance) || (Math.random() < Math.exp( - (1.0*newSolutionDistance-1.0*currentSolutionDistance) / selfT  ) ) )  {
				currentSolutionDistance = newSolutionDistance;
				prevSolutionDistance = currentSolutionDistance;
				prevSolution = currentSolution.slice();

				if (newSolutionDistance < bestSolutionDistance){ // remember best solution found so far
					bestSolutionDistance = newSolutionDistance;
					bestSolution = currentSolution.slice();
				}
			} else{
				// reject the worsening move
				currentSolution = prevSolution.slice();
				currentSolutionDistance = prevSolutionDistance;
			}

			switch(coolingSchedule){
				case "1":
				selfT *= coolingRate;
				break;
				case "0":
				selfT *= 1.0/(1.0+coolingRate);
				break;
			}

			if(noOfRuns == 0) {
				acceptedFitness.push({x: k, y: currentSolutionDistance});
				bestFitness.push({x: k, y: bestSolutionDistance});
			}

		}
		meanObj += bestSolutionDistance;

		// update best solution in all runs
		if(bestSolutionDistance < allBestDistance){
			allBestDistance = bestSolutionDistance;
			allBestSolution = bestSolution;
		}

	}

	// convert the best tour to array of objects for creating chart.
	bestTour = [];
	for(var i = 0; i < allBestSolution.length; i++){
		bestTour.push({x: data[allBestSolution[i]][0], y: data[allBestSolution[i]][1]});
	}
	bestTour.push({x: data[allBestSolution[0]][0], y: data[allBestSolution[0]][1]});

	var chartData = [];
	chartData.push({name: "bestSolution: " + allBestDistance, type: "route", data: bestTour, chart: 0, route: allBestSolution});
	chartData.push({name: "accepted fitness", type: "process", data: acceptedFitness, chart: 1});
	chartData.push({name: "best fitness", type: "process", data: bestFitness, chart: 1});

	return chartData
}
