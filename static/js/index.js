document.addEventListener("DOMContentLoaded", () => {
    // Set SVG Style     
    document.querySelector("#svg").style.width = document.body.offsetWidth;
    document.querySelector("#svg").style.height = document.body.offsetHeight - 62;

    // State
    let draw = false;

    // Set elements
    let lines = [];
    let points = [];
    let svg = null;     
    let color = 'black';

    function render() {

        svg = d3.select("#svg");        
        
        const thicknessPicker = document.querySelector("#thickness-picker");

        // Thickness line update
        thicknessPicker.addEventListener('change', (event) => {         
            thicknessLine = document.querySelector("#thicknessLine");
            thicknessLine.setAttribute("stroke-width", event.target.value * 2);        
        });    
        
        svg.on("touchstart", function() {
            draw = true;

            const coords = d3.touches(this);             
            draw_point(coords[0][0], coords[0][1], false)
        });

        svg.on("touchend", function() {
            draw = false;
        });

        svg.on("touchmove", function() {
            if(!draw)
                return;

            const coords = d3.touches(this);             
            draw_point(coords[0][0], coords[0][1], true)
        });

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
                if(a.dataset.color == 'white') {
                    document.querySelector("#svg").style.cursor = 'cell';
                }

            }
        });

        if(document.body.offsetWidth <= 765) {
            thickness = document.querySelector("#thickness-picker2").value;
        } else {
            thickness = document.querySelector("#thickness-picker").value;
        }

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

    //Download Image
    document.querySelectorAll(".download-btn").forEach(a => {
        downloadBtn = a;
        downloadBtn.addEventListener('click', createImg);
    }); 

    function createImg() { 
        html2canvas(document.querySelector("#svg")).then(canvas => {
            document.body.appendChild(canvas);
            style = canvas.getAttributeNode("style")
            canvas.removeAttributeNode(style);
        });

        loader = document.querySelector("#loader");
        loader.classList.add('active');     
        loader.parentElement.style.display = 'block'; 

        myFunc = setTimeout(downloadImg, 3000);
    }
    function downloadImg() {
        canvas = document.querySelector("canvas");
         
        downloadBtn.href = canvas.toDataURL();
        downloadBtn.download = "myboard.png";

        downloadBtn.click();
        clearTimeout(myFunc);

        loader.classList.remove('active');
        loader.parentElement.style.display = 'none';
        
        return false;
    }
    
});

(function() {
    // ServiceWorker is a progressive technology. Ignore unsupported browsers
    if ('serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.');
    navigator.serviceWorker.register('sw.js').then(function() {
        console.log('CLIENT: service worker registration complete.');
    }, function() {
        console.log('CLIENT: service worker registration failure.');
    });
    } else {
    console.log('CLIENT: service worker is not supported.');
    }
}) ();