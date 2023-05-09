(async function () {
    // let data = await d3.json("data.json");
    // let data = [
    //     // You can add initial data points here, or leave it empty to start with no data.
    // ];
    let data = JSON.parse(localStorage.getItem("pushupData")) || [];

    document.getElementById("import").addEventListener("click", async () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "application/json";
        fileInput.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            if (file) {
                const fileText = await file.text();
                data = JSON.parse(fileText);
                updateChart();
                localStorage.setItem("pushupData", JSON.stringify(data));
            }
        });
        fileInput.click();
    });

    document.getElementById("export").addEventListener("click", () => {
        const dataStr = JSON.stringify(data);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const dataUrl = URL.createObjectURL(dataBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = dataUrl;
        downloadLink.download = "data.json";
        downloadLink.click();
        URL.revokeObjectURL(dataUrl);
    });

    const dailyView = (data) => data;
    const weeklyView = (data) => {
        const weekData = {};
        data.forEach(d => {
            const week = new Date(d.date);
            week.setDate(week.getDate() - week.getDay());
            const weekStr = week.toISOString().slice(0, 10);
            weekData[weekStr] = (weekData[weekStr] || 0) + d.value;
        });
        return Object.entries(weekData).map(([date, value]) => ({ date, value }));
    };
    const monthlyView = (data) => {
        const monthData = {};
        data.forEach(d => {
            const monthStr = d.date.slice(0, 7) + "-01";
            monthData[monthStr] = (monthData[monthStr] || 0) + d.value;
        });
        return Object.entries(monthData).map(([date, value]) => ({ date, value }));
    };

    let currentView = dailyView;
    const updateView = (view) => {
        currentView = view;
        updateChart();
    };

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

    const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // .call(zoom);

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

    let bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.date); })
        .attr("y", function (d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.value); });

    d3.select("#add-entry").on("submit", function (event) {
        event.preventDefault();
        const addDate = document.querySelector("#add-date").value;
        const addPushups = Number(document.querySelector("#add-pushups").value);
        data.push({ date: addDate, value: addPushups });
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        updateChart();
        localStorage.setItem("pushupData", JSON.stringify(data));
    });

    d3.select("#delete-entry").on("submit", function (event) {
        event.preventDefault();
        const deleteDate = document.querySelector("#delete-date").value;
        data = data.filter(d => d.date !== deleteDate);
        updateChart();
        localStorage.setItem("pushupData", JSON.stringify(data));
    });

    function updateChart() {
        const viewData = currentView(data);
    
        x.domain(viewData.map(function (d) { return d.date; }));
        y.domain([0, d3.max(viewData, function (d) { return d.value; })]);
    
        bar = svg.selectAll(".bar")
            .data(viewData, d => d.date);
    
        bar.exit().remove();
    
        bar.enter().append("rect")
            .attr("class", "bar")
            .merge(bar)
            .attr("x", function (d) { return x(d.date); })
            .attr("y", function (d) { return y(d.value); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.value); });
    
        svg.selectAll(".axis--x").call(xAxis);
        svg.selectAll(".axis--y").call(yAxis);
        svg.selectAll(".grid").call(gridAxis);
    }    

    // Zoom buttons
    const viewLevels = [dailyView, weeklyView, monthlyView];
    let viewIndex = 0;
    document.getElementById("zoom-out").addEventListener("click", () => {
        viewIndex = Math.max(0, viewIndex - 1);
        updateView(viewLevels[viewIndex]);
    });
    document.getElementById("zoom-in").addEventListener("click", () => {
        viewIndex = Math.min(viewLevels.length - 1, viewIndex + 1);
        updateView(viewLevels[viewIndex]);
    });

}());
