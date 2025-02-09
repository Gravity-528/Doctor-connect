import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const DoctorNav = () => {
  return (
    <nav className="bg-black shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
          Mentors Connect
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 items-center">
          {/* Your Slot Button */}
          <Button
            variant="ghost"
            className="text-white hover:bg-white hover:text-black transition-colors border border-transparent hover:border-white"
            asChild
          >
            <a href="/DoctorSlot">Your Slot</a>
          </Button>

          {/* Avatar Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="transition-transform transform hover:scale-110"
              >
                <Avatar className="w-10 h-10 rounded-full">
                  <AvatarImage
                    src="https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg"
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <AvatarFallback className="rounded-full">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 bg-white text-black rounded-md shadow-lg border border-gray-200">
              <div className="flex flex-col space-y-2 p-2">
                <a
                  href="/profile"
                  className="hover:bg-black hover:text-white transition-colors p-2 rounded-md"
                >
                  Profile
                </a>
                <a
                  href="/"
                  className="hover:bg-black hover:text-white transition-colors p-2 rounded-md"
                >
                  Logout
                </a>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Avatar Dropdown for Mobile */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="transition-transform transform hover:scale-110"
              >
                <Avatar className="w-10 h-10 rounded-full">
                  <AvatarImage
                    src="https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg"
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <AvatarFallback className="rounded-full">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 bg-white text-black rounded-md shadow-lg border border-gray-200">
              <div className="flex flex-col space-y-2 p-2">
                <a
                  href="/profile"
                  className="hover:bg-black hover:text-white transition-colors p-2 rounded-md"
                >
                  Profile
                </a>
                <a
                  href="/"
                  className="hover:bg-black hover:text-white transition-colors p-2 rounded-md"
                >
                  Logout
                </a>
              </div>
            </PopoverContent>
          </Popover>

          {/* Mobile Menu Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white hover:text-black">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-black text-white">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Menu</span>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white hover:text-black">
                    <X className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
              </div>
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-white hover:text-black transition-colors border border-transparent hover:border-white"
                  asChild
                >
                  <a href="/DoctorSlot">Your Slot</a>
                </Button>
                <Button
                  className="w-full bg-white text-black hover:bg-gray-200 transition-colors"
                  asChild
                >
                  <a href="/">Logout</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNav;