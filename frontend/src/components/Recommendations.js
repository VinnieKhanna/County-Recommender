import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router";

// MUI Imports
import { Button, Box, Link, Grid, Typography } from "@mui/material";
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Snackbar from "@mui/material/Snackbar";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InfoIcon from '@mui/icons-material/Info';

// Data Imports
import wikipedias from "../data/wikipedias.json"
import abbrevs from "../data/abbreviations.json"


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

  
export default function Recommendations(props) {
    const navigate = useNavigate();
    const [recs, setRecs] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchRecommendations = () => {
        setLoading(true);
        // Can't use props.token here since it may not have loaded yet
        // Need synchronous check to local/session
        let local = localStorage.getItem("flask-jwt-token");
        let session = sessionStorage.getItem("flask-jwt-token");
        let token = local ? local : session;
        fetch("/get_recommendations", {
            method: "GET",
            headers: {
                "Authorization" : `JWT ${token}`
            }
        }).then(async res => {
            switch(res.status) {
                case 200:
                    res.json().then((recObj) => {
                        setRecs(recObj);
                        setLoading(false);
                    })
                    break
                default:
                    setMsg("Error getting recommendations");
                    setOpen(true);
                    setLoading(false);
                    break
            }
        })
    }

    useEffect(fetchRecommendations, [])

    const submitRatings = () => {
        setLoading(true)
        fetch("/add_ratings", {
            method: "POST",
            body: JSON.stringify(recs),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${props.token}`
            }
        }).then(async res => {
            switch(res.status) {
                case 200:
                    setMsg("Submitted feedback, re-compiling recs")
                    fetchRecommendations()
                    break
                default:
                    setMsg("Error submitting ratings")
            }
            setOpen(true);
        })
    }

    const handleRatingChange = (event, newvalue, idx) => {
        let newRecs = recs.slice()
        newRecs[idx]["Rating"] = newvalue == null ? 0 : newvalue
        setRecs(newRecs)
    }

    
    return (
        <div>
            <br/>              
            <br/>
            <Box sx={{flexGrow: 1, mx:'auto', width:'90%'}}>
            <Grid container spacing={5}>
                <Grid item xs={6} md={6}>
                    <AppBar sx={{ borderRadius: '16px' }} position="static">
                        <Toolbar variant="dense">
                            <InfoIcon />
                            <Typography display="block" variant="overline" component="div" sx={{ flexGrow: 1 }}>
                                Recommendations
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Typography variant="caption" sx={{ display: "flex", justifyContent: "space-between", ml:2, mt:1, color: "#424242" }}>
                            Calculated recommendations based on user inputs
                    </Typography> 
                </Grid>
            </Grid>
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="primary" />
            </Backdrop>
            <br/>
            <Box>
                <Stack>
                    <Stack 
                    direction="row" 
                    alignItems="center" 
                    justifyContent="center"
                    spacing={2}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 500 }} aria-label="customized table">
                                <colgroup>
                                    <col width="25%" />
                                    <col width="25%" />
                                    <col width="25%" />
                                    <col width="25%" />
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                    <StyledTableCell>State</StyledTableCell>
                                    <StyledTableCell>County</StyledTableCell>
                                    <StyledTableCell>Distance (mi)</StyledTableCell>
                                    <StyledTableCell align="center">Suggestion Rating</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recs.map((row, idx) => (
                                    <StyledTableRow key={idx}>
                                        <StyledTableCell 
                                        component="th" 
                                        scope="row"
                                        >
                                        {row['State']}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Link href={wikipedias[abbrevs[row['State']]][row['County'].split(" ")[0]]}>
                                                {row['County']}
                                            </Link>
                                        </StyledTableCell>
                                        <StyledTableCell>{row['Distance'] === 'N/A' ? 'N/A' : Math.round(row['Distance'] * 100)/100 }</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Rating name="size-large" value={row['Rating']} onChange={(e, newVal) => handleRatingChange(e, newVal, idx)} size="large" />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Stack>
            </Box>
            <br/>
            <br/>
            <Box>
      <Stack alignItems="center" 
      justifyContent="center" direction="row" spacing={2}>
      <Button 
        variant="contained"
        size = "large"
        onClick={() => navigate("/info-collection")}>
        Edit Preferences
        </Button>
      
        <Button 
        variant="outlined"
        size = "large"
        onClick={submitRatings}>
        Submit Feedback
        </Button>
        </Stack>
        </Box>
        <Snackbar
            open={open}
            autoHideDuration={6000}
            message={msg}
            onClose={()=>setOpen(false)}
        />
        </Box>
        </div>
      
    );
}