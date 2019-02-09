//Initialize Variables
var width = 800,
		height = 500,
		svg = d3.select("#map")
						.append("svg")
						.attr("width", width)
						.attr("height", height),
		colorScale = ['#BF9A00', '#FFCD00'],
		color = d3.scale.linear()
							.domain([0, 7])
							.range(colorScale),
		data = d3.map(),
		projection = d3.geo.equirectangular()
										.center([-95, 40])
										.scale(2000)
										.translate([width / 2, height / 2]),
		path = d3.geo.path()
						.projection(projection),
		tip = d3.tip()
						.attr('class', 'd3-tip')
						.offset([-15, 0])
						.html(function(d) {
		return "<strong>" + d.properties.name + " - </strong><span>" + data.get(d.properties.abbr) + " breweries per capital</span>"
	});

//Uploading data
queue()
	.defer(d3.json, "https://rawgit.com/geobabbler/us-state-squares/380435e6d7295251519797ecc38d3ee91fb05a01/state_squares.geojson")
	.defer(d3.csv, "https://raw.githubusercontent.com/wboykinm/us-state-squares/9bb9d0d820569f978aaebe2d349eae12d56f2b97/example/bpc.csv", function(d) {
		data.set(d.state, +d.bpc);
})
	.await(ready);

// Building map
function ready(error, d) {
  svg.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(d.features)
    .enter()
    .append("path")
    .attr("class", function(d) {
      return d.properties.abbr;
    })
    .style("fill", function(d) {
      return color(data.get(d.properties.abbr))
    })
    .attr("d", path);
  
  // Building State Labels
  svg.selectAll('.place-label')
     .data(d.features)
     .enter()
     .append('text')
     .attr('class', 'place-label')
     .attr('transform', function(d){
      return 'translate('+path.centroid(d)+')';
  })
     .attr('dy', '.5em')
     .attr('dx', '-.7em')
     .text(function(d){
      return d.properties.abbr;
  })
}

//Building information