import React, { useState } from "react";

const DoctorNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="text-2xl font-bold text-gray-800">
              Mentors Connect
            </a>
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            <a
              href="/DoctorSlot"
              className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md text-base font-medium transition duration-300"
            >
              Your Slot
            </a>
            <a
              href="/"
              className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md text-base font-medium transition duration-300"
            >
              Logout
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-gray-600 focus:outline-none"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="text-gray-700 hover:bg-gray-100 block px-4 py-2 rounded-md text-base font-medium transition duration-300"
            >
              Your Slot
            </a>
            <a
              href="/about"
              className="text-gray-700 hover:bg-gray-100 block px-4 py-2 rounded-md text-base font-medium transition duration-300"
            >
              Logout
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DoctorNav;
