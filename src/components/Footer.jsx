import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-bold tracking-wider mb-2 text-vigovia-primary">vigovia</h2>
              <p className="text-vigovia-accent tracking-widest text-sm">PLAN.PACK.GO</p>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your trusted travel partner for creating unforgettable journeys. 
              We specialize in personalized itineraries that match your travel dreams 
              with seamless execution.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-vigovia-primary hover:text-vigovia-accent transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-vigovia-primary hover:text-vigovia-accent transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-vigovia-primary hover:text-vigovia-accent transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-vigovia-primary hover:text-vigovia-accent transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-vigovia-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-vigovia-primary transition-colors duration-200">
                  Our Offerings
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-vigovia-primary transition-colors duration-200">
                  Popular Destinations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-vigovia-primary transition-colors duration-200">
                  Vigovia Specials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-vigovia-primary transition-colors duration-200">
                  Company
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-vigovia-primary">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-vigovia-accent" />
                <span className="text-gray-600">+91-9999999999</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-vigovia-accent" />
                <span className="text-gray-600">contact@vigovia.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-vigovia-accent mt-1" />
                <span className="text-gray-600">
                  HD-109 Cinnabar Hills,<br />
                  Links Business Park,<br />
                  Karnataka, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 Vigovia Tech Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-vigovia-primary transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-vigovia-primary transition-colors duration-200">
                Legal Notice
              </a>
              <a href="#" className="text-gray-500 hover:text-vigovia-primary transition-colors duration-200">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
