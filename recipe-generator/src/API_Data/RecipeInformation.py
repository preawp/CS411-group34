import requests
import config

api_key = config.SPOONACULAR_API_KEY

# get the taste analytics of the recipe. 
# Returns {sweetness, saltiness, sourness, bitterness, savoriness, fattiness, spiciness}
def get_taste_data(recipe_id):
    taste_url = f'https://api.spoonacular.com/recipes/{recipe_id}/tasteWidget.json?apiKey={api_key}&normalize=true'
        
    taste_response = requests.get(taste_url)

    if taste_response.status_code == 200:
        return taste_response.json()
    else:
        print(f'Error: {taste_response.status_code}')
        print(taste_response.text)
        return None

def get_instructions(recipe_id):
    instructions = []

    instructions_url = f'https://api.spoonacular.com/recipes/{recipe_id}/analyzedInstructions?apiKey={api_key}'
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

