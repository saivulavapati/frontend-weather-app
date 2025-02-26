import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import config from "../utils/config";
import { useAuth } from "../context/AuthContext"
import { TextField, Button, Container, Typography, Alert, Box,Link } from "@mui/material";

const LoginForm = () => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const { setIsAuthenticated} = useAuth();

  const { API_BASE_URL } = config;

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values, { setSubmitting,setErrors }) => {
    setServerError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setIsAuthenticated(true);
        navigate("/weather");
      } else if (response.status === 404) {
        setServerError("User does not exist. Please register.");
      } else if (response.status === 401) {
        setServerError("Invalid email or password.");
      }else if(response.status === 400 && data.errors){
        setErrors(data.errors)
      }
       else {
        setServerError(data.message || "An unexpected error occurred.");
      }
    } catch (error) {
      console.log(error)
      setServerError("An unexpected error occurred. Please try again.");
    }
    setSubmitting(false);
  };


  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 3, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper" }}>
        <Typography variant="h6" align="center" gutterBottom>
          Login
        </Typography>
        {serverError && <Alert severity="error">{serverError}</Alert>}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleChange, handleBlur, values, errors, touched }) => (
            <Form>
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
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Button fullWidth variant="contained" color="primary" type="submit" disabled={isSubmitting} sx={{ mt: 2 }}>
                {isSubmitting ? "Logging In..." : "Log In"}
              </Button>
            </Form>
          )}
        </Formik>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link component="button" onClick={()=> navigate("/register")}>Register</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginForm;
