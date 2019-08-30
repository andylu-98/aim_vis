//Permutation

//defualt setting - start
var numberOfCities = 5;
//defualt setting - end

//generate all permutations
function permute(x){
	var txt="";
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
//run
function run(){
	permute(numberOfCities);
}

run();
