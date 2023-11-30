import requests
import config
import base64
#import RecipeInformation

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


def get_song_recommendations(taste_data):
    # Get the access token
    access_token = get_access_token(client_id, client_secret)

    associated_genres = [
    'pop',              #sweetness
    'rap',              #saltiness
    'electronic',       #sourness
    'metal',            #bitterness
    'classical',         #savoriness
    'country'           #fattiness
    ]
    #spiciness: energy

    tracks_summary = []

    taste_values = []
    for key, value in taste_data.items():
        taste_values.append(value)

    threshold = sum(taste_values[:-1]) / 6.0

    selected_genres = []
    for i, value in enumerate(taste_values[:-1]):
        if value > threshold:
            selected_genres.append(associated_genres[i])

    params = {
            "seed_genres": ','.join(selected_genres),
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
            for track in tracks_info['tracks']:
                tracks_summary.append([
                            track['name'], 
                            [artist['name'] for artist in track['artists']] if 'artists' in track else ['Unknown Artist'],
                            track['album']['name'],
                            track['album']['images'][-1]['url'] if len(track['album']) > 0 else '',
                            track['album']['uri']
                            ])
            return tracks_summary
        else:
            print(f'Error: {response.status_code}')
            print(response.text)
            return None
        
#tracks_summary = get_song_recommendations(RecipeInformation.get_taste_data(12345))
#print(tracks_summary)
#tracks_summary = get_song_recommendations(taste_data)
# print(tracks_summary)