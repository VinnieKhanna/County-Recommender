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

    const cities = [{"label": "New York", "value": "New York"}, {"label": "Los Angeles", "value": "Los Angeles"}, {"label": "Chicago", "value": "Chicago"}, {"label": "Houston", "value": "Houston"}, {"label": "Phoenix", "value": "Phoenix"}, {"label": "Philadelphia", "value": "Philadelphia"}, {"label": "San Antonio", "value": "San Antonio"}, {"label": "San Diego", "value": "San Diego"}, {"label": "Dallas", "value": "Dallas"}, {"label": "San Jose", "value": "San Jose"}, {"label": "Austin", "value": "Austin"}, {"label": "Jacksonville", "value": "Jacksonville"}, {"label": "Fort Worth", "value": "Fort Worth"}, {"label": "Columbus", "value": "Columbus"}, {"label": "Indianapolis", "value": "Indianapolis"}, {"label": "Charlotte", "value": "Charlotte"}, {"label": "San Francisco", "value": "San Francisco"}, {"label": "Seattle", "value": "Seattle"}, {"label": "Denver", "value": "Denver"}, {"label": "Oklahoma City", "value": "Oklahoma City"}, {"label": "Nashville", "value": "Nashville"}, {"label": "El Paso", "value": "El Paso"}, {"label": "Washington", "value": "Washington"}, {"label": "Boston", "value": "Boston"}, {"label": "Las Vegas", "value": "Las Vegas"}, {"label": "Portland", "value": "Portland"}, {"label": "Detroit", "value": "Detroit"}, {"label": "Louisville", "value": "Louisville"}, {"label": "Memphis", "value": "Memphis"}, {"label": "Baltimore", "value": "Baltimore"}, {"label": "Milwaukee", "value": "Milwaukee"}, {"label": "Albuquerque", "value": "Albuquerque"}, {"label": "Fresno", "value": "Fresno"}, {"label": "Tucson", "value": "Tucson"}, {"label": "Sacramento", "value": "Sacramento"}, {"label": "Mesa", "value": "Mesa"}, {"label": "Kansas City", "value": "Kansas City"}, {"label": "Atlanta", "value": "Atlanta"}, {"label": "Omaha", "value": "Omaha"}, {"label": "Colorado Springs", "value": "Colorado Springs"}, {"label": "Raleigh", "value": "Raleigh"}, {"label": "Virginia Beach", "value": "Virginia Beach"}, {"label": "Long Beach", "value": "Long Beach"}, {"label": "Miami", "value": "Miami"}, {"label": "Oakland", "value": "Oakland"}, {"label": "Minneapolis", "value": "Minneapolis"}, {"label": "Tulsa", "value": "Tulsa"}, {"label": "Bakersfield", "value": "Bakersfield"}, {"label": "Wichita", "value": "Wichita"}, {"label": "Arlington", "value": "Arlington"}, {"label": "Aurora", "value": "Aurora"}, {"label": "Tampa", "value": "Tampa"}, {"label": "New Orleans", "value": "New Orleans"}, {"label": "Cleveland", "value": "Cleveland"}, {"label": "Anaheim", "value": "Anaheim"}, {"label": "Honolulu", "value": "Honolulu"}, {"label": "Henderson", "value": "Henderson"}, {"label": "Stockton", "value": "Stockton"}, {"label": "Lexington", "value": "Lexington"}, {"label": "Corpus Christi", "value": "Corpus Christi"}, {"label": "Riverside", "value": "Riverside"}, {"label": "Santa Ana", "value": "Santa Ana"}, {"label": "Orlando", "value": "Orlando"}, {"label": "Irvine", "value": "Irvine"}, {"label": "Cincinnati", "value": "Cincinnati"}, {"label": "Newark", "value": "Newark"}, {"label": "Saint Paul", "value": "Saint Paul"}, {"label": "Pittsburgh", "value": "Pittsburgh"}, {"label": "Greensboro", "value": "Greensboro"}, {"label": "St. Louis", "value": "St. Louis"}, {"label": "Lincoln", "value": "Lincoln"}, {"label": "Plano", "value": "Plano"}, {"label": "Anchorage", "value": "Anchorage"}, {"label": "Durham", "value": "Durham"}, {"label": "Jersey City", "value": "Jersey City"}, {"label": "Chandler", "value": "Chandler"}, {"label": "Chula Vista", "value": "Chula Vista"}, {"label": "Buffalo", "value": "Buffalo"}, {"label": "North Las Vegas", "value": "North Las Vegas"}, {"label": "Gilbert", "value": "Gilbert"}, {"label": "Madison", "value": "Madison"}, {"label": "Reno", "value": "Reno"}, {"label": "Toledo", "value": "Toledo"}, {"label": "Fort Wayne", "value": "Fort Wayne"}, {"label": "Lubbock", "value": "Lubbock"}, {"label": "St. Petersburg", "value": "St. Petersburg"}, {"label": "Laredo", "value": "Laredo"}, {"label": "Irving", "value": "Irving"}, {"label": "Chesapeake", "value": "Chesapeake"}, {"label": "Winston�Salem", "value": "Winston�Salem"}, {"label": "Glendale", "value": "Glendale"}, {"label": "Scottsdale", "value": "Scottsdale"}, {"label": "Garland", "value": "Garland"}, {"label": "Boise", "value": "Boise"}, {"label": "Norfolk", "value": "Norfolk"}, {"label": "Spokane", "value": "Spokane"}, {"label": "Fremont", "value": "Fremont"}, {"label": "Richmond", "value": "Richmond"}, {"label": "Santa Clarita", "value": "Santa Clarita"}, {"label": "San Bernardino", "value": "San Bernardino"}, {"label": "Baton Rouge", "value": "Baton Rouge"}, {"label": "Hialeah", "value": "Hialeah"}, {"label": "Tacoma", "value": "Tacoma"}, {"label": "Modesto", "value": "Modesto"}, {"label": "Port St. Lucie", "value": "Port St. Lucie"}, {"label": "Huntsville", "value": "Huntsville"}, {"label": "Des Moines", "value": "Des Moines"}, {"label": "Moreno Valley", "value": "Moreno Valley"}, {"label": "Fontana", "value": "Fontana"}, {"label": "Frisco", "value": "Frisco"}, {"label": "Rochester", "value": "Rochester"}, {"label": "Yonkers", "value": "Yonkers"}, {"label": "Fayetteville", "value": "Fayetteville"}, {"label": "Worcester", "value": "Worcester"}, {"label": "Columbus", "value": "Columbus"}, {"label": "Cape Coral", "value": "Cape Coral"}, {"label": "McKinney", "value": "McKinney"}, {"label": "Little Rock", "value": "Little Rock"}, {"label": "Oxnard", "value": "Oxnard"}, {"label": "Amarillo", "value": "Amarillo"}, {"label": "Augusta", "value": "Augusta"}, {"label": "Salt Lake City", "value": "Salt Lake City"}, {"label": "Montgomery", "value": "Montgomery"}, {"label": "Birmingham", "value": "Birmingham"}, {"label": "Grand Rapids", "value": "Grand Rapids"}, {"label": "Grand Prairie", "value": "Grand Prairie"}, {"label": "Overland Park", "value": "Overland Park"}, {"label": "Tallahassee", "value": "Tallahassee"}, {"label": "Huntington Beach", "value": "Huntington Beach"}, {"label": "Sioux Falls", "value": "Sioux Falls"}, {"label": "Peoria", "value": "Peoria"}, {"label": "Knoxville", "value": "Knoxville"}, {"label": "Glendale", "value": "Glendale"}, {"label": "Vancouver", "value": "Vancouver"}, {"label": "Providence", "value": "Providence"}, {"label": "Akron", "value": "Akron"}, {"label": "Brownsville", "value": "Brownsville"}, {"label": "Mobile", "value": "Mobile"}, {"label": "Newport News", "value": "Newport News"}, {"label": "Tempe", "value": "Tempe"}, {"label": "Shreveport", "value": "Shreveport"}, {"label": "Chattanooga", "value": "Chattanooga"}, {"label": "Fort Lauderdale", "value": "Fort Lauderdale"}, {"label": "Aurora", "value": "Aurora"}, {"label": "Elk Grove", "value": "Elk Grove"}, {"label": "Ontario", "value": "Ontario"}, {"label": "Salem", "value": "Salem"}, {"label": "Cary", "value": "Cary"}, {"label": "Santa Rosa", "value": "Santa Rosa"}, {"label": "Rancho Cucamonga", "value": "Rancho Cucamonga"}, {"label": "Eugene", "value": "Eugene"}, {"label": "Oceanside", "value": "Oceanside"}, {"label": "Clarksville", "value": "Clarksville"}, {"label": "Garden Grove", "value": "Garden Grove"}, {"label": "Lancaster", "value": "Lancaster"}, {"label": "Springfield", "value": "Springfield"}, {"label": "Pembroke Pines", "value": "Pembroke Pines"}, {"label": "Fort Collins", "value": "Fort Collins"}, {"label": "Palmdale", "value": "Palmdale"}, {"label": "Salinas", "value": "Salinas"}, {"label": "Hayward", "value": "Hayward"}, {"label": "Corona", "value": "Corona"}, {"label": "Paterson", "value": "Paterson"}, {"label": "Murfreesboro", "value": "Murfreesboro"}, {"label": "Macon", "value": "Macon"}, {"label": "Lakewood", "value": "Lakewood"}, {"label": "Killeen", "value": "Killeen"}, {"label": "Springfield", "value": "Springfield"}, {"label": "Alexandria", "value": "Alexandria"}, {"label": "Kansas City", "value": "Kansas City"}, {"label": "Sunnyvale", "value": "Sunnyvale"}, {"label": "Hollywood", "value": "Hollywood"}, {"label": "Roseville", "value": "Roseville"}, {"label": "Charleston", "value": "Charleston"}, {"label": "Escondido", "value": "Escondido"}, {"label": "Joliet", "value": "Joliet"}, {"label": "Jackson", "value": "Jackson"}, {"label": "Bellevue", "value": "Bellevue"}, {"label": "Surprise", "value": "Surprise"}, {"label": "Naperville", "value": "Naperville"}, {"label": "Pasadena", "value": "Pasadena"}, {"label": "Pomona", "value": "Pomona"}, {"label": "Bridgeport", "value": "Bridgeport"}, {"label": "Denton", "value": "Denton"}, {"label": "Rockford", "value": "Rockford"}, {"label": "Mesquite", "value": "Mesquite"}, {"label": "Savannah", "value": "Savannah"}, {"label": "Syracuse", "value": "Syracuse"}, {"label": "McAllen", "value": "McAllen"}, {"label": "Torrance", "value": "Torrance"}, {"label": "Olathe", "value": "Olathe"}, {"label": "Visalia", "value": "Visalia"}, {"label": "Thornton", "value": "Thornton"}, {"label": "Fullerton", "value": "Fullerton"}, {"label": "Gainesville", "value": "Gainesville"}, {"label": "Waco", "value": "Waco"}, {"label": "West Valley City", "value": "West Valley City"}, {"label": "Warren", "value": "Warren"}, {"label": "Lakewood", "value": "Lakewood"}, {"label": "Hampton", "value": "Hampton"}, {"label": "Dayton", "value": "Dayton"}, {"label": "Columbia", "value": "Columbia"}, {"label": "Orange", "value": "Orange"}, {"label": "Cedar Rapids", "value": "Cedar Rapids"}, {"label": "Stamford", "value": "Stamford"}, {"label": "Victorville", "value": "Victorville"}, {"label": "Pasadena", "value": "Pasadena"}, {"label": "Elizabeth", "value": "Elizabeth"}, {"label": "New Haven", "value": "New Haven"}, {"label": "Miramar", "value": "Miramar"}, {"label": "Kent", "value": "Kent"}, {"label": "Sterling Heights", "value": "Sterling Heights"}, {"label": "Carrollton", "value": "Carrollton"}, {"label": "Coral Springs", "value": "Coral Springs"}, {"label": "Midland", "value": "Midland"}, {"label": "Norman", "value": "Norman"}, {"label": "Athens", "value": "Athens"}, {"label": "Santa Clara", "value": "Santa Clara"}, {"label": "Columbia", "value": "Columbia"}, {"label": "Fargo", "value": "Fargo"}, {"label": "Pearland", "value": "Pearland"}, {"label": "Simi Valley", "value": "Simi Valley"}, {"label": "Meridian", "value": "Meridian"}, {"label": "Topeka", "value": "Topeka"}, {"label": "Allentown", "value": "Allentown"}, {"label": "Thousand Oaks", "value": "Thousand Oaks"}, {"label": "Abilene", "value": "Abilene"}, {"label": "Vallejo", "value": "Vallejo"}, {"label": "Concord", "value": "Concord"}, {"label": "Round Rock", "value": "Round Rock"}, {"label": "Arvada", "value": "Arvada"}, {"label": "Clovis", "value": "Clovis"}, {"label": "Palm Bay", "value": "Palm Bay"}, {"label": "Independence", "value": "Independence"}, {"label": "Lafayette", "value": "Lafayette"}, {"label": "Ann Arbor", "value": "Ann Arbor"}, {"label": "Rochester", "value": "Rochester"}, {"label": "Hartford", "value": "Hartford"}, {"label": "College Station", "value": "College Station"}, {"label": "Fairfield", "value": "Fairfield"}, {"label": "Wilmington", "value": "Wilmington"}, {"label": "North Charleston", "value": "North Charleston"}, {"label": "Billings", "value": "Billings"}, {"label": "West Palm Beach", "value": "West Palm Beach"}, {"label": "Berkeley", "value": "Berkeley"}, {"label": "Cambridge", "value": "Cambridge"}, {"label": "Clearwater", "value": "Clearwater"}, {"label": "West Jordan", "value": "West Jordan"}, {"label": "Evansville", "value": "Evansville"}, {"label": "Richardson", "value": "Richardson"}, {"label": "Broken Arrow", "value": "Broken Arrow"}, {"label": "Richmond", "value": "Richmond"}, {"label": "League City", "value": "League City"}, {"label": "Manchester", "value": "Manchester"}, {"label": "Lakeland", "value": "Lakeland"}, {"label": "Carlsbad", "value": "Carlsbad"}, {"label": "Antioch", "value": "Antioch"}, {"label": "Westminster", "value": "Westminster"}, {"label": "High Point", "value": "High Point"}, {"label": "Provo", "value": "Provo"}, {"label": "Lowell", "value": "Lowell"}, {"label": "Elgin", "value": "Elgin"}, {"label": "Waterbury", "value": "Waterbury"}, {"label": "Springfield", "value": "Springfield"}, {"label": "Gresham", "value": "Gresham"}, {"label": "Murrieta", "value": "Murrieta"}, {"label": "Lewisville", "value": "Lewisville"}, {"label": "Las Cruces", "value": "Las Cruces"}, {"label": "Lansing", "value": "Lansing"}, {"label": "Beaumont", "value": "Beaumont"}, {"label": "Odessa", "value": "Odessa"}, {"label": "Pueblo", "value": "Pueblo"}, {"label": "Peoria", "value": "Peoria"}, {"label": "Downey", "value": "Downey"}, {"label": "Pompano Beach", "value": "Pompano Beach"}, {"label": "Miami Gardens", "value": "Miami Gardens"}, {"label": "Temecula", "value": "Temecula"}, {"label": "Everett", "value": "Everett"}, {"label": "Costa Mesa", "value": "Costa Mesa"}, {"label": "Ventura", "value": "Ventura"}, {"label": "Sparks", "value": "Sparks"}, {"label": "Santa Maria", "value": "Santa Maria"}, {"label": "Sugar Land", "value": "Sugar Land"}, {"label": "Greeley", "value": "Greeley"}, {"label": "South Fulton", "value": "South Fulton"}, {"label": "Dearborn", "value": "Dearborn"}, {"label": "Concord", "value": "Concord"}, {"label": "Edison", "value": "Edison"}, {"label": "Tyler", "value": "Tyler"}, {"label": "Sandy Springs", "value": "Sandy Springs"}, {"label": "West Covina", "value": "West Covina"}, {"label": "Green Bay", "value": "Green Bay"}, {"label": "Centennial", "value": "Centennial"}, {"label": "Jurupa Valley", "value": "Jurupa Valley"}, {"label": "El Monte", "value": "El Monte"}, {"label": "Allen", "value": "Allen"}, {"label": "Hillsboro", "value": "Hillsboro"}, {"label": "Menifee", "value": "Menifee"}, {"label": "Nampa", "value": "Nampa"}, {"label": "Spokane Valley", "value": "Spokane Valley"}, {"label": "Rio Rancho", "value": "Rio Rancho"}, {"label": "Brockton", "value": "Brockton"}, {"label": "El Cajon", "value": "El Cajon"}, {"label": "Burbank", "value": "Burbank"}, {"label": "Inglewood", "value": "Inglewood"}, {"label": "Renton", "value": "Renton"}, {"label": "Davie", "value": "Davie"}, {"label": "Rialto", "value": "Rialto"}, {"label": "Boulder", "value": "Boulder"}, {"label": "South Bend", "value": "South Bend"}, {"label": "Woodbridge", "value": "Woodbridge"}, {"label": "Vacaville", "value": "Vacaville"}, {"label": "Wichita Falls", "value": "Wichita Falls"}, {"label": "Lee's Summit", "value": "Lee's Summit"}, {"label": "Edinburg", "value": "Edinburg"}, {"label": "Chico", "value": "Chico"}, {"label": "San Mateo", "value": "San Mateo"}, {"label": "Bend", "value": "Bend"}, {"label": "Goodyear", "value": "Goodyear"}, {"label": "Buckeye", "value": "Buckeye"}, {"label": "Daly City", "value": "Daly City"}, {"label": "Fishers", "value": "Fishers"}, {"label": "Quincy", "value": "Quincy"}, {"label": "Davenport", "value": "Davenport"}, {"label": "Hesperia", "value": "Hesperia"}, {"label": "New Bedford", "value": "New Bedford"}, {"label": "Lynn", "value": "Lynn"}, {"label": "Carmel", "value": "Carmel"}, {"label": "Longmont", "value": "Longmont"}, {"label": "Tuscaloosa", "value": "Tuscaloosa"}, {"label": "Norwalk", "value": "Norwalk"}];

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