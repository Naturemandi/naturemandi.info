import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10">

        {/* Brand Info */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3">NatureMandi</h3>
          <p className="text-sm">
            Bringing authentic regional treasures like Kaladi, Rajma, and Himalayan Pickles from Jammu & Kashmir to homes across India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/profile" className="hover:text-white">My Account</Link></li>
            <li><Link to="/support" className="hover:text-white">Support</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-white mb-3">Contact Us</h4>
          <p className="text-sm">Email: <a href="mailto:naturemandi.info@gmail.com" className="hover:underline">naturemandi.info@gmail.com</a></p>
          <p className="text-sm">Phone: <a href="tel:+916006061464" className="hover:underline">+91-6006061464</a></p>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold text-white mb-3">Follow Us</h4>
          <div className="flex items-center space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-xl hover:text-pink-500" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-xl hover:text-blue-400" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-xl hover:text-blue-600" />
            </a>
            <a href="https://wa.me/916006061464" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="text-xl hover:text-green-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-xs text-gray-500 mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} NatureMandi. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
