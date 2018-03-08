# --------------------------------
# IGN API scraper           -
# Copyright (C) 2018 GameFrame   -
# --------------------------------
from ratelimit import rate_limited
from codecs import open

import requests
import os
import json

import sys
sys.path.append(os.path.abspath('app'))
from orm import Game, Developer, Article

"""
The API key
"""
API_KEY = os.environ['KEY_IGN']

@rate_limited(period=40, every=60)
def rq_articles_from_keyword(keyword):
    """
    Request article metadata using IGN's API
    """
    print("[IGN ] Downloading article metadata for keyword: %s" % keyword)
	
	url = "https://newsapi.org/v2/everything?q=%s&apiKey=%s" % (keyword, API_KEY)
	response = requests.get(url)
	
	assert response.status_code == requests.codes.ok
	return response.json()

def populate_articles_for_games(db):
    """
    Insert articles related to the list of games into the database.
    """

    counter = 0

    for game in Game.query.all():
        articles_json = rq_articles_from_keyword(game.name)
		lst = articles_json["articles"]
		for i in lst:
		
		    counter += 1
			article = Article()

			article.title = i["title"]
			article.outlet = i["sources"]["name"]
			article.introduction = i["description"]
			article.author = i["author"]
			article.timestamp = i["publishedAt"] # TODO Parse the date
			article.image = i["urlToImage"]
			article.article_link = i["url"]
			
			game.articles.append(article)
			article.games.append(game)
				
			print("Uploading articles for game (%s): %s" %
				(game.name, game.name.encode('utf-8', 'ignore')))

			db.session.add(article)
			db.session.commit()

    print("[IGN ] Inserted %d new articles for %s" % counter, game.name)