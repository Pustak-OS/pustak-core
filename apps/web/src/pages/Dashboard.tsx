import React from "react";
import { signOut } from "supertokens-auth-react/recipe/session";

const Dashboard = () => {
  async function onLogout() {
    await signOut();
    window.location.href = "/auth"; // or redirect to wherever the login page is
  }
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard!</p>
      <button
        onClick={() => {
          onLogout();
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
