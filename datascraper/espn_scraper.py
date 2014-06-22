# This is a basic scraper for baseball stats from ESPN. It will find the team name and the
# total number of homeruns that a team had over the season.
# Ultimately decided not to pursue this further b/c MLB returns data in very nice JSON format
# @author Eric

from bs4 import BeautifulSoup
import urllib, urllib2
 
base_url = "http://espn.go.com/mlb/stats/team/_/stat/batting/year/{0}"
def gen_url(year): 
    return base_url.format(year) 
 
#get request 
def get_baseball_stats(url): 
    response = urllib.urlopen(url)
    html = response.read()
    # print html 
    soup = BeautifulSoup(html) 

    #gets all the table rows (each table row corresponds to a baseball team)
    table_rows = soup.find_all("tr")[2:-4]
    for table_row in table_rows:
        table_entry = table_row.find_all("td")
        # gets the team_name, if else is needed b/c sometimes team name is in <a> tag, sometimes it is not
        team_name = table_entry[1].find("a")
        if team_name == None:
            team_name = table_entry[1].contents[0]
        else:
            team_name = table_entry[1].find("a").contents[0]
        home_runs = table_entry[8].contents[0]
        print "Name: " + str(team_name) + ", Home Runs: " + str(home_runs)

print gen_url(2006)
get_baseball_stats(gen_url(2003))