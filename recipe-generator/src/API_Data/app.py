from flask import Flask, jsonify, request
from flask_cors import CORS
import RecipeInformation
import Recipes

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "Welcome to my flask server"

@app.route('/update-ingredients', methods = ['POST'])
def update_ingredients():
    global chosen_ingredients
    data = request.get_json()

    app.logger.info("Received data: %s", data) #temporary

    if 'ingredients' in data:
        chosen_ingredients = data['ingredients']
        return jsonify({'message': 'Ingredients updated'})
    else:
        return jsonify({'error': 'Invalid request'}), 400

@app.route('/generate-menu', methods = ['GET'])
def generate_menu():
    global chosen_ingredients
    recipe_summaries = Recipes.get_recipe_summaries(Recipes.get_recipes(chosen_ingredients))
   # menu_data = {
    #    'recipes': recipe_summaries
  #  }

    return jsonify(recipe_summaries)

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad Request'}), 400

if __name__ == '__main__':
    app.run(debug=True)