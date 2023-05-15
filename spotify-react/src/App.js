import './App.css';
import { useEffect, useState } from 'react';

function App() {
  // Initialize all of the variables that the Spotify API requires
  const CLIENT_ID = "2e7905b28fa443f3b1a6b0688cce9dd0";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "user-top-read";

  // Initialize the token using useState
  const [token, setToken] = useState("");

  // idk what this does but i think it gets the token or smth
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, []);

  // Logs the user out of their Spotify account
  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  }

  // Gets a user's top tracks as an array
  const getTopTracks = async () => {
    // Initializes the data object that will contain the response JSON from the Spotify API
    let data = { next: "https://api.spotify.com/v1/me/top/tracks" };
    // Initializes an array to store ALL of the user's top tracks
    let topTracks = [];
    // Continuously get the next page of the user's top tracks
    while (data.next) {
      // Fetch the user's next top tracks
      console.log("Fetching next...");
      let response = await fetch(data.next, { headers: { Authorization: `Bearer ${token}` } } );
      console.log("Done fetching next page!");
      if (response.ok) { // If the response is ok
        // Get the JSON of the Spotify API's response
        data = await response.json();
        // Add the top tracks to the topTracks array
        topTracks = topTracks.concat(data.items);
      } else { // If something goes wrong
        console.log("oopsie!!");
      }
    }
    console.log(topTracks);
    printTopTracks(topTracks);
    getTopLabels(topTracks);
    return topTracks;
  }

  // Prints out the artist(s) name(s) and title of each track
  const printTopTracks = (topTracks) => {
    for (const track of topTracks) {
      console.log(track.artists.map((artist) => artist.name).join(", ") + " - " + track.name);
    }
  };

  // Gets the label associated with each track
  const getTopLabels = (items) => {
    for (const item of items) { // Loop through every track in the array
      // Fetch the details of the album the track is on from the Spotify API
      fetch(item.album.href, { headers: { Authorization: `Bearer ${token}` } } )
        .then((res) => res.json())
        .then((album) => {
          console.log(album.artists.map((artist) => artist.name).join(", ") + " - " + album.label);
        })
        .catch((err) => { console.log(err) });
    }
  }

  return (
    <div className="App">
      <header className="App-header">
      {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login
            to Spotify</a>
        : <button onClick={logout}>Logout</button>
      }
      {token ?
        <button onClick={getTopTracks}>Go!</button>
        : <h2>Please login</h2>
      }
      </header>
    </div>
  );
}

export default App;
