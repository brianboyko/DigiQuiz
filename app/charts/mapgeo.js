// I have no idea why this requires the "require" syntax
// and won't work with the import syntax.
const d3 = require('d3');

const mapgeo = (element) => {
  const h = 300;
  const w = 500;
  const monthlySales = [100, 130, 250, 300, 265, 225, 180, 120, 145, 130].map((sales, index) => ({
    month: (index + 1) * 10,
    sales: sales
  }))

  let path = d3.geoPath();
  let svg = d3.select(element)
    .append("svg")
    .attr('width', w)
    .attr('height', h)

  d3.json("../us.json", (json) => {
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', "#666666")
  })


}

export default mapgeo
