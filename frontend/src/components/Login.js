import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';

// Code adapted from template:
// https://github.com/mui/material-ui/tree/v5.10.16/docs/data/material/getting-started/templates

export default function Login(props) {
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState("");
    const checkboxRef = React.useRef();
    const navigate = useNavigate();

    React.useEffect(() => {
        // if you alr have a token you shouldn't be on this page. redirect.
        if (props.token != null) { 
            navigate("/info-collection")
        }
    }, [props.token, navigate])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // Request JWT token from Flask /auth endpoint
        fetch("/auth", {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(data)),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async res => {
            switch(res.status) {
                case 200:
                    setMsg("Login Success")
                    let jwt = await res.json()
                    let token = jwt["access_token"]
                    if (checkboxRef.current.children[0].checked) {
                        localStorage["flask-jwt-token"] = token
                    } else {
                        sessionStorage["flask-jwt-token"] = token
                    }
                    props.setToken(token)
                    props.setUser(data.get("username"))
                    localStorage["username"] = data.get("username")
                    setTimeout(() => navigate("/info-collection"), 1000)
                    break
                case 401:
                    setMsg("Login Failed - Incorrect Password")
                    break
                default:
                    setMsg("Login Failed - Unknown")
            }
            setOpen(true);
        })
    };

    return (
        <Container component="main" maxWidth="xs">
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
            />
            <FormControlLabel
                control={<Checkbox ref={checkboxRef} value="remember" color="primary" />}
                label="Remember me"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                message={msg}
                onClose={()=>setOpen(false)}
            />
            <Grid container>
                <Grid item>
                <NavLink to="/sign-up">
                    {"Don't have an account? Sign Up"}
                </NavLink>
                </Grid>
            </Grid>
            </Box>
        </Box>
        </Container>
    );
}