// React, Router Imports
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

// MUI Imports
import React from 'react'
import { Typography, Button, Box, Grid, FormControl } from "@mui/material";
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InfoIcon from '@mui/icons-material/Info';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Snackbar from "@mui/material/Snackbar";

// Data Imports
import { states } from "../data/states";
import counties from "../data/counties.json";

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
const locationImpList = []
function createData(
    county,
    state,
    locationImp
  ) {
    return { county, state, locationImp };
  }

  const rows = []; 
  
export default function PastLivingHistory(props) {
    const navigate = useNavigate();

    const [countySelectList, setCountySelectList] = useState([])
 
    const [state, setState] = useState('')
    const [county, setCounty] = useState('')
    const [locationImp, setLocationImp] = useState('')    

    const [stateError, setStateError] = useState(false)
    const [countyError, setCountyError] = useState(false)
    const [locationImpError, setLocationImpError] = useState(false)

    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState("");

  
    // On selected state changing, change counties on dropdown
    useEffect(() => {
      if (state !== undefined && state != null && state !== '') {
        setCountySelectList(counties[state])
      }
    }, [state])

    const handleAdd = () => {
      // e.preventDefault()

      setStateError(false)
      setCountyError(false)
      setLocationImpError(false)

      if (state === '') {
        setStateError(true)
      }

      if (county === '') {
        setCountyError(true)
      }

      if (locationImp === '') {
        setLocationImpError(true)
      }

      else if (countyList.includes(county) && stateList.includes(state)) {
        setCountyError(true)
        alert("County already entered")
      }

      else if (state && county && locationImp) {
        rows.push(createData(county, state, locationImp))
        countyList.push(county)
        stateList.push(state)
        locationImpList.push(locationImp)
        setState('')
        setCounty('')
        setLocationImp('')
      }
    }

    const handleSubmit = () => {
      fetch("/add_living_history", {
        method: "POST",
        body: JSON.stringify(rows),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `JWT ${props.token}`
        }
      }).then(res => {
        switch(res.status) {
          case 200:
            setMsg("Successfully updated living history")
            navigate("/recommendations")
            break
          case 401:
            setMsg("Unauthorized. Try signing out and back in.")
            break
          default:
            setMsg(`${res.status}: Failed to update history - Unknown.`)
            break
        }
        setOpen(true)
      })
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
                                Living History
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Typography variant="caption" sx={{ display: "flex", justifyContent: "space-between", ml:2, mt:1, color: "#424242" }}>
                                Please input the counties you have lived in before
                    </Typography> 
                </Grid>
                <Grid item xs={6} md={6}></Grid>
            </Grid>
            <br/>           
            <Box>
            <TableContainer component={Paper} sx={{ flexGrow: 1, mx:'auto' }}>
                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                <colgroup>
                    <col width="35%" />
                    <col width="35%" />
                    <col width="30%" />
                </colgroup>
                    <TableHead>
                    <TableRow sx={{ flexGrow: 1, mx:'auto', backgroundColor:'#1876d1' }}>
                        <StyledTableCell>County</StyledTableCell>
                        <StyledTableCell>State</StyledTableCell>
                        <StyledTableCell align="center">Location Importance</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.state}>
                            <StyledTableCell>{row.county}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                {row.state}
                            </StyledTableCell>
                            <StyledTableCell align="center">{row.locationImp}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Box>
            <br></br>
            <Box>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack 
                direction="row" 
                alignItems="center" 
                justifyContent="center">
                    <Grid container spacing={5}>
                        <Grid item xs={3} md={3}>
                            <FormControl style={{minWidth: 150}}>
                                <InputLabel id="demo-simple-select-label">County</InputLabel>
                                <Select
                                onChange={(e) => setCounty(e.target.value)}
                                label="County"
                                value={county} 
                                variant="outlined"
                                required
                                error = {countyError} >
                                    {countySelectList.map((county, idx) => <MenuItem key={idx} value={county}>{county}</MenuItem>)}
                                </Select>
                            </FormControl>  
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <FormControl style={{minWidth: 150}}>
                                <InputLabel id="demo-simple-select-label">State</InputLabel>
                                <Select
                                onChange={(e) => setState(e.target.value)}
                                label="State"
                                value={state} 
                                variant="outlined"
                                required
                                error = {stateError} >
                                    {states.map((state, idx) => <MenuItem key={idx} value={state}>{state}</MenuItem>)}
                                </Select>
                            </FormControl>  
                        </Grid>                  
                        
                        <Grid item xs={4} md={4}>
                            <FormControl style={{minWidth: 200}}>
                                <InputLabel id="demo-simple-select-label">Location Importance</InputLabel>
                                <Select
                                value={locationImp}
                                label="Location Importance"
                                onChange={(e) => setLocationImp(e.target.value)}
                                required
                                error = {locationImpError} >
                                    <MenuItem value={0}>{0}</MenuItem>
                                    <MenuItem value={1}>{1}</MenuItem>
                                    <MenuItem value={2}>{2}</MenuItem>
                                    <MenuItem value={3}>{3}</MenuItem>
                                    <MenuItem value={4}>{4}</MenuItem>
                                    <MenuItem value={5}>{5}</MenuItem>
                                    <MenuItem value={6}>{6}</MenuItem>
                                    <MenuItem value={7}>{7}</MenuItem>
                                    <MenuItem value={8}>{8}</MenuItem>
                                    <MenuItem value={9}>{9}</MenuItem>
                                    <MenuItem value={10}>{10}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} md={2}>
                            <Button 
                            variant="contained"
                            size = "large"
                            sx={{ mt: 1 }}
                            onClick={() => handleAdd()}>                +
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </form>
            </Box>
            <br/><br/>
            <Button 
            variant="contained"
            size = "large"
            onClick={handleSubmit}>
            Submit Living History
            </Button>
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
