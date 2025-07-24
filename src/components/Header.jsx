import React from 'react';
import { Plane } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-black/20 backdrop-blur-sm text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Plane className="h-8 w-8 text-vigovia-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wider">vigovia</h1>
              <p className="text-sm text-vigovia-light tracking-widest">PLAN.PACK.GO</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-white hover:text-vigovia-light transition-colors duration-200"
            >
              Home
            </a>
            <a 
              href="#" 
              className="text-white hover:text-vigovia-light transition-colors duration-200"
            >
              Destinations
            </a>
            <a 
              href="#" 
              className="text-white hover:text-vigovia-light transition-colors duration-200"
            >
              About Us
            </a>
            <a 
              href="#" 
              className="text-white hover:text-vigovia-light transition-colors duration-200"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
