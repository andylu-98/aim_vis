function generateChart(route, line){
	var ctx = document.getElementById('chart').getContext('2d');
	var scatterChart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Route',
				data:	route,
				backgroundColor: '#D5E2EA',
				borderColor: '#7FC0E8',
				showLine: line,
				lineTension: 0
				}]
			},
			options: {
				scales: {
					xAxes: [{
						type: 'linear',
						position: 'bottom'
					}]
				}
			}
		});
}
