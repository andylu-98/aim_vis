//parameters - start
var hTitle;					//title of the page
var hName;					//name of the page
var hDescription;		//description of the page
var hPConstraints;	//constraints for each user-defined parameter
var hPDefaults;			//default value for each user-defined parameter
var hChartNum;			//number of chart displayed
var hChartName;			//name of each chart
var hPValues;				//user inoput for each user-defined parameter
var hChartData;			//data to be displayed in each chart(several dataset could appear in one chart)
var hChartConfig;		//configuration for each chart
var hCharts;				//the chart object for each chart
var color = ['#E83D3D', '#E8793D', '#E5E83D', '#A7E83D', '#54E83D', '#3DE8C4', '#3DACE8', '#3D79E8', '#8B3DE8', '#E83DE0', '#7FE251', '#E49765', '#FFC300'];
//parameters - end

//classes constructor - start
function heuristic(name, title, description, pConstraints, pDefaults, chartNum, chartName){
	hName = name;
	hTitle = title;
	hDescription = description;
	hPConstraints = pConstraints;
	hPDefaults = pDefaults;
	hChartNum = chartNum;
	hChartName = chartName;
	hChartConfig = [];
	hCharts = [];
	//generate the page
	generate(hTitle, hName, hDescription, hPConstraints, hChartNum, hChartName);

	//generate configuration and object for each chart
	for(var i = 0; i < hChartNum; i++){
		hChartConfig.push(
			{
				type: 'line',
				data: {
					datasets: []
				},
				options: {
					title: {
						display: true,
						text: hChartName[i].name
					},
					scales: {
						xAxes: [{
							type: 'linear',
							position: 'bottom',
							display: true,
							scaleLabel: {
								display: true,
								labelString: hChartName[i].x
							}
						}],
						yAxes: [{
							display: true,
							scaleLabel: {
								display: true,
								labelString: hChartName[i].y
							}
						}]
					}
				}
			});
		var ctx = document.getElementById(hChartName[i].name).getContext('2d');
		hCharts.push(new Chart(ctx, hChartConfig[i]));
	}
}
//classes constructor - end

//functions - start

//generate the page
function generate(title, name, description, pConstraints, chartNum, chartName){
	//parameter list - start
	var input;
	var run
	var form;
	var p;
	var warning;
	var button;
	var text;
	var field;
	var canvas;

	var i;
	var j;
	//parameter list - end

	//add titel and header
	document.title = title;
	document.querySelector("div.header").innerHTML = "<h1>" + name + "</h1>" + "<p>" + description + "</p>";

	//add input fields
	input = document.querySelector("div.input");
	form = document.createElement("form");
	//for each parameter, create its input field in the form: <p class = "param# input">name: <input></p><p class = "param# warning">msg/p>
	for(i = 0; i < pConstraints.length; i++){

		if(pConstraints[i].type === "hr"){
			p = document.createElement("p");
			p.setAttribute("class", "param" + (i+1));
			p.classList.add("input");

			field = document.createElement("hr");
			field.setAttribute("width", "30%");

			warning = document.createElement("p");
			warning.setAttribute("class", "param" + (i+1));
			warning.classList.add("warning");

			p.appendChild(field);
			form.appendChild(p);
			form.appendChild(warning);
			continue;
		}
		else{
			p = document.createElement("p");
			p.setAttribute("class", "param" + (i+1));
			p.classList.add("input");

			text = document.createTextNode(pConstraints[i].name + ": ");
			p.appendChild(text);

			if(pConstraints[i].type === "int" || pConstraints[i].type === "float" ||pConstraints[i].type === "coordinates"){
				field = document.createElement("input");
				field.setAttribute("type", "text");
				field.setAttribute("name", "param" + (i+1));
				p.appendChild(field);
			}
			else if(pConstraints[i].type === "string"){
				for(j = 0; j < pConstraints[i].info.value.length; j++){
					field = document.createElement("input");
					field.setAttribute("type", "radio");
					field.setAttribute("name", "param" + (i+1));
					field.setAttribute("value", j);
					if(j == pConstraints[i].info.checked) field.checked = true;
					text = document.createTextNode(pConstraints[i].info.value[j]);
					p.appendChild(field);
					p.appendChild(text);
				}
			}
			warning = document.createElement("p");
			warning.setAttribute("class", "param" + (i+1));
			warning.classList.add("warning");

			form.appendChild(p);
			form.appendChild(warning);
		}
	}

	input.appendChild(form);

	button  = document.createElement("button");
	button.setAttribute("type", "button");
	button.setAttribute("class", "default");
	text = document.createTextNode("Use Default Settings");
	button.appendChild(text);

	input.appendChild(button);

	button  = document.createElement("button");
	button.setAttribute("type", "button");
	button.setAttribute("class", "continue");
	text = document.createTextNode("Continue");
	button.appendChild(text);

	input.appendChild(button);

	//add running result page
	run = document.querySelector("div.run");
	run.style.display = "none";

	p = document.createElement("p");
	run.appendChild(p);

	for(i = 0; i < chartNum; i++){
		p = document.createElement("p");
		// if(chartNum != 1){
		// 	if(i%2 == 0) p.setAttribute("class", "left");
		// 	if(i%2 == 1) p.setAttribute("class", "right");
		// }
		// else{
			p.setAttribute("class", "single");
		// }
		canvas = document.createElement("canvas");
		canvas.setAttribute("id", chartName[i].name);
		p.appendChild(canvas);
		run.appendChild(p);
	}

	button  = document.createElement("button");
	button.setAttribute("type", "button");
	button.setAttribute("class", "run");
	text = document.createTextNode("Run");
	button.appendChild(text);

	run.appendChild(button);

	document.querySelector("button.default").addEventListener("click", setDefault);
	document.querySelector("button.continue").addEventListener("click", validate);
	document.querySelector("button.run").addEventListener("click", runAlgorithm);

}

//set all user input to default
function setDefault(){
	for(var i = 0; i < hPDefaults.length; i++) {
		if(hPConstraints[i].type == 'string'){
			document.querySelectorAll("[name=param" + (i+1) + "][type=radio]").checked = false;
			document.querySelectorAll("[name=param" + (i+1) + "][type=radio]")[hPConstraints[i].info.checked].checked = true;
		}
		else if(hPConstraints[i].type == 'hr') continue;
		else document.querySelector(".param" + (i+1) + ".input>input").value = hPDefaults[i];

	}
}

//validate all user input and prompt error properly
function validate(){
	var pass = true;
	hPValues = [];
	for(var i = 0; i < hPConstraints.length; i++) document.querySelector(".param" + (i+1) + ".warning").innerHTML = "";
	for(var i = 0; i < hPConstraints.length; i++){
		if(hPConstraints[i].type === "string") hPValues.push(document.querySelector("[name=param" + (i+1) + "]:checked").value);
		else if(hPConstraints[i].type === "hr") hPValues.push("");
		else{
			var value = document.querySelector(".param" + (i+1) + ".input>input").value;
			if(hPConstraints[i].type === "int"){
				var info = hPConstraints[i].info;
				// if(info.min === undefined) if(info.minIndex === undefined) {console.error("int parameter should have two info attributes indicating permitted minimum and maximum value"); return;}
				// if(info.minIndex === undefined) if(info.min === undefined) {console.error("int parameter should have two info attributes indicating permitted minimum and maximum value"); return;}
				// if(info.max === undefined) if(info.maxIndex === undefined) {console.error("int parameter should have two info attributes indicating permitted minimum and maximum value"); return;}
				// if(info.maxIndex === undefined) if(info.max === undefined) {console.error("int parameter should have two info attributes indicating permitted minimum and maximum value"); return;}

				var parse = parseInt(value);
				if(parse != value){
					document.querySelector(".param" + (i+1) + ".warning").innerHTML = "^Please Enter an Integer.";
					hPValues.push(null);
					pass = false;
					continue;
				}
				var min;
				var max;
				var minInclusive = info.minInclusive;
				var maxInclusive = info.maxInclusive;
				if(info.min === undefined) min = hPValues[info.minIndex];
				else min = info.min;
				if(info.max === undefined) max = hPValues[info.maxIndex];
				else max = info.max;

				if(min === null || max === null) {
					document.querySelector(".param" + (i+1) + ".warning").innerHTML = "^You need to correct previous parameters.";
					hPValues.push(null);
					pass = false;
					continue;
				}

				var rightRange;
				if(minInclusive && maxInclusive) rightRange = (parse >= min && parse <= max);
				else if(!minInclusive && maxInclusive) rightRange = (parse > min && parse <= max);
				else if(minInclusive && !maxInclusive) rightRange = (parse >= min && parse < max);
				else if(!minInclusive && !maxInclusive) rightRange = (parse > min && parse < max);

				if(!rightRange){
					document.querySelector(".param" + (i+1) + ".warning").innerHTML = "^Please enter a number between " + min + " and " + max + ".";
					hPValues.push(null);
					pass = false;
					continue;
				}
				hPValues.push(parse);
			}
			else if(hPConstraints[i].type === "float"){
				var info = hPConstraints[i].info;
				// if(info.min === undefined) if(info.minIndex === undefined) {console.error("float parameter should have two info attributes indicating permitted minimum and maximum value"); return;}
				// if(info.minIndex === undefined) if(info.min === undefined) {console.error("float parameter should have two info attributes indicating permitted minimum and maximum value"); return;}
				// if(info.max === undefined) if(info.maxIndex === undefined) {console.error("float parameter should have two info attributes indicating permitted minimum and maximum value"); return;}
				// if(info.maxIndex === undefined) if(info.max === undefined) {console.error("float parameter should have two info attributes indicating permitted minimum and maximum value"); return;}

				var parse = parseFloat(value);
				if(parse != value){
					document.querySelector(".param" + (i+1) + ".warning").innerHTML = "^Please Enter a Number.";
					hPValues.push(null);
					pass = false;
					continue;
				}
				var min;
				var max;
				if(info.min === undefined) min = hPValues[info.minIndex];
				else min = info.min;
				if(info.max === undefined) max = hPValues[info.maxIndex];
				else max = info.max;

				if(min === null || max === null) {
					document.querySelector(".param" + (i+1) + ".warning").innerHTML = "^You need to correct previous parameters.";
					hPValues.push(null);
					pass = false;
					continue;
				}

				var rightRange;
				if(minInclusive && maxInclusive) rightRange = (parse >= min && parse <= max);
				else if(!minInclusive && maxInclusive) rightRange = (parse > min && parse <= max);
				else if(minInclusive && !maxInclusive) rightRange = (parse >= min && parse < max);
				else if(!minInclusive && !maxInclusive) rightRange = (parse > min && parse < max);

				if(!rightRange){
					document.querySelector(".param" + (i+1) + ".warning").innerHTML = "^Please enter a number between " + min + " and " + max + ".";
					hPValues.push(null);
					pass = false;
					continue;
				}
				hPValues.push(parse);
			}
			else if(hPConstraints[i].type === "coordinates"){
				var info = hPConstraints[i].info;
				// if(info.length === undefined) if(info.lengthIndex === undefined) {console.error("no length specified."); return;}
				// if(info.lengthIndex === undefined) if(info.length === undefined) {console.error("no length specified."); return;}

				var length;
				if(info.length === undefined) length = hPValues[info.lengthIndex];
				else length = info.length;

				if(length === null) {
					document.querySelector(".param" + (i+1) + ".warning").innerHTML = "^You need to correct previous parameters.";
					hPValues.push(null);
					pass = false;
					continue;
				}

				value = value.replace(/\t/g, " ");
				value = value.replace(/\r/g, " ");
				value = value.replace(/\n/g, " ");
				value = value.replace(/,/g, " ");
				value = value.split(" ");
				value = value.filter( function(item){return item != " " && item != "";} );
				//if there's NaN in the input or the total number of coordinates is not a even number
				if( !value.every(function(item){return parseInt(item) ==item || parseFloat(item) == item;}) || value.length % 2 !== 0){
					document.querySelector(".param" + (i+1) + ".warning").innerHTML="^Invalid format!";
					hPValues[i] = null;
					pass = false;
					continue;
				}

				if(value.length / 2 !== length){
					document.querySelector(".param" + (i+1) + ".warning").innerHTML="^Please enter " + length + " cities!";
					hPValues[i] = null;
					pass = false;
					continue;
				}
				value = value.map(Number);
				hPValues.push(value);
			}
		}
	}
	if(!pass) return;
	else{
		var txt = "";
		for(var i = 0; i < hPValues.length; i++){
			if(hPConstraints[i].type == "coordinates") continue;
			txt += hPConstraints[i].name;
			if(hPConstraints[i].type == "string") txt += ": " + hPConstraints[i].info.value[hPValues[i]] + "\t";
			else txt += ": " + hPValues[i] + "\t";


		}
		document.querySelector("div.run p").innerHTML = txt;
		document.querySelector("div.input").style.display = "none";
		document.querySelector("div.run").style.display = "block";
	}
}

//run algorithm and generate chart
function runAlgorithm(){
	for(var i = 0; i < hChartConfig.length; i++) hChartConfig[i].data.datasets = [];
	hChartData = apply(hPValues);
	for(var i = 0; i < hChartData.length; i++){
		if(hChartData[i].type === "route") addData(hChartData[i].data, hChartData[i].name, hChartData[i].chart, true);
		else addData(hChartData[i].data, hChartData[i].name, hChartData[i].chart, false);
	}
	for(var i = 0; i < hCharts.length; i++) hCharts[i].update();
}

//add data to the chart
function addData(data, label, id, route){
	var radius; //radius for each point
	if(route) {
		radius = [];
		for(var i = 0; i < data.length; i++) radius.push(0);
		radius[0] = 10;
		radius[1] = 5;
	}
	else radius = 0;
	hChartConfig[id].data.datasets.push({
		label: label,
		data:	data,
		borderColor: color[Math.floor(Math.random() * Math.floor(color.length))],
		lineTension: 0,
		pointRadius: radius
	});
}
//functions - end
