var user_id = "juthamas_rat"

d3.json("/egonetwork/data").then(function (data) {

    graph = data

    function zoomed() {
        container.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
    }

    var zoom = d3.zoom()
        .scaleExtent([0, 50])
        .on("zoom", zoomed);

    var width = $('.egograph').width(),
        height = $('.wrapper').height();

    var svg = d3.select("body").selectAll("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "xMaxYMin meet")
        .style("pointer-events", "all")
        .call(zoom)
        .on("wheel", function () { d3.event.preventDefault(); });

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().distance(10).strength(0.5))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var container = svg.append("g")
        .attr("class", "main_plate")

    var link = container.selectAll("line").data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", 1)
        .style("stroke", "#999999")
        .style("cursor", "default");

    var node = container.selectAll("circle").data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function (d) { return d3.interpolateRainbow(d.group / (group.length + 1)); })
        .on("click", function (d) {
            mouseout_node();
            mouseover_node(d);
        });

    var label = container.selectAll("text").data(graph.nodes)
        .enter().append("text")
        .attr("class", "node_label")
        .attr("font-size", 2)
        .style("fill-opacity", 0.1)
        .text(function (d) { return d.id; });

    simulation.force("link", d3.forceLink().id(function (d) { return d.id; }))
        .on("tick", ticked)
        .nodes(graph.nodes)
        .force("link").links(graph.links);

    function ticked() {
        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });

        label.attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; });
    }

    var mouseover_node = function (z) {

        var neighbors = {};
        neighbors[z.index] = true;

        link.filter(function (d) {
            if (d.source == z) {
                neighbors[d.target.index] = true
                return true
            } else if (d.target == z) {
                neighbors[d.source.index] = true
                return true
            } else {
                return false
            }
        })
            .style("stroke-opacity", 1)
            .style("stroke-width", 1)
            .style("stroke", "#FF0000");

        node.filter(function (d) { return neighbors[d.index] })
            .style("stroke-width", 3)
            .style("opacity", 1);

        node.filter(function (d) { return !neighbors[d.index] })
            .style("opacity", 0.5);

        label.filter(function (d) { return !neighbors[d.index] })
            .style("fill-opacity", 0.5);

        label.filter(function (d) { return neighbors[d.index] })
            .attr("font-size", 3)
            .style("fill-opacity", 1)

    };

    var mouseout_node = function () {
        link.style("stroke-opacity", 0.5)
            .style("stroke-width", 1)
            .style("stroke", "#999999");

        node.style("stroke-width", 1)
            .style("opacity", 1);

        label.attr("font-size", 2)
            .style("fill-opacity", 0.1)
    };

});