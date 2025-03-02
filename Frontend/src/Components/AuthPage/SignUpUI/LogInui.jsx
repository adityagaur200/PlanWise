"use client";
import React, { useState } from "react";
import { Label } from "./label.jsx";
import { Input } from "./input.jsx";
import { cn } from "../../../libs/utils.jsx";
import { Link } from "@mui/material";

export function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3030/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.status === 401) {
        setError("Invalid username or password.");
        setLoading(false);
        return;
      }

      const contentType = response.headers.get("content-type");

      let token = null;
      if (!contentType || !contentType.includes("application/json")) {
        token = await response.text();
      } else {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Login failed. Please check your credentials.");
        }
        token = data.token;
      }

      if (!token) {
        setError("Login failed: No token received.");
        setLoading(false);
        return;
      }

      console.log("Received JWT Token:", token);

      // Store token and username in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", formData.username); // Store username

      window.location.href = "/"; // Redirect after successful login
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">UserName</Label>
          <Input 
            id="username" 
            placeholder="User Name"
            value={formData.username} 
            onChange={handleChange} 
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            placeholder="••••••••" 
            type="password" 
            value={formData.password} 
            onChange={handleChange} 
          />
        </LabelInputContainer>

        {/* Display error message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In →"}
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <p className="text-amber-50 cursor-pointer text-center">
            Don't have an account? <Link href="/SignUp">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
