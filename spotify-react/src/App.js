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
        data = {};
      }
    }
    console.log(topTracks);
    printTopTracks(topTracks);

    let groupedAlbums = groupAlbums(topTracks);
    let albumData = await getAlbumData(groupedAlbums);
    console.log(albumData);

    console.log(groupLabels(albumData));
    return topTracks;
  }

  // Takes an array of top tracks and returns the unique albums
  const groupAlbums = (tracks) => {
    let albums = {};
    for (const track of tracks) {
      albums[track.album.id] = track.album;
    }
    return Object.values(albums);
  }

  // Takes an array of albums and returns an array containing each album's full data
  const getAlbumData = async (albums) => {
    let albumData = [];
    for (const album of albums) {
      let response = await fetch(album.href, { headers: { Authorization: `Bearer ${token}` } } );
      if (response.ok) {
        let data = await response.json();
        albumData.push(data);
      } else {
        console.log(response);
      }
    }
    return albumData;
  }

  // Takes an array of albums and returns an object with labels as keys and albums as values
  const groupLabels = (albums) => {
    let result = {};
    for (const album of albums) {
      if (result[album.label]) {
        result[album.label].push(album);
      } else {
        result[album.label] = [album];
      }
    }
    return result;
  }

  // Prints out the artist(s) name(s) and title of each track
  const printTopTracks = (topTracks) => {
    for (const track of topTracks) {
      console.log(track.artists.map((artist) => artist.name).join(", ") + " - " + track.name);
    }
  }

  // Gets the label associated with each track
  const getTopLabels = async (items) => {
    let data = {};
    for (const item of items) { // Loop through every track in the array
      // Fetch the details of the album the track is on from the Spotify API
      let response = await fetch(item.album.href, { headers: { Authorization: `Bearer ${token}` } } );
      if (response.ok) {
        data = await response.json();
        console.log(data);
      } else {
        console.log(response);
      }
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
