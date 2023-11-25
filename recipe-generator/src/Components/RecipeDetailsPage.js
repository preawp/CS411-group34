import React from 'react';
import {useParams} from 'react-router-dom';

const RecipeDetailsPage = () => {
    const {id} = useParams();

    return (
      <div>
      <h2>{`Recipe ${id}`}</h2>
      <p>{"yay"}</p>
      <p>Display details for recipe with index: {id}</p>
      {/* Add your detailed information rendering here */}
    </div>
  );
};
  
  export default RecipeDetailsPage;