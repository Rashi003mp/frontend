import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

/**
 * RegistrationForm Component
 *
 * Purpose:
 * Renders a registration form for new users. On submission, user details are validated client-side with Formik/Yup, and then sent via HTTP POST to http://localhost:3001/users for storage in your database.
 * Tailwind CSS is used for responsive styling. Redux is NOT required.
 */
const RegistrationForm = () => {
  // Define validation schema using Yup
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
  try {
    // STEP 1: Check if the email already exists in the database
    const checkEmail = await fetch(`http://localhost:3001/users?email=${values.email}`);
    const result = await checkEmail.json();

    if (result.length > 0) {
      // If email exists, show error and stop registration
      setStatus({ error: "Email already registered. Please use another." });
      setSubmitting(false);
      return; // stop here
    }

    // STEP 2: Proceed to register the new user
    const userData = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      setStatus({ success: "Registration successful!" });
      resetForm();
      navigate('/login'); // Go to login after success
    } else {
      const errorData = await response.json();
      setStatus({ error: errorData.message || "Registration failed." });
    }
  } catch (error) {
    setStatus({ error: "Server error. Please try again later." });
  }

  setSubmitting(false);
}
,
  });
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Name Field */}
        <label className="block mb-2 font-medium text-gray-700" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm mb-2">{formik.errors.name}</div>
        )}

        {/* Email Field */}
        <label className="block mb-2 font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm mb-2">{formik.errors.email}</div>
        )}

        {/* Password Field */}
        <label className="block mb-2 font-medium text-gray-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm mb-2">{formik.errors.password}</div>
        )}

        {/* Confirm Password Field */}
        <label className="block mb-2 font-medium text-gray-700" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="text-red-500 text-sm mb-4">{formik.errors.confirmPassword}</div>
        )}

        {/* Status Messages */}
        {formik.status && formik.status.success && (
          <div className="text-green-600 mb-2">{formik.status.success}</div>
        )}
        {formik.status && formik.status.error && (
          <div className="text-red-600 mb-2">{formik.status.error}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
        >
          {formik.isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
