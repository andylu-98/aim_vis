# Heuristics.js for G52AIM
a visualization tool for major heuristics covered in G52AIM module

author: Xingjian Lu (Andy) 2019 psyxl11

---
## Heuristics.js
Heuristics.js contains two files, heuristics.js & heuristics.css.
### *object*
> heuristic

```javascript
	{
	name:,	//string, name of the algorithm
	title:,	//string, title of the page
	pConstraints:,	//an array of parameter object, info and constraints for each parameter
	pDefaults:,	//an array of values(potentially of different types), the default value for each parameter
	chartNum:,	//integer, number of chart to be displayed
	chartInfo:	//an array of chart object, info for each chart
	}
```

> parameter

```javascript
	{
	name:,	//string, name of the parameter
	type:,	//string, type of parameter, allowed value: "int", "float", "string", "coordinates"
	info:	//an object, see below
	}
```
for different types of parameters, info has different type of attributes

	1. "int"(html text input): {min/minIndex: , max/maxIndex: , minInclusive: , maxInclusive: }
		interpreted input type: an integer number
		an integer number within given range will be expected from user
		* min/minIndex: int, lower bound of parameter value. if using min, this will the treated as the actual lower bound value. if using minIndex, this will be treated as the an index of the pConstraints array, and the user input for parameter at this index will be used as the lower bound
		* max/maxIndex: int, upper bound of parameter value. if using max, this will the treated as the actual upper bound value. if using maxIndex, this will be treated as the an index of the pConstraints array, and the user input for parameter at this index will be used as the upper bound
		* minInclusive: boolean, true represents inclusive lower bound, false represents non-inclusive lower bound
		* maxInclusive: boolean, true represents inclusive upper bound, false represents non-inclusive upper bound
	2. "float"(html text input): {min/minIndex: , max/maxIndex: , minInclusive: , maxInclusive: }
	  interpreted input type: a number
		a float number within given range will be expected from user
		* same as int except for that the type of min and max are treated as float.
	3. "string"(html radio input): {value: , checked: }
		interpreted input type: an integer number representing the index in 'value'
		a option is expected to be selected from a number of radio buttons
		* value: an array of strings, all permitted values of this parameter
		* checked: int, the index of the value originally checked when the page is generated
	4. "coordinates"(html text input): {length/lengthIndex: }
		interpreted input type: a tsp object
		input of tsp format is expected, i.e. each line of input should in the format 'label x-coordinate y-coordinate', each line should be separated by a return.
		* length/lengthIndex: int, the number of coordinates. note that this represent the number of coordinates and hence the actual number of input numbers will the twice the number specified here. if using length, this will be treated as the actual length value. if using lengthIndex, this will be treated as the an index of the pConstraints array, and the user input for parameter at this index will be used as the length
	5. "hr"(just a horizontal rule): {}
		created for creating a horizontal rule between sections of parameters. You only need to specify the type of it to be "hr"

the default value for different type of parameters

	1. int: an integer number satisfying all constraints
	2. float: a real number satisfying all constraints
	3. string: the index in the value array provided
	4. coordinates: an array of real numbers, separated by comma
	5. hr: an empty string,"" to take a space, because hr doesn't need a value.

> chart

```javascript
	{
	name:,	// string, the name of the chart, this will be displayed at the top of the chart
	x:,	// string, the name of x axis, this will be displayed at the bottom of the chart
	y:	// string, the name of y axis, this will be displayed at the left hand side of the chart
	}
```

> coordinate

```javascript
	{
	x:,	// a float number, the x coordinate of this coordinate
	y:	// a float number, the x coordinate of this coordinate
	}
```

> dataSet
the data returned from the algorithm to the framework need to be an array of this object
```javascript
	{
	name:,	//string, the label of this dataset that will be displayed in the chart, you can also include information such as average fitness or best fitness.
	type:,	//string, permitted value: route, process. if value is route, the first two data point will be marked to indicate route direction, you should only have one dataset with type 'route', otherwise it would cause error.
	data:,	//an array of coordinate objects, the coordinates will be displayed in order in the chart
	chart:,	//int, the index in the chartInfo attribute of heuristic object representing the id of the chart that this dataset will be displayed in
	route:  //array of int, representing the index of cities in the input data array, this attribute is optional and only will be used when the type of dataset is route.
	}
```

>tsp

```javascript
	{
	label:, 	//an array of labels(possible type: string or int)
	data: 		//an array of numbers
	}
```

> how to create a page with Heuristics.js

In order to create a page for an algorithm using Heuristics.js you need to provide the following
1. algorithm.js - the file containing your algorithm
	* this needs to contain a function to call in order for your algorithm to be called by the framework
		```javascript
		function applyAlgorithm(parameters){
			var chartData;
			// --- code here
			return chartData;
		}
		```
		* parameters: an array of parameter values(potentially of different type) in the index specified in the pConstraints attribute of heuristic object. this will be the user input captured from the webpage
		* chartData: am array of dataSet object, captured from the algorithm running process. this will be returned to the framework and used to generate chart in the webpage.

2. page.js - the file for generating the page
	* create a heuristic object providing all the information specified in the object section. store this object as a global object.
	* wrap your function applyAlgorithm() in side a function called apply(), the framework will run your algorithm by directly calling apply() ```javascript function apply(parameters) return applyAlgorithm(parameters); ```

3. algorithm.html - a html file for Heuristics.js to work on
	* include the following in the body of html file
		```HTML
			<div class="header"></div>
			<div class="input"></div>
			<div class="run"></div>
		```
	* also include the following files in order in this file
		1. Chart.min.js
		2. heuristics.js
		3. algorithm.js
		4. page.js
		5. Chart.min.css
		6. heuristics.css

		*note: chart.min.js & chart.min.css can be downloaded from https://chartjs.org*

Please note that you need to keep the parameter settings and chart informations uniform in both your algorithm file and page.js in order for this framework to work correctly.

examples of usage can be found in the pages folder in the repo

---
### Heuristic Examples
> Exhaustive Search

description:

	exhaustive search evaluates all possible solutions and choose the one with best fitness
charts:

	1. best solution
	2. solution distribution of all permutations generated

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
 | | | number of cities | int | 5 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | city coordinates | coordinates | D5 | {lengthIndex:  0(*number of cities*) }

> Random Mutation Hill Climbing

description:

	the hill climbing that uses random mutation as neighborhood move
charts:

	1. best solution

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  0(*number of cities*) }
loop | | number of passes | int | 1 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
neighborhood operator | random swap | | | |
move acceptance | static | move acceptance | string | 0 | {value: ["improving only", "improving and equal"], checked: 0 }

> Iterated Local Search

description:

	this algorithm is based on visiting a sequence of locally optimal solutions by perturbing the current local optimum and applying local search/hill climbing after starting from the modified solution

charts:

	1. best solution
	2. accepted solution fitness at each iteration

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  0(*number of cities*) }
perturbation | random exchange | intensity of mutation | int | 1 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
local search | SDHC | depth of search | int | 1 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
local search acceptance | static | local search acceptance | string | 0 | {value: ["improving only", "improving and equal"], checked: 0 }
neighborhood operator | adjacent exchange | | | |
move acceptance | static | move accpetance | string | 1 | {value: ["improving only", "improving and equal"], checked: 1 }
termination | static | number of iterations | int | 6000 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | number of trials | int | 30 | {min: 1, max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
other | | | number Iterations Displayed | int | 2000 | {min: 1, maxIndex: 7, minInclusive: true, maxInclusive: true}

> Simulated Annealing

description:

	A stochastic local search algorithm inspired by the physical process of annealing (Kirkpatrick et al. 1983)

charts:

	1. best solution
	2. accepted solution fitness and best solution fitness at each iteration

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  0(*number of cities*) }
initial temperature | calculate from initial fitness | scale distance | float | 0.5 | {min: 0, max: 1, minInclusive: false, maxInclusive: false}
perturbation | random exchange | | | |
move acceptance | non-worsening or with boltzmann probability | | | |
cooling | cooling | cooling schedule | string | 0 | {value: ["LundyMees", "Geometric"], checked: 0 }
 | | | cooling rate | float | 0.0001 | {min: 0; max: 1, minInclusive: false, maxInclusive: false}
termination | static | number of iterations | int | 150000 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | number of trials | int | 30 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | stopping temperature | float | 0.00001 | {min: 0; max: MAX_SAFE_INTEGER, minInclusive: false, maxInclusive: false}
 other | | | number Iterations Displayed | int | 5000 | {min: 1, maxIndex: 6, minInclusive: true, maxInclusive: true}

> Genetic Algorithms

description:

	A population based search method based on Darwin's Theory of Evolution

charts:

	1. best solution
	2. average solution fitness of the population at each iteration

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  0(*number of cities*) }
 | | | population size | int | 6 | {min: 1, max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
selection | tournament selection | tour size | int | 2 | {min: 1, maxIndex: 2(*population size*), minInclusive: true, maxInclusive: true}
crossover | order crossover | crossover probability | float | 0.9 | {min: 0; max: 1, minInclusive: true, maxInclusive: true}
mutation | random swap | mutation probability | float | 0.9 | {min: 0; max: 1, minInclusive: true, maxInclusive: true}
replacement | transgenerational with elitism | offspring size | int | 2 | {min: 1, maxIndex: 2(*population size*), minInclusive: true, maxInclusive: false}
termination | static | number of iterations | int | 150000 | {min: 1; max: MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}
 | | | number of trials | int | 30 | {min: 1; max: MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}
 other | | | number Iterations Displayed | int | 5000 | {min: 1, maxIndex: 9, minInclusive: true, maxInclusive: true}


> Memetic Algorithms

description:

	A heuristic based on combining the exploration ability of genetic algorithm and the exploitation ability of hill climbing

charts:

	1. best solution
	2. average solution fitness of the population at each iteration

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  0(*number of cities*) }
 | | | population size | int | 6 | {min: 1, max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
selection | tournament selection | tour size | int | 2 | {min: 1, maxIndex: 2(*population size*), minInclusive: true, maxInclusive: true}
crossover | order crossover | crossover probability | float | 0.9 | {min: 0; max: 1, minInclusive: true, maxInclusive: true}
mutation | random swap | mutation probability | float | 0.9 | {min: 0; max: 1, minInclusive: true, maxInclusive: true}
hill climbing | NDHC | depth of search | int | 1 | {min: 1; max: MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}
hc acceptance | static | hc move acceptance | string | 0 | {values: ["improving only", "improving and equal"], checked: 0 }
hc neighborhood operator | adjacent swap | | | |
replacement | transgenerational with elitism | offspring size | int | 2 | {min: 1, max: 2(*population size*), minInclusive: true, maxInclusive: true}
termination | static | number of iterations | int | 150000 | {min: 1; max: MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}
 | | | number of trials | int | 30 | {min: 1; max: MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}
 other | | | number Iterations Displayed | int | 5000 | {min: 1, maxIndex: 11, minInclusive: true, maxInclusive: true}

> Multi-meme Memetic Algorithms

description:

	Memetic algorithm with self-adaptive memetic materials

charts:

	1. best solution
	2. average solution fitness of the population at each iteration

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  0(*number of cities*) }
 | | | population size | int | 6 | {min: 1, max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
selection | tournament selection | tour size | int | 2 | {min: 1, maxIndex: 2(*population size*), minInclusive: true, maxInclusive: true}
crossover | order crossover | crossover probability | float | 0.9 | {min: 0; max: 1, minInclusive: true, maxInclusive: true}
mutation | random swap | mutation probability | float | 0.9 | {min: 0; max: 1, minInclusive: true, maxInclusive: true}
hill climbing | NDHC | depth of search | int | 1 | {min: 0; max: MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}
hc acceptance | static | hc move acceptance | string | 0 | {values: ["improving only", "improving and equal"], checked: 0 }
hc neighborhood operator | adjacent swap | | | |
replacement | transgenerational with elitism | offspring size | int | 2 | {min: 1, max: 2(*population size*), minInclusive: true, maxInclusive: false}
mutate meme | | innovation rate | float | 0.4 | {min: 0, max: 1, minInclusive: true, maxInclusive: true}
termination | static | number of iterations | int | 150000 | {min: 1; max: MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}
 | | | number of trials | int | 30 | {min: 1; max: MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}
 other | | | number Iterations Displayed | int | 5000 | {min: 1, maxIndex: 12, minInclusive: true, maxInclusive: true}

> Hyper-Heuristics

description:

	A cross-domain search method using reinforcement learning.

charts:

	1. best solution
	2. accepted solution fitness and best solution fitness at each iteration

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {min: 1; max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  0(*number of cities*) }
learning | reinforcement learning | upper score | int | 20 | {min: 0, max: MAX_SAFE_INTEGER, minInclusive: true, maxInclusive: false}
 | | | lower score | int | 0 | {min: 0, maxIndex: 2(*upper score*), minInclusive: true, maxInclusive: false}
 | | | initial score | int | 10 | {minIndex: 3(*lower score*), maxIndex: 2(*upper score*), minInclusive: true, maxInclusive: true}
selection | tournamen selection | tour size | int | 2 | {min: 1, max: 2, minInclusive: true, maxInclusive: true}
move acceptance | naive acceptance | acceptance rate | float | 0.5 | {min: 0, max: 1, minInclusive: true, maxInclusive: true}
termination | static | number of iterations | int | 6000 | {min: 1; max: MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}
 | | | number of trials | int | 30 | {min: 1; max: MAX_SAFE_INTEGER , minInclusive: true, maxInclusive: false}
other | | | number Iterations Displayed | int | 5000 | {min: 1, maxIndex: 8, minInclusive: true, maxInclusive: true}
