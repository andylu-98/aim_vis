//Multi-meme memetic algorithms

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
var populationSize = 6;
var tourSize = 2;
var generationGap = 1/3;
var intensityOfMutation = 1;	// apply mutation for how many times
var depthOfSearch = 1;		// number of passes in hill climbing
var inovationRate = 0.4;
//unused ---------------
var crossoverProbability;
var mutationProbability;
//default setting -end

//parameters - start
var distanceMatrix = [];
var data = [];
var memes = [1, 2]; // number of each heuristics [mutation, hill climbing]
//parameters - end

//classes - start
//individual object
function individual(gene, meme){
	this.gene = gene;
	this.meme = meme;
}
//classes - end

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
//return the index of the largest element in an array
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
//order crossover
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
//random swap
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

//apply Multi-meme memetic algorithm
function applyMMA(){
	//parameter list - start
	var tmp; 			//temporarily store a location in a solution
	var loc1; 		// a location in a solution
	var loc2; 		// another location in a solution
	var noOfRuns;	//loop counter for trials
	var iteration; //loop counter for generations
	var i;				//a loop counter
	var j;  			//another loop counter
	//parameter list - end

	for (noOfRuns=0; noOfRuns < maxTrials; noOfRuns++){
		var currentPopulation = [];
		var currentPopulationDistance = [];
		//initialisation - create random permutations (initialization)
		for(i = 0; i < populationSize; i++) {
			var currentSolution = permutation(data.length);
			var currentMeme = [];
			for(j = 0; j < memes.length; j++) currentMeme.push(getRndInteger(0, memes[j]-1));
			var currentIndividual = new individual(currentSolution, currentMeme);
			currentPopulation.push(currentIndividual);
			currentPopulationDistance.push(totalDistance(currentIndividual.gene));
		}
		//generations
		for(iteration = 0; iteration < maxIteration; iteration++){
			var parents = []; // two parents selected using tournament selection, values are indexes in the population
			var offsprings = []; //two offsprings generated in each iteration, values are individuals
			var offspringSize = populationSize * generationGap;
			for(i = 0; i < Math.ceil((offspringSize+1)/2); i++){
				parents = [];
				//selection
				parents.push(tournamentSelection(currentPopulationDistance, true));
				parents.push(tournamentSelection(currentPopulationDistance, true));
				while(parents[0] === parents[1]) parents[1] = tournamentSelection(currentPopulationDistance, true);
				//inherit memetic material
				var offspringMemes = [];
				if(currentPopulationDistance[parents[0]] <= currentPopulationDistance[parents[1]]){
					offspringMemes.push(currentPopulation[parents[0]].meme.slice());
					offspringMemes.push(currentPopulation[parents[0]].meme.slice());
				}else{
					offspringMemes.push(currentPopulation[parents[1]].meme.slice());
					offspringMemes.push(currentPopulation[parents[1]].meme.slice());
				}
				//crossover - new offsprings are stored in the offsprings array
				var offspringGenes = [];
				orderCrossover(currentPopulation[parents[0]].gene, currentPopulation[parents[1]].gene, offspringGenes);
				for(j = 0; j < 2; j++) offsprings.push(new individual(offspringGenes[j], offspringMemes[j]));
			}
			offsprings = offsprings.splice(0, offspringSize);

			//mutation - Make a random swap forming a new solution from the current solution
			for(i = 0; i < offspringSize; i++){
				switch(offsprings[i].meme[0]){
					case 0:
					randomSwap(offsprings[i].gene);
					break;
				}
			}
			//mutation - mutate memetic material
			for(i = 0; i < offspringSize; i++){
				for(j = 0; j < memes.length; j++){
					if(Math.random() < inovationRate){
						var rnd = getRndInteger(0, memes[j]-1);
						if (rnd === offsprings[i].meme[j]){ rnd = offsprings[i].meme[j]+1; if (rnd === memes[j]) rnd=0;};
						offsprings[i].meme[j] = rnd;
					}
				}
			}
			//hill climbing - next descent with adjacent swap as neighborhood operator
			for(i = 0; i < offspringSize; i++){
				switch(offsprings[i].meme[1]){
					case 0:
						ndhc(offsprings[i].gene);
						break;
					case 1:
						sdhc(offsprings[i].gene);
						break;
				}
			}
			//replace - trans-generational with elitism
			for(i = 0; i < offspringSize; i++){
				currentPopulation.push(offsprings[i]);
				currentPopulationDistance.push(totalDistance(offsprings[i].gene));
			}
			for(i = 0; i < offspringSize; i++){
				var largest = indexOfMax(currentPopulationDistance);
				var hold1 = [];
				var hold2 = [];
				for(j = 0; j < currentPopulation.length; j++){
					if(j!=largest) hold1.push(currentPopulation[j]);
					if(j!=largest) hold2.push(currentPopulationDistance[j]);
				}
				currentPopulation = hold1.slice();
				currentPopulationDistance = hold2.slice();
			}
		}
		console.log(noOfRuns);for(var a = 0; a < populationSize; a++) console.log(currentPopulation[a].gene + " " + currentPopulation[a].meme + " "+ currentPopulationDistance[a]);
	}
}
//run
function run(){
	//convert coordinatesOfCities into an array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length; i++){
		data.push([coordinatesOfCities[i].x, coordinatesOfCities[i].y]);
	}
	dist();
	applyMMA();
}

run();
