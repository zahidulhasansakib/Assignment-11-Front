
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaUserTie,
  FaUserGraduate,
  FaUsers,
  FaPaperPlane,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaGlobe,
  FaWhatsapp,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone, MdAccessTime } from "react-icons/md";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Admin/Team Information
  const adminTeam = [
    {
      name: "Md. Zahidul Hasan Sakib",
      role: "Platform Administrator",
      email: "sakib@tuitionplatform.com",
      phone: "+01889500928",
      photo: "https://i.ibb.co/4pDNDk1/avatar.png",
      department: "Platform Management",
    },
    {
      name: "Fatema Khatun",
      role: "Student Support Lead",
      email: "fatema@tuitionplatform.com",
      phone: "+880 1812-345678",
      photo: "https://i.ibb.co/4pDNDk1/avatar.png",
      department: "Student Affairs",
    },
    {
      name: "Rafiqul Islam",
      role: "Tutor Coordinator",
      email: "rafiq@tuitionplatform.com",
      phone: "+880 1912-345678",
      photo: "https://i.ibb.co/4pDNDk1/avatar.png",
      department: "Tutor Management",
    },
    {
      name: "Nusrat Jahan",
      role: "Technical Support",
      email: "nusrat@tuitionplatform.com",
      phone: "+880 1612-345678",
      photo: "https://i.ibb.co/4pDNDk1/avatar.png",
      department: "IT Support",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending message
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 3 seconds
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our platform? Want to become a tutor? Need help
            with your tuition? We're here for you!
          </p>
        </motion.div>

        {/* Quick Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Email Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
                <MdEmail />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm mb-3">24/7 Support</p>
              <a
                href="mailto:support@tuitionplatform.com"
                className="text-indigo-600 font-medium hover:underline">
                support@tuitionplatform.com
              </a>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
                <MdPhone />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm mb-3">Mon-Fri, 9am-6pm</p>
              <a
                href="tel:+8801712345678"
                className="text-indigo-600 font-medium hover:underline">
                +880 1712-345678
              </a>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
                <MdLocationOn />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 text-sm mb-3">Head Office</p>
              <p className="text-indigo-600 font-medium">
                123 Gulshan Avenue, Dhaka
              </p>
            </div>
          </div>

          {/* Hours Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
                <MdAccessTime />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Working Hours
              </h3>
              <p className="text-gray-600 text-sm mb-3">Support Time</p>
              <p className="text-indigo-600 font-medium">Sat-Thu, 9am-8pm</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form -  */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaPaperPlane className="text-indigo-600" />
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900 font-medium text-base placeholder-gray-500 bg-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900 font-medium text-base placeholder-gray-500 bg-white"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900 font-medium text-base placeholder-gray-500 bg-white"
                    placeholder="What would you like to talk about?"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900 font-medium text-base placeholder-gray-500 bg-white resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={sending || sent}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </>
                  ) : sent ? (
                    <>
                      <FaCheckCircle className="text-xl" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Admin Info - Right Column (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaUserTie className="text-indigo-600" />
                Admin Team
              </h2>

              <div className="space-y-4">
                {adminTeam.map((admin, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {admin.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          {admin.name}
                        </h3>
                        <p className="text-sm text-indigo-600 font-medium mb-2">
                          {admin.role}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          {admin.department}
                        </p>
                        <div className="flex flex-col gap-1 mt-2 text-xs">
                          <a
                            href={`mailto:${admin.email}`}
                            className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors">
                            <MdEmail className="text-sm" />
                            <span className="truncate">{admin.email}</span>
                          </a>
                          <a
                            href={`tel:${admin.phone}`}
                            className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors">
                            <MdPhone className="text-sm" />
                            <span>{admin.phone}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Media Links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  Connect With Us
                </h3>
                <div className="flex justify-center gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                    <FaFacebook size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-sky-100 text-sky-500 rounded-xl flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300">
                    <FaTwitter size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-300">
                    <FaWhatsapp size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all duration-300">
                    <FaInstagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300">
                    <FaLinkedin size={20} />
                  </a>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">24/7</p>
                    <p className="text-xs text-gray-600">Support</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">15min</p>
                    <p className="text-xs text-gray-600">Response Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">1000+</p>
                    <p className="text-xs text-gray-600">Happy Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">500+</p>
                    <p className="text-xs text-gray-600">Tutors</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaMapMarkerAlt className="text-indigo-600" />
              Our Location
            </h2>
            <div className="relative h-80 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.835575749282!2d90.406666315384!3d23.780784384557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c79f3b6f7b3d%3A0x7e3f3b3f3b3f3b3f!2sDhaka!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Office Location"
                className="absolute inset-0"
              />
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center text-gray-500 text-sm">
          <p>
            We typically respond within 24 hours. For urgent matters, please
            give us a call.
          </p>
          <p className="mt-2">© 2024 Tuition Platform. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
