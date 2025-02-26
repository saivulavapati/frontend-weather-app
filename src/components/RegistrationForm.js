import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import config from "../utils/config";
import { TextField, Button, Container, Typography, Alert, Box, Stack } from "@mui/material";


const RegistrationForm = () => {
  const [serverError, setServerError] = useState("");
  const { API_BASE_URL } = config;
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required").min(2, "Must be at least 2 characters"),
    lastName: Yup.string().required("Last name is required").min(1, "Must be at least 2 characters"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    dateOfBirth: Yup.date().required("Date of birth is required").max(new Date(), "Date of birth must be in the past"),
    password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    setServerError("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setErrors(data);
        } else {
          throw new Error(data.error || "Something went wrong!");
        }
        return;
      }

      alert("Registration Successful!");
      resetForm();
      navigate("/")
      
    } catch (error) {
      setServerError(error.message);
    }

    setSubmitting(false);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 3, p: 2, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper" }}>
        <Typography variant="h6" align="center" gutterBottom>
          Registration Form
        </Typography>
        {serverError && <Alert severity="error">{serverError}</Alert>}

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            dateOfBirth: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleChange, handleBlur, values, errors, touched }) => (
            <Form>
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="First Name"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Stack>

              <TextField
                fullWidth
                margin="dense"
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                fullWidth
                margin="dense"
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={values.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
              />

              <TextField
                fullWidth
                margin="dense"
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <TextField
                fullWidth
                margin="dense"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />

              <Button fullWidth variant="contained" color="primary" type="submit" disabled={isSubmitting} sx={{ mt: 2 }}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default RegistrationForm;
