import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import AddProductForm from "./components/AddProductForm";
import ProfileModal from "./components/ProfileModal";

import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import LandingPage from "./components/LandingPage";
import ConfirmationPage from "./components/ConfirmationPage";
import "./App.css";

function App() {
  const [isAddProductOpen, setAddProductOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  

  const navigate = useNavigate();

  // Function to check if the user is authenticated
  const checkAuthentication = () => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  };

  const setUserProfile = () => {
    setUserId(localStorage.getItem("userId"));
    setFullName(localStorage.getItem("fullName"));
    setEmailAddress(localStorage.getItem("userName"));
    setUserId(localStorage.getItem("userId"));
    
  };

  useEffect(() => {
    checkAuthentication(); // Check authentication status on mount
    setUserProfile();
  }, []);

  const handleSignIn = () => {
    checkAuthentication();
  };

  const handleVisitAsGuest = () => {
    setIsAuthenticated(true); // Allow guest access
  };

  const handleAddProductClick = () => {
    setAddProductOpen(true);
    setProfileOpen(false);
    
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
    setAddProductOpen(false);
    
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const handleLoginClick = () => {
    setLoginOpen(true);
    setAddProductOpen(false);
    setProfileOpen(false);
    
    setRegisterOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/main");
  };

  const handleRegisterClick = () => {
    setRegisterOpen(true);
    setAddProductOpen(false);
    setProfileOpen(false);
    
    setLoginOpen(false);
  };

  const handleRegisterSuccess = () => {
    setRegisterOpen(false);
    checkAuthentication(); // Check authentication after registration
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/landingPage"); // Navigate to landing page or login page
    window.location.reload();
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <NavBar
            isAuthenticated={isAuthenticated}
            onAddProductClick={handleAddProductClick}
            onProfileClick={handleProfileClick}
            
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
            onLogout={handleLogout}
          />
          <Header />
          <main>
            <ProductGrid
              currentUserId={currentUserId}
            />
          </main>
          <Footer />
          {(isLoginOpen || isRegisterOpen) && <div className="modal-overlay" />}
          {isAddProductOpen && (
            <AddProductForm
              onClose={() => setAddProductOpen(false)}
              onSuccess={() => {
                setAddProductOpen(false);
                window.location.reload();
              }}
            />
          )}
          {isProfileOpen && (
            <ProfileModal
              onClose={() => setProfileOpen(false)}
              currentUserId={currentUserId}
              fullName={fullName}
              emailAddress={emailAddress}
            
            />
          )}
          
          {isLoginOpen && (
            <LoginForm
              onClose={() => setLoginOpen(false)}
              onLoginSuccess={checkAuthentication}
            />
          )}
          {isRegisterOpen && (
            <RegistrationForm
              onClose={() => setRegisterOpen(false)}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}
        </>
      ) : (
        <LandingPage
          onSignIn={handleSignIn}
          onVisitAsGuest={handleVisitAsGuest}
        />
      )}
      <Routes>
        <Route
          path="/login"
          element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/registration"
          element={
            <RegistrationForm onRegisterSuccess={handleRegisterSuccess} />
          }
        />
        <Route path="/confirmation" element={<ConfirmationPage />} />

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/main" : "/landingPage"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
