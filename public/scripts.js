var socket = io.connect('http://localhost:3000/'); 
var points = [];
function sub()
{
    var formData = new FormData();
    formData.append("id",document.getElementById("id").value);
    formData.append("primary",document.getElementById("primary").value);
    formData.append("secondary",document.getElementById("secondary").value);
    addPoint(formData);
}

function addPoint(data)
{
   var id = data.get("id");
   var primary = data.get("primary");
   var secondary = data.get("secondary");
   var newpoint = 
   {
      id: id,
      primary: primary,
      secondary: secondary
   }

   socket.emit('newpoint', newpoint);
   
}


socket.on('updatepoints', function(data)
{
    points = data;
})

var x = d3.scaleLinear()
   .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 460-margin.left - margin.right,
  height = 400-margin.top - margin.bottom;

  var svg = d3.select("#showarea")
  .append("svg")
  .attr("width", width+margin.left+margin.right)
  .attr("height", height+margin.top+margin.bottom)
  .append("g")
  .attr("transform",
  "translate("+margin.left+","+margin.top+")");

  x.domain(points.map(function(d) { return d.primary; }));
  y.domain(points.map(function(d) { return d.secondary; }));
 
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [8000, 9200])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
    // Add the line
    svg.append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.primary) })
        .y(function(d) { return y(d.secondary) })
        )
    // Add the points
    svg
      .append("g")
      .selectAll("dot")
      .data(points)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 5)
        .attr("fill", "#69b3a2")


