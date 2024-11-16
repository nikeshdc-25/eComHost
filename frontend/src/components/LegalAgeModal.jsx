import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/joy";

const LegalAgeModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isLegal = localStorage.getItem("isLegalToSmoke");
    if (!isLegal) {
      setOpen(true);
    }
  }, []);

  const handleConfirm = (isLegal) => {
    if (isLegal) {
      localStorage.setItem("isLegalToSmoke", "true");
      setOpen(false);
    } else {
      window.location.href = "about:blank";
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {}}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          color: "black",
          p: 4,
          textAlign: "center",
          maxWidth: 600,
          width: "90%",
          boxShadow: "none",
          borderTop: "20px solid green",
        }}
      >
        <Typography
          mb={3}
          sx={{ fontWeight: "bold", fontSize: "24px" }}
        >
          Age Verification Required
        </Typography>
        <Typography mb={3}>
          This website contains age-restricted content. Please confirm your age.
        </Typography>
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Button
            variant="solid"
            color="success"
            onClick={() => handleConfirm(true)}
            sx={{ width: "48%", padding: "10px" }}
          >
            I am over 18
          </Button>
          <Button
            variant="solid"
            color="danger"
            onClick={() => handleConfirm(false)}
            sx={{ width: "48%", padding: "10px" }}
          >
            I am under 18
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LegalAgeModal;
