import { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Box, Typography, TextField, Grid, Stack, Container, InputAdornment, IconButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../slices/userApiSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import Avatar from "@mui/material/Avatar";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  const [showPassword, setShowPassword] = useState(false);

const handleClickShowPassword = () => setShowPassword(!showPassword);


  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password didn't match.");
      return;
    }
    try {
      let resp = await signup({
        username,
        email,
        password,
        primaryPhone,
      }).unwrap();
      dispatch(setCredentials(resp.user));
      toast.success(resp.message);
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  return (
    <Container maxWidth="xs">
      {" "}
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
          <PersonAddAltOutlinedIcon />
        </Avatar>
        <Typography variant="h5" component="h1">
          Welcome! Join the Family
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Create an account to get started
        </Typography>
      </Box>
      <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
        <TextField
          fullWidth
          label="Name*"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email*"
          variant="outlined"
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password*"
          variant="outlined"
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Confirm Password*"
          variant="outlined"
          margin="normal"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <TextField
          fullWidth
          label="Contact"
          variant="outlined"
          margin="normal"
          value={primaryPhone}
          onChange={(e) => setPrimaryPhone(e.target.value)}
          required
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </Box>
      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
        <Typography variant="body2">
          Already a member? <Link to="/login">Login</Link>
        </Typography>
      </Stack>
    </Container>
  );
};

export default RegisterPage;
