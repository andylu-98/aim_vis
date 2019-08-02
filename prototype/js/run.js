//Simulated Annealing

//default settings
function defaultSetting(){
	numberOfCities = 29;
	coordinatesOfCities = [
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
		{ x: 27462.5, y: 12992.2222}];
		maxTrials = 30;
		maxIteration = 150000;
		intensityOfMutation = 1;
		coolingSchedule = "LundyMees";
		coolingRate = 0.0001;
		toDiv4(true);
	}

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
		};
	}

	function totalDistance(tour){
		var tmpDist = 0;
		for (var j = 1; j < data.length; j++)
		tmpDist += parseInt(distanceMatrix[tour[j-1]][tour[j]]);
		tmpDist += parseInt(distanceMatrix[tour[data.length-1]][tour[0]]);
		return tmpDist;
	}

	// inclusive min,max
	function getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}

	function getStringTour(tour){
		var locTxt = "";
		for (var i = 0; i < tour.length-1; i++)
		locTxt += tour[i] + ",";
		locTxt += tour[tour.length-1];
		return locTxt;
	}

	function applySimulatedAnnealing(){
		dist();
		// parameter list
		var allDetails = false; // make this value true if you want to display all details for the search, ensure that maxIteration is not large AND  maxTrials is 1
		var tmp;
		var txt="";
		var txt2="";
		var allTxt = "";
		var loc;
		var loc2;
		var meanObj=0;
		var allBestSolution = [];
		var allBestSolutionDistance = 1000000000;

		const stopping_temperature=0.00001;

		var scaleDistance = 0.5;

		switch(coolingSchedule){
			case "Geometric":
			txt2 ="<br/>Cooling Schedule: Geometric<br/>" + "Cooling rate: " + coolingRate;
			break;
			case "LundyMees":
			txt2 ="<br/>Cooling Schedule: LundyMees<br/>"+ "Cooling rate: " + coolingRate;
			break;
			default:
			document.getElementById("demo").innerHTML = "Unknown Cooling Schedule";
			return;
		}

		for (var noOfRuns=0;noOfRuns<maxTrials;noOfRuns++){
			var currentSolution = [];
			var currentSolutionDistance;
			var bestSolution = [];
			var bestSolutionDistance;
			var prevSolution = [];
			var prevSolutionDistance;
			var newSolutionDistance;
			var selfT ;
			var k = 0;
			// create a random permutation
			for (var i = 0; i < data.length; i++)
			currentSolution.push(i);
			for (var i = 0; i < data.length-1; i++){
				loc = getRndInteger(i+1, data.length-1); // random location (i,maxLength)
				tmp = currentSolution[i];
				currentSolution[i] = currentSolution[loc];
				currentSolution[loc] = tmp;
			};
			currentSolutionDistance = totalDistance(currentSolution);
			prevSolution = currentSolution.slice();
			prevSolutionDistance = currentSolutionDistance;
			bestSolution = currentSolution.slice();
			bestSolutionDistance = currentSolutionDistance;

			selfT = scaleDistance*currentSolutionDistance ; // initial temperature setting

			allTxt += "Run#" + noOfRuns + ": ";

			while( (selfT >= stopping_temperature) && (k++ < maxIteration) ){

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
					if ((allDetails)&&(newSolutionDistance < currentSolutionDistance)) txt+= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A:" +getStringTour(currentSolution)+": "+newSolutionDistance+"<br/>";
					if ((allDetails)&&(newSolutionDistance >= currentSolutionDistance)) txt+=  "AW:" + getStringTour(currentSolution)+": "+newSolutionDistance+"<br/>";

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
					if (allDetails) txt+= "RW:" + getStringTour(currentSolution)+": "+newSolutionDistance+"<br/>";
				}
				switch(coolingSchedule){
					case "Geometric":
					selfT *= coolingRate;
					break;
					case "LundyMees":
					selfT *= 1.0/(1.0+coolingRate);
					break;
					default:
					document.getElementById("demo").innerHTML = "Unknown Cooling Schedule";
					return;
				}

			}
			meanObj += bestSolutionDistance;

			if(bestSolutionDistance < allBestSolutionDistance){
				allBestSolutionDistance = bestSolutionDistance;
				allBestSolution = bestSolution;
			}

			if (allDetails)
			allTxt += "<br/>Best tour found by SA: " + getStringTour(bestSolution) +"<br/> Best tour length (travelling distance): "+ bestSolutionDistance  + "<br/>" + txt;
			else
			allTxt += bestSolutionDistance  +  "<br/>" + txt; // + (100*(numberOfAcceptedMoves/(k-1))).toFixed(2)

		}

		document.getElementById("demo").innerHTML = "<p>Known optimal tour length (travelling distance) for Western Sahara TSP problem instance with 29 cities (WI29) is ~27603 </p> <p>Mean Distance Over All Runs: " + (meanObj/maxTrials).toFixed(2) + "</p>"+  allTxt; // <p></p>Searched States (Configurations, Solutions):<br/>" + txt;

		bestTour = [];
		for(var i = 0; i < allBestSolution.length; i++){
			bestTour.push({x: data[allBestSolution[i]][0], y: data[allBestSolution[i]][1]});
		}
		bestTour.push({x: data[allBestSolution[0]][0], y: data[allBestSolution[0]][1]});

		generateChart(bestTour, true, "Best Distance: " + allBestSolutionDistance);
	}

	//run the main algorithm
	function run(){
		for(var i = 0; i < coordinatesOfCities.length; i++){
			data.push([coordinatesOfCities[i].x, coordinatesOfCities[i].y]);
		}
		applySimulatedAnnealing();
	}
