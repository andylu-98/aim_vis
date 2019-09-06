var heuristicPage = new heuristic(
	"Exhaustive Search",
	"Exhaustive Search",
	"exhaustive search evaluates all possible solutions and choose the one with best fitness",
	[
		{name: "Number Of Cities", type: "int", info: {min: 1, max: Number.MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}},
		{name: "Coordinate of Cities", type: "coordinates", info: {lengthIndex: 0}}
	],
	[5, [1.309016994, 1.951056516, 0.190983006, 1.587785252, 0.190983006, 0.412214748, 1.309016994, 0.048943484, 2, 1]],
	2,
	[{name: "Solution", x: "x", y: "y"}, {name: "all possible solution fitness", x: "solution", y: "fitness"}]
);

function apply(parameters){
	return applyExhaustiveSearch(parameters);
}
