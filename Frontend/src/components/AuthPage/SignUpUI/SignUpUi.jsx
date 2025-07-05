"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Label } from "./label.jsx";
import { Input } from "./input.jsx";
import { cn } from "@/libs/utils";

export function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:3030/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // ✅ Store JWT token and username in localStorage
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("username", data.username);

      alert("Signup successful!");
      navigate("/"); 
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
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="User Name" type="text" onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="project@gmail.com" type="email" onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" onChange={handleChange} />
        </LabelInputContainer>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button className="bg-black w-full text-white rounded-md h-10 font-medium" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up →"}
        </button>
      </form>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
