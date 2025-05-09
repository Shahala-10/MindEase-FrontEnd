import React from 'react';
import { motion } from 'framer-motion';

const EmergencyContactForm = ({ contactNumber, formData, handleChange, prefix }) => {
  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label htmlFor={`${prefix}Name`} className="block text-gray-200 font-medium mb-2">
          Contact Name
        </label>
        <input
          type="text"
          id={`${prefix}Name`}
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-600/50 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          placeholder="Enter contact name (e.g., John Doe)"
          required
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <label htmlFor={`${prefix}Phone`} className="block text-gray-200 font-medium mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id={`${prefix}Phone`}
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-600/50 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          placeholder="Enter phone number (e.g., 1234567890)"
          required
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <label htmlFor={`${prefix}Email`} className="block text-gray-200 font-medium mb-2">
          Email (Optional)
        </label>
        <input
          type="email"
          id={`${prefix}Email`}
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-600/50 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          placeholder="Enter email (e.g., john@example.com)"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <label htmlFor={`${prefix}Relationship`} className="block text-gray-200 font-medium mb-2">
          Relationship
        </label>
        <select
          id={`${prefix}Relationship`}
          name="contactRelationship"
          value={formData.contactRelationship}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-600/50 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          required
        >
          <option value="Family">Family</option>
          <option value="Friend">Friend</option>
          <option value="Caregiver">Caregiver</option>
          <option value="Other">Other</option>
        </select>
      </motion.div>
    </div>
  );
};

export default EmergencyContactForm;