// I have no idea why this requires the "require" syntax
// and won't work with the import syntax.
const d3 = require('d3');

const scatterplot = (element) => {
  const h = 350;
  const w = 400;
  const monthlySales = [100, 130, 250, 300, 265, 225, 180, 120, 145, 130].map((sales, index) => ({
    month: (index + 1) * 10,
    sales: sales
  }))

  const salesKPI = (d) => (d >= 250) ? "#33CC66" : "#666666"

  const showMinMax = (ds, col, val, type) => {
    let max = d3.max(ds, (d) => d[col])
    let min = d3.min(ds, (d) => d[col])
    if (type === 'minmax' && (val === max || val === min)){
      return val;
    } else if (type === 'all'){
      return val;
    }
  }

  let plot = d3.select(element)
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  let dots = plot.selectAll("circle")
    .data(monthlySales)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.month * 3)
    .attr('cy', (d) => h - d.sales)
    .attr('r', 5)
    .attr('fill', (d) => salesKPI(d.sales))

  let labels = plot.selectAll("text")
    .data(monthlySales)
    .enter()
    .append("text")
    .text((d) => showMinMax(monthlySales, 'sales', d.sales, 'minmax'))
    .attr('x', (d) => (d.month * 3) - 25)
    .attr('y', (d) => h - d.sales)
    .attr('font-size', "12px")
    .attr('font-family', "Helvetica, Arial, sans-serif")
    .attr('fill', "#666666")
    .attr('text-anchor', 'start')

}

export default scatterplot
