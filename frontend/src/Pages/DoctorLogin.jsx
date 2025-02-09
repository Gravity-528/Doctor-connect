import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../Providers/DataProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { LoginDoctorGet } = useData();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
      await LoginDoctorGet(formData.username, formData.password);
      navigate('/DoctorHome');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6 text-white min-h-screen items-center justify-center bg-black p-4')}>
      <Card className="bg-black text-white border border-gray-700 shadow-lg w-full max-w-sm p-6">
        <CardHeader>
          <CardTitle className="text-2xl">Doctor Login</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials below to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-black text-white border border-gray-600 focus:border-white focus:outline-none px-3 py-2 rounded-md"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-black text-white border border-gray-600 focus:border-white focus:outline-none px-3 py-2 rounded-md"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black border border-white hover:bg-black hover:text-white transition-all duration-300"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
              </Button>

              <div className="mt-4 text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link to="/doctorRegister" className="underline">
                  Register
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorLogin;

