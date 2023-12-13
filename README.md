# Recipe and Song

Welcome to Recipe and Song! This is a web application where you can input a list of ingredients and receive a list of recipes in return. For each recipe, five songs are generated based on how the recipe tastes.

## Project Details

This project makes use of the Spoonacular and Spotify APIs. Once the user inputs a list of ingredients, we retrieve a list of recipe suggestions from the Spoonacular API. Once the user selects a recipe, we get a list of song recommendations from the Spotify API tailored to the taste of the recipe. We do this by getting data about the taste from Spoonacular, which gives us values from 0 to 100 for sweetness, saltiness, sourness, bitterness, savoriness, fattiness, and spiciness. We then correlated these values to specify different types of songs from Spotify. Spiciness, for example, correlates to how energetic the songs will be.
