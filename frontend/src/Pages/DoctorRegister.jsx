import React, { useState } from 'react';
import axios from 'axios';
import { useData } from '../Providers/DataProvider';

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    qualification: '',
    DoctorPhoto: '',
    username: '',
    password: '',
  });

  const {RegisterDoctorGet}=useData();

  const handleChange = (e) => {
    const { name, value,type,files } = e.target;
    if(type=='file'){
      setFormData({ ...formData, [name]: files[0] });
    
    }else{
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('qualification', formData.qualification);
    data.append('DoctorPhoto', formData.DoctorPhoto); 
    data.append('username', formData.username);
    data.append('password', formData.password);
    await RegisterDoctorGet(data);
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
          className="px-4 py-2 rounded-md text-black"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md text-black"
        />
        <input
          type="text"
          name="qualification"
          placeholder="Qualification"
          value={formData.qualification}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md text-black"
        />
        <input
          type="file"
          name="DoctorPhoto"  
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md text-black"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md text-black"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md text-black"
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
