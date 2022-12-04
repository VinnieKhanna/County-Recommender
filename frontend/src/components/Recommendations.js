import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router";

// MUI Imports
import { Button, Box, Link } from "@mui/material";
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
        }).then(async res => {
            switch(res.status) {
                case 200:
                    let recObj = await res.json();
                    setRecs(recObj);
                    break
                default:
                    setMsg("Error getting recommendations");
                    setOpen(true);
                    break
            }
        })
    }, [])
        return (
            <div>
      
      <Box sx={{pt:"5em"}}>
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
                  <StyledTableCell>Distance</StyledTableCell>
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
        <Snackbar
            open={open}
            autoHideDuration={6000}
            message={msg}
            onClose={()=>setOpen(false)}
        />
        </div>
      
    );
}