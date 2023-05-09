(async function () {
    const data = await d3.json("data.json");
    const margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .rangeRound([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(10);
    const gridAxis = d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat("");

    const zoom = d3.zoom()
        .scaleExtent([1, 32])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "white")
        .attr("pointer-events", "all");

    x.domain(data.map(function (d) { return d.date; }));
    y.domain([0, d3.max(data, function (d) { return d.value; })]);

    svg.append("g")
        .attr("class", "grid")
        .call(gridAxis);

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

const bar = svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.date); })
    .attr("y", function (d) { return y(d.value); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d.value); });

function zoomed(event) {
    const t = event.transform;
    const xt = t.rescaleX(x);
    svg.selectAll(".bar")
        .attr("x", function (d) { return xt(d.date); })
        .attr("width", xt.bandwidth());
    svg.selectAll(".axis--x").call(xAxis.scale(xt));
}

d3.select("#slider").on("input", function () {
    const sliderPos = Number(this.value);
    const newXDomain = data.slice(sliderPos, sliderPos + 20).map(d => d.date);
    x.domain(newXDomain);
    bar.attr("x", d => x(d.date));
    svg.selectAll(".axis--x").call(xAxis);
});
}());
