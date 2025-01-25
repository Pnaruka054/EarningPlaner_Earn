import React, { useState } from "react";
import axios from "axios";

const ContactUs = ({ style }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
  });
  const [submitProcessState, setSubmitProcessState] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitProcessState(false); // Set to false when starting to submit
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/add_to_sheet`, formData);
      setSubmitProcessState(true); // Set back to true if successful
    } catch (error) {
      setSubmitProcessState(true); // Set back to true on error
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full sm:w-10/12 md:w-8/12 lg:w-[95%] bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-4xl font-semibold text-blue-600 mb-4">Contact Us</h2>
        <p className="text-center text-yellow-500 mb-6">Get in touch!</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Your Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Message *</label>
            <textarea
              id="message"
              name="message"
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              className="mr-2"
              checked={formData.consent}
              onChange={handleChange}
              required
            />
            <label htmlFor="consent" className="text-sm text-gray-600">
              I consent to having this website store my submitted information so they can respond to my inquiry.
            </label>
          </div>

          <button
            type="submit"
            disabled={!submitProcessState}
            className={`w-full py-3 rounded-lg text-white font-medium ${!submitProcessState ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} transition`}
          >
            {submitProcessState ? "Send Message" : <i className="fas fa-spinner fa-spin"></i>}
          </button>
        </form>

        <div className="mt-6 text-gray-600 italic text-sm">
          Need help or have any questions? We’re here to assist you! Please fill out the contact form below with your details and message, and our support team will reach out to you as soon as possible. We strive to respond promptly and address all inquiries thoroughly. Your feedback is important to us, and we look forward to assisting you! Please note that by submitting this form, you may also receive announcements and promotional emails from us.
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
