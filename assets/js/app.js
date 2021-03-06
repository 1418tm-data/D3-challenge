var svgWidth = 800;
var svgHeight = 400;

var margin = {
  top: 60,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("/assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, 24])
      .range([0, width]);    

    var yLinearScale = d3.scaleLinear()
      .domain([4, 28])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    bottomAxis.tickValues([8,10,12,14,16,18,20,22])     
    leftAxis.tickValues([4,6,8,10,12,14,16,18,20,22,24,26])

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "8")
    .attr("class", "stateCircle");

    // Step 6: Create the labels for the circles
    // ==============================
    chartGroup.append("g")
    .selectAll('text')
    .data(healthData)
    .enter()
    .append("text")
    .text(d=>d.abbr)
    .attr("x",d=>xLinearScale(d.poverty))
    .attr("y",d=>yLinearScale(d.healthcare))
    .attr( "class", "stateText")
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "10px")
    .style("font-weight", "bold")
    .attr("alignment-baseline", "central");
    

    // Step 7: Create axes labels
    // ==============================
    chartGroup.append("text")
      
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("font-weight", "bold")
      .attr("class", "aText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 20})`)
      .attr("class", "aText")
      .attr("font-weight", "bold")
      .text("In Poverty (%)");
  })
  .catch(function(error) {
    console.log(error);
  });
