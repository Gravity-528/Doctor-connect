import React, { useState } from 'react';
import axios from 'axios';

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    qualification: '',
    image: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="bg-blue-500 h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-5xl font-bold mb-6">Doctor Registration</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md"
        />
        <input
          type="text"
          name="qualification"
          placeholder="Qualification"
          value={formData.qualification}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-white text-blue-500 px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition duration-300 ease-in-out"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default DoctorRegister;