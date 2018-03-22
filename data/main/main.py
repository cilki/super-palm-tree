# --------------------------------
# GameFrame API scraper          -
# Copyright (C) 2018 GameFrame   -
# --------------------------------

import os
import sys
from signal import SIGINT, signal
from time import time

from flask import Flask

from aws import upload_image
from common import METRICS
from sources import igdb, newsapi, steam
from orm import db
from util import reset, trim


def sigint_handler(sig, frame):
    """
    SIGINT handler which prints run metrics and exits
    """
    print("\nRun Metrics:\n%s" % METRICS)
    sys.exit(0)


# Register signal
signal(SIGINT, sigint_handler)

# Setup Flask
app = Flask(__name__)

# Configure SQLAlchemy
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLALCHEMY_URI']

# Greetings
print("                             __                          \n                            / _|                         \n  __ _  __ _ _ __ ___   ___| |_ _ __ __ _ _ __ ___   ___ \n / _` |/ _` | '_ ` _ \\ / _ \\  _| '__/ _` | '_ ` _ \\ / _ \\\n| (_| | (_| | | | | | |  __/ | | | | (_| | | | | | |  __/\n \\__, |\\__,_|_| |_| |_|\\___|_| |_|  \\__,_|_| |_| |_|\\___|\n  __/ |                                                  \n |___/\n\n")
print("")
print("Connected to: %s" % os.environ['SQLALCHEMY_URI'])

print("")
print("0. RESET                          Drop all tables and rebuild database schema")
print("1. REBUILD                        Reset database, merge, and link")
print("2. FILTER                         Delete low quality entities")

print("")
print("[STEAM]")
print("3. COLLECT games                  Download missing games from Steam")
print("4. COLLECT headers                Download game headers from Steam")
print("5. MERGE games                    Upload game cache into database")
print("6. LINK developers                Compute Game-Developer links from Steam games")
print("7. GENERATE covers                Generate game covers")
print("8. UPLOAD covers                  Upload game covers to S3")

print("")
print("[IGDB]")
print("9. COLLECT games                  Download missing games from IGDB")
print("A. COLLECT developers             Download missing developers from IGDB")
print("B. COLLECT covers                 Download game covers from IGDB")
print("C. MERGE games                    Upload game cache into database")
print("D. MERGE developers               Upload developer cache into database")
print("E. LINK developers                Compute Game-Developer links from IGDB developers")

print("")
print("[NEWSAPI]")
print("F. GATHER articles by game        Download game articles from NEWSAPI")
print("G. GATHER articles by developer   Download developer articles from NEWSAPI")
print("H. MERGE articles                 Upload article cache into database and LINK")

print("")
print("[YOUTUBE]")

with app.app_context():

    # Initialize Flask
    db.init_app(app)

    cmd = ""
    while True:

        print("")
        if len(cmd) == 0:
            cmd = input("Choose an action: ")

        action = cmd[0]
        cmd = cmd[1:]

        if action == '0':
            print("[MAIN ] Resetting database")
            reset(db)
            print("[MAIN ] Reset complete")
        elif action == '1':
            t = time()
            print("[MAIN ] Rebuilding database")

            reset(db)
            steam.merge_games(db)
            igdb.merge_games(db)
            igdb.merge_developers(db)

            igdb.link_developers(db)
            steam.link_developers(db)

            newsapi.merge_articles(db)
            trim(db)
            print("[MAIN ] Rebuild completed in %d seconds" % (time() - t))
        elif action == '2':
            trim(db)
        elif action == '3':
            steam.collect_games()
        elif action == '4':
            steam.collect_headers()
        elif action == '5':
            steam.merge_games(db)
        elif action == '6':
            steam.link_developers(db)
        elif action == '7':
            steam.generate_covers()
        elif action == '8':
            steam.upload_covers()
        elif action == '9':
            igdb.collect_games()
        elif action == 'a':
            igdb.collect_developers()
        elif action == 'b':
            igdb.collect_covers()
        elif action == 'c':
            igdb.merge_games(db)
        elif action == 'd':
            igdb.merge_developers(db)
        elif action == 'e':
            igdb.link_developers(db)
        elif action == 'f':
            newsapi.gather_articles_by_game(db)
        elif action == 'g':
            newsapi.gather_articles_by_developer(db)
        elif action == 'h':
            newsapi.merge_articles(db)
        else:
            print("Unknown Command")