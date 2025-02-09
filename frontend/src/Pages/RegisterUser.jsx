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

const RegisterUser = () => {
  const navigate = useNavigate();
  const { RegisterUserGet } = useData();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await RegisterUserGet(formData.name, formData.username, formData.password, formData.email);
      navigate('/userLogin');
    } catch (err) {
      console.log('Error registering user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6 text-white min-h-screen items-center justify-center bg-black p-4')}>
      <Card className="bg-black text-white border border-gray-700 shadow-lg w-full max-w-sm p-6">
        <CardHeader>
          <CardTitle className="text-2xl">User Registration</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your details below to sign up
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
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5 text-black" />
                ) : (
                  'Sign Up'
                )}
              </Button>

              <div className="mt-4 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/userLogin" className="underline">
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

export default RegisterUser;
