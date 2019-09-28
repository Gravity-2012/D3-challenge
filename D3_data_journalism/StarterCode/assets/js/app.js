// Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 600;

// Define the chart's margins as an object
var chartMargin = {
  top: 100,
  right: 100,
  bottom: 150,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);



// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(journalData) {

  // Log an error if one exists
//   if (error) return console.warn(error);

  // Print the tvData
  console.log(journalData);

  // Cast the poverty and obseity value to a number for each piece of journalData
  journalData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

    // Step 2: Create scale functions for poverty and obseity
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([7, d3.max(journalData, d => d.poverty) *1.2])
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([15, d3.max(journalData, d => d.obesity) *1.2])
      .range([chartHeight, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(journalData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "12")
    .attr("fill", "orange")
    .attr("opacity", ".8");

    // Step 5.5: Create abbreviations in the circles
    chartGroup.append("g").selectAll("text")
    .data(journalData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .attr("font-size", "12px")
    .attr("fill", "white")
    .style("font-weight", "bold");


    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br> Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity Rates");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth/ 2}, ${chartHeight + chartMargin.top})`)
      .attr("class", "axisText")
      .text("Poverty");
});
