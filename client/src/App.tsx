import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
// FIXED: Path matches your exact explorer tree layout now
import { Dashboard } from "./Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC AUTHENTICATION GATEWAYS */}
        <Route
          path="/sign-in"
          element={
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-pure-black)" }}>
              <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" redirectUrl="/" />
            </div>
          }
        />
        <Route
          path="/sign-up"
          element={
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-pure-black)" }}>
              <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" redirectUrl="/" />
            </div>
          }
        />

        {/* SECURE DASHBOARD LINKAGE */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />

        {/* CATCH-ALL REDIRECT VECTOR */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}