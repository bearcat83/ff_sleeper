import requests
import json
import os
import pandas as pd

def getUsers(league_id):
    url = f'https://api.sleeper.app/v1/league/{league_id}/users'
    response = requests.get(url)
    json_response = json.loads(response.text)
    return json_response

def getRosters(league_id):
    url = f'https://api.sleeper.app/v1/league/{league_id}/rosters'
    response = requests.get(url)
    json_response = json.loads(response.text)
    return json_response

def getNFLstate(sport):
    url = f'https://api.sleeper.app/v1/state/{sport}'
    response = requests.get(url)
    json_response = json.loads(response.text)
    return json_response

def getMatchups(league_id, week):
    url = f'https://api.sleeper.app/v1/league/{league_id}/matchups/{week}'
    response = requests.get(url)
    json_response = json.loads(response.text)
    return json_response


id = 995076504847437824
sport = 'nfl'

nfl_state = getNFLstate(sport)

week = 1 #will need to loop here

user_list = getUsers(id)
roster_list = getRosters(id)
matchup_list = getMatchups(id, week)

user_list2 = pd.DataFrame(user_list)
roster_list2 = pd.DataFrame(roster_list)
matchup_list2 = pd.DataFrame(matchup_list)

user_list2.to_excel(r'/Users/<user>/Desktop/user_list_ff.xlsx', index=False)
roster_list2.to_excel(r'/Users/<user>/Desktop/roster_list.xlsx', index=False)   
matchup_list2.to_excel(r'/Users/<user>/Desktop/matchup_list.xlsx', index=False)
