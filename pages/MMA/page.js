var heuristicPage = new heuristic(
	"Genetic Algorithms",
	"Genetic Algorithms",
	"Genetic Algorithms is a type of evolutionary algorithms developed based on Darwin's theory of evolution.",
	[
		{name: "Number Of Cities", type: "int", info: {min: 1, max: Number.MAX_SAFE_INTEGER}},
		{name: "Coordinate of Cities", type: "coordinates", info: {lengthIndex: 0}},
		{name: "Number of Trials", type: "int", info: {min: 1, max: Number.MAX_SAFE_INTEGER}},
		{name: "Number of Iterations", type: "int", info: {min: 1, max: Number.MAX_SAFE_INTEGER}},
		{name: "Population Size", type: "int", info: {min: 1, max: Number.MAX_SAFE_INTEGER}},
		{name: "Tournament Size", type: "int", info: {min: 1, maxIndex: 4}},
		{name: "offspring Size", type: "int", info: {min: 1, maxIndex: 4}},
		{name: "Intensity of Mutation", type: "int", info: {min: 1, maxIndex: Number.MAX_SAFE_INTEGER}}
	],
	[29,[
		20833.3333,17100.0,
		20900.0,17066.6667,
		21300.0,13016.6667,
		21600.0,14150.0,
		21600.0,14966.6667,
		21600.0,16500.0,
		22183.3333,13133.3333,
		22583.3333,14300.0,
		22683.3333,12716.6667,
		23616.6667,15866.6667,
		23700.0,15933.3333,
		23883.3333,14533.3333,
		24166.6667,13250.0,
		25149.1667,12365.8333,
		26133.3333,14500.0,
		26150.0,10550.0,
		26283.3333,12766.6667,
		26433.3333,13433.3333,
		26550.0,13850.0,
		26733.3333,11683.3333,
		27026.1111,13051.9444,
		27096.1111,13415.8333,
		27153.6111,13203.3333,
		27166.6667,9833.3333,
		27233.3333,10450.0,
		27233.3333,11783.3333,
		27266.6667,10383.3333,
		27433.3333,12400.0,
		27462.5,12992.2222], 30, 600000, 6, 2, 2, 1],
		2,
		[{name: "Solution", x: "x", y: "y"}, {name: "Process", x: "iteration", y: "fitness"}]
	);

	function apply(parameters){
		return applyGA(parameters);
	}
