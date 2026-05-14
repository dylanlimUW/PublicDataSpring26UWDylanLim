    //Declare consts/global variables
        const margin = 30;
        const width = 500; 
        const height = 500;


    //Load data and related variables
        d3.csv("iphone_sales_dataset.csv").then(data => {
            console.log("data", data)
        //format data
        data.forEach(d => { 
            d.iPhone_Model = d.iPhone_Model;
            d.Quantity = +d.Quantity; 
        });
        
        //Group sales by iPhone model and sum the quantity for each model
        const salesByModel = d3.rollup(
            data,
            v => d3.sum(v, d => d.Quantity),
            d => d.iPhone_Model
        ).map(d => ({ iPhone_Model: d[0], Quantity: d[1] }));
        
        const maxY = d3.max(salesByModel, d => d.Quantity);


    //Scales - note: band and linear
        const xScale = d3.scaleBand()
                        .domain(data.map(d => d.iPhone_Model))
                        .range([margin, width - margin])
                        .paddingInner(.1);
        
        const yScale = d3.scaleLinear()
                        .domain([0, maxY]) 
                        .range([height - margin, margin]);
        

    //SVG
        const svg = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

                    
    //Axes - create axes
        const bottomAxis = d3.axisBottom()
                             .scale(xScale);
        
        const leftAxis = d3.axisLeft()
                           .scale(yScale);
        

    //Bars
    //rect needs x, y, width, and height
        svg.selectAll("rect") 
            .data(salesByModel) 
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.model)) 
            .attr("y", d => yScale(d.quantity)) 
            .attr("width", xScale.bandwidth()) // note this is specific to using the bandscale as the scale calculates padding
            .attr("height", d => (height-margin) - yScale(d.quantity))
            .attr("fill", "pink");
        

    //Axes - call axes
        svg.append("g")
            .attr("transform", "translate(0," + (height - margin) + ")") 
            .call(bottomAxis);

        svg.append("g")
            .attr("transform", "translate(" + margin + ",0)")
            .call(leftAxis); 

                
    });