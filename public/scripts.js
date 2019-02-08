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


function drawgraph()
{

    var max = d3.max(table, function(d) { return d.float; });
    max = Math.round(max);
    max = max+(10-max%10);
   
    const margin = 60;
    const width = 500 - 2 * margin;
    const height = 500 - 2 * margin;
    
    const svg = d3.select('svg');
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

