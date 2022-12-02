// React, Router Imports
import { useNavigate } from "react-router";
import { useState } from "react";

// MUI Imports
import React from 'react'
import { Typography, Button, Box, Grid } from "@mui/material";
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';


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
function createData(
    state,
    county,
  ) {
    return { state, county };
  }

  const rows = [
     
  ];
  
export default function PastLivingHistory() {
    const navigate = useNavigate();
    
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const [state, setState] = useState('')
    const [county, setCounty] = useState('')
    const [stateError, setStateError] = useState(false)
    const [countyError, setCountyError] = useState(false)

    const handleSubmit = (e) => {
      // e.preventDefault()

      setStateError(false)
      setCountyError(false)

      if (state === '') {
        setStateError(true)
      }

      if (county === '') {
        setCountyError(true)
      }


      else if (countyList.includes(county) && stateList.includes(state)) {
        setCountyError(true)
        alert("County already entered")
      }

      else if (state && county) {
        rows.push(createData(state, county))
        countyList.push(county)
        stateList.push(state)
        console.log(countyList)
        setState('')
        setCounty('')
      }
    }

    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                display: { xs: 'block', md: 'block' },
                                }}
                            >
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" onClick={() => navigate("/info-collection")}>Preference Settings</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" onClick={() => navigate("/past-counties")}>Living History</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" onClick={() => navigate("/recommendations")}>Recommendations</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                        <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'flex' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                        >
                        County Recommender
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
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
                    <TableHead>
                    <TableRow sx={{ flexGrow: 1, mx:'auto', backgroundColor:'#1876d1' }}>
                        <StyledTableCell>State</StyledTableCell>
                        <StyledTableCell>County</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.state}>
                        <StyledTableCell component="th" scope="row">
                            {row.state}
                        </StyledTableCell>
                        <StyledTableCell>{row.county}</StyledTableCell>
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
            justifyContent="center"
            spacing={2}>
                <TextField onChange={(e) => setState(e.target.value)} 
                label="State"
                value={state} 
                variant="outlined"
                required
                error = {stateError} />

                <TextField onChange={(e) => setCounty(e.target.value)}  
                label="County"
                value={county} 
                variant="outlined"
                required
                error = {countyError} /> 

                <Button 
                variant="contained"
                size = "large"
                sx={{ mt: 1 }}
                onClick={() => handleSubmit()}>                +
                </Button>
                </Stack>
                </form>
                </Box>
                <br></br>
            <Button 
            variant="contained"
            size = "large"
            onClick={() => navigate("/recommendations")}>
            Submit Living History
            </Button>
        </Box>
    </div>

    );
  }
