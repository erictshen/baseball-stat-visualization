import urllib, urllib2
import json
 
# base_url = "http://mlb.mlb.com/stats/sortable.jsp#elem=%5Bobject+Object%5D&tab_level=child&click_text=Sortable+Team+hitting&game_type='R'&season={0}&season_type=ANY&league_code='MLB'&sectionType=st&statType=hitting"  
# base_url = "http://sports.yahoo.com/mlb/stats/byteam?cat=Overall&cut_type=0&sort=722&conference=MLB&year=season_{0}"
# base_url = "http://espn.go.com/mlb/stats/team/_/stat/batting/year/{0}"

START_YEAR = 1900
END_YEAR = 2013

STOLEN_BASES_BUCKETS = 18
HOME_RUNS_BUCKETS = 15
STOLEN_BASES_BUCKET_SIZE = 20
HOME_RUNS_BUCKET_SIZE = 20
base_url = "http://mlb.mlb.com/lookup/json/named.team_hitting_season_leader_master.bam?season={0}&sort_order=%27desc%27&sort_column=%27avg%27&game_type=%27R%27&sport_code=%27mlb%27&recSP=1&recPP=50"
def gen_url(year): 
    return base_url.format(year) 
 

def get_baseball_stats():
    data_dict = {}
    for year in range(START_YEAR, END_YEAR + 1):
        # print str(year)
        data_dict[str(year)] = get_baseball_stats_year(year, gen_url(year))    
    # print json.JSONEncoder().encode(data_dict)    
    f = open('data.json', 'w')
    f.write(json.JSONEncoder().encode(data_dict))
    f.close()

def get_baseball_stats_year(year, url):
    response = urllib.urlopen(url)
    html = response.read()
    json_object = convert(json.loads(html))
    # print json_object
    # data = json_object[unicode("team_hitting_season_leader_master")][unicode(quer)]
    # print data[unicode("team_hitting_season_leader_master")]
    data = json_object["team_hitting_season_leader_master"]["queryResults"]["row"]
    year_dict = []
    data_matrix = [[0 for i in range(HOME_RUNS_BUCKETS)] for j in range(STOLEN_BASES_BUCKETS)]
    # data_matrix = [[[] for i in range(HOME_RUNS_BUCKETS)] for j in range(STOLEN_BASES_BUCKETS)]
    for team in data:
    	stolen_bases = team['sb']
    	home_runs = team['hr']
    	team_name = team['team_full']
    	stolen_bases_index = int(stolen_bases) // STOLEN_BASES_BUCKET_SIZE
    	home_runs_index = int(home_runs) // HOME_RUNS_BUCKET_SIZE
    	data_matrix[stolen_bases_index][home_runs_index] += 1
    	# data_matrix[stolen_bases_index][home_runs_index].append(team_name)

    	# data_matrix[stolen_bases_index][home_runs_index].append({"name":team_name,"sb":stolen_bases,"hr":home_runs})

    	# print data_matrix[17]

    for i in range(STOLEN_BASES_BUCKETS):
    	for j in range(HOME_RUNS_BUCKETS):
    		# year_dict.append({'sb':i*STOLEN_BASES_BUCKET_SIZE, 'hr':j*HOME_RUNS_BUCKET_SIZE, 'total':len(data_matrix[i][j]), 'teams':data_matrix[i][j]})
            year_dict.append({'sb':i*STOLEN_BASES_BUCKET_SIZE, 'hr':j*HOME_RUNS_BUCKET_SIZE, 'total':data_matrix[i][j]})
            if data_matrix[i][j] > 4:
                print data_matrix[i][j]
    return year_dict
    # print json.JSONEncoder().encode(year_dict)

def convert(input):
    if isinstance(input, dict):
        return {convert(key): convert(value) for key, value in input.iteritems()}
    elif isinstance(input, list):
        return [convert(element) for element in input]
    elif isinstance(input, unicode):
        return input.encode('utf-8')
    else:
        return input

get_baseball_stats()
