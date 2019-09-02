var distanceMatrix = [];
var data = [];
var heuristicNum = [1, 2]; // number of different heuristics 0: mutation, 1: hill climbing
function heuristicPair(h1, h2){
	this.h1 = h1;
	this.h2 = h2;
}
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
	//the distance between the last city and the first city in the tour
	tmpDist += parseInt(distanceMatrix[tour[data.length-1]][tour[0]]);
	return tmpDist;
}
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}
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
function tournamentSelection(dataArr, bool, tourSize){
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
function adjacentSwap(dataArr, index){
	var swapIndex = (index+1) % dataArr.length;
	var tmp = dataArr[index];
	dataArr[index] = dataArr[swapIndex];
	dataArr[swapIndex] = tmp;
}
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
function applyHH(pValues){

	distanceMatrix = [];
	data = [];

	var numberOfCities = pValues[0];
	var coordinatesOfCities = pValues[1];
	var maxTrials = pValues[2];
	var maxIteration = pValues[3];
	var tourSize = pValues[4];
	var intensityOfMutation = pValues[5];	// apply mutation for how many times
	var depthOfSearch = pValues[6];		// number of passes in hill climbing
	var upperScore = pValues[7];
	var lowerScore = pValues[8];
	var initialScore = pValues[9];
	var acceptanceRate = pValues[10];

	//convert coordinatesOfCities into an array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length/2; i++){
		data.push([coordinatesOfCities[2*i], coordinatesOfCities[2*i+1]]);
	}
	dist();

	var currentSolutionProgress = [];
	var bestSolutionProgress = [];
	var allBestSolution = [];
	var allBestDistance = Number.MAX_SAFE_INTEGER;

	var tmp; 			//temporarily store a location in a solution
	var loc; 		// a location in a solution
	var noOfRuns;	//loop counter for trials
	var iteration; //loop counter for generations
	var i;				//a loop counter
	var j;  			//another loop counter

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
		for(i = 0; i < heuristicPairs.length; i++) heuristicScore.push(initialScore);

		for(iteration = 0; iteration < maxIteration; iteration++){

			var heuristics = tournamentSelection(heuristicScore, false, tourSize);
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

			//record the search process of the first iteration
			if(noOfRuns == 0){
				currentSolutionProgress.push({x: iteration, y: currentSolutionDistance});
				bestSolutionProgress.push({x: iteration, y: bestSolutionDistance});
			}
		}
		if(bestSolutionDistance < allBestDistance){
			allBestDistance = bestSolutionDistance;
			allBestSolution = bestSolution;
		}
	}

	var bestSolutionOb = [];
	for(var i = 0; i < allBestSolution.length; i++){
		bestSolutionOb.push({x: data[allBestSolution[i]][0], y: data[allBestSolution[i]][1]});
	}
	bestSolutionOb.push({x: data[allBestSolution[0]][0], y: data[allBestSolution[0]][1]});

	allBestSolution = bestSolutionOb;

	var chartData = [];
	chartData.push({name: "bestSolution: " + allBestDistance, data: allBestSolution, chart: 0});
	chartData.push({name: "currentSolutions", data: currentSolutionProgress, chart: 1});
	chartData.push({name: "bestSolutions", data: bestSolutionProgress, chart: 1});

	return chartData;
}
