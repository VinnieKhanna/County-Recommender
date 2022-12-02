import { useNavigate } from "react-router";

// MUI Imports
import * as React from 'react';
import { Typography, Button, Box, Grid, FormControl, TextField, Slider } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';

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

    return (
        <Box>
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