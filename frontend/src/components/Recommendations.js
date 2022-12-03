import React, { useEffect } from 'react'
import { useNavigate } from "react-router";
import { useState } from "react";

// MUI Imports
import { Typography, Button, Box } from "@mui/material";
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Rating from '@mui/material/Rating';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


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
const countyList = []
const stateList = []
const options = [
  {label: 'React',      value: 'react'},
  {label: 'JavaScript', value: 'js'   },
  {label: 'TypeScript', value: 'ts'   }
];
function createData(
    state,
    county,
  ) {
    return { state, county };
  }

  const rows = [
     createData("Georgia", "Fulton"),
     createData("Georgia", "Dekalb"),
     createData("Georgia", "Gwinnett"),
     createData("Alabama", "Jefferson"),
     createData("Alabama", "Montgomery"),
  ];
  
export default function Recommendations(props) {
    useEffect(() => {
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
        }).then(res => {
            console.log(res)
        })
    }, [])
        return (
            <div>
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
                  County Recommender
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
                      <Box sx={{mt: "2em"}}>
                  <Typography variant="h3" gutterBottom>
                      Recommendations
                  </Typography>
                  <br/>
              </Box>
      
      <Box>
          <Stack><Stack 
      direction="row" 
      alignItems="center" 
      justifyContent="center"
      spacing={2}>
      <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>State</StyledTableCell>
                  <StyledTableCell>County</StyledTableCell>
                  <StyledTableCell align="center">Suggestion Rating</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.state}>
                    <StyledTableCell 
                    component="th" 
                    scope="row"
                    >
                      {row.state}
                    </StyledTableCell>
                    <StyledTableCell>{row.county}</StyledTableCell>
                    <StyledTableCell align="center"><Rating name="size-large" defaultValue={0} size="large" /></StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
            </Stack></Stack>
      
        </Box>
        <br></br>
      
            <br></br>
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
        variant="contained"
        size = "large"
        onClick={() => navigate("/recommendations")}>
        Submit Feedback
        </Button>
        </Stack>
        </Box>
        </div>
      
    );
}