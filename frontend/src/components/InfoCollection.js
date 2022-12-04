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
import Snackbar from "@mui/material/Snackbar";

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

    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState("");

    const [city, setCity] = React.useState('');

    const handleCityChange = (event) => {
      setCity(event.target.value);
    };

    const [population, setPopulation] = React.useState('');

    const handlePopulationChange = (event) => {
      setPopulation(event.target.value);
    };

    const [populationImp, setPopulationImp] = React.useState(5);

    const handlePopulationImpChange = (event) => {
      setPopulationImp(event.target.value);
    };

    const [temperature, setTemperature] = React.useState('');

    const handleTemperatureChange = (event) => {
      setTemperature(event.target.value);
    };

    const [temperatureImp, setTemperatureImp] = React.useState(5);

    const handleTemperatureImpChange = (event) => {
      setTemperatureImp(event.target.value);
    };

    const [precipitationImp, setPrecipitationImp] = React.useState(5);

    const handlePrecipitationImpChange = (event) => {
      setPrecipitationImp(event.target.value);
    };

    const [unemploymentImp, setUnemploymentImp] = React.useState(5);

    const handleUnemploymentImpChange = (event) => {
      setUnemploymentImp(event.target.value);
    };

    const [educationImp, setEducationImp] = React.useState(5);

    const handleEducationImpChange = (event) => {
      setEducationImp(event.target.value);
    };

    const [povertyImp, setPovertyImp] = React.useState(5);

    const handlePovertyImpChange = (event) => {
      setPovertyImp(event.target.value);
    };

    const [costOfLiving, setCostOfLiving] = React.useState(5);

    const handleCostOfLivingChange = (event) => {
      setCostOfLiving(event.target.value);
    };

    const [costOfLivingImp, setCostOfLivingImp] = React.useState(5);

    const handleCostOfLivingImpChange = (event) => {
      setCostOfLivingImp(event.target.value);
    };

    const handleSubmit = (event) => {
        let preferences = [city, population, populationImp, temperature, temperatureImp, precipitationImp, unemploymentImp, educationImp, povertyImp, costOfLiving, costOfLivingImp]
        let preferenceNames = "city, population, populationImp, temperature, temperatureImp, precipitationImp, unemploymentImp, educationImp, povertyImp, costOfLiving, costOfLivingImp".split(", ");
        let prefObj = preferences.reduce((k, v, i) => ({ ...k, [preferenceNames[i]]: v}), {});
        fetch("/insert_user_prefs", {
            method: "POST",
            body: JSON.stringify(prefObj),
            headers: {
                "Authorization": `JWT ${props.token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            switch(res.status) {
                case 200:
                    setMsg("Successfully updated prefs")
                    navigate("/past-counties");
                    break
                case 401:
                    setMsg("Unauthorized. Try signing out and back in.")
                    break
                case 422:
                    setMsg("Population and Temperature must be numbers.")
                    break
                default:
                    setMsg(`${res.status}: Failed to update prefs - Unknown.`)
            }
            setOpen(true)
        })
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
                <Snackbar
                open={open}
                autoHideDuration={6000}
                message={msg}
                onClose={()=>setOpen(false)}
                />
                <br/>
                <br/>
            </Box>
        </Box>
    );
}

export default InfoCollection;