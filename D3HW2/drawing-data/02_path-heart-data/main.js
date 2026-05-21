        //Consts, including our heart path command points     
        const svgW = 800;
        const svgH = 600;
        const heart = ["M100,100 C100,50 175,75 148.5,115 L100,175 L50.5,115 C25,75 100,50 100,100"];
        const size = 150;
        const sizeY = 100;

        
        //Load data and related variables
        d3.csv("heart-data.csv").then(data => {
              console.log("data", data)
          //format data
          data.forEach(d => { 
              d.day = d.day;
              d.love = +d.love; 
          });

        const maxData = d3.max(data, d=>d.love);
        const minData = d3.min(data, d=>d.love);
        const rowLength = data.length;//
        //const rowLength = 3;// what if we wanted to make a grid?

        const myColor = d3.scaleLinear()
                          .domain([minData, maxData])
                          .domain([0, maxData])
                          .range(["white", "red"]);
        
        //Learn about color scales in the HW
        /*const myColor = d3.scaleSequential()
                          .domain([minData, maxData])
                          .interpolator(d3.interpolateGreens);
                          //.domain([0, maxData])
                          //.range(["white", "red"]);*/
        
        //scale ordinal is only included here to show how implement it
        /*const  myColor = d3.scaleOrdinal().domain(data)
                                          .range(d3.schemeSpectral[7]);*/

        //SVG
        const svg = d3.select("body")
                .append("svg")
                .attr("width", svgW) 
                .attr("height", svgH);

        //group    
        const g = svg.selectAll("g")//our group! 
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("transform", (d,i)=>{
                          const x = (i % rowLength) * size; 
                          const y = (Math.floor(i/rowLength)+1) * sizeY;
                          console.log("xy", [x,y])
                          return "translate(" + [x,y] + ")";})
        //hearts                  
        g.append("path")
        .attr("d", heart)
        .attr("fill", d=> myColor(d.love))//here we are applying color with .attr("fill")
        .attr("class", "hearts"); 


        //labels
        g.append("text")
        .attr("x", size/2 + 20) //x coordinate
        .attr("y", size + 40) //y coordinate
        .attr("dy", "5px") //y coordinate offset
        .attr("class", "labels") 
        .text(d=>d.day); //the text 

        });  