# Heuristics.js for G52AIM
a visualization tool for major heuristics covered in G52AIM module

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
		an integer number within given range will be expected from user
		* min/minIndex: int, lower bound of parameter value. if using min, this will the treated as the actual lower bound value. if using minIndex, this will be treated as the an index of the pConstraints array, and the user input for parameter at this index will be used as the lower bound
		* max/maxIndex: int, upper bound of parameter value. if using max, this will the treated as the actual upper bound value. if using maxIndex, this will be treated as the an index of the pConstraints array, and the user input for parameter at this index will be used as the upper bound
		* minInclusive: boolean, true represents inclusive lower bound, false represents non-inclusive lower bound
		* maxInclusive: boolean, true represents inclusive upper bound, false represents non-inclusive upper bound
	2. "float"(html text input): {min/minIndex: , max/maxIndex: , minInclusive: , maxInclusive: }
		a float number within given range will be expected from user
		* same as int except for that the type of min and max are treated as float.
	3. "string"(html radio input): {value: , checked: }
		a option is expected to be selected from a number of radio buttons
		* value: an array of strings, all permitted values of this parameter
		* checked: int, the index of the value originally checked when the page is generated
	4. "coordinates"(html text input): {length/lengthIndex: }
		an array of float number is expected from the user input, the numbers can be separated by comma, return, space, or tab
		* length/lengthIndex: int, the number of coordinates. note that this represent the number of coordinates and hence the actual number of input numbers will the twice the number specified here. if using length, this will be treated as the actual length value. if using lengthIndex, this will be treated as the an index of the pConstraints array, and the user input for parameter at this index will be used as the length

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
	data:,	//an array of coordinate objects, the coordinates will be displayed in order in the chart
	chart:	//int, the index in the chartInfo attribute of heuristic object representing the id of the chart that this dataset will be displayed in
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

examples of usage can be found in the pages folder in the repo

---
### Heuristic Examples
> Exhaustive Search

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
 | | | number of cities | int | 5 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | city coordinates | coordinates | D5 | {lengthIndex:  *number of cities* }

> Random Mutation Hill Climbing

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  *number of cities* }
loop | | number of passes | int | 1 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
neighborhood operator | random swap | | | |
move acceptance | static | move acceptance | string | 0 | {values: ["improving only", "improving and equal"], checked: 0 }

> Iterated Local Search

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  *number of cities* }
perturbation | random exchange | intensity of mutation | int | 1 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
local search | SDHC | depth of search | int | 1 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
local search acceptance | static | local search acceptance | string | 0 | {values: ["improving only", "improving and equal"], checked: 0 }
neighborhood operator | adjacent exchange | | | |
move acceptance | static | move accpetance | string | 1 | {values: ["improving only", "improving and equal"], checked: 1 }
termination | static | number of iterations | int | 6000 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | number of trials | int | 30 | {minimum: 0; maximum: MAX_SAFE_INTEGER }

> Simulated Annealing

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  *number of cities* }
initial temperature | calculate from initial fitness | scale distance | float | 0.5 | {minimum: 0, maximum: 1}
perturbation | random exchange | | | |
move acceptance | non-worsening or with boltzmann probability |
cooling | cooling | cooling schedule | string | 0 | {values: ["LundyMees", "Geometric"], checked: 0 }
 | | | cooling rate | float | 0.0001 | {minimum: 0; maximum: 1}
termination | static | number of iterations | int | 150000 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | number of trials | int | 30 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | stopping temperature | float | 0.00001 | {minimum: 0; maximum: 1}

> Genetic Algorithms

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  *number of cities* }
 | | | population size | int | 6 | {minimum: 1, maximum: MAX_SAFE_INTEGER}
selection | tournament selection | tour size | int | 2 | {minimum: 1, maximum: *population size*}
crossover | order crossover | crossover probability | float | 0.9 | {minimum: 0; maximum: 1}
mutation | random swap | mutation probability | float | 0.9 | {minimum: 0; maximum: 1}
replacement | transgenerational with elitism | offspring size | int | 2 | {minimum: 1, maximum: *population size*}
termination | static | number of iterations | int | 150000 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | number of trials | int | 30 | {minimum: 0; maximum: MAX_SAFE_INTEGER }


> Memetic Algorithms

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  *number of cities* }
 | | | population size | int | 6 | {minimum: 1, maximum: MAX_SAFE_INTEGER}
selection | tournament selection | tour size | int | 2 | {minimum: 1, maximum: *population size*}
crossover | order crossover | crossover probability | float | 0.9 | {minimum: 0; maximum: 1}
mutation | random swap | mutation probability | float | 0.9 | {minimum: 0; maximum: 1}
hill climbing | NDHC | depth of search | int | 1 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
hc acceptance | static | hc move acceptance | string | 0 | {values: ["improving only", "improving and equal"], checked: 0 }
hc neighborhood operator | adjacent swap | | | |
replacement | transgenerational with elitism | offspring size | int | 2 | {minimum: 1, maximum: *population size*}
termination | static | number of iterations | int | 150000 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | number of trials | int | 30 | {minimum: 0; maximum: MAX_SAFE_INTEGER }

> Multi-meme Memetic Algorithms

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  *number of cities* }
 | | | population size | int | 6 | {minimum: 1, maximum: MAX_SAFE_INTEGER}
selection | tournament selection | tour size | int | 2 | {minimum: 1, maximum: *population size*}
crossover | order crossover | crossover probability | float | 0.9 | {minimum: 0; maximum: 1}
mutation | random swap | mutation probability | float | 0.9 | {minimum: 0; maximum: 1}
hill climbing | NDHC | depth of search | int | 1 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
hc acceptance | static | hc move acceptance | string | 0 | {values: ["improving only", "improving and equal"], checked: 0 }
hc neighborhood operator | adjacent swap | | | |
replacement | transgenerational with elitism | offspring size | int | 2 | {minimum: 1, maximum: *population size*}
mutate meme | | innovation rate | float | 0.4 | {minimum: 0, maximum: 1}
termination | static | number of iterations | int | 150000 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | number of trials | int | 30 | {minimum: 0; maximum: MAX_SAFE_INTEGER }

> Hyper-Heuristics

component | method | parameter | parameter type | parameter default | parameter info
-|-|-|-|-|-
initialization | random | number of cities | int | 29 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | city coordinates | coordinates | WI29 | {lengthIndex:  *number of cities* }
learning | reinforcement learning | upper score | int | 20 | {minimum: 0, maximum : MAX_SAFE_INTEGER}
 | | | lower score | int | 0 | {minimum: 0, maximum: *upper score*}
 | | | initial score | int | 10 | {minimum: *lower score*, maximum: *upper score*}
selection | tournamen selection | tour size | int | 2 | {minimum: 1, maximum: 2}
move acceptance | naive acceptance | acceptance rate | float | 0.5 | {minimum: 0, maximum: 1}
termination | static | number of iterations | int | 6000 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
 | | | number of trials | int | 30 | {minimum: 0; maximum: MAX_SAFE_INTEGER }
