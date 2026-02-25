// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaRocket,
  FaShieldAlt,
  FaHandsHelping,
  FaCheckCircle,
  FaStar,
  FaArrowRight,
  FaQuoteLeft,
  FaQuoteRight,
  FaGraduationCap,
  FaMoneyBillWave,
  FaClock,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaAward,
  FaHeart,
  FaLightbulb,
  FaBullseye, // ← Changed from FaTarget to FaBullseye
} from "react-icons/fa";
import { MdSchool, MdPeople, MdVerified, MdTrendingUp } from "react-icons/md";

const About = () => {
  // Platform statistics
  const stats = [
    { value: "5000+", label: "Active Students", icon: FaUserGraduate },
    { value: "2000+", label: "Verified Tutors", icon: FaChalkboardTeacher },
    { value: "10,000+", label: "Tuitions Posted", icon: FaBook },
    { value: "98%", label: "Success Rate", icon: FaCheckCircle },
  ];

  // Core values
  const coreValues = [
    {
      icon: FaShieldAlt,
      title: "Trust & Safety",
      description:
        "All tutors are thoroughly verified with background checks and qualification verification.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: FaRocket,
      title: "Fast Matching",
      description:
        "AI-powered matching system connects students with the perfect tutors within hours.",
      color: "from-orange-600 to-orange-700",
    },
    {
      icon: FaHandsHelping,
      title: "Student First",
      description:
        "Every feature is designed with students' learning journey and success in mind.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: FaMoneyBillWave,
      title: "Fair Pricing",
      description:
        "Transparent pricing with no hidden fees. Pay only for the lessons you take.",
      color: "from-orange-600 to-orange-700",
    },
  ];

  // Team members
  const teamMembers = [
    {
      name: "Dr. Sarah Rahman",
      role: "Founder & CEO",
      qualification: "Ph.D. in Education",
      experience: "15+ years",
      image: "https://i.ibb.co/4pDNDk1/avatar.png",
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Prof. Kamal Hossain",
      role: "Head of Academics",
      qualification: "M.Sc. in Mathematics",
      experience: "12+ years",
      image: "https://i.ibb.co/4pDNDk1/avatar.png",
      color: "from-orange-600 to-orange-700",
    },
    {
      name: "Fatema Akter",
      role: "Student Success Manager",
      qualification: "MBA in Education",
      experience: "8+ years",
      image: "https://i.ibb.co/4pDNDk1/avatar.png",
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Rafiqul Islam",
      role: "Technical Director",
      qualification: "B.Sc. in CSE",
      experience: "10+ years",
      image: "https://i.ibb.co/4pDNDk1/avatar.png",
      color: "from-orange-600 to-orange-700",
    },
  ];

  // Milestones
  const milestones = [
    {
      year: "2020",
      event: "Platform Launched",
      description: "Started with 50 tutors in Dhaka",
    },
    {
      year: "2021",
      event: "10,000 Users",
      description: "Reached 10,000 students and tutors",
    },
    {
      year: "2022",
      event: "National Expansion",
      description: "Expanded to all districts of Bangladesh",
    },
    {
      year: "2023",
      event: "AI Matching",
      description: "Introduced AI-powered tutor matching",
    },
    {
      year: "2024",
      event: "100,000+ Success Stories",
      description: "Helped over 100,000 students achieve their goals",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-600/10 to-orange-700/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 mb-6">
            About Tuition Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to transform education in Bangladesh by
            connecting
            <span className="font-bold text-orange-500">
              {" "}
              passionate students{" "}
            </span>
            with
            <span className="font-bold text-orange-500">
              {" "}
              exceptional tutors{" "}
            </span>
            through our innovative platform.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 rounded-3xl p-8 md:p-12 mb-16 text-white shadow-2xl border border-gray-700">
          <div className="max-w-3xl mx-auto text-center">
            <FaQuoteLeft className="text-4xl text-orange-500 opacity-70 mb-4 inline-block" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-500">
              Our Mission
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-300">
              "To create a seamless, accessible, and quality education ecosystem
              where every student can find their perfect tutor, and every tutor
              can make a meaningful impact."
            </p>
            <FaQuoteRight className="text-4xl text-orange-500 opacity-70 mt-4 inline-block" />
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-gray-700 hover:border-orange-500/30 hover:shadow-orange-500/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">
                  <Icon />
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* What We Do Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            What We Do
          </h2>
          <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Tuition Platform is Bangladesh's premier online marketplace
            connecting students with qualified tutors
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-orange-500/30 hover:shadow-orange-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                <FaUserGraduate />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                For Students
              </h3>
              <p className="text-gray-400">
                Post your tuition requirements, browse qualified tutors, and
                find the perfect match for your learning needs.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-orange-500/30 hover:shadow-orange-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                <FaChalkboardTeacher />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">For Tutors</h3>
              <p className="text-gray-400">
                Create your profile, showcase your expertise, and connect with
                students who need your guidance.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-orange-500/30 hover:shadow-orange-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                <MdSchool />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                For Institutions
              </h3>
              <p className="text-gray-400">
                Partner with us to provide quality tutoring services to your
                students and enhance learning outcomes.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-orange-500/30 hover:shadow-orange-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                <FaGlobe />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                For Community
              </h3>
              <p className="text-gray-400">
                Building a stronger educational community by making quality
                tutoring accessible to all.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto mb-12">
            We're not just a platform – we're your partner in educational
            success
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-orange-500/30 hover:shadow-orange-500/10 transition-all duration-300">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center text-white text-2xl mb-4`}>
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-400">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Our Journey / Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Our Journey
          </h2>
          <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto mb-12">
            From a small startup to Bangladesh's leading tuition platform
          </p>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 hidden md:block"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                    <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 inline-block max-w-md hover:border-orange-500/30 transition-all duration-300">
                      <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2">
                        {milestone.event}
                      </h3>
                      <p className="text-gray-400 mt-2">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full border-4 border-gray-800 shadow-lg z-10 my-4 md:my-0"></div>
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Passionate educators and technologists working to transform
            education
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-orange-500/30 hover:shadow-orange-500/10 transition-all duration-300 text-center">
                <div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.color} mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg`}>
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-orange-500 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-400 text-sm mb-1">
                  {member.qualification}
                </p>
                <p className="text-gray-500 text-sm">{member.experience}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            What People Say
          </h2>
          <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Thousands of students and tutors trust us for their educational
            journey
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-orange-500/30 transition-all duration-300">
              <div className="flex gap-1 text-orange-500 mb-4">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-gray-300 mb-4 italic">
                "Found the perfect math tutor for my daughter through this
                platform. Her grades improved from C to A+ in just 3 months!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                  MR
                </div>
                <div>
                  <p className="font-bold text-white">Mahbub Rahman</p>
                  <p className="text-sm text-gray-400">
                    Parent of Class 10 Student
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-orange-500/30 transition-all duration-300">
              <div className="flex gap-1 text-orange-500 mb-4">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-gray-300 mb-4 italic">
                "As a tutor, this platform has been a game-changer. I've found
                15+ students and built a stable income stream."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                  SN
                </div>
                <div>
                  <p className="font-bold text-white">Sharmin Nahar</p>
                  <p className="text-sm text-gray-400">English Tutor</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-orange-500/30 transition-all duration-300">
              <div className="flex gap-1 text-orange-500 mb-4">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-gray-300 mb-4 italic">
                "The verification process is thorough and the payment system is
                secure. I feel safe using this platform."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                  TK
                </div>
                <div>
                  <p className="font-bold text-white">Tanvir Khan</p>
                  <p className="text-sm text-gray-400">University Student</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 rounded-3xl p-12 text-center text-white shadow-2xl border border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-500">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join thousands of students and tutors who are already part of our
            community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Sign Up as Student
            </Link>
            <Link
              to="/sign-up?role=tutor"
              className="px-8 py-4 bg-transparent border-2 border-orange-500 text-orange-500 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300">
              Become a Tutor
            </Link>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 text-center text-gray-500 text-sm">
          <p>
            © 2024 Tuition Platform. Empowering education across Bangladesh.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
