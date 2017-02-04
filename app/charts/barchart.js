// I have no idea why this requires the "require" syntax
// and won't work with the import syntax. 
const d3 = require('d3');

const colorPicker = (v) => ((v <= 20) ? "#666666" : "#FF0033");

const bargraph = (element) => {
  let w = 300;
  let h = 120;
  let padding = 2;
  let dataset = [5, 10, 14, 20, 25, 11, 25, 22, 18, 7];

  // note, in D3 4.5, you must chain 'attr' calls together,
  // passing in an object as a parameter will not work.
  let bar = d3.select(element)
    .append("svg")
    .attr("width", w)
    .attr("height", h)

  bar.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr('x', (data, i) => (i * (w/dataset.length)))
    .attr('y', (data) => (h - (data * 4)))
    .attr('width', ((w / dataset.length) - padding))
    .attr('height', (data) => (data * 4))
    .attr('fill', (data) => colorPicker(data))

  bar.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text((data) => data)
    .attr("text-anchor", "middle")
    .attr("x", (data, i) => ((i * (w / dataset.length)) + (((w / dataset.length) - padding) / 2)))
    .attr("y", (data) => (h - (data * 4)) + 14)
    .attr('fill', "white")
    .attr("font-family", "Helvetica, Arial, sans-serif")
    .attr("font-size", 12)

}

export default bargraph
