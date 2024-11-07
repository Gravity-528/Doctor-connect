import React, { useState } from 'react';
import { useData } from '../Providers/DataProvider';
import { Link, useNavigate } from 'react-router-dom';

const LoginUser = () => {
  const navigate=useNavigate();
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
    
    // setIsAuth(isAuth);
    console.log(isAuth);
    // if(!isAuth.valid){
    //   console.log(isAuth);
    //   console.error("some error in LoginUser in handleSubmit");
    // }
    navigate('/userHome');

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
          Login
        </button>
        <p>New to website <Link to='/userRegister' className='text-black'>Register here</Link></p>
      </form>
    </div>
  );
};

export default LoginUser;
