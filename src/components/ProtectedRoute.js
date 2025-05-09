import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [hasEnoughContacts, setHasEnoughContacts] = useState(null);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    const checkEmergencyContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/get_emergency_contacts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const contacts = response.data.data.contacts;
        setHasEnoughContacts(contacts.length >= 2);
      } catch (err) {
        console.error('Error checking emergency contacts:', err);
        setHasEnoughContacts(false);
      }
    };

    if (isLoggedIn) {
      checkEmergencyContacts();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (hasEnoughContacts === null) {
    return <div>Loading...</div>; // Show loading while checking contacts
  }

  if (!hasEnoughContacts) {
    return <Navigate to="/emergency-contacts" replace state={{ fromSignup: true }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;