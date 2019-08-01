//check the inputs on EnterNumberOfCities page and prompt message accordingly
//the number of cities should be an integer
function checkCityNumber(){
	var input = document.querySelector("#citynumber input").value;
	if (parseInt(input)!==parseFloat(input) || parseInt(input)!= input || parseFloat(input) != input) {
		//either number is NaN, or number is not an integer number
		document.querySelector("#citynumber .warning").innerHTML="Please Enter an Integer Number!";
		return 1;
	}
	numberOfCities = parseInt(input);
	toDiv2();
}
