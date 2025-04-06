import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { assets } from '../asset/asset';

function Footer() {
  return (
    <footer className="py-6 bg-transparent w-full">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Company Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={assets.logo}
                alt="Logo"
                className="w-10 h-10 object-cover"
              />
            </div>
            <p className="text-gray-600 text-sm text-center md:text-left">
              Your trusted eCommerce partner.<br /> Delivering quality products and<br /> exceptional service to your doorstep.
            </p>
          </div>

          {/* Middle Column - Contact Info */}
          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-md font-semibold mb-3">Get in Touch</h3>
            <ul className="space-y-1.5 text-center">
              <li className="flex items-center gap-2 text-gray-600">
                <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                <span className="text-sm">ecommerce@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <FontAwesomeIcon icon={faPhone} className="text-sm" />
                <span className="text-sm">+123-456-7890</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                <span className="text-sm">123 Main Street</span>
              </li>
            </ul>
          </div>

          {/* Right Column - Links */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-md font-semibold mb-3">Company</h3>
            <ul className="space-y-1.5 text-center md:text-right">
              {[{ to: "#", text: "Home" }, { to: "#", text: "About Us" }, { to: "#", text: "Privacy Policy" }, { to: "#", text: "Delivery Information" }]
                .map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-600 hover:text-black transition-colors duration-200"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-6 pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
