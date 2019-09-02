var distanceMatrix = [];
var data = [];
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
	}
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
function indexOfMax(arr) {

	var max = arr[0];
	var maxIndex = 0;

	for (var i = 1; i < arr.length; i++) {
		if (arr[i] > max) {
			maxIndex = i;
			max = arr[i];
		}
	}

	return maxIndex;
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
function orderCrossover(parent1, parent2, offspring){
	var length = parent1.length;
	var offspring1 = [];
	var offspring2 = [];
	//segment between two cut points
	var seg1 = [];
	var seg2 = [];
	//parent sequence start from the second cut point
	var fill1 = [];
	var fill2 = [];

	//choose the two cut point and order them
	var loc1 = getRndInteger(0, length-1);
	var loc2 = getRndInteger(1, length-1);
	if (loc1 === loc2){ loc2 = loc2+1; if (loc2 === length) loc2=0;};
	var startLoc = Math.min(loc1, loc2);
	var endLoc = Math.max(loc1, loc2);

	//offspring & segment between two cut points & parent sequence start from the second cut point
	for(var i = 0; i < length; i++) {
		if(i >=startLoc && i <= endLoc){
			seg1.push(parent1[i]);
			seg2.push(parent2[i]);
			offspring1.push(parent1[i]);
			offspring2.push(parent2[i]);
		}
		else{
			offspring1.push(-1);
			offspring2.push(-1);
		}
		fill1.push(parent1[(endLoc+1+i) % length]);
		fill2.push(parent2[(endLoc+1+i) % length]);
	}

	// go through parent sequences starting from second cut point, and set any
	// position that's conflict with the between-segment portion of the other parent to -1
	for(var i = 0; i < length; i++){
		for(var j = 0; j < (endLoc-startLoc+1); j++){
			if(fill1[i] === seg2[j]){
				fill1[i] = -1;
				break;
			}
		}
		for(var j = 0; j < (endLoc-startLoc+1); j++){
			if(fill2[i] === seg1[j]){
				fill2[i] = -1;
				break;
			}
		}
	}

	fill1 = fill1.filter(function (item){return item != -1;})
	fill2 = fill2.filter(function (item){return item != -1;})

	//put the removed version of parent sequence into corresponding offspring
	for(var j = 0; j < fill2.length; j++) { offspring1[(endLoc+1+j) % length] = fill2[j]; }
	for(var j = 0; j < fill1.length; j++) { offspring2[(endLoc+1+j) % length] = fill1[j]; }

	offspring.push(offspring1);
	offspring.push(offspring2);
}
function randomSwap(dataArr){
	for(var i = 0; i < 2; i++){
		var loc1 = getRndInteger(0, dataArr.length-1);
		var loc2 = getRndInteger(1, dataArr.length-1);
		if (loc1 === loc2){ loc2 = loc2+1; if (loc2 === dataArr.length) loc2=0;};
		var tmp = dataArr[loc1];
		dataArr[loc1] = dataArr[loc2];
		dataArr[loc2] = tmp;
	}
}
function applyGA(pValues){

	distanceMatrix = [];
	data = [];

	var numberOfCities = pValues[0];
	var coordinatesOfCities = pValues[1];
	var maxTrials = pValues[2];
	var maxIteration = pValues[3];
	var populationSize = pValues[4];
	var tourSize = pValues[5];
	var offspringSize = pValues[6];
	var intensityOfMutation = pValues[7];

	//convert coordinatesOfCities into an array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length/2; i++){
		data.push([coordinatesOfCities[2*i], coordinatesOfCities[2*i+1]]);
	}
	dist();

	var populationAverages = [];
	var populationBests = [];
	var allBestSolution = [];
	var allBestDistance = Number.MAX_SAFE_INTEGER;

	var tmp; 			//temporarily store a location in a solution
	var loc1; 		// a location in a solution
	var loc2; 		// another location in a solution
	var noOfRuns;	//loop counter for trials
	var iteration; //loop counter for generations
	var i;				//a loop counter
	var j;  			//another loop counter

	for (noOfRuns = 0; noOfRuns < maxTrials; noOfRuns++){
		var currentPopulation = [];
		var currentPopulationDistance = [];
		//initialisation - create random permutations (initialization)
		for(i = 0; i < populationSize; i++) {
			var perm = permutation(data.length);
			currentPopulation.push(perm);
			currentPopulationDistance.push(totalDistance(perm));
		}
		//generations
		for(iteration = 0; iteration < maxIteration; iteration++){
			var parents = []; 		// parents in each generation, array of indexes
			var offsprings = []; 	// offsprings in each generation, array of solutions
			for(i = 0; i < Math.ceil((offspringSize+1)/2); i++){
				parents = [];
				//selection
				parents.push(tournamentSelection(currentPopulationDistance, true, tourSize));
				parents.push(tournamentSelection(currentPopulationDistance, true, tourSize));
				while(parents[0] === parents[1]) parents[1] = tournamentSelection(currentPopulationDistance, true,  tourSize);
				//crossover - new offsprings are stored in the offsprings array
				orderCrossover(currentPopulation[parents[0]], currentPopulation[parents[1]], offsprings);
			}
			offsprings = offsprings.splice(0, offspringSize);

			//mutation - Make a random swap forming a new solution from the current solution
			for(i = 0; i < intensityOfMutation; i++){
				for(j = 0; j < offspringSize; j++) randomSwap(offsprings[j]);
			}

			//replace - trans-generational with elitism
			for(i = 0; i < offspringSize; i++){
				currentPopulation.push(offsprings[i].slice());
				currentPopulationDistance.push(totalDistance(offsprings[i]));
			}

			for(i = 0; i < offspringSize; i++){
				var largest = indexOfMax(currentPopulationDistance);
				var hold1 = [];
				var hold2 = [];
				for(j = 0; j < currentPopulation.length; j++){
					if(j!=largest) hold1.push(currentPopulation[j].slice());
					if(j!=largest) hold2.push(currentPopulationDistance[j]);
				}
				currentPopulation = hold1.slice();
				currentPopulationDistance = hold2.slice();
			}

			if(noOfRuns == 0){
				//record process for the first iteration
				var sum = 0;
				var best = Number.MAX_SAFE_INTEGER;
				for(i = 0; i < currentPopulationDistance.length; i++){
					if(currentPopulationDistance[i] < best) best = currentPopulationDistance[i];
					sum += currentPopulationDistance[i];
				}
				var average = sum/currentPopulation.length;

				populationAverages.push({x: iteration, y: average});
				populationBests.push({x: iteration, y: best});
			}
		}

		var best = Number.MAX_SAFE_INTEGER;
		var bestIndex = 0;
		for(i = 0; i < currentPopulationDistance.length; i++){
			if(currentPopulationDistance[i] < best) {
				best = currentPopulationDistance[i];
				bestIndex = i;
			}
		}

		if(best < allBestDistance){
			allBestSolution = currentPopulation[bestIndex];
			allBestDistance = best;
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
	chartData.push({name: "populationAverage", data: populationAverages, chart: 1});
	chartData.push({name: "populationBest", data: populationBests, chart: 1});

	return chartData;
}
