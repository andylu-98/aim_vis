var distanceMatrix = [];
var data = [];
function EuclideanDistance(x1,y1,x2,y2){
	return Math.sqrt( Math.pow((x1-x2),2) + Math.pow((y1-y2),2) );
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
	tmpDist += parseFloat(distanceMatrix[tour[j-1]][tour[j]]);
	//the distance between the last city and the first city in the tour
	tmpDist += parseFloat(distanceMatrix[tour[data.length-1]][tour[0]]);
	return tmpDist;
}
function exhaustive(pValues){
	distanceMatrix = [];
	data = [];

	var numberOfCities = pValues[0];
	var coordinatesOfCities = pValues[1];

	//convert coordinatesOfCities into an array of array of numbers
	for(var i = 0; i < coordinatesOfCities.length/2; i++){
		data.push([coordinatesOfCities[2*i], coordinatesOfCities[2*i+1]]);
	}
	dist();

	var fitnessDistribution = [];
	var allBestSolution = [];

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

	for(var i = 0; i < bestTour.length; i++){
		allBestSolution.push({x: data[bestTour[i]][0], y: data[bestTour[i]][1]});
	}
	allBestSolution.push({x: data[bestTour[0]][0], y: data[bestTour[0]][1]});

	var chartData = [];
	chartData.push({name: "bestSolution", data: allBestSolution, chart: 0});
	chartData.push({name: "fitnesses", data: fitnessDistribution, chart: 1});

	return chartData;

}
