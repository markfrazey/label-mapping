import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

// This contains the welcome page that provides an introduction to our app
function Welcome (props) {
  return (
    <Container component="main" maxWidth="sm" sx={{ fontFamily:'YoungSerif', mb: 4 }}>
      <Paper elevation={2} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h2" align="center" gutterBottom>
          WELCOME
        </Typography>
        <Typography variant="body1" paragraph>
          Ever wondered about the influence the "Big Three" wield over the music you enjoy? Universal Music Group, Sony Music Entertainment, and Warner Music Group are the titans of the music industry, each owning a considerable array of smaller labels. Their substantial impact on the global music market arises from their extensive distribution networks, diverse artist rosters, and significant financial resources.
        </Typography>
        <Typography variant="body1" paragraph>
          Wondering where your favorite artists fit into this picture? Sign in with your Spotify account to uncover the intricate network of record labels linked with your favorite artists and songs.
        </Typography>
        <Typography variant="body1" paragraph>
          Don't have a Spotify account? You can still access the data from the past year's top songs and their corresponding record labels.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined">View Top Charts</Button>
          <Button variant="contained" style={{ textAlign: "center" }} href={`${props.endpoint}?client_id=${props.client}&redirect_uri=${props.redirect}&response_type=${props.response}&scope=${props.scope}`}>Log In With Spotify</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Welcome;