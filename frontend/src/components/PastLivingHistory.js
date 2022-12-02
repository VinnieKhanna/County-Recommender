// React, Router Imports
import { useNavigate } from "react-router";
import { useState } from "react";

// MUI Imports
import React from 'react'
import { Typography, Button, Box } from "@mui/material";
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';


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
    // const newData = addData();
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
        <Box sx={{mt: "2em"}}>
            <Typography variant="h3" gutterBottom>
                Past Living History
            </Typography>
            <br/>
        </Box>

        <Box>
        <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
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
      </div>

    );
  }
