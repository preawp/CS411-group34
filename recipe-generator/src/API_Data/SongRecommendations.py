import requests
import config
import base64

client_id = config.SPOTIFY_CLIENT_ID
client_secret = config.SPOTIFY_CLIENT_SECRET

def get_access_token(client_id, client_secret):
    # Combine client ID and client secret into a single string
    credentials = f"{client_id}:{client_secret}"
    
    encoded_credentials = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")
    
    headers = {
        "Authorization": f"Basic {encoded_credentials}",
    }
    
    data = {
        "grant_type": "client_credentials",
    }

    response = requests.post('https://accounts.spotify.com/api/token', headers=headers, data=data)

    if response.status_code == 200:
        # Parse and return the access token from the response
        return response.json().get("access_token")
    else:
        print(f'Error: {response.status_code}')
        print(response.text)
        return None

# Get the access token
access_token = get_access_token(client_id, client_secret)

# Get the song recommendations
threshold = 40.0

associated_genres = [
    'pop',              #sweetness
    'rap',              #saltiness
    'electronic',       #sourness
    'metal'             #bitterness
]
    #savoriness: danceability; fattiness: instrumentalness; spiciness: energy

def get_song_recommendations(taste_data):
    tracks_summary = []

    taste_values = []
    for key, value in taste_data.items():
        taste_values.append(value)

    selected_genres = []
    for i, value in enumerate(taste_values[:4]):
        if value > threshold:
            selected_genres.append(associated_genres[i])

    params = {
            "seed_genres": ','.join(selected_genres),
            "target_danceability": 0.25 + taste_values[4] * 0.006,
            "target_instrumentalness": 0.25 + taste_values[5] * 0.006,
            "target_energy": 0.25 + taste_values[6] * 0.006,
            "limit": 5,  # 5 recommendations for now
        }

    if access_token:
        headers = {
            "Authorization": f'Bearer {access_token}'
        }

        # get song recommendations based on the genres specified above
        response = requests.get('https://api.spotify.com/v1/recommendations', headers = headers, params = params)
        
        if response.status_code == 200:
            tracks_info = response.json()

            # Store the information as a list in order of track name, artist name(s), album name
            for tracks in tracks_info['tracks']:
                tracks_summary.append([tracks['name'], 
                            [artist['name'] for artist in tracks['artists']] if 'artists' in tracks else ['Unknown Artist'],
                            tracks['album']['name']])
            
            return tracks_summary
        else:
            print(f'Error: {response.status_code}')
            print(response.text)
            return None
        
#tracks_summary = get_song_recommendations(taste_data)
# print(tracks_summary)