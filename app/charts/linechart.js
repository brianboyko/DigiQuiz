// I have no idea why this requires the "require" syntax
// and won't work with the import syntax.
const d3 = require('d3');

const linechart = (element) => {
  const h = 350;
  const w = 400;
  const monthlySales = [100, 130, 250, 300, 265, 225, 180, 120, 145, 130].map((sales, index) => ({
    month: (index + 1) * 10,
    sales: sales
  }))

  let lineFun = d3.line()
    .x((data) => data.month*3)
    .y((data) => h-data.sales)

  let line = d3.select(element)
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  line.append('path')
    .attr('d', lineFun(monthlySales))
    .attr('stroke', "purple")
    .attr('stroke-width', 2)
    .attr('fill', "none")

  // add labels

  let labels = line.selectAll("text")
    .data(monthlySales)
    .enter()
    .append("text")
    .text((d) => d.sales)
    .attr('x', (d) => d.month*3 - 25)
    .attr('y', (d) => h - d.sales)
    .attr('font-size', '12px')
    .attr('font-family', "Helvetica, Arial, sans-serif")
    .attr('fill', "#666666")
    .attr('text-anchor', 'start')
    .attr('font-weight', (d, i) => ((i === 0 || i === (monthlySales.length - 1)) ? "bold" : "normal"))


}

export default linechart
