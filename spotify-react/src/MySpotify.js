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
import { ImageList, ImageListItem } from "@mui/material";
import ImageListItemBar from "@mui/material/ImageListItemBar";

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
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Top Artists" {...a11yProps(0)} />
          <Tab label="Charts" {...a11yProps(1)} />
          <Tab label="About" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {props.artists.length === 0 ? (
          <Typography variant="body1" paragraph>
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
                      "repeat(auto-fill,minmax(160px,1fr)) !important",
                    gridAutoColumns: "minmax(160px, 1fr)",
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

          <p>CHARTS HERE</p>

      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography variant="h4">About This Project</Typography>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Varius quam quisque id diam vel. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. A erat nam at lectus. Tellus id interdum velit laoreet id donec ultrices tincidunt. Ac ut consequat semper viverra. Odio euismod lacinia at quis risus sed. Enim nunc faucibus a pellentesque sit amet porttitor. Mattis pellentesque id nibh tortor id aliquet. Risus quis varius quam quisque id. Sit amet volutpat consequat mauris nunc.

Aliquam nulla facilisi cras fermentum odio eu. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus. Augue eget arcu dictum varius duis. Velit scelerisque in dictum non consectetur a erat nam at. Ut faucibus pulvinar elementum integer enim neque volutpat. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus. In est ante in nibh mauris cursus mattis molestie a. Sit amet consectetur adipiscing elit duis tristique sollicitudin. Cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla. Et tortor at risus viverra adipiscing at in tellus integer. Nunc aliquet bibendum enim facilisis gravida neque. Morbi tristique senectus et netus et malesuada. Ullamcorper malesuada proin libero nunc consequat interdum varius. Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Nunc non blandit massa enim nec. At urna condimentum mattis pellentesque. Diam sit amet nisl suscipit adipiscing bibendum. Aliquam vestibulum morbi blandit cursus.</p>

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
