import requests
import config
from flask import Flask, jsonify, request
from flask_cors import CORS

api_key = config.SPOONACULAR_API_KEY
app = Flask(__name__)
CORS(app)
#chosen_ingredients = ['Tomato', 'Cheese', 'Bread', 'Beef', 'Chicken', 'Pasta', 'Rice', 'Shrimp']


# User input for the ingredients specified. Placeholder
# until we figure out how to implement user input

def get_recipes(ingredients):
    params = {
        'apiKey': api_key,
        'ingredients': ','.join(ingredients),

        #number of recipes to return, 1 for now
        'number': '5',
        'limitLicense': "true",
        'ranking': '2',
        'ignorePantry': 'true'

    }

    recipe_url = f'https://api.spoonacular.com/recipes/findByIngredients'
    recipe_response = requests.get(recipe_url, params = params)

    if recipe_response.status_code == 200:
        # the recommended recipes
        return recipe_response.json()

    else:
        print(f'Error: {recipe_response.status_code}')
        print(recipe_response.text)
        return None

#recipe_data = get_recipes(chosen_ingredients)

# returns a summary of the recipe as a list, 
# [title, spoonacular summary, missed ingredients, used ingredients, link for an image]
def get_recipe_summary(recipe):
    summary_url = f'https://api.spoonacular.com/recipes/{recipe["id"]}/summary?apiKey={api_key}'

    summary_response = requests.get(summary_url)

    if summary_response.status_code == 200:
        recipe_summary = [
            recipe["title"],
            summary_response.json()["summary"],
            [ingredient['name'] for ingredient in recipe['missedIngredients']],
            [ingredient['name'] for ingredient in recipe['usedIngredients']],
            recipe['image'],
            recipe['id']
        ]
        return recipe_summary
    else:
        print(f'Error: {summary_response.status_code}')
        print(summary_response.text)
        return None

# Takes a list of recipes as input, returns a list of recipe summaries
def get_recipe_summaries(recipe_data):
    return [get_recipe_summary(recipe) for recipe in recipe_data]

#print(recipe_data)