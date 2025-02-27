import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import config from "../utils/config";
import { TextField, Button, Container, Typography, Alert, Box, Stack } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const [serverError, setServerError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { API_BASE_URL } = config;
  const {user} = useAuth();
  console.log(user)
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users?email=${user}`, {
          method: "GET",
          credentials: "include", 
        });
        console.log(response)
        const data = await response.json();
        console.log(data)
        if (response.ok) {
          setUserDetails(data);
        } else {
          throw new Error(data.error || "Failed to fetch profile");
        }
      } catch (error) {
        setServerError(error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required").min(2, "Must be at least 2 characters"),
    lastName: Yup.string().required("Last name is required").min(1, "Must be at least 2 characters"),
    dateOfBirth: Yup.date().required("Date of birth is required").max(new Date(), "Date of birth must be in the past"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    // setServerError("");

    // try {
    //   const response = await fetch(`${API_BASE_URL}/users/profile`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "include",
    //     body: JSON.stringify(values),
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error(data.error || "Update failed");
    //   }

    //   setUserDetails(data);
    //   alert("Profile updated successfully!");
    //   setIsEditing(false); // Disable editing mode after update
    // } catch (error) {
    //   setServerError(error.message);
    // }

    // setSubmitting(false);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 3, p: 2, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper" }}>
        <Typography variant="h6" align="center" gutterBottom>
          Profile
        </Typography>

        {serverError && <Alert severity="error">{serverError}</Alert>}

        <Formik
          enableReinitialize
          initialValues={userDetails}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                />
              </Stack>

              <TextField
                fullWidth
                margin="dense"
                label="Email"
                name="email"
                type="email"
                value={values.email}
                disabled // Email is non-editable
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
                disabled={!isEditing}
              />

              {isEditing ? (
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button fullWidth variant="contained" color="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button fullWidth variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </Stack>
              ) : (
                <Button fullWidth variant="contained" color="primary" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
                  Update Profile
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Profile;
