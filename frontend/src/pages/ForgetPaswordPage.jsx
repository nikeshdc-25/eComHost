import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { toast } from "react-toastify";
import {
  useChangePasswordMutation,
  useSendOtpMutation,
} from "../slices/userApiSlice";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [sendOtp] = useSendOtpMutation(); // Mutation hook for sending OTP
  const [changePassword] = useChangePasswordMutation(); // Mutation hook for changing password

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      let resp = await sendOtp({ email }).unwrap(); // Sending email to the backend
      setOtpSent(true);
      setTimer(60); // Set timer for 1 minute
      toast.success(resp.message); // Use response.message if available
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      let resp = await changePassword({
        email,
        otp,
        newPassword,
      }).unwrap(); // Sending OTP and new password to backend
      toast.success(resp.message);
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpSent}
          />
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={handleSendOtp}
            disabled={!email || timer > 0}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP"}
          </Button>
          {otpSent && (
            <Box sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Enter 6-digit OTP"
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{ maxLength: 6 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="newPassword"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleVerifyOtp}
                disabled={
                  !otp ||
                  otp.length !== 6 ||
                  !newPassword ||
                  newPassword !== confirmPassword
                }
              >
                Verify OTP and Change Password
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
