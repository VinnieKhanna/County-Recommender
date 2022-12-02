import { useNavigate } from "react-router";

// MUI Imports
import * as React from 'react';
import { Typography, Button, Box, Grid, FormControl, TextField, Slider } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

// Data Imports
import { cities } from "../data/cities";

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


    const [city, setCity] = React.useState('');

    const handleCityChange = (event) => {
      setCity(event.target.value);
    };

    const [population, setPopulation] = React.useState('');

    const handlePopulationChange = (event) => {
      setPopulation(event.target.value);
    };

    const [populationImp, setPopulationImp] = React.useState('');

    const handlePopulationImpChange = (event) => {
      setPopulationImp(event.target.value);
    };

    const [temperature, setTemperature] = React.useState('');

    const handleTemperatureChange = (event) => {
      setTemperature(event.target.value);
    };

    const [temperatureImp, setTemperatureImp] = React.useState('');

    const handleTemperatureImpChange = (event) => {
      setTemperatureImp(event.target.value);
    };

    const [precipitationImp, setPrecipitationImp] = React.useState('');

    const handlePrecipitationImpChange = (event) => {
      setPrecipitationImp(event.target.value);
    };

    const [unemploymentImp, setUnemploymentImp] = React.useState('');

    const handleUnemploymentImpChange = (event) => {
      setUnemploymentImp(event.target.value);
    };

    const [educationImp, setEducationImp] = React.useState('');

    const handleEducationImpChange = (event) => {
      setEducationImp(event.target.value);
    };

    const [povertyImp, setPovertyImp] = React.useState('');

    const handlePovertyImpChange = (event) => {
      setPovertyImp(event.target.value);
    };

    const [costOfLiving, setCostOfLiving] = React.useState('');

    const handleCostOfLivingChange = (event) => {
      setCostOfLiving(event.target.value);
    };

    const [costOfLivingImp, setCostOfLivingImp] = React.useState('');

    const handleCostOfLivingImpChange = (event) => {
      setCostOfLivingImp(event.target.value);
    };

    var preferences = [city, population, populationImp, temperature, temperatureImp, precipitationImp, unemploymentImp, educationImp, povertyImp, costOfLiving, costOfLivingImp]

    const handleSubmit = (event) => {
        navigate("/past-counties")
    }

    return (
        <Box>
            <Box component="main" sx={{flexGrow: 1, mx:'auto', width:'90%'}}>
                <br/>              
                <br/>
                <Grid container spacing={5}>
                    <Grid item xs={6} md={6}>
                        <AppBar sx={{ borderRadius: '16px' }} position="static">
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
                    </Grid> 
                    <Grid item xs={6} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Preferred City</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={city}
                            label="Preferred City"
                            onChange={handleCityChange}
                            >
                                {cities.map((city) => <MenuItem value={city.value}>{city.label}</MenuItem>)}
                            </Select>
                        </FormControl>                            
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                            <TextField 
                                id="population" 
                                label="Preferred Population" 
                                variant="outlined" 
                                helperText="Please indicate your preferred population" 
                                value={population}
                                onChange={handlePopulationChange}/>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242" }} theme={sliderTitle}>
                            Population Importance
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
                                max={10} 
                                value={populationImp}
                                onChange={handlePopulationImpChange}/>
                        </FormControl>                            
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                            <TextField 
                                id="income" 
                                label="Preferred Temperature (°F)" 
                                variant="outlined" 
                                helperText="Please indicate your preferred temperature"
                                value={temperature}
                                onChange={handleTemperatureChange}/>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242" }} theme={sliderTitle}>
                            Temperature Importance
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} variant="filled">
                            <Slider
                                aria-label="temperatureImportance"
                                defaultValue={5}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={0}
                                max={10} 
                                value={temperatureImp}
                                onChange={handleTemperatureImpChange}/>
                        </FormControl>                            
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242" }} theme={sliderTitle}>
                            Average Precipitation Importance
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} variant="filled">
                            <Slider
                                aria-label="precipitationImportance"
                                defaultValue={5}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={0}
                                max={10}
                                value={precipitationImp}
                                onChange={handlePrecipitationImpChange}/>
                        </FormControl>                            
                    </Grid>           
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242"}} theme={sliderTitle}>
                            Unemployment Rate Importance
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} variant="filled">
                            <Slider
                                aria-label="unemploymentImportance"
                                defaultValue={5}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={0}
                                max={10}
                                value={unemploymentImp}
                                onChange={handleUnemploymentImpChange}/>
                        </FormControl>                            
                    </Grid>                    
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242" }} theme={sliderTitle}>
                            Education Rate Importance
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
                                max={10}
                                value={educationImp}
                                onChange={handleEducationImpChange}/>
                        </FormControl>                            
                    </Grid>           
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242"}} theme={sliderTitle}>
                            Poverty Rate Importance
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} variant="filled">
                            <Slider
                                aria-label="povertyImportance"
                                defaultValue={5}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={0}
                                max={10} 
                                value={povertyImp}
                                onChange={handlePovertyImpChange}/>
                        </FormControl>                       
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242" }} theme={sliderTitle}>
                            Preferred Cost of Living (Cheap to Expensive)
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
                                max={10} 
                                value={costOfLiving}
                                onChange={handleCostOfLivingChange}/>
                        </FormControl>                            
                    </Grid>           
                    <Grid item xs={6} md={6}>
                        <Typography id="input-slider" sx={{ display: "flex", justifyContent: "space-between", mt:1, color: "#424242"}} theme={sliderTitle}>
                            Cost of Living Importance
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 1 }} variant="filled">
                            <Slider
                                aria-label="povertyImportance"
                                defaultValue={5}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={0}
                                max={10}
                                value={costOfLivingImp}
                                onChange={handleCostOfLivingImpChange}/>
                        </FormControl>                            
                    </Grid>             
                </Grid>
                <br/>
                <Button variant="contained" endIcon={<SendIcon />} sx={{ mt: 4 }} onClick={handleSubmit}>
                    Submit Preferences
                </Button>
                <br/>
                <br/>
            </Box>
        </Box>
    );
}

export default InfoCollection;