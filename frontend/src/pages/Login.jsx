import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

/**
 * LoginPage Component
 *
 * Purpose:
 * Renders a login form for returning users. On submission, user login details are validated client-side.
 * If the login is successful, user details are stored in sessionStorage.
 * Tailwind CSS used for styling. Designed to follow Registration with a smooth flow for users.
 */

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  // Validation schema for login
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
  try {
    const res = await fetch(`http://localhost:3001/users?email=${values.email}`);
    const users = await res.json();

    if (users.length > 0 && users[0].password === values.password) {
      const user = users[0];
      sessionStorage.setItem("user", JSON.stringify(user));
      setStatus({ success: "Login successful!" });
      if (onLoginSuccess) onLoginSuccess(user);
      resetForm();
      navigate("/"); // Navigate to homepage or dashboard
    } else {
      setStatus({ error: "Invalid email or password" });
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
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={formik.handleSubmit}>
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
          <div className="text-red-500 text-sm mb-4">{formik.errors.password}</div>
        )}

        {formik.status && formik.status.success && (
          <div className="text-green-600 mb-2">{formik.status.success}</div>
        )}
        {formik.status && formik.status.error && (
          <div className="text-red-600 mb-2">{formik.status.error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
        >
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>
        <span>New to our store ?</span><br />
        <button  onClick={() => navigate('/registration')}>Register</button>
       
      </form>
    </div>
  );
};

export default LoginPage;
