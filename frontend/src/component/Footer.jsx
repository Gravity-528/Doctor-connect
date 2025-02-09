import React from "react";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 text-center">
        
        <h2 className="text-3xl font-bold mb-6">Mentors Connect</h2>
        <p className="text-gray-300 text-sm mb-8 max-w-2xl mx-auto">
          Connecting you with experienced mentors for your career growth. We provide personalized guidance to help you achieve your professional goals.
        </p>

        
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            About Us
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Privacy Policy
          </a>
        </div>

    
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <FaFacebook className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <FaTwitter className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>

        
        <div className="mb-8">
          <p className="text-gray-300 text-sm mb-4">Subscribe to our newsletter for updates:</p>
          <form className="flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </Button>
          </form>
        </div>

        
        <p className="text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} Mentors Connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
