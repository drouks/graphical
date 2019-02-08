var socket = io.connect('http://localhost:3000/'); 
var table = [];
var sorted = [];

function request()
{
    socket.emit('datarequest');
}


socket.on('updatedata', function(data)
{
    table = JSON.parse(data);

    
    for(var i=0;i<table.length;i++)
    {
        var dateString = table[i].date;
        var splitStr = dateString.split('/');
        var dateObj = new Date(+splitStr[2], splitStr[1] - 1, +splitStr[0]); 
        table[i].date = dateObj;
    }

    table.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
      });

    var format = d3.timeFormat("%d-%m");
    
    table.forEach(function(d)
    {
        d.date = format(d.date);

    });


    for(var i=0;i<table.length;i++)
    {
        document.getElementById("actualdata").innerHTML = 
        document.getElementById("actualdata").innerHTML+'#' +(i+1)+' float: '+table[i].float+' date: '+table[i].date+" <br/>";
    }

});


function drawbarchart()
{
   
    var max = d3.max(table, function(d) { return d.float; });
    max = Math.round(max);
    max = max+(10-max%10);
   
    const margin = 60;
    const width = 800 - 2 * margin;
    const height = 500 - 2 * margin;
    
    const svg = d3.select('#canvas');
    svg.selectAll("*").remove();
    const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);
  
    const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, max]);

    chart.append('g')
    .call(d3.axisLeft(yScale));

    const xScale = d3.scaleBand()
    .range([0, width])
    .domain(table.map((s) => (s.date)))
    .padding(0.2)

   
//s.date.getDay()+1)+'/'+(s.date.getMonth()+1)+'/'+s.date.getFullYear())
    chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

    chart.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom()
        .scale(xScale)
        .tickSize(-height, 0, 0)
        .tickFormat(''));

     chart.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft()
        .scale(yScale)
        .tickSize(-width, 0, 0)
        .tickFormat(''));

    chart.selectAll()
    .data(table)
    .enter()
    .append('rect')
    .attr('x', (s) => xScale(s.date))
    .attr('y', (s) => yScale(s.float))
    .attr('height', (s) => height - yScale(s.float))
    .attr('width', xScale.bandwidth());

    svg.append('text')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Float');

    svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Date');

     svg.append('text')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Date-To-Float Barchart with Socket');
    
}


function drawpiechart()
{
    const width = 800;
    const height = 600;
    var radius = Math.min(width, height) / 2;
    radius = radius*0.9;

    document.getElementById("canvas").innerHTML="";

    const color = d3.scaleOrdinal(["#0066ff", "#b3d1ff", "#003d99", "#ff8533", " #cc80ff","#8a00e6","#66ff66"]);

   var svg = d3.select("#canvas")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width/2 + "," + height/2 +")");
         



    var pie = d3.pie()
    .value(function(d) { return d.float; })(table);
    
    var arc = d3.arc()
	.outerRadius(radius - 10)
	.innerRadius(0);

    var labelArc = d3.arc()
    .outerRadius(radius + 30)
    .innerRadius(radius -5);

    
    var g = svg.selectAll("arc")
	.data(pie)
	.enter().append("g")
    .attr("class", "arc");
    
    g.append("path")
	.attr("d", arc)
    .style("fill", function(d) { return color(d.data.float);});
    
    g.append("text")
    .attr("transform", function(d) { 
        var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
        return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; })
    .attr("dy", ".35em")
    .attr('text-anchor','middle')
    .text(function(d) { return d.data.date })
    .style("font-size", "12px");


}
