# --------------------------------
# Google API scraper             -
# Copyright (C) 2018 GameFrame   -
# --------------------------------
import json
import os

import requests
from ratelimit import rate_limited
from tqdm import tqdm

from cache import WS, Cache, load_working_set
from orm import Game, Video

from .util import condition_video, xappend

"""
The API key
"""
API_KEY = os.environ['KEY_YOUTUBE']


"""
The video cache for games
"""
CACHE_VIDEO = Cache("/youtube/videos.game")


def rq_videos(keyword):
    """
    Request video metadata according to a game using the YouTube API
    """

    rq = requests.get("https://www.googleapis.com/youtube/v3/search",
                      params={'q': keyword, 'order': 'relevance',
                              'part': 'snippet', 'type': 'video', 'maxResults': 20, 'key': API_KEY})

    assert rq.status_code == requests.codes.ok

    videos = []
    for video_json in rq.json()['items']:

        # YouTube ID
        if 'id' not in video_json:
            continue

        # Title
        if "snippet" not in video_json or "title" not in video_json["snippet"]:
            continue

        # Title relevancy

        # Timestamp
        if "publishedAt" not in video_json["snippet"]:
            continue

        # Channel
        if "channelTitle" not in video_json["snippet"]:
            continue

        # Finally add the video
        videos.append(video_json)

    return videos


def build_video(video_json):
    """
    Build a Video object from the raw data
    """

    # Match by title
    if video_json["snippet"]["title"] in WS.videos:
        video = WS.videos[video_json['title']]

    # Build new Video
    else:
        video = Video()

    # YouTube ID
    if video.youtube_id is None:
        video.youtube_id = video_json["id"]['videoId']

    # Name
    if video.name is None:
        video.name = video_json["snippet"]["title"]

    # Timestamp
    if video.timestamp is None:
        video.timestamp = video_json["snippet"]["publishedAt"]

    # Channel
    if video.channel is None:
        video.channel = video_json["snippet"]["channelTitle"]

    # Video Link
    if video.video_link is None:
        video.video_link = "https://www.youtube.com/watch?v=" + video.youtube_id

    return video


def gather_videos_by_game():
    """
    Download videos from YouTube by game
    """
    load_working_set()

    print("[GOOGLE] Gathering videos")

    for game in tqdm(WS.game_name.values()):
        name = game.name.replace("/", "\\")
        if not CACHE_VIDEO.exists(name):
            CACHE_VIDEO.write_json(
                name, rq_videos(condition_video(game.name)))

    print("[GOOGLE] Gather complete")


def merge_videos():
    """
    Merge cached videos into the working set and link
    """
    load_working_set()

    print("[GOOGLE] Merging/Linking videos")
    for filename in tqdm(CACHE_VIDEO.list_dir()):

        if not filename.replace("\\", "/") in WS.game_name:
            continue
        game = WS.game_name[filename.replace("\\", "/")]

        for video_json in CACHE_VIDEO.read_json(filename):

            # Build Video
            video = build_video(video_json)

            # Setup a relationship between the video and game
            xappend(game.videos, video)

            # Add to working set
            WS.add_video(video)

    print("[GOOGLE] Merge/Link Complete")
