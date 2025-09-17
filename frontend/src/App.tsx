// frontend/src/App.tsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Assets from "./pages/Assets";
import Trades from "./pages/Trades";
import Holdings from "./pages/Holdings";
import Macro from "./pages/Macro";
import WatchList from "./pages/WatchList";
import Home from "./pages/Home";
import Signup from "./pages/Auth/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/Auth/SignIn";
import Navbar from "./pages/NavBar";
import GoogleCallback from "./pages/Auth/GoogleCallBack";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import RoleActionManager from "./pages/RoleActionManager";

export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div>
        <Routes>
          {/* Home Route - accessible to everyone */}
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/assets" replace /> : <Home />} 
          />

          {/* Protected Routes - only accessible when logged in */}
          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trades"
            element={
              <ProtectedRoute>
                <Trades />
              </ProtectedRoute>
            }
          />
          <Route
            path="/holdings"
            element={
              <ProtectedRoute>
                <Holdings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/macro"
            element={
              <ProtectedRoute>
                <Macro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/actionmanager"
            element={
              <ProtectedRoute>
                <RoleActionManager/>
              </ProtectedRoute>
            }
          />

          {/* Public Routes - accessible when not logged in */}
          <Route 
            path="/signup" 
            element={isLoggedIn ? <Navigate to="/assets" replace /> : <Signup />} 
          />
          <Route 
            path="/signin" 
            element={isLoggedIn ? <Navigate to="/assets" replace /> : <SignIn />} 
          />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          {/* Optional: About page for logged out users */}
          <Route 
            path="/about" 
            element={
              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
                <div className="container mx-auto px-4">
                  <div className="text-center">
                    <h1 className="text-5xl font-bold text-white mb-6">About Us</h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                      We're dedicated to providing the best trading experience with cutting-edge technology and user-centric design.
                    </p>
                  </div>
                </div>
              </div>
            } 
          />

          {/* Catch-all route */}
          <Route 
            path="*" 
            element={<Navigate to={isLoggedIn ? "/assets" : "/"} replace />} 
          />
        </Routes>
      </div>
    </div>
  );
}