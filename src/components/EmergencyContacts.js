import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import EmergencyContactForm from './EmergencyContactForm';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactRelationship: 'Family',
  });
  const [editContact, setEditContact] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fromSignup = location.state?.fromSignup || false;

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/get_emergency_contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data.data.contacts);
      if (fromSignup && response.data.data.contacts.length >= 2) {
        navigate('/chat');
      }
    } catch (err) {
      setError('Failed to fetch emergency contacts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, fromSignup]);

  const fetchAlerts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/get_emergency_alerts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(response.data.data.alerts);
    } catch (err) {
      console.error('Failed to fetch emergency alerts:', err);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [fetchContacts, fetchAlerts]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (fromSignup && contacts.length < 2) {
        e.preventDefault();
        e.returnValue = 'You must add at least 2 emergency contacts before leaving this page.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [fromSignup, contacts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      contact_name: formData.contactName,
      phone_number: formData.contactPhone,
      email: formData.contactEmail,
      relationship: formData.contactRelationship,
    };

    try {
      const token = localStorage.getItem('token');
      if (editContact) {
        await axios.put(`http://localhost:5000/update_emergency_contact/${editContact.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Emergency contact updated successfully!');
      } else {
        await axios.post('http://localhost:5000/add_emergency_contact', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Emergency contact added successfully!');
      }
      setFormData({
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        contactRelationship: 'Family',
      });
      setEditContact(null);
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save emergency contact. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      contactName: contact.contact_name,
      contactPhone: contact.phone_number,
      contactEmail: contact.email || '',
      contactRelationship: contact.relationship,
    });
    setEditContact(contact);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setFormData({
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      contactRelationship: 'Family',
    });
    setEditContact(null);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this emergency contact?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/delete_emergency_contact/${contactId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Emergency contact deleted successfully!');
        fetchContacts();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete emergency contact. Please try again.');
      }
    }
  };

  const maxContacts = 5;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
          Add Emergency Contacts
        </h2>
        {fromSignup && contacts.length < 2 && (
          <p className="text-yellow-400 text-center mb-4">
            You must add at least {2 - contacts.length} more emergency contact(s) to proceed. This is mandatory.
          </p>
        )}
        {alerts.length > 0 && (
          <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
            <p>🚨 An alert has been sent to your emergency contacts due to a distress signal in your message. They have been notified to support you.</p>
            <ul className="mt-2">
              {alerts.slice(0, 3).map((alert) => (
                <li key={alert.id} className="text-sm">
                  {alert.message} (Sent at {new Date(alert.timestamp).toLocaleString()})
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {success && <p className="text-green-400 text-center mb-4">{success}</p>}

        {contacts.length >= maxContacts ? (
          <p className="text-yellow-400 text-center mb-4">
            You have reached the maximum number of emergency contacts ({maxContacts}).
          </p>
        ) : (
          <form id="emergency-contact-form" onSubmit={handleSubmit}>
            <EmergencyContactForm
              contactNumber={editContact ? "Edit" : "New"}
              formData={formData}
              handleChange={handleInputChange}
              prefix="contact"
            />
            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded text-white font-semibold transition duration-300 ${
                  isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Saving...' : editContact ? 'Update Contact' : 'Add Contact'}
              </button>
              {editContact && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full p-3 rounded bg-gray-600 text-white font-semibold hover:bg-gray-500 transition duration-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Your Emergency Contacts:</h3>
          {contacts.length === 0 ? (
            <p className="text-gray-400">No emergency contacts added yet.</p>
          ) : (
            <ul className="space-y-4">
              {contacts.map((contact) => (
                <li key={contact.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-white font-semibold">{contact.contact_name}</p>
                    <p className="text-gray-400">Phone: {contact.phone_number}</p>
                    {contact.email && <p className="text-gray-400">Email: {contact.email}</p>}
                    <p className="text-gray-400">Relationship: {contact.relationship}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {(!fromSignup || contacts.length >= 2) && (
          <button
            onClick={() => navigate('/chat')}
            className="w-full mt-6 p-3 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition duration-300"
          >
            Proceed to Chat
          </button>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;