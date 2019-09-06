var heuristicPage = new heuristic(
	"Hyper-heuristics",
	"Hyper-heuristics",
	"A cross-domain search method using reinforcement learning.",
	[
		{name: "Number Of Cities", type: "int", info: {min: 1, max: Number.MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}},
		{name: "Coordinate of Cities", type: "coordinates", info: {lengthIndex: 0}},
		{name: "Upper Score", type: "int", info: {min: 0, max: Number.MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}},
		{name: "Lower Score", type: "int", info: {min: 0, maxIndex: 2, minInclusive: true, maxInclusive: false}},
		{name: "Initial Score", type: "int", info: {minIndex: 3, maxIndex: 2, minInclusive: true, maxInclusive: true}},
		{name: "Tournament Size", type: "int", info: {min: 1, max: 2, minInclusive: true, maxInclusive: true}},
		{name: "Naive Acceptance Rate", type: "float", info: {min: 0, max: 1, minInclusive: true, maxInclusive: true}},
		{name: "Number of Iterations", type: "int", info: {min: 1, max: Number.MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}},
		{name: "Number of Trials", type: "int", info: {min: 1, max: Number.MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}}
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
		27462.5,12992.2222], 20, 0, 10, 2, 0.5, 6000, 30],
		2,
		[{name: "Solution", x: "x", y: "y"}, {name: "Process", x: "iteration", y: "fitness"}]
	);

	function apply(parameters){
		return applyHH(parameters);
	}
