import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../Providers/DataProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';


const DoctorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    qualification: '',
    DoctorPhoto: '',
    username: '',
    password: '',
  });

  const { RegisterDoctorGet } = useData();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      console.log("name is",name);
      console.log("value is",value);
      setFormData({ ...formData, [name]: value });
    }
  };
  console.log("formData is",formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('qualification', formData.qualification);
    data.append('DoctorPhoto', formData.DoctorPhoto);
    data.append('username', formData.username);
    data.append('password', formData.password);
    
    console.log("data is",data);
    console.log("FormData content:");
for (let pair of data.entries()) {
  console.log(`${pair[0]}:`, pair[1]);
}
    try{
    // await RegisterDoctorGet(formData.name,formData.email,formData.qualification,formData.username,formData.password)
    const response=await RegisterDoctorGet(data);
    console.log("response is",response);
    if(response.status == 201 || response.status == 200){
      toast.success("Doctor registered successfully!");
      navigate('/doctorLogin');
    }else{
      toast.error("Error in registering doctor. Please try again.");
      console.error("Error in registering doctor:", response.data);
    }
    }catch(err){
      toast.error("Error in registering doctor. Please try again.");
      console.error("error in registering doctor:",err);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6 text-white min-h-screen items-center justify-center bg-black p-4')}>
      <Card className="bg-black text-white border border-gray-700 shadow-lg w-full max-w-sm p-6">
        <CardHeader>
          <CardTitle className="text-2xl">Doctor Registration</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your details below to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black text-white border border-gray-600 focus:border-white focus:outline-none px-3 py-2 rounded-md"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black text-white border border-gray-600 focus:border-white focus:outline-none px-3 py-2 rounded-md"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  type="text"
                  name="qualification"
                  placeholder="Enter your qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  className="w-full bg-black text-white border border-gray-600 focus:border-white focus:outline-none px-3 py-2 rounded-md"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="DoctorPhoto">Doctor Photo</Label>
                <Input
                  id="DoctorPhoto"
                  type="file"
                  name="DoctorPhoto"
                  onChange={handleChange}
                  required
                  className="w-full bg-black text-white border border-gray-600 focus:border-white focus:outline-none px-3 py-2 rounded-md"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-black text-white border border-gray-600 focus:border-white focus:outline-none px-3 py-2 rounded-md"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-black text-white border border-gray-600 focus:border-white focus:outline-none px-3 py-2 rounded-md"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black border border-white hover:bg-black hover:text-white transition-all duration-300"
              >
                Sign Up
              </Button>

              <div className="mt-4 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/doctorLogin" className="underline">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorRegister;
