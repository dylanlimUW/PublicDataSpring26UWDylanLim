        //1. Consts/global variables  
            const w = 500;
            const h = 500;
            const margin = 50; 

        //2. Dummy Data and related variables for max x & y
            const data = [
            [200, 40], [170, 100], 
            [400, 60], [100, 150], 
            [410, 300], [120, 220], 
            [310, 260], [400, 110], 
            [500,90], [270, 600], 
            [530, 380], [475, 475]
            ];

            const maxX = d3.max(data, d => d[0]);            
            const maxY = d3.max(data, d => d[1]);
            
            console.log("data", data);
    

        //3. Scales        
            const xScale = d3.scaleLinear()
                             .domain([0, maxX]) 
                             //.domain([0, 700])
                             .range([margin, w-margin]); // don't forget the ; !!! 

            const yScale = d3.scaleLinear()
                            .domain([0, maxY])
                            //.domain([0, 700])
                            .range([h-margin, margin]); 

        //4. Create Axes 
        /*Each axis needs the relevant scale & any ticks.
        To implement: you will also need to actually call it!*/
            
            const bottomAxis = d3.axisBottom()
                                .scale(xScale)
                                //.tickValues([0, 100, 300, 500]);
                                .ticks(10);


            const leftAxis = d3.axisLeft()
                             .scale(yScale)
                             //.tickValues([0, 100, 300, 600]);
                             .ticks(10); 
            


        //5. SVG             
            const svg = d3.select("body")
                        .append("svg")
                        .attr("width", w) 
                        .attr("height", h);


        //6. Circles 
        //Circles need cx, cy, and r
            svg.selectAll("circle") 
                .data(data) 
                .enter()
                .append("circle") 
                .attr("cx", d => xScale(d[0])) 
                .attr("cy", d => yScale(d[1])) 
                .attr("r", 6) 
                .attr("fill", "pink"); 


        //7. Call Axes 
            svg.append("g")
                .attr("transform", "translate(0," + (h -margin) + ")") //this makes the axis appear at the bottom of the chart--pushes it down to the bottom
                .call(bottomAxis); // now we are calling our the bottomAxis function that we generated above

            svg.append("g")
                 .attr("transform", "translate(" + margin + ",0)") //this makes the axis appear at the left of the chart--and includes the margin so we can see it.
                 .call(leftAxis); // now we are calling our the leftAxis function that we generated above