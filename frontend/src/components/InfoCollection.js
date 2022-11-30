import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

// MUI Imports
import { Typography, Button, Box } from "@mui/material";
import Slider from '@mui/material/Slider';

export default function InfoCollection() {
  const navigate = useNavigate();
  const [counties, setCounties] = useState([]);
  useEffect(() => {
    fetch("/get_counties?state=GA").then(async res => {
        const json = await res.json();
        console.log(json);
        setCounties(json);
    })
  }, [])

    return (
        <Box sx={{mt: "2em"}}>
           <Typography variant="h3" gutterBottom>
                Info Collection Page            
            </Typography>
            <br/>
            <Button variant="outlined" onClick={() => navigate("/past-counties")}>
                Living History
            </Button>
            {counties.map(e => (
                <Typography>
                    {e}
                </Typography>
            ))}
        </Box>
    )
}
