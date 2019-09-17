//Exhaustive Search
var distanceMatrix;		//distances between all pairs of cities, distanceMatrix[a][b] stands for the distance between city of index a and b in data
var data;							//array of array of numbers, represent the coordinates of cities

//helper functions
//calculate the Euclidean distance between two coordinates
function EuclideanDistance(x1,y1,x2,y2){
	return Math.sqrt( Math.pow((x1-x2),2) + Math.pow((y1-y2),2) );
}
//calculate the Euclidean distance between all pairs of cities and store in distanceMatrix
function dist(){
	for (var i = 0; i < data.length; i++){
		var arr = [];
		for (var j = 0; j < data.length; j++){
			arr.push( EuclideanDistance(data[i][0], data[i][1],data[j][0], data[j][1]) );
		};
		distanceMatrix.push(arr);
	};
}
//calculate the total diatance of a given tour
function totalDistance(tour){
	var tmpDist = 0;
	for (var j = 1; j < data.length; j++)
	tmpDist += parseFloat(distanceMatrix[tour[j-1]][tour[j]]);
	//the distance between the last city and the first city in the tour
	tmpDist += parseFloat(distanceMatrix[tour[data.length-1]][tour[0]]);
	return tmpDist;
}

//apply
function applyExhaustiveSearch(pValues){

	//reset distanceMatrix and data
	distanceMatrix = [];
	data = [];

	//extract value from user input - pValues
	var numberOfCities = pValues[0];
	var coordinatesOfCities = pValues[1];

	//data for generating chart in the webpage, array of objects of format {x: , y:}
	var fitnessDistribution = [];	//fitness value for each permtation
	var allBestSolution = [];			//best solution found

	//convert from array of numbers to array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length/2; i++) data.push([coordinatesOfCities[2*i], coordinatesOfCities[2*i+1]]);

	//calculate distance between all pair of cities and store in distanceMatrix
	dist();

	//create all permutations of numberOfCities cities
	var inputArray = [];
	for (var i = 0; i < numberOfCities; i++) inputArray.push(i);
	var result = inputArray.reduce(function permute(res, item, key, arr) {
		return res.concat(arr.length > 1 && arr.slice(0, key).concat(arr.slice(key + 1)).reduce(permute, []).map(function(perm) { return [item].concat(perm); }) || item);
	}, []);

	//evaluate all permutations and find the one with best fitness
	var upb = result.length;
	var bestTour = result.pop()
	var bestDistance = totalDistance(bestTour);
	var tmpDist;
	var tmpTour;
	fitnessDistribution.push({x: 0, y: bestDistance});
	for (var i = 1; i < upb; i++){
		tmpTour = result.pop();
		tmpDist = totalDistance(tmpTour);
		fitnessDistribution.push({x: i, y: tmpDist});
		if (tmpDist<bestDistance){
			bestDistance = tmpDist;
			bestTour = tmpTour;
		}
	}

	//convert the bestTour found to correct format for generate chart
	for(var i = 0; i < bestTour.length; i++) allBestSolution.push({x: data[bestTour[i]][0], y: data[bestTour[i]][1]});
	allBestSolution.push({x: data[bestTour[0]][0], y: data[bestTour[0]][1]});

	//store all the data to a single array to easily return
	var chartData = [];
	chartData.push({name: "bestSolution: " + bestDistance, type: "route", data: allBestSolution, chart: 0});
	chartData.push({name: "fitnesses", type: "process", data: fitnessDistribution, chart: 1});

	return chartData;

}
