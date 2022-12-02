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



export default function SignUp(props) {
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState("");
    const checkboxRef = React.useRef();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!validate_fields(data)) {
            setMsg("All fields must be at least 4 characters, no spaces.");
        } else {
            fetch("/insert_user", {
                method: 'POST',
                body: data
            }).then(async res => {
                switch(res.status) {
                    // Have to explicitly auth cause flask-jwt is annoying
                    case 200:
                        const auth_data = {
                            "username": data.get("username"), 
                            "password": data.get("password")
                        }
                        fetch("/auth", {
                            method: 'POST',
                            body: JSON.stringify(auth_data),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }).then(async response => {
                            if (response.status === 200) {
                                setMsg("Account Creation Success")
                                let jwt = await response.json()
                                let token = jwt["access_token"]
                                if (checkboxRef.current.children[0].checked) {
                                    localStorage["flask-jwt-token"] = token
                                } else {
                                    sessionStorage["flask-jwt-token"] = token
                                }
                                props.setToken(token)
                                props.setUser(data.get("username"))
                                localStorage["username"] = data.get("username")
                                setTimeout(() => navigate("/info-collection"), 100)
                            } else {
                                setMsg("Account Creation Failed - Unknown")   
                            }
                        });
                        break
                    case 409:
                        setMsg("Account Creation Failed - Duplicate Username")
                        break
                    default:
                        setMsg("Account Creation Failed - Unknown")
                }
            })
        }
        setOpen(true);
    };

    const validate_fields = (formData) => {
        for (let field of formData.entries()) {
            if (field[1] == null || field[1].trim() === '' 
            || field[1].length < 4 || field[1].includes(' ')) {
                return false;
            }
        }
        return true;
    }

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
            Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                />
                </Grid>
            </Grid>
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
                Sign Up
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                message={msg}
                onClose={()=>setOpen(false)}
            />
            <Grid container justifyContent="flex-start">
                <Grid item>
                <NavLink to="/login">
                    Already have an account? Sign in
                </NavLink>
                </Grid>
            </Grid>
            </Box>
        </Box>
        </Container>
    );
}