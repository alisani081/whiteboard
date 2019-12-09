document.addEventListener("DOMContentLoaded", () => {
    // State
    let draw = false;

    // Set elements
    let lines = [];
    let points = [];
    let svg = null;
    let color = 'black';

    function render() {

        svg = d3.select("#svg");

        
        showLine = d3.select(".thickness");

        // Create nav thickness line 
        showLine.append('line')
                .attr('x1', 0)
                .attr('y1', 5)
                .attr('x2', 500)
                .attr('y2', 5)  
                .attr('stroke-width', 1)              
                .style('stroke', 'black');

        document.querySelector("#thickness-picker").onchange = function() {
            showLine.append('line')
                .attr('x1', 0)
                .attr('y1', 5)
                .attr('x2', 500)
                .attr('y2', 5)  
                .attr('stroke-width', this.value * 2)              
                .style('stroke', 'black');
        };        

        svg.on("mousedown", function() {
            draw = true;

            const coords = d3.mouse(this);
            draw_point(coords[0], coords[1], false)
        });

        svg.on("mouseup", function() {
            draw = false;
        });

        svg.on("mousemove", function() {
            if(!draw)
                return;

            const coords = d3.mouse(this);
            draw_point(coords[0], coords[1], true);
        });

        document.querySelector("#erase").onclick = () => {
            const cfm = confirm('Are you sure, you want to erase?');

            if (cfm) {
                // Remove points
                for (i = 0; i < points.length; i++) {
                    points[i].remove();
                }

                // Remove Lines
                for (i = 0; i < lines.length; i++) {
                    lines[i].remove();
                }
                points = [];
                lines = [];
            }            
        }
    }    

    // Draw points 
    function draw_point(x, y, connect) {        

        // Get color 
        document.querySelectorAll(".color-picker").forEach(a => {
            a.onclick = () => {
                color = a.dataset.color;
            }
        });

        const thickness = document.querySelector("#thickness-picker").value;

        if(connect) {
            const last_point = points[points.length - 1];
            const line = svg.append('line')
                            .attr('x1', last_point.attr('cx'))
                            .attr('y1', last_point.attr('cy'))
                            .attr('x2', x)
                            .attr('y2', y)
                            .attr('stroke-width', thickness * 2)
                            .style('stroke', color);

            lines.push(line);
        }

        const point = svg.append('circle')
                         .attr('cx', x)
                         .attr('cy', y)
                         .attr('r', thickness)
                         .style('fill', color);

        points.push(point);
    }        

    render();
});