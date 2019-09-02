//Permutation
function applyPermutation(pValues){

	//extract value from user input - pValues
	var numberOfCities = pValues[0];

	var inputArray = [];
	for (var i = 0; i < x; i++) inputArray.push(i+1);
	var result = inputArray.reduce( function permute(res, item, key, arr) {
			return res.concat(arr.length > 1
				&& arr.slice(0, key)
							.concat(arr.slice(key + 1))
							.reduce(permute, [])
							.map(
								function(perm) {return [item].concat(perm);})
				|| item); }, [] );
	var upb = result.length;

	for (var i = 0; i < upb; i++) txt += result.pop() + " ......("+i + ") \n";
	console.log(txt);
}


//reset distanceMatrix and data
//extract value from user input - pValues
//data for generating chart in the webpage, array of objects of format {x: , y:}
//convert from array of numbers to array of array of numbers
//calculate distance between all pair of cities and store in distanceMatrix
//create all permutations of numberOfCities cities
//evaluate all permutations and find the one with best fitness
//convert the bestTour found to correct format for generate chart
//store all the data to a single array to easily return
