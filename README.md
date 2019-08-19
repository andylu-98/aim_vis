# AIMVisualization
G52AIM Visualization
**QUESTION: move acceptance in each hill climbing?**

---
### permutation
>parameter settings

parameter | constraint | default value
----------|----------|----------
number of cities | positive integer | 5

---
### exhaustive search
>parameter settings

parameter | constraint | default value
----------|----------|----------
number of cities | positive integer | 5
city coordinates | *number of cities* pairs of positive real numbers | D5

---
### random mutation hill climbing
>components

component | description
----------|---------
initialisation | random
neighborhood operator | random swap
move acceptance | custom

>parameter settings

parameter | constraint | default value
----------|----------|----------
number of cities | positive integer | 29
city coordinates | *number of cities* pairs of positive real numbers | WI29
number of passes | positive integer | 1
**move acceptance** | non-worsening OR improving only | improving only

---
### iterated local search
>components

component | description
----------|---------
initialisation | random
mutation | random swap
hill climbing | random mutation
neighborhood operator(HC) | adjacent swap
move acceptance(HC) | improving only
move acceptance(ILS) | non-worsening
termination | exceed predefined number of iterations

>parameter settings

parameter | constraint | default value
----------|----------|----------
number of cities | positive integer | 29
city coordinates | *number of cities* pairs of positive real numbers | WI29
number of trials | positive integer | 30
number of ILS iterations | positive integer | 6000
intensity of mutation (number of mutation moves) | positive integer | 1
depth of search (number of hill climbing passes) | positive integer | 1

---
### simulated annealing
>components

component | description
----------|---------
initialisation | random
neighborhood operator | random swap
move acceptance | custom
termination | exceed predefined number of iterations

>parameter settings

parameter | constraint | default value
----------|----------|----------
number of cities | positive integer | 29
city coordinates | *number of cities* pairs of positive real numbers | WI29
number of trials | positive integer | 30
number of SA iterations | positive integer | 150000
intensity of mutation (number of mutation) | positive integer | 1  
cooling schedule | geometric cooling OR Lundy-Mees | Lundy-Mees
cooling rate | positive real number < 1 | 0.0001
**initial temperature** | not applicable | /
**stopping temperature** | not applicable | /

---
### genetic algorithm
>components

component | description
----------|---------
initialisation | random
selection | tournament selection
crossover | order crossover
mutation | random swap
replacement | trans generational with elitism
termination | exceed predefined number of iterations

>parameter settings

parameter | constraint | default value
----------|----------|----------
number of cities | positive integer | 29
city coordinates | *number of cities* pairs of positive real numbers | WI29
number of trials | positive integer | 30
number of GA iterations | positive integer | 6000
population size | positive integer | 6
tournament size | positive integer <= *population size* | 2
intensityOfMutation | positive integer | 1
generation gap | 1/popSize ~ 1 | 1/3
**crossover probability** | ??? | ???
**mutation probability** | ??? | ???

>question

intensity of mutation? replacement strategy?

---
### memetic algorithm
>components

component | description
----------|---------
initialisation | random
selection | tournament selection
crossover | order crossover
mutation | random swap
hill climbing | next descent hill climbing
neighborhood operator(HC) | adjacent swap
move acceptance(HC) | improving only
replacement | trans generational with elitism
termination | exceed predefined number of iterations

>parameter settings

parameter | constraint | default value
----------|----------|----------
number of cities | positive integer | 29
city coordinates | *number of cities* pairs of positive real numbers | WI29
number of trials | positive integer | 30
number of MA iterations | positive integer | 6000
population size | positive integer | 6
tournament size | positive integer <= *population size* | 2
intensityOfMutation | positive integer | 1
generation gap | 1/popSize ~ 1 | 1/3
**crossover probability** | ??? | ???
**mutation probability** | ??? | ???

>question

intensity of mutation? depth of search? replacement strategy?

---
### multi-meme memetic algorithm
>components

component | description
----------|---------
initialisation | random
selection | tournament selection
crossover | order crossover
mutation | random swap
hill climbing | next descent OR steepest descent hill climbing
neighborhood operator(HC) | adjacent swap
move acceptance(HC) | improving only
replacement | trans generational with elitism
termination | exceed predefined number of iterations
memeplex | [mutation,  hill climbing]

>parameter settings

parameter | constraint | default value
----------|----------|----------
number of cities | positive integer | 29
city coordinates | *number of cities* pairs of positive real numbers | WI29
number of trials | positive integer | 30
number of MA iterations | positive integer | 6000
population size | positive integer | 6
tournament size | positive integer <= *population size* | 2
intensityOfMutation | positive integer | 1
generation gap | 1/popSize ~ 1 | 1/3
innovation rate | real number between 0 and 1 (both inclusive) | 0.4
**crossover probability** | ??? | ???
**mutation probability** | ??? | ???

---
### hyperheuristics
>components

component | description
----------|---------

>parameter settings

parameter | constraint | default value
----------|----------|----------
number of cities | positive integer | 29
city coordinates | *number of cities* pairs of positive real numbers | WI29
number of trials | positive integer | 30
number of MA iterations | positive integer | 6000
population size | positive integer | 6
tournament size | positive integer <= *population size* | 2
intensityOfMutation | positive integer | 1
generation gap | 1/popSize ~ 1 | 1/3
innovation rate | real number between 0 and 1 (both inclusive) | 0.4
RL initialScore | positive integer|10
RL upperScore | positive integer| 20
RL lowerScore | non-negative integer| 0
naive acceptance acceptanceRate | a float number between 0 and 1 | 0.5
**crossover probability** | ??? | ???
**mutation probability** | ??? | ???
