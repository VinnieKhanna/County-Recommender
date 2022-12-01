import { useNavigate } from "react-router";

// MUI Imports
import * as React from 'react';
import { Typography, Button, Box, Grid, FormControl, TextField, Slider } from "@mui/material";
import { createTheme} from '@mui/material/styles';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';

const sliderTitle = createTheme({
    typography: {
      htmlFontSize: 18
    },
  });
  
function valuetext(value) {
    return `${value}`;
}

function InfoCollection(props) {
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <Box>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                display: { xs: 'block', md: 'block' },
                                }}
                            >
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" onClick={() => navigate("/info-collection")}>Preference Settings</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" onClick={() => navigate("/past-counties")}>Living History</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" onClick={() => navigate("/recommendations")}>Recommendations</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                        <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'flex' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                        >
                        County Recommender
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box component="main" sx={{flexGrow: 1, mx:'auto', width:'90%'}}>
                <br/>
                <AppBar sx={{ borderRadius: '16px', width:'50%' }} position="static">
                    <Toolbar variant="dense">
                        <InfoIcon />
                        <Typography display="block" variant="overline" component="div" sx={{ flexGrow: 1 }}>
                            Preference Settings
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Typography variant="caption" sx={{ display: "flex", justifyContent: "space-between", ml:2, mt:1, color: "#424242" }}>
                            Please input your initial preferences and their weight
                </Typography>                
                <br/>
                <Grid container spacing={5}>
                    <Grid item xs={6} md={6}>
                        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                            <TextField 
                                id="population" 
                                label="Preferred Population*" 
                                variant="outlined" 
                                helperText="Please indicate your preferred population" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242" }} theme={sliderTitle}>
                            Indicate Population Importance
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} variant="filled">
                            <Slider
                                aria-label="populationImportance"
                                defaultValue={5}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={0}
                                max={10} />
                        </FormControl>                            
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                            <TextField 
                                id="income" 
                                label="Approximate Household Income*" 
                                variant="outlined" 
                                helperText="Please input your current household income" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242" }} theme={sliderTitle}>
                            Indicate Cost of Living Importance
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} variant="filled">
                            <Slider
                                aria-label="costOfLivingImportance"
                                defaultValue={5}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={0}
                                max={10} />
                        </FormControl>                            
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242" }} theme={sliderTitle}>
                            Indicate Education Importance
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} variant="filled">
                            <Slider
                                aria-label="educationImportance"
                                defaultValue={5}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={0}
                                max={10} />
                        </FormControl>                            
                    </Grid>           
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242"}} theme={sliderTitle}>
                            Indicate Crime Rate Importance
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} variant="filled">
                            <Slider
                                aria-label="crimeRateImportance"
                                defaultValue={5}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={0}
                                max={10} />
                        </FormControl>                            
                    </Grid>
                </Grid>
                <br/>
                <Button variant="contained" endIcon={<SendIcon />} sx={{ mt: 4 }} onClick={() => navigate("/past-counties")}>
                    Submit Preferences
                </Button>
            </Box>
        </Box>
    );
}

export default InfoCollection;