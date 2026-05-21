//Consts/global variables  
            const w = 500;
            const h = 500;
            const margin = 50;
            const parseTime = d3.timeParse("%Y-%m");//time parser

            /* Data (2023 monthly summarized weather data for
            "NY-Central Park" area. Includes avg, max, min temps.
            Source: NWS, https://www.weather.gov/wrh/Climate?wfo=okx)*/
            
            d3.csv("nyc-2023.csv").then(data => {
            console.log("data", data)
                
                data.forEach(d => { 
                d.date = parseTime(d.date);//parse this time data
                d.max = +d.max;
                d.min = +d.min;
                d.avg = +d.avg;    
                });
            
            //scales - with Scale Time
            const xScale = d3.scaleTime()
                             .domain(d3.extent(data, d => d.date)) 
                             .range([margin, w-margin]); 

            const yScale = d3.scaleLinear()
                             .domain([0, d3.max(data, d => d.avg)]) 
                             .range([h-margin, margin]); 



            //bottom axis with tick time formatting
            const bottomAxis = d3.axisBottom()
                                .scale(xScale)
                                .tickFormat(d3.timeFormat("%b"));
                                //.tickFormat(d3.timeFormat("%b-%Y"))
                                //.ticks(d3.timeMonth.every(2));
                                //.ticks(4);
             

            //left axis
            const leftAxis = d3.axisLeft()
                             .scale(yScale);
                             //.ticks(4);
            
            
            //SVG
            const svg = d3.select("body")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);


            //line generator with optional curves
            const line = d3.line()
                            //.curve(d3.curveStepAfter)
                            //.curve(d3.curveBasis)
                            //.curve(d3.curveNatural)
                            .x(d=>xScale(d.date))
                            .y(d=>yScale(d.avg));
           
            //line
            svg.append("path")
                .data([data])
                .attr("d", line)
                //.attr("d", line(data))
                .attr("class", "line")
                //.style("stroke", "green");//note this example of inline styling vs CSS
                console.log("path",line(data))
            
            //call axes
            
            svg.append("g")
                .attr("class", "axis") 
                .attr("transform", "translate(0," + (h-margin) + ")") 
                .call(bottomAxis);    

            
            svg.append("g")
               .attr("class", "axis") 
               .attr("transform", "translate(" + margin + ",0)")
               .call(leftAxis);

            });