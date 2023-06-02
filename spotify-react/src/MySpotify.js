import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect } from "react";
import { Card, ImageList, ImageListItem } from "@mui/material";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// The TabPanel contains each tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function MyTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAlbumClick = (album) => {
    const albumUrl = album.external_urls.spotify;
    window.open(albumUrl, "_blank");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} centered position='static'>
          <Tab label="Top Artists" {...a11yProps(0)} />
          <Tab label="Timeline" {...a11yProps(1)} />
          <Tab label="About" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {props.artists.length === 0 ? (
          <Typography variant="body2" paragraph>
            Loading...
          </Typography>
        ) : (
          <Box>
            {props.artists.map((artist) => (
              <Box key={artist.id}>
                <Typography variant="h4">{artist.name}</Typography>
                <ImageList
                  sx={{
                    gridAutoFlow: "column",
                    gridTemplateColumns:
                      "repeat(auto-fill,minmax(250px,1fr)) !important",
                    gridAutoColumns: "minmax(250px, 1fr)",
                  }}
                >
                  {artist.albums.map((album) => (
                    <ImageListItem
                      key={album.id}
                      onClick={() => handleAlbumClick(album)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={album.images[1].url}
                        loading="lazy"
                        alt={album.name}
                      />
                      <ImageListItemBar
                        title={album.name}
                        subtitle={album.label}
                        position="below"
                        className='titleWrap'
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            ))}
          </Box>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box>
          {props.artists.map((artist) => (
            <Box key={artist.id}>
              <Accordion defaultExpanded={false}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="timeline-content"
                  id="timeline-header"
                >
                  <Typography variant="h4">{artist.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Timeline position="left">
                    {artist.albums.map((album) => (
                      // WE NEED AN ARRAY OF OBJECTS   
                      <TimelineItem>
                        <TimelineOppositeContent>{album.release_date.split('-')[0]}</TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>{album.label}</TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </AccordionDetails>
              </Accordion>
            </Box>
          ))}
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="about-content"
            id="about-header"
          >
            <Typography variant="h5">About This Project</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* <Typography variant="h5">Objective</Typography> */}
            <Typography variant="body2" paragraph>
              Our objective for this web app was to create a dynamic overview for listening habits that emphasize the role that record labels play in their favorite artist's careers, for both casual listeners and intense enthusiasts alike.
            </Typography>

            <Typography variant="body2" paragraph>
              Each artist has a different discography and career - working with different labels or self releasing parts of their discography through independent distribution platforms, such as Distrokid or Tunecore. We wanted to chart these relations between labels, album releases, and artists.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="process-content"
            id="process-header"
          >
            <Typography variant="h6">What was the development process like?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" paragraph>
              From the listener’s current 15 top artists, we would return information about each artist’s albums, with the release year and record label.
            </Typography>

            <Typography variant="body2" paragraph>
              We use the Spotify API in order to get the list of the personalized top artists.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="faq-content"
            id="faq-header"
          >
            <Typography variant="h6">What are the limitations?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* <Typography variant="h5">Objective</Typography> */}
            <Typography variant="body2" paragraph>
              There are a couple of limitations.
            </Typography>

            <Typography variant="body2" paragraph>
              <ul>
                <li>Spotify often does not contain an entire artist's discography.</li>
                <li>Artists often change stage names, or release music under a variety of different projects with different names; for example, the artistly commonly known as 'Four Tet' has also released music under the names 'KH', '00110100 01010100', and ' ⣎⡇ꉺლ༽இ•̛)ྀ◞ ༎ຶ ༽ৣৢ؞ৢ؞ؖ ꉺლ'. We cannot track any name changes throughout an artist's career.</li>
                <li>We only included and returned musical releases within Spotify's database listed as albums - that means we excluded other categorizations of released music such as EPs and singles. This means that any artists whose discographies consist of mostly EPs or singles may be misrepresented. This will skew by genre - dance music in particular favors the EP format.</li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>

      </TabPanel>
    </Box>
  );
}

function Navbar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Label Mapper
          </Typography>
          <Button color="inherit" onClick={props.logout}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function MySpotify(props) {
  return (
    <>
      <Navbar logout={props.logout} />
      <MyTabs artists={props.artists} />
    </>
  );
}

export default MySpotify;
