import React, { useState } from "react";
import axios from "axios";
import ContactUs_gif from '../../../../assets/ContactUs.gif'
import ProcessBgBlack from "../processBgBlack/processBgBlack";

const ContactUs = () => {
  const [formData_state, setFormData_state] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
  });
  const [submit_process_state, setSubmit_process_state] = useState(false);
  let [data_process_state, setData_process_state] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData_state({
      ...formData_state,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit_process_state(false); // Set to false when starting to submit
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/add_to_sheet`, formData_state);
      setSubmit_process_state(true); // Set back to true if successful
    } catch (error) {
      setSubmit_process_state(true); // Set back to true on error
      console.log(error);
    }
  };

  return (
    <section id="contactForm" className="mt-5 mx-2 bg-white shadow-md rounded-lg p-8 border border-gray-200">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-900 relative inline-block">
          Send Us A <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Message</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have any questions? Fill out the form below, and we’ll get back to you as soon as possible.
        </p>
      </div>

      <div className="mt-12 flex flex-col lg:flex-row items-center gap-14">
        {/* Contact Form */}
        <div className="w-full lg:w-[60%] p-10 bg-gray-50 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block font-semibold text-gray-700">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData_state.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-semibold text-gray-700">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData_state.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block font-semibold text-gray-700">Mobile Number:</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData_state.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block font-semibold text-gray-700">Subject:</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData_state.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block font-semibold text-gray-700">Message:</label>
              <textarea
                id="message"
                name="message"
                value={formData_state.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 h-36 focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                required
              ></textarea>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={formData_state.consent}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="consent" className="ml-3 text-gray-700">
                I agree to the <a href="/terms" className="text-blue-600 hover:underline">terms and conditions</a> and the <a href="/privacy" className="text-blue-600 hover:underline">privacy policy</a>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              disabled={!submit_process_state}
            >
              {submit_process_state ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden lg:block w-[40%]">
          <img src={ContactUs_gif} alt="Contact Us" className="w-full h-auto object-cover select-none" draggable="false" />
        </div>
      </div>
      {(data_process_state || submit_process_state) && <ProcessBgBlack />}
    </section>
  );
};

export default ContactUs;
