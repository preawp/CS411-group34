from flask import Flask, jsonify, request
from flask_cors import CORS
import RecipeInformation
import SongRecommendations
import Recipes

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "Welcome to my flask server"

@app.route('/generate-menu', methods = ['POST'])
def generate_menu():
    data = request.get_json()

    if 'ingredients' in data:
        return jsonify(Recipes.get_recipe_summaries(Recipes.get_recipes(data['ingredients'])))

    else:
        return jsonify({'error': 'Invalid request'}), 400

'''
@app.route('/update-ingredients', methods = ['POST'])
def update_ingredients():
    global chosen_ingredients
    data = request.get_json()

    if 'ingredients' in data:
        chosen_ingredients = data['ingredients']
        return jsonify({'message': 'Ingredients updated'})
    else:
        return jsonify({'error': 'Invalid request'}), 400

@app.route('/generate-menu', methods = ['GET'])
def generate_menu():
    global chosen_ingredients
    recipe_summaries = Recipes.get_recipe_summaries(Recipes.get_recipes(chosen_ingredients))

    return jsonify(recipe_summaries)
'''

@app.route('/generate-songs', methods = ['POST'])
def generate_songs():
    data = request.get_json()
    recipe_id = data.get('id')

    if recipe_id is not None:
        songs = SongRecommendations.get_song_recommendations(
            RecipeInformation.get_taste_data(recipe_id))
        return jsonify({'songs': songs})
    else:
        return jsonify({'error': 'Invalid request'}), 400
    
@app.route('/get-instructions', methods = ['POST'])
def get_instructions():
    data = request.get_json()
    recipe_id = data.get('id')

    if recipe_id is not None:
        instructions = RecipeInformation.get_instructions(recipe_id)
        return jsonify({'instructions': instructions})
    else:
        return jsonify({'error': 'Invalid request'}), 400


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad Request'}), 400

if __name__ == '__main__':
    app.run(debug=True)