// React, Router Imports
import { useNavigate } from "react-router";

// MUI Imports
import { Typography, Button, Box } from "@mui/material";

export default function PastLivingHistory() {
    const navigate = useNavigate();
    return (
        <Box sx={{mt: "2em"}}>
            <Typography variant="h3" gutterBottom>
                Past Living History Page
            </Typography>
            <br/>
            <Button variant="outlined" onClick={() => navigate("/recommendations")}>
                Compile Recommendations
            </Button>
        </Box>
    )
}