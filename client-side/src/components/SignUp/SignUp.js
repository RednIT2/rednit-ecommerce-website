import React, { useState } from "react";

export function SignUp({ closeModal }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("User registered successfully!");
        closeModal(); // Đóng modal sau khi đăng ký thành công
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-green-100 to-green-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-green-600">Sign Up</h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
        onClick={handleSignUp}
      >
        Sign Up
      </button>
    </div>
  );
}