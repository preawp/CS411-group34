import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const RecipeDetailsPage = () => {
  const [songs, setSongs] = useState([]);
  const [instructions, setInstructions] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {id} = useParams();
  const navigate = useNavigate();

  const generateSongs = async () => {
  
    try {
        const generateSongsResponse = await fetch('http://localhost:5000/generate-songs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
        
      if (generateSongsResponse.ok) {
        const generatedSongs = await generateSongsResponse.json()
        setSongs(generatedSongs.songs)
      } else {
        setError(`Error: ${generateSongsResponse.status}`);
      }

    } catch (error) {
     setError('Error fetching data');
    } 
  };

  const getInstructions = async () => {
    try {
      const getInstructionsResponse = await fetch('http://localhost:5000/get-instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (getInstructionsResponse.ok) {
        const instructions = await getInstructionsResponse.json()
        console.log(instructions.instructions)
        setInstructions(instructions.instructions)
      } else {
        setError(`Error: ${getInstructionsResponse.status}`);
      }
    } catch (error) {
     setError('Error fetching data');
    }
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      await generateSongs();
      await getInstructions();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
  
      <div>
        <h1>Instructions</h1>
        <ol style={{ textAlign: 'left', lineHeight: '1.5', fontSize: '25px' }}>
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>
  
      <h1>Songs Generated From This Recipe</h1>
  {songs.length > 0 ? (
    <ul style={{ listStyleType: 'none', padding: 0, columnCount: 5 }}>
      {songs.map((song, index) => (
        <li key={index} style={{ marginBottom: '20px' }}>
          <h2>
            <a href={song[4]} target="_blank" rel="noopener noreferrer">
              {song[0]}
            </a>
          </h2>
          <p>
            <span>{`by ${song[1].join(', ')}`}</span>
            <br />
            <span>{`from ${song[2]}`}</span>
          </p>
          <img
            src={song[3]}
            alt={`Image for ${song[0]}`}
            style={{ maxWidth: '200px', width: '100%', height: 'auto' }}
          />
        </li>
      ))}
    </ul>
  ) : (
    <p style = {{fontSize: '20px'}}>{'No songs generated for this recipe :('}</p>
  )}
  <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
};

export default RecipeDetailsPage;