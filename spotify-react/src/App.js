import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { useEffect, useRef, useState } from 'react';
// import Box from '@mui/material/Box';
// import Navbar from './Navbar';
import Container from '@mui/material/Container';
import Welcome from './Welcome';
import MySpotify from './MySpotify';

// import TimeStamp from './fonts/Time-Stamp-master/TimeStamp-Standard.otf';
// import YoungSerif from './fonts/YoungSerif-master/fonts/webfonts/YoungSerif-Regular.woff2'

function App() {
  // Initialize all of the variables that the Spotify API requires
  const CLIENT_ID = "2e7905b28fa443f3b1a6b0688cce9dd0";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "user-top-read";

  // Initialize the token using useState
  const [token, setToken] = useState("");

  // Initialize the top artists object
  const [artists, setArtists] = useState([]);

  // Initialize the ref idk what this does
  const ref = useRef(null);

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
    let albumData = await getAllAlbumData(groupedAlbums);
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
  const getAllAlbumData = async (albums) => {
    let albumData = [];
    for (const album of albums) {
      albumData.push(await getAlbumData(album));
    }
    return albumData;
  }

  // Takes an individual album and returns an object containing the album's data
  const getAlbumData = async (album) => {
    let result;
    let response = await fetch(album.href, { headers: { Authorization: `Bearer ${token}` } } );
      if (response.ok) {
        result = await response.json();
      } else {
        console.log(response);
      }
    return result;
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

  const getTopArtists = async () => {
    let data = { next: "https://api.spotify.com/v1/me/top/artists" };
    let topArtists = [];
    while (data.next) {
      console.log("Fetching next...");
      let response = await fetch(data.next, { headers: { Authorization: `Bearer ${token}` } } );
      console.log("✅ done + fetching next page");
      if (response.ok) {
        data = await response.json();
        console.log(data);
        topArtists = topArtists.concat(data.items);
      } else {
        console.log("oopsie!!");
        console.log(response);
        data = {};
      }
    }
    return topArtists;
  }

  const getArtistAlbums = async (artists) => {
    let result = [];
    for (const artist of artists) {
      let artistAlbums = [];
      let data = { next: `${artist.href}/albums?include_groups=album` };
      while (data.next) {
        let response = await fetch(data.next, { headers: { Authorization: `Bearer ${token}` } } );
        if (response.ok) {
          data = await response.json();
          artistAlbums = artistAlbums.concat(data.items);
        } else {
          console.log("🟥oopsies");
          console.log(response);
          data = {};
        }
      }
      let albums = await getAllAlbumData(artistAlbums);
      artist.albums = albums;
      result.push(artist);
      console.log(albums);
    }
    return result;
  }

  const getLabelsFromChartTracks = async () => {
    let result = [];
    let data = {};
    let tracks = JSON.parse(ref.current.value);
    console.log(tracks);
    for (const track of tracks) {
      let response = await fetch(`https://api.spotify.com/v1/tracks/${track.match(/(?<=track\/).*/)}`, { headers: { Authorization: `Bearer ${token}` } } );
      if (response.ok) {
        data = await response.json();
        let albumData = await getAlbumData(data.album);
        data.album = albumData;
        console.log(data);
        result.push(data);
      } else {
        console.log("oopsie!!");
        console.log(response);
      }
    }
    console.log(result);
  }

  // Initialize the MUI theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#B443FF',
      },
      background: {
        default: '#000000',
        paper: '#080808',
      },
    },
    typography: {
      fontFamily: '"YoungSerif", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h2: {
        fontWeight: 600,
        transform: "scale(1, 3)",
        padding: ".6em 0",
      },
    },

  });

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

  useEffect(() => {
    if (token !== "" && artists.length === 0) {
      getTopArtists()
        .then((topArtists) => getArtistAlbums(topArtists.slice(0, 10)))
        .then(setArtists);
    }
  });

  // Logs the user out of their Spotify account
  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ fontFamily:'YoungSerif', mb: 4 }}>
        {!token ? // If the user isn't logged in to their Spotify,

            <Welcome endpoint={AUTH_ENDPOINT} client={CLIENT_ID} redirect={REDIRECT_URI} response={RESPONSE_TYPE} scope={SCOPE} />

        : // If the user is logged in, display the MySpotify page
          <MySpotify logout={logout} artists={artists} />
        }
      </Container>

    </ThemeProvider>
  );
}

export default App;