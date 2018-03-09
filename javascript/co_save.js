var co_line_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    co_line_width = co_get_screen_width() - co_line_margin.left - co_line_margin.right,
    co_line_height = 300 - co_line_margin.top - co_line_margin.bottom;

function co_get_screen_width() {
    console.log(innerWidth)
    if (innerWidth < 800) {
        return innerWidth;
    }
    return 800;
}


var co_line_svg = d3.select("#co_save")
    .append("svg")
    .attr("width", co_line_width + co_line_margin.left + co_line_margin.right)
    .attr("height", co_line_height + co_line_margin.top + co_line_margin.bottom)
    .attr("transform", "translate(0,0)");


var co_line_g = co_line_svg.append("g").attr("transform", "translate(" + co_line_margin.left + "," + co_line_margin.top + ")");

var co_line_x = d3.scaleTime().range([0, co_line_width]),
    co_line_y = d3.scaleLinear().range([co_line_height, 0]);

var co_bisectDate = d3.bisector(function (d) { return d.year; }).left;

var co_line = d3.line()
    .x(function (d) { return co_line_x(d.year); })
    .y(function (d) { return co_line_y(d.co); });

var co_line_move;
var co_data;
var co_text_year;
var co_text_save;
var co_text_tree_1;

d3.csv("./data/energy_type.csv", function (d) {
    d.year = +d.year;
    if (d.year == 97) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.557 / 1000 / 100000;
    } else if (d.year == 98) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.543 / 1000 / 100000;
    } else if (d.year == 99) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.535 / 1000 / 100000;
    } else if (d.year == 100) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.536 / 1000 / 100000;
    } else if (d.year == 101) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.532 / 1000 / 100000;
    } else if (d.year == 102) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.522 / 1000 / 100000;
    } else if (d.year == 103) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.521 / 1000 / 100000;
    } else if (d.year == 104) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.528 / 1000 / 100000;
    } else if (d.year == 105) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.529 / 1000 / 100000;
    }

    return d;
}, function (error, data) {

    co_data = data;
    co_line_x.domain(d3.extent(data, function (d) { return d.year; }));
    co_line_y.domain([0, d3.max(data, function (d) {
        return Math.max(d.co);
    })])

    create_x_axis(co_line_g, co_line_x, co_line_height)
    create_y_axis(co_line_g, co_line_y)

    co_line_g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "0.7em")
        .attr("font-size", "90%")
        .attr("text-anchor", "end")
        .text("單位(十萬公噸)");
    co_line_g.append("text")
        .attr("transform", "translate(-10,2)")
        .attr("dy", "27.5em")
        .attr("font-size", "60%")
        .attr("text-anchor", "end")
        .text("年");

    co_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "co_line")
        .attr("stroke", "#FF5511")
        .attr("stroke-width", 2.5)
        .attr("d", co_line);

    co_circle = co_line_g.selectAll("co-line-circle")
        .data(data)
        .enter();

    co_circle.append("circle")
        .attr("r", 4)
        .attr("cx", function (d) { return co_line_x(d.year); })
        .attr("cy", function (d) { return co_line_y(d.co); });
    

    var co_info = co_line_g.append("rect")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("x", co_line_width *0.8)
        .attr("y", 80)
        .attr("width", co_line_width *0.2)
        .attr("height", 150)
        .attr("opacity", 0.3)
        .attr("fill", "lightgray")
        .style("stroke", "black")
        .style("stroke-width", "5px")
    function create_text(create_g, create_dy, create_size, create_trans, create_content) {
        return_text = create_g.append("text")
            .attr("transform", create_trans)
            .attr("dy", create_dy)
            .attr("font-size", create_size)
            .style("text-anchor", "middle")
            .style("fill", "black")
            .text(create_content);
        return return_text
    }
    co_text_year = create_text(co_line_g, "2em", "1.2em", "translate(625,70)", "民國97年")
    co_text_save_1 = create_text(co_line_g, "2em", ".85em", "translate(625,100)", "節省的CO2達")
    co_text_save = create_text(co_line_g, "2em", "1em", "translate(625,115)", data[0].co.toFixed(2) + "十萬公噸")
    co_text_tree = create_text(co_line_g, "2em", "0.8em", "translate(625,140)", "造林效益相當於")

    var park = data[0].co * 100000 / 25.894;
    co_text_tree_1 = create_text(co_line_g, "2em", "1.1em", "translate(625,155)", park.toFixed(2) + "座")
    co_text_tree_2 = create_text(co_line_g, "2em", "0.8em", "translate(625,180)", "大安森林公園")

    co_line_move = co_line_g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", co_line_height)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);
    var co_touch_rect = co_line_g.append('rect')
        .attr('width', co_line_width) // can't catch mouse events on a g element
        .attr('height', co_line_height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on("mouseover", function (d) {
            for (i = 0; i < stack_data.length; i++) {
                if (d3.mouse(this)[0] < x(97 + i) + 10 && d3.mouse(this)[0] > x(97 + i) - 10) {
                    stack_bar_change(i)
                }
            }
            date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);

            line_move(co_line_move, d3.mouse(this)[0]);
            line_move(stackarea_line_move, d3.mouse(this)[0]);

        })
        .on("mousemove", function (d) {
            for (i = 0; i < stack_data.length; i++) {
                if (d3.mouse(this)[0] < x(97 + i) + 10 && d3.mouse(this)[0] > x(97 + i) - 10) {
                    stack_bar_change(i)
                }
            }
            for (i = 0; i < stack_data.length; i++) {
                if (d3.mouse(this)[0] < co_line_x(97 + i) + 10 && d3.mouse(this)[0] > co_line_x(97 + i) - 10) {
                    var year = 97 + i
                    park = data[i].co * 100000 / 25.894;

                    co_text_year.text("民國" + year + "年")
                    co_text_save.text(data[i].co.toFixed(2) + "十萬公噸")
                    co_text_tree_1.text(park.toFixed(2) + "座")
                }
            }

            date_x = co_bisectDate(data, co_line_x.invert(d3.mouse(this)[0]), 0);

            line_move(co_line_move, d3.mouse(this)[0]);
            line_move(stackarea_line_move, d3.mouse(this)[0])
        })
})

