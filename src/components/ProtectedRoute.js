import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const [hasEnoughContacts, setHasEnoughContacts] = useState(null);

  useEffect(() => {
    const checkEmergencyContacts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_emergency_contacts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const contacts = response.data.data.contacts || [];
        setHasEnoughContacts(contacts.length >= 2);
      } catch (err) {
        console.error('Error checking emergency contacts:', err);
        setHasEnoughContacts(false);
      }
    };

    if (token) {
      checkEmergencyContacts();
    } else {
      setHasEnoughContacts(false);
    }
  }, [token]);

  // 🔐 Not logged in: redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ⏳ Still checking emergency contacts
  if (hasEnoughContacts === null) {
    return <div className="text-white text-center">Checking emergency contacts...</div>;
  }

  // ❗Not enough emergency contacts: redirect
  if (!hasEnoughContacts) {
    return <Navigate to="/emergency-contacts" replace state={{ fromSignup: true }} />;
  }

  // ✅ All checks passed: allow access
  return <Outlet />;
};

export default ProtectedRoute;
