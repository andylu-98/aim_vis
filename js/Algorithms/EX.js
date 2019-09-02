//Exhaustive Search

//defualt setting - start
var numberOfCities = 5;
var coordinatesOfCities = [
	{	x: 1.309016994	,	y: 1.951056516},
	{ x: 0.190983006	,	y: 1.587785252},
	{ x: 0.190983006	,	y: 0.412214748},
	{ x: 1.309016994	,	y: 0.048943484},
	{ x: 2	,	y: 1}
];
//defualt setting - end

//parameters
var distanceMatrix = [];
var data = [];

//calculate the euclidean distance between two cities
function EuclideanDistance(x1,y1,x2,y2){
	return Math.sqrt( Math.pow((x1-x2),2) + Math.pow((y1-y2),2) );
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
	tmpDist += parseFloat(distanceMatrix[tour[j-1]][tour[j]]);
	//the distance between the last city and the first city in the tour
	tmpDist += parseFloat(distanceMatrix[tour[data.length-1]][tour[0]]);
	return tmpDist;
}
//apply the algorithm
function exhaustive(){
	//create all permutations
	var inputArray = [];
	for (var i = 0; i < numberOfCities; i++)
	inputArray.push(i);
	var result = inputArray.reduce(function permute(res, item, key, arr) {
		return res.concat(arr.length > 1 && arr.slice(0, key).concat(arr.slice(key + 1)).reduce(permute, []).map(function(perm) { return [item].concat(perm); }) || item);
	}, []);

	var upb = result.length;
	var bestTour = result.pop()
	var bestDistance = totalDistance(bestTour);
	var tmpDist;
	var tmpTour;

	for (var i = 1; i < upb; i++){
		tmpTour = result.pop();
		tmpDist = totalDistance(tmpTour);
		if (tmpDist<bestDistance){
			bestDistance = tmpDist;
			bestTour = tmpTour;
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
	exhaustive();
}

run();
