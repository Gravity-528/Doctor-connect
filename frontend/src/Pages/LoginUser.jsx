import React, { useState } from 'react';
import axios from 'axios';
import { useData } from '../Providers/DataProvider';

const LoginUser = () => {
  const {isAuth,setIsAuth,LoginUserGet}=useData();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await LoginUserGet(formData.username,formData.password);

    if(!isAuth.valid){
      console.log(isAuth);
      console.error("some error in LoginUser in handleSubmit");
    }
  };

  return (
    <div className="bg-blue-500 h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-5xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginUser;
