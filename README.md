baseball-stat-visualization
===========================

Live Demo : <a href="http://ericshen.com/projects/baseball-visualization/visualization.php">Team Stolen Bases vs. Home Runs Over Time</a>

When keeping up with Hacker News, I came across this <a href="http://noahveltman.com/nflplayers/">visualization</a> by <a href="http://noahveltman.com">Noah Veltman</a>, comparing height and weight of NFL players over time. This visualization inspired me to come up with some visualization of my own. As an ardent baseball fan, one trend that I have always heard about was whether the stolen base was losing significance because of the emphasis on hitting homeruns. So, I decided to make a visualization for stolen bases verses homeruns over time, using Noah's template.

In this repo, there are 2 main things. First off are the files for the visualization. visualization.html is the actual visualization, and when opened in a web browser, it should run the visualization (note : there might be an error running it locally due to the Same Origin Policy [Works in Firefox last time I checked though]). visualization.html stores its dependencies in the index_files directory, with its main dependencies being the JQuery UI slider and d3.js. When the visualization actually runs, it first of all calls visualization.js, which then loads the data from data.json, and finally renders the graph using d3.js.

In addition to the visualization itself, there is a scraper which I used to collect and format the data. I used data from the <a href="http://mlb.mlb.com/stats/">MLB Website</a> for the visualization. Running this scraper (use python baseball_scraper.py), and it'll generate the relevant json file.

All in all, I would like to credit Noah Veltman for providing both the template and also the inspiration for this visualization. I would also like to credit the MLB and their website for the data.