import * as d3 from "d3"


let sym = d3.symbol()
    .type(d3.symbolSquare).size(500);
d3.select("#gfg")
    .append("path")
    .attr("d", sym)
    .attr("fill", "green")
    .attr("transform", "translate(50,50)");

console.log("hi, d3")