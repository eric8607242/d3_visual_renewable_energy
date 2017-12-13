var scale_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    scale_width = 1600 - scale_margin.left - scale_margin.right,
    scale_height = 400 - scale_margin.top - scale_margin.bottom,
    scale_radius = Math.min(scale_width, scale_height) / 2;

var scale_svg = d3.select("#scale")
    .append("svg")
    .attr("width", scale_width + scale_margin.left + scale_margin.right)
    .attr("height", scale_height + scale_margin.top + scale_margin.bottom)
    //.attr("transform", "translate(" + scale_width/8 + ",0)")
    .append("g").attr("transform", "translate(" + scale_width / 2 + "," + scale_height / 2 + ")");

var scale_color = d3.scaleOrdinal()
    .range(["#FF5511", "#FFFF33", "#5599FF", "	#00AA00"]);


var scale_arc = d3.arc()
    .outerRadius(scale_radius - 30)
    .innerRadius(scale_radius - 80);

var scale_pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.percent });

var scale;
var scale_data;
var scale_total=0;

d3.csv("./data/his_ele_cate.csv", function (d, i, columns) {
    return {
        year: +d.year,
        energy: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };

}, function (error, data) {
    scale_data = data;
    if (error) throw error;
    console.log(data[1].energy.length);
    for(i = 0 ; i < data[1].energy.length;i++){
        scale_total = scale_total+data[1].energy[i].percent;
    }
    scale_color.domain(data[1].energy.map(function (d) { return d.name; }));


    scale = scale_svg.selectAll(".arc")
        .data(function (d) { return scale_pie(data[1].energy); })
        .enter().append("g")
        .attr("class", "arc");

    scale_circle = scale.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", scale_radius - 85)
        .attr("fill", "white")
    var scale_text = scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "0em")
        .attr("font-size", "3em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    /*console.log(scale);
    console.log(pie(data[1].energy));*/
    scale.append("path")
        .attr("d", scale_arc)
        .style("fill", function (d) { return scale_color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            console.log(select_name)

            scale_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name === "fire") { return scale_color.range()[0]; }
                    else if (select_name === "nuclear") { return scale_color.range()[1] }
                    else if (select_name === "water") { return scale_color.range()[2] }
                    else if (select_name === "renewable") { return scale_color.range()[3] }
                })
            var select_value = d3.select(this).data()[0].value;
            var select_value_per = +((select_value/scale_total)*100);
            console.log(Math.round(select_value_per));

            scale_text.text(Math.round(select_value_per) + "%")
            //console.log(d3.select(this).data()[0].value);
            //console.log(select_value);
        })
        .on("mouseout", function (d) {
            scale_circle.attr("opacity", 0)
        });
})