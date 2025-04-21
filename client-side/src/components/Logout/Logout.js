import React from "react";

export function Logout({ setUser }) {
  const handleLogout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const refreshToken = user?.refreshToken;

    if (!refreshToken) {
      alert("No refresh token found.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
      });

      if (response.ok) {
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem("user");
        setUser(null);
        alert("Logged out successfully.");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to log out.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred while logging out.");
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout
    </button>
  );
}