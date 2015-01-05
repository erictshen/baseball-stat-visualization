
var $slider = $("#slider"),
    playButton = d3.select("div#play"),
    year,
    interval;

d3.json("data.json",function(err,bins){
  
    //initializes the necessary constants for the chart.
    var cell = doCellSizing(),
        width = cell*18+1,
        height = cell*15+1,
        margin = {top: cell+20, right: 0, bottom: 36, left: 50},
        currentYear = 1900;

    d3.select("div.container").style("width",(width+margin.left+margin.right)+"px");

    d3.select("div.container-outer").style("width",(width+margin.left+margin.right+20)+"px");

    $slider.css("width",(width+margin.left+margin.right-151)+"px");

    //generates x and y coordinates
    var x = d3.scale.ordinal()
      .domain(d3.range(0,360,20))
      .rangeBands([0,width],0.05);

    var y = d3.scale.ordinal()
      .domain(d3.range(0,300,20).reverse())
      .rangeBands([0,height],0.05);

    //initializes color ranges
    var color = d3.scale.quantize()
      .domain([0,6])
      // .range(["#ffffff","#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"]);
      // .range(["#ffffff","#fee0d2","#fc9272","#ef3b2c","#cb181d","#99000d"])
      .range(["#ffffff", "#cccccc", "#999999", "#666666", "#333333", "#000000"])

    //initializes the axes
    var xAxis = d3.svg.axis()
      .scale(x)
      .tickValues(x.domain().filter(function(d){
        return d % 20 == 0;
      }))
      .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues(y.domain().filter(function(d){
          return d % 20 == 0;
        }))
        .orient("left");

    //initializes chart
    var svg = d3.select("div.chart").append("svg")
        .attr("width", width+margin.left+margin.right)
        .attr("height", height+margin.top+margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //initializes cells in the chart
    var bg = svg.append("rect")
      .attr("class","bg")
      .attr("x",0)
      .attr("y",0)
      .attr("width",width)
      .attr("height",height);

    //fills in correct values for each cell, given the data
    var rects = svg.selectAll("rect.cell")
      .data(bins[currentYear])
      .enter()
      .append("rect")
        .attr("class","cell")
        .attr("x",function(d){
          return x(d.sb);
        })
        .attr("y",function(d){
          return y(d.hr);
        })
        .attr("width",x.rangeBand())
        .attr("height",y.rangeBand())
        .style("fill",function(d){
          return color(d.total);
        });

    svg.append("rect")
      .attr("class","chart-title-background")
      .attr("x",width-81-1)
      .attr("y",height-47)
      .attr("width",81)
      .attr("height",47);

    svg.append("text")
      .attr("class","chart-title year")
      .text(currentYear)
      .attr("x",width)
      .attr("y",height)
      .attr("dx","-0.3em")
      .attr("dy","-0.4em");

    //renders x-axis and y-axis, and adds the axis titles
    var gx = svg.append("g")
      .attr("class","x axis")
      .attr("transform","translate(0,"+height+")");

    gx.call(xAxis);

    gx.append("text")
      .text("Stolen Bases")
      .attr("y",margin.bottom)
      .attr("class","axis-label")
      .attr("x",width/2)
      .attr("dy","-2px");

    var gy = svg.append("g")
      .attr("class","y axis")
    
    gy.call(yAxis);

    gy.append("text")
      .text("Home Runs")
      .attr("y",height/2)
      .attr("class","axis-label")
      .attr("x",12-margin.left)
      .attr("transform","rotate(-90 "+(12-margin.left)+" "+(height/2)+")");

    // creates the legend for the visualization
    var legend = svg.append("g")
      .attr("class","legend")
      .attr("transform","translate(" + (width - (cell*6*2) - 5) + "," + (-margin.top) + ")");

    var swatches = legend.selectAll("g")
      .data(color.range())
      .enter()
      .append("g");

    //fills in the colors of the legend correctly
    swatches.append("rect")
      .attr("width",cell*2)
      .attr("height",cell)
      .style("fill",function(d){
        return d;
      })
      .attr("x",function(d,i){
        return (i*cell*2);
      })
      .attr("y",0);

    // adds the text labels
    swatches.append("text")
      .attr("x",function(d,i){
        return cell*2*i + 2;
      })
      .text(function(d,i){
        return i;
      })
      .style("font-size",(cell <= 20 ? "10px" : "12px"))
      .attr("y",cell+10);

    // creates the slider and initializes it
    $slider.noUiSlider({
      start: 1900,
      range: {
        'min': 1900,
        'max': 2013
      },
      connect: "lower",
      step: 1
    });

    $("div.noUi-handle").append('<span class="year">1900</div>');

    year = d3.selectAll(".year");

    // slider click listener (stops animation when dragged, and sets it to the proper year)
    $slider.on("slide click",function(e){
      stop();
      currentYear = +$(this).val();
      updateYear(currentYear);
    });

    // playButton that toggles between starting and stopping
    playButton.datum(false).on("click",function(d){
      if (d) stop();
      else start();
    });

    d3.select("div.controls").style("display","block");

    // starts the slider! (For the first time)
    start();

    // starts the slider up so that it will step through the years.
    function start() {

      clearInterval(interval);

      playButton.datum(true).text("STOP");

      update();

      interval = setInterval(update,250);

    }

    //stops the slider.
    function stop() {
      clearInterval(interval);

      playButton.datum(false).text("PLAY");
    }

    //updates the plot to reflect the current year. wraps around if necessary
    function update() {

      currentYear++;
      if (currentYear > 2013) currentYear = 1900;

      updateYear(currentYear);

    }

    //updates the plot for the passed in year parameter. Also advances the slider
    function updateYear(yr) {

      rects.data(bins[yr])
        .style("fill",function(d){
          return color(d.total);
        });

      year.text(yr);
      $slider.val(yr);

    }

    function doCellSizing() {
      if (window.innerWidth > 700) {
        return 25;
      }
      return 20;
    }

});