import os
import json
import spotify
from flask import render_template, request, redirect, url_for , current_app
from flask_restx import Resource, Api
from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3
import asyncio
from . import blueprint

api = Api(blueprint)

# Spotify credentials
SPOTIFY_CLIENT_ID = 'your_client_id'
SPOTIFY_CLIENT_SECRET = 'your_client_secret'
SPOTIFY_REDIRECT_URI = 'your_redirect_uri'



class Index(Resource):
    def get(self):
        return render_template('index.html')

class CheckSettings(Resource):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.config_file = 'config.json'

    def get_settings_from_config(self):
        with open(self.config_file, 'r') as f:
            config_data = json.load(f)
        return config_data.get('camera_ip'), config_data.get('camera_port')

    def get(self):
        ip, port = self.get_settings_from_config()
        return {'ip': ip, 'port': port}

class SubmitSettings(Resource):
    def __init__(self):
        self.config_file = 'config.json'

    def post(self):
        ip = request.form['ip']
        port = request.form['port']
        # Update IP and port in config.json
        self.update_config(ip, port)
        return redirect(url_for('index'))

    def update_config(self, ip, port):
        with open(self.config_file, 'r') as f:
            config_data = json.load(f)
        config_data['camera_ip'] = ip
        config_data['camera_port'] = port
        with open(self.config_file, 'w') as f:
            json.dump(config_data, f, indent=4)


class Songs(Resource):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Get the current working directory
        current_directory = os.getcwd()
        # Construct the file path relative to the current directory
        self.audio_folder = os.path.join(current_directory, 'apps','static','assets','audio')

        # Define the default image URL
        self.default_image_url =  'http://127.0.0.1:5000/static/assets/img/logo.png' # s.path.join(current_directory, 'apps','static','assets','img','logo.png')

    def get_song_metadata(self, file_path):
        audio = MP3(file_path, ID3=EasyID3)
        title = audio.get('title', [os.path.basename(file_path).replace('.mp3', '').title()])[0]
        artist = audio.get('artist', ['Unknown Artist'])[0]
        album = audio.get('album', ['Unknown Album'])[0]
        duration = str(int(audio.info.length // 60)) + ":" + str(int(audio.info.length % 60)).zfill(2)
        
        # Get image URL
        image_url = self.get_image_url(file_path)
        

        # Additional relevant metadata
        # You can extract more metadata from the MP3 tags here
        mp3_file_name = os.path.splitext(os.path.basename(file_path))[0] + '.mp3'
        mp3_path = 'http://127.0.0.1:5000/static/assets/audio/' +  mp3_file_name
        return {'title': title, 'artist': artist, 'album': album, 'duration': duration, 'image_url': image_url , 'src': mp3_path}

    def get_image_url(self, file_path):
        # Example logic to construct image URL based on file path
        image_file_name = os.path.splitext(os.path.basename(file_path))[0] + '.jpg'
        image_path = os.path.join('static', 'images', image_file_name)
        
        # Check if the image file exists
        if os.path.exists(image_path):
            # If the image file exists, return its URL
            image_url = '/' + image_path.replace('\\', '/')  # Convert backslashes to forward slashes for URL
        else:
            # If the image file doesn't exist, return the default image URL
            image_url = self.default_image_url
        
        return image_url

    def get(self):
        songs = []
        for filename in os.listdir(self.audio_folder):
            if filename.endswith('.mp3'):
                file_path = os.path.join(self.audio_folder, filename)
                metadata = self.get_song_metadata(file_path)
                songs.append({'file_path': file_path, **metadata})
        return songs

async def get_sorted_playlist(playlist_uri, client_id, secret, token):
    async with spotify.Client(client_id, secret) as client:
        user = await spotify.User.from_token(client, token)
        async for playlist in user:
            if playlist.uri == playlist_uri:
                sorted_tracks = await playlist.sort(reverse=True, key=(lambda track: track.popularity))
                return sorted_tracks
    return None


class SpotifyPlaylist(Resource):
    def post(self):
        # Parse request data
        data = request.json
        playlist_uri = data.get('playlist_uri')
        client_id = SPOTIFY_CLIENT_ID
        secret = SPOTIFY_CLIENT_SECRET
        token = ''

        # Run asynchronous task in a separate event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        sorted_playlist = loop.run_until_complete(get_sorted_playlist(playlist_uri, client_id, secret, token))

        if sorted_playlist:
            return sorted_playlist
        else:
            return {'error': 'Playlist not found'}, 404

api.add_resource(Index, '/')
api.add_resource(CheckSettings, '/check_settings')
api.add_resource(SubmitSettings, '/submit-settings')
api.add_resource(Songs, '/songs')
api.add_resource(SpotifyPlaylist, '/spotify/playlist')
