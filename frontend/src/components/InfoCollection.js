import { useNavigate } from "react-router";

// MUI Imports
import { Typography, Button, Box } from "@mui/material";

export default function InfoCollection() {
  const navigate = useNavigate();

    return (
        <Box sx={{mt: "2em"}}>
           <Typography variant="h3" gutterBottom>
                Info Collection Page            
            </Typography>
            <br/>
            <Button variant="outlined" onClick={() => navigate("/past-counties")}>
                Living History
            </Button>
        </Box>
    )
}
