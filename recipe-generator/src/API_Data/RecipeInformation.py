import requests
import config
from Recipes import recipe_data

# Will get info about the taste, instructions, other info of the chosen recipe

api_key = config.SPOONACULAR_API_KEY

# Placeholder until we figure out how to get the chosen recipe as user input
chosen_recipe_index = 0
chosen_recipe = recipe_data[chosen_recipe_index]

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
            recipe['image']
        ]
        return recipe_summary
    else:
        print(f'Error: {summary_response.status_code}')
        print(summary_response.text)
        return None

recipe_summary = get_recipe_summary(chosen_recipe)


# get the taste analytics of the recipe. 
# Returns {sweetness, saltiness, sourness, bitterness, savoriness, fattiness, spiciness}
def get_taste_data(recipe):
    taste_url = f'https://api.spoonacular.com/recipes/{recipe["id"]}/tasteWidget.json?apiKey={api_key}&normalize=true'
        
    taste_response = requests.get(taste_url)

    if taste_response.status_code == 200:
        return taste_response.json()
    else:
        print(f'Error: {taste_response.status_code}')
        print(taste_response.text)
        return None

taste_data = get_taste_data(chosen_recipe)
#print(taste_data)

def get_instructions(recipe):
    instructions = []

    instructions_url = f'https://api.spoonacular.com/recipes/{recipe["id"]}/analyzedInstructions?apiKey={api_key}'
    instructions_response = requests.get(instructions_url)

    if instructions_response.status_code == 200:
        instructions_data = instructions_response.json()
        for step_data in instructions_data[0]['steps']:
            instructions.append(step_data['step'])
        return instructions
    else:
        print(f'Error: {instructions_response.status_code}')
        print(instructions_response.text)
        return None

instructions = get_instructions(chosen_recipe)
#print(instructions)