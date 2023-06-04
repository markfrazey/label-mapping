import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';


function Home () {
  return (
    <div className="App">
      <header className="App-header">
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login
              to Spotify</a>
          : <button onClick={logout}>Logout</button>
        }
        {token ?
          <>
            <button onClick={getTopArtists}>Go!</button>
            <textarea id="top-songs" ref={ref}></textarea>
            <button onClick={getLabelsFromChartTracks}>TEst</button>
          </>
          : <h2>Please login</h2>
        }
      </header>
      <body>
        <div id="output">
          {artists.length > 0 ?
            artists.map((artist) => <ArtistBox artist={artist} /> )
            : <h4>Press "Go" and then wait a little bit</h4>
          }
        </div>
      </body>
    </div>
  );
}

export default Home;