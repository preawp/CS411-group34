import requests
import config

api_key = config.SPOONACULAR_API_KEY

# User input for the ingredients specified. Placeholder
# until we figure out how to implement user input
chosen_ingredients = ['Tomato', 'Cheese', 'Bread', 'Beef', 'Chicken', 'Pasta', 'Rice', 'Shrimp']

def get_recipes(ingredients):
    params = {
        'apiKey': api_key,
        'ingredients': ','.join(ingredients),

        #number of recipes to return, 1 for now
        'number': '1',
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

recipe_data = get_recipes(chosen_ingredients)

#print(recipe_data)