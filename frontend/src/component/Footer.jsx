import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Mentors Connect</h2>
        <p className="text-sm mb-6">Connecting you with experienced mentors for your career growth.</p>

        <div className="flex justify-center space-x-4 mb-6">
          <a href="#" className="hover:text-gray-300">About Us</a>
          <a href="#" className="hover:text-gray-300">Contact</a>
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="hover:text-gray-300">
            <i className="fab fa-facebook fa-lg"></i>
          </a>
          <a href="#" className="hover:text-gray-300">
            <i className="fab fa-twitter fa-lg"></i>
          </a>
          <a href="#" className="hover:text-gray-300">
            <i className="fab fa-linkedin fa-lg"></i>
          </a>
        </div>

        <p className="text-sm">&copy; {new Date().getFullYear()} Mentors Connect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
