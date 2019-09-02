//Hyper Heuristics
//default setting -start
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
var maxIteration = 600000;
var tourSize = 2;
var intensityOfMutation = 1;	// apply mutation for how many times
var depthOfSearch = 1;		// number of passes in hill climbing
var initialScore = 10;
var upperScore = 20;
var lowerScore = 0;
var acceptanceRate = 0.5; //naive acceptance
//unused ---------------
var crossoverProbability;
var mutationProbability;
//default setting -end

//parameters - start
var distanceMatrix = [];
var data = [];
var heuristicNum = [1, 2]; // number of different heuristics 0: mutation, 1: hill climbing
//parameters - end

//classes - start
function heuristicPair(h1, h2){
	this.h1 = h1;
	this.h2 = h2;
}
//classed - end

//helper functions - start
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
//create random permutations
function permutation(length){
	var perm = [];
	for (j = 0; j < length; j++) perm.push(j);
	for (j = 0; j < length-1; j++){
		loc1 = getRndInteger(j+1, length-1); // random location (i,maxLength)
		tmp = perm[j];
		perm[j] = perm[loc1];
		perm[loc1] = tmp;
	}
	return perm;
}
//helper functions - end

//low level heuristics - start
// tournament selection - bool: true: minimisation; false: maximisation
function tournamentSelection(dataArr, bool){
	var bestIndex;
	var bestValue;
	//create a random permutation of the population
	var perm = permutation(dataArr.length);
	//tournament
	var candidate = [];
	for (var i = 0; i < tourSize; i++) candidate.push(perm[i]);
	bestIndex = candidate[0];
	bestValue = dataArr[bestIndex];
	for(var i = 1; i < tourSize; i++){
		if(bool){
			if(dataArr[candidate[i]] < bestValue){
				bestIndex = candidate[i];
				bestValue = dataArr[candidate[i]];
			}
		} else{
			if(dataArr[candidate[i]] > bestValue){
				bestIndex = candidate[i];
				bestValue = dataArr[candidate[i]];
			}
		}
	}
	return bestIndex;
}
//random random
function randomSwap(solution){
	for(var i = 0; i < 2; i++){
		var loc1 = getRndInteger(0, data.length-1);
		var loc2 = getRndInteger(1, data.length-1);
		if (loc1==loc2){ loc2 = loc2+1; if (loc2==data.length) loc2=0;};
		var tmp = solution[loc1];
		solution[loc1] = solution[loc2];
		solution[loc2] = tmp;
	}
}
//adjacent Swap
function adjacentSwap(dataArr, index){
	var swapIndex = (index+1) % dataArr.length;
	var tmp = dataArr[index];
	dataArr[index] = dataArr[swapIndex];
	dataArr[swapIndex] = tmp;
}
//next descent hill climbing
function ndhc(solution){
	var bestEval = totalDistance(solution);
	for(var i = 0; i < depthOfSearch; i++){
		for(var j = 0; j < data.length; j++){
			//swap
			adjacentSwap(solution, j);
			//evaluate
			var currentEval = totalDistance(solution);
			if(currentEval < bestEval) bestEval = currentEval;
			else adjacentSwap(solution, j);
		}
	}
}
//steepest descent hill climbing
function sdhc(solution){
	var bestEval = totalDistance(solution);
	var bestIndex = -1;
	for(var i = 0; i < depthOfSearch; i++){
		for(var j = 0; j < data.length; j++){
			//swap
			adjacentSwap(solution, j);
			//evaluate
			var currentEval = totalDistance(solution);
			if(currentEval < bestEval){
				bestEval = currentEval;
				bestIndex = j;
			}
			adjacentSwap(solution, j);
		}
		if(bestIndex != -1) adjacentSwap(solution, bestIndex);
	}
}
//low level heuristics - end

//apply hyper heuristics
function applyHH(){
	//parameter list - start
	var tmp; 			//temporarily store a location in a solution
	var loc; 		// a location in a solution
	var noOfRuns;	//loop counter for trials
	var iteration; //loop counter for generations
	var i;				//a loop counter
	var j;  			//another loop counter
	//parameter list - end

	for(noOfRuns = 0; noOfRuns < maxTrials; noOfRuns++){
		var currentSolution;
		var currentSolutionDistance;
		var previousSolution;
		var previousSolutionDistance;
		var bestSolution;
		var bestSolutionDistance;
		var distanceInProgress;
		var heuristicPairs;
		var heuristicScore;

		//initialisation
		currentSolution = permutation(data.length);
		currentSolutionDistance = totalDistance(currentSolution);
		previousSolution = currentSolution.slice();
		previousSolutionDistance = currentSolutionDistance;
		bestSolution = currentSolution.slice();
		bestSolutionDistance = currentSolutionDistance;

		heuristicPairs = [];
		for(i = 0; i < heuristicNum[0]; i++){
			for(j = 0; j < heuristicNum[1]; j++){
				heuristicPairs.push(new heuristicPair(i, j));
			}
		}

		heuristicScore = [];
		for(i = 0; i < heuristicPairs.length; i++) heuristicScore.push(10);

		for(iteration = 0; iteration < maxIteration; iteration++){

			var heuristics = tournamentSelection(heuristicScore, false);
			switch (heuristicPairs[heuristics].h1) {
				case 0:
					randomSwap(currentSolution);
					break;
			}
			switch(heuristicPairs[heuristics].h2){
				case 0:
					ndhc(currentSolution);
					break;
				case 1:
					sdhc(currentSolution);
					break;
			}
			//acceptance
			currentSolutionDistance = totalDistance(currentSolution);

			if(currentSolutionDistance < previousSolutionDistance) heuristicScore[heuristics] += heuristicScore[heuristics]==upperScore?0:1;
			else if(currentSolutionDistance > previousSolutionDistance) heuristicScore[heuristics] -= heuristicScore[heuristics]==lowerScore?0:1;

			if(currentSolutionDistance < bestSolutionDistance){
				bestSolutionDistance = currentSolutionDistance;
				bestSolution = currentSolution.slice();
			}

			if(currentSolutionDistance < previousSolutionDistance || Math.random() < acceptanceRate){
				previousSolutionDistance = currentSolutionDistance;
				previousSolution = currentSolution.slice();
			}else{
				currentSolution = previousSolution.slice();
				currentSolutionDistance = previousSolutionDistance;
			}
		}

		console.log(noOfRuns);
		console.log(bestSolution + " " + bestSolutionDistance + " score: " + heuristicScore);
	}
}
//run
function run(){
	//convert coordinatesOfCities into an array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length; i++){
		data.push([coordinatesOfCities[i].x, coordinatesOfCities[i].y]);
	}
	dist();
	applyHH();
}

run();
