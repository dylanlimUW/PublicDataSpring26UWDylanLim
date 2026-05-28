//Consts/global variables  
            const w = 900;
            const h = 500;
            const margin = 50;
            const parseTime = d3.timeParse("%Y-%m-%d");

            //Data: iPhone sales dataset
            d3.csv("iphone_sales_dataset.csv").then(data => {
            console.log("data", data);

                data.forEach(d => { 
                d.Sale_Date = parseTime(d.Sale_Date);
                d.Quantity = +d.Quantity;
                d.Price = +d.Price;
                });

            //Group data by sale date
            const salesByDate = d3.rollups(
                data,
                v => ({
                    quantity: d3.sum(v, d => d.Quantity),
                    orders: v.length,
                    avgPrice: d3.mean(v, d => d.Price)
                }),
                d => d.Sale_Date
            ).map(d => ({
                date: d[0],
                quantity: d[1].quantity,
                orders: d[1].orders,
                avgPrice: d[1].avgPrice
            }));

            salesByDate.sort((a, b) => a.date - b.date);

            //Scales - with Scale Time
            const xScale = d3.scaleTime()
                            .domain(d3.extent(salesByDate, d => d.date)) 
                            .range([margin, w - margin]); 

            const yScale = d3.scaleLinear()
                            .domain([0, d3.max(salesByDate, d => d.quantity)]) 
                            .range([h - margin, margin]); 

            const priceScale = d3.scaleLinear()
                            .domain([0, d3.max(salesByDate, d => d.avgPrice)])
                            .range([h - margin, margin]);

                
            //Bottom axis with tick time formatting
            const bottomAxis = d3.axisBottom()
                                .scale(xScale)
                                .tickFormat(d3.timeFormat("%b %d"));

            //Left axis
            const leftAxis = d3.axisLeft()
                            .scale(yScale);

            const rightAxis = d3.axisRight()
                            .scale(priceScale);

            //SVG
            const svg = d3.select("body")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

            //Line generator for quantity sold
            const quantityLine = d3.line()
                                    //.curve(d3.curveStepAfter)
                                    .curve(d3.curveBasis)
                                    //.curve(d3.curveNatural)
                                    .x(d => xScale(d.date))
                                    .y(d => yScale(d.quantity));

            //Line generator for number of orders
            const ordersLine = d3.line()
                                //.curve(d3.curveStepAfter)
                                .curve(d3.curveBasis)
                                //.curve(d3.curveNatural)
                                .x(d => xScale(d.date))
                                .y(d => yScale(d.orders));

            //Line generator for average price
            const avgPriceLine = d3.line()
                                //.curve(d3.curveStepAfter)
                                .curve(d3.curveBasis)
                                .x(d => xScale(d.date))
                                .y(d => priceScale(d.avgPrice));

            //Quantity line
            svg.append("path")
                .data([salesByDate])
                .attr("d", quantityLine)
                .attr("id", "quantityLine")
                .attr("class", "line quantity-line");

            //Orders line
            svg.append("path")
                .data([salesByDate])
                .attr("d", ordersLine)
                .attr("id", "ordersLine")
                .attr("class", "line orders-line")
                .style("opacity", 0); //Start with avg price line hidden

            //Average price line
            svg.append("path")
                .data([salesByDate])
                .attr("d", avgPriceLine)
                .attr("id", "avgPriceLine")
                .attr("class", "line avg-price-line")
                .style("opacity", 0); //Start with avg price line hidden

            //Call axes
            svg.append("g")
                .attr("class", "axis") 
                .attr("transform", "translate(0," + (h - margin) + ")") 
                .call(bottomAxis);    

            svg.append("g")
                .attr("class", "axis") 
                .attr("transform", "translate(" + margin + ",0)")
                .call(leftAxis);

            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (w - margin) + ",0)")
                .call(rightAxis);

            svg.selectAll(".axis:last-of-type path, .axis:last-of-type line")
                .style("stroke", "orange");

            svg.selectAll(".axis:last-of-type text")
                .style("fill", "orange");

            //X axis label
            svg.append("text")
                .attr("x", w / 2)
                .attr("y", h - 10)
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .text("Sale Date");

            //Y axis label
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -h / 2)
                .attr("y", 25)
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .text("Sales Volume Metrics (Left Axis)");

            //Right axis for average price
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -h / 2)
                .attr("y", w - 5)
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .text("Average Price (Right Axis)");

            //Graph title
            svg.append("text")
                .attr("x", w / 2)
                .attr("y", margin / 2)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .text("iPhone Sales January 2025 - April 2025");
            
            //Legend

            //Blue line sample
            svg.append("line")
                .attr("x1", w - 180)
                .attr("x2", w - 150)
                .attr("y1", 40)
                .attr("y2", 40)
                .style("stroke", "steelblue")
                .style("stroke-width", 3);

            //Blue label
            svg.append("text")
                .attr("x", w - 140)
                .attr("y", 45)
                .style("font-size", "12px")
                .text("Quantity Sold");


            //Pink line sample
            svg.append("line")
                .attr("x1", w - 180)
                .attr("x2", w - 150)
                .attr("y1", 65)
                .attr("y2", 65)
                .style("stroke", "pink")
                .style("stroke-width", 3);

            //Pink label
            svg.append("text")
                .attr("x", w - 140)
                .attr("y", 70)
                .style("font-size", "12px")
                .attr("id", "ordersLabel")
                .text("Number of Orders");

            //Orange line sample
            svg.append("line")
                .attr("x1", w - 180)
                .attr("x2", w - 150)
                .attr("y1", 90)
                .attr("y2", 90)
                .style("stroke", "orange")
                .style("stroke-width", 3);

            //Orange label
            svg.append("text")
                .attr("x", w - 140)
                .attr("y", 95)
                .style("font-size", "12px")
                .text("Average Price");

            //Dropdown interaction
            d3.select("#metricSelect").on("change", function() {
                const selected = this.value;
                d3.select("#quantityLine")
                    .transition()
                    .duration(700)
                    .style("opacity", selected === "quantity" || selected === "all" ? 1 : 0);

                d3.select("#ordersLine")
                    .transition()
                    .duration(700)
                    .style("opacity", selected === "orders" || selected === "all" ? 1 : 0);

                d3.select("#avgPriceLine")
                    .transition()
                    .duration(700)
                    .style("opacity", selected === "avgPrice" || selected === "all" ? 1 : 0);
                });
            });
            