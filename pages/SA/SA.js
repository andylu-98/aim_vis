//Simulated Annealing

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
var maxTrials = 30;
var maxIteration = 150000;
var intensityOfMutation = 1;
var coolingSchedule = "LundyMees";
var coolingRate = 0.0001;
//defualt setting - end

//parameters
var distanceMatrix = [];
var data = [];

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
//calculate the total distance in a given tour (in integer)
function totalDistance(tour){
	var tmpDist = 0;
	for (var j = 1; j < data.length; j++)
	tmpDist += parseInt(distanceMatrix[tour[j-1]][tour[j]]);
	//the distance between the last city and the first city in the tour
	tmpDist += parseInt(distanceMatrix[tour[data.length-1]][tour[0]]);
	return tmpDist;
}
// inclusive min,max
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}
//apply simulated annealing
function applySimulatedAnnealing(){

	// parameter list
	var allDetails = false; // make this value true if you want to display all details for the search, ensure that maxIteration is not large AND maxTrials is 1
	var tmp; //temporarily store a location in a solution
	var loc; // a location in a solution
	var loc2; // another location in a solution
	var meanObj = 0; //average objective value across all runs
	var scaleDistance = 0.5; //used to calculate initial solution
	var allBestSolution = [];
	var allBestSolutionDistance = 1000000000;

	const stopping_temperature=0.00001;

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

		while( (selfT >= stopping_temperature) && (k++ < maxIteration) ){ //termination criteria
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
				case "Geometric":
				selfT *= coolingRate;
				break;
				case "LundyMees":
				selfT *= 1.0/(1.0+coolingRate);
				break;
			}

		}
		meanObj += bestSolutionDistance;

		// update best solution in all runs
		if(bestSolutionDistance < allBestSolutionDistance){
			allBestSolutionDistance = bestSolutionDistance;
			allBestSolution = bestSolution;
		}

		console.log(noOfRuns);
		console.log(bestSolution + " " + bestSolutionDistance);

	}

	// convert the best tour to array of objects for creating chart.
	bestTour = [];
	for(var i = 0; i < allBestSolution.length; i++){
		bestTour.push({x: data[allBestSolution[i]][0], y: data[allBestSolution[i]][1]});
	}
	bestTour.push({x: data[allBestSolution[0]][0], y: data[allBestSolution[0]][1]});

	//generateChart(bestTour, true, "Best Distance: " + allBestSolutionDistance);
}
//run
function run(){
	//convert coordinatesOfCities into an array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length; i++){
		data.push([coordinatesOfCities[i].x, coordinatesOfCities[i].y]);
	}
	dist();
	applySimulatedAnnealing();
}

run();
